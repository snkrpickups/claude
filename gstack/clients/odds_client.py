"""The Odds API wrapper (Section 6). Budgeted; caches every response.

A request is spent only to fetch a fresh live price. On budget refusal we serve
the most recent cached snapshot batch from the store and never crash.

Parsing is separated from HTTP (`parse_odds_payload`) so Pillar A / tests can
exercise the full pipeline on a fixture with zero network and zero budget.
"""

from __future__ import annotations

import logging
import sqlite3
from dataclasses import dataclass
from typing import Callable, List, Optional, Sequence

from ..budget import BudgetExceeded, BudgetGuard
from ..config import Config
from ..engine import odds_math
from ..store import repo
from ..store.repo import Snapshot

logger = logging.getLogger("gstack.odds_client")

ODDS_API_BASE = "https://api.the-odds-api.com/v4"


@dataclass
class PollResult:
    fetched_at: int
    snapshots_written: int
    games_written: int
    from_cache: bool
    requests_spent: int


def parse_odds_payload(
    payload: Sequence[dict],
    *,
    sport: str,
    sharp_book: str,
    fetched_at: int,
) -> tuple[list[dict], list[Snapshot]]:
    """Turn an Odds API ``/odds`` JSON payload into game + snapshot records.

    Expects American odds (``oddsFormat=american``). A snapshot is emitted per
    book/market/outcome. ``is_sharp`` is 1 when the book key matches
    ``sharp_book``.
    """
    games: list[dict] = []
    snaps: list[Snapshot] = []

    for game in payload:
        game_id = game["id"]
        home = game.get("home_team", "")
        away = game.get("away_team", "")
        commence = _iso_to_epoch(game.get("commence_time"))
        games.append(
            {
                "game_id": game_id,
                "sport": sport,
                "home_team": home,
                "away_team": away,
                "commence_time": commence,
            }
        )
        for bookmaker in game.get("bookmakers", []):
            book_key = bookmaker.get("key", "")
            is_sharp = 1 if book_key == sharp_book else 0
            for market in bookmaker.get("markets", []):
                market_key = market.get("key", "")
                for outcome in market.get("outcomes", []):
                    american = int(round(outcome["price"]))
                    decimal = odds_math.american_to_decimal(american)
                    implied = odds_math.decimal_to_implied(decimal)
                    line = outcome.get("point")
                    snaps.append(
                        Snapshot(
                            game_id=game_id,
                            fetched_at=fetched_at,
                            book=book_key,
                            is_sharp=is_sharp,
                            market=market_key,
                            outcome=outcome.get("name", ""),
                            line=line,
                            american=american,
                            decimal=decimal,
                            implied=implied,
                        )
                    )
    return games, snaps


def _iso_to_epoch(iso: Optional[str]) -> int:
    if not iso:
        return 0
    from datetime import datetime, timezone

    # The Odds API returns e.g. "2026-06-23T02:10:00Z".
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp())


class OddsClient:
    def __init__(
        self,
        conn: sqlite3.Connection,
        config: Config,
        budget: BudgetGuard,
        http_get: Optional[Callable[[str, dict], object]] = None,
    ):
        self.conn = conn
        self.config = config
        self.budget = budget
        # Injectable for tests; defaults to requests.get at call time.
        self._http_get = http_get

    def _do_get(self, url: str, params: dict):
        if self._http_get is not None:
            return self._http_get(url, params)
        import requests  # imported lazily so tests need no network stack

        resp = requests.get(url, params=params, timeout=20)
        resp.raise_for_status()
        return resp.json()

    def poll_odds(self) -> PollResult:
        """Spend one request to fetch live NBA odds, caching every price.

        On budget refusal, returns the most recent cached batch unchanged.
        """
        fetched_at = repo.now_epoch()
        try:
            self.budget.spend(1)
        except BudgetExceeded:
            cached = repo.latest_snapshots(self.conn)
            return PollResult(
                fetched_at=repo.latest_fetch_time(self.conn) or fetched_at,
                snapshots_written=0,
                games_written=0,
                from_cache=True,
                requests_spent=0,
            ) if cached else PollResult(
                fetched_at=fetched_at,
                snapshots_written=0,
                games_written=0,
                from_cache=True,
                requests_spent=0,
            )

        self.config.require_odds_api()
        url = f"{ODDS_API_BASE}/sports/{self.config.odds_api_sport_key}/odds"
        params = {
            "apiKey": self.config.odds_api_key,
            "regions": self.config.regions,
            "markets": ",".join(self.config.markets),
            "oddsFormat": "american",
        }
        payload = self._do_get(url, params)
        return self._cache_payload(payload, fetched_at)

    def _cache_payload(self, payload, fetched_at: int) -> PollResult:
        games, snaps = parse_odds_payload(
            payload,
            sport=self.config.sport,
            sharp_book=self.config.sharp_book,
            fetched_at=fetched_at,
        )
        for g in games:
            repo.upsert_game(self.conn, **g)
        written = repo.insert_snapshots(self.conn, snaps)
        self.conn.commit()
        logger.info(
            "Cached %d snapshots across %d games at %d",
            written, len(games), fetched_at,
        )
        return PollResult(
            fetched_at=fetched_at,
            snapshots_written=written,
            games_written=len(games),
            from_cache=False,
            requests_spent=1,
        )

    def ingest_fixture(self, payload, fetched_at: Optional[int] = None) -> PollResult:
        """Cache a payload WITHOUT spending budget (for tests / offline fixtures)."""
        return self._cache_payload(payload, fetched_at or repo.now_epoch())
