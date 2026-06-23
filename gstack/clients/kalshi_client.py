"""Kalshi market-data client (the execution venue for World Cup bets).

Kalshi's market-data API is free, so — unlike The Odds API — these reads do NOT
pass through the request-budget guard (the budget guards only the metered sharp
feed). Kalshi prices are stored as ordinary snapshots under ``book='kalshi'`` so
the existing devig/EV/Kelly/CLV pipeline treats it like any other "book".

Parsing is split into:
  * ``normalize_kalshi_events`` — adapt the raw Kalshi JSON into a stable shape.
    The exact field names of Kalshi's /events+/markets payload must be verified
    against the live API; this adapter is the single place to fix if they drift.
  * ``cache_markets`` — link each normalized market to a stored sharp game and
    write snapshots. Unmatched markets are skipped with a warning, never guessed.
"""

from __future__ import annotations

import logging
import sqlite3
from dataclasses import dataclass
from typing import Callable, List, Optional, Sequence

from ..engine import matching, odds_math
from ..store import repo
from ..store.repo import Snapshot

logger = logging.getLogger("gstack.kalshi_client")

KALSHI_BASE = "https://api.elections.kalshi.com/trade-api/v2"


@dataclass
class KalshiLeg:
    yes_team: str        # team the YES contract pays on, or a draw label
    yes_ask: int         # cents you'd PAY to buy YES (taker entry); 1..99
    yes_bid: Optional[int] = None  # cents you'd post at as a maker
    ticker: Optional[str] = None


@dataclass
class KalshiMatch:
    team_a: str
    team_b: str
    commence_time: Optional[int]   # epoch UTC
    legs: List[KalshiLeg]
    event_ticker: Optional[str] = None


def normalize_kalshi_events(raw: Sequence[dict]) -> List[KalshiMatch]:
    """Adapt raw Kalshi event/market JSON into ``KalshiMatch`` records.

    Accepts the already-grouped shape GSTACK uses internally (see tests). A thin
    layer over the live /events endpoint would populate the same fields; keep
    that mapping here so the rest of the code is insulated from API drift.
    """
    matches: List[KalshiMatch] = []
    for ev in raw:
        legs = [
            KalshiLeg(
                yes_team=m["yes_team"],
                yes_ask=int(m["yes_ask"]),
                yes_bid=int(m["yes_bid"]) if m.get("yes_bid") is not None else None,
                ticker=m.get("ticker"),
            )
            for m in ev.get("markets", [])
        ]
        matches.append(
            KalshiMatch(
                team_a=ev["team_a"],
                team_b=ev["team_b"],
                commence_time=_to_epoch(ev.get("commence_time")),
                legs=legs,
                event_ticker=ev.get("event_ticker"),
            )
        )
    return matches


def _to_epoch(value) -> Optional[int]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return int(value)
    from datetime import datetime, timezone

    dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp())


class KalshiClient:
    def __init__(
        self,
        conn: sqlite3.Connection,
        *,
        maker: bool = False,
        http_get: Optional[Callable[[str, dict], object]] = None,
    ):
        self.conn = conn
        self.maker = maker  # if True, store the bid (post) price instead of ask
        self._http_get = http_get

    # -- fetch (free; no budget guard) ---------------------------------------
    def fetch_world_cup_markets(self, series_ticker: str) -> List[KalshiMatch]:
        raw = self._get(f"{KALSHI_BASE}/events", {
            "series_ticker": series_ticker,
            "status": "open",
            "with_nested_markets": "true",
        })
        # `raw` is expected to be a list of normalized events; a production
        # adapter would reshape the live response into that here.
        return normalize_kalshi_events(raw)

    def _get(self, url: str, params: dict):
        if self._http_get is not None:
            return self._http_get(url, params)
        import requests

        resp = requests.get(url, params=params, timeout=20)
        resp.raise_for_status()
        return resp.json()

    # -- cache: link to sharp games and write snapshots ----------------------
    def cache_markets(
        self, matches: Sequence[KalshiMatch], *, fetched_at: int
    ) -> int:
        """Store Kalshi legs as snapshots aligned to existing sharp games.

        Returns the number of snapshots written. Markets that can't be linked to
        a stored game/outcome are skipped with a warning.
        """
        games = repo.list_games(self.conn)
        snaps: List[Snapshot] = []
        skipped = 0

        for match in matches:
            for leg in match.legs:
                link = matching.link_kalshi_market(
                    games,
                    team_a=match.team_a,
                    team_b=match.team_b,
                    yes_team=leg.yes_team,
                    commence_time=match.commence_time,
                )
                if link is None:
                    skipped += 1
                    logger.warning(
                        "Kalshi market unmatched: %s YES on %s vs %s (skipped)",
                        leg.yes_team, match.team_a, match.team_b,
                    )
                    continue
                price_cents = leg.yes_bid if self.maker else leg.yes_ask
                if price_cents is None or not 0 < price_cents < 100:
                    skipped += 1
                    continue
                decimal = odds_math.kalshi_price_to_decimal(price_cents)
                snaps.append(Snapshot(
                    game_id=link.game_id,
                    fetched_at=fetched_at,
                    book="kalshi",
                    is_sharp=0,
                    market="h2h",
                    outcome=link.outcome,
                    line=None,
                    american=odds_math.decimal_to_american(decimal),
                    decimal=decimal,
                    implied=odds_math.decimal_to_implied(decimal),
                ))

        written = repo.insert_snapshots(self.conn, snaps)
        self.conn.commit()
        if skipped:
            logger.info("Kalshi cache: %d snapshots written, %d skipped",
                        written, skipped)
        return written
