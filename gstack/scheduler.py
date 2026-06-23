"""The budgeted polling loop (Section 6.3).

Free phase: NBA main markets only, slate-aware cadence (3-5 pulls/slate), well
under budget. This module runs ONE budgeted poll then the full analysis against
stored data. A real deployment wires ``run_once`` to a cron/slate schedule; we
deliberately avoid a continuous loop so request consumption stays bounded.
"""

from __future__ import annotations

import logging
import sqlite3
from dataclasses import dataclass
from typing import List

from .clients.odds_client import OddsClient, PollResult
from .config import Config
from .clv import harness
from .engine import pillar_a
from .recommend import Ticket, size_and_persist

logger = logging.getLogger("gstack.scheduler")


@dataclass
class RunReport:
    poll: PollResult
    candidates: int
    tickets: List[Ticket]


def run_once(
    conn: sqlite3.Connection, config: Config, client: OddsClient
) -> RunReport:
    """One budgeted fetch + full analysis against the freshly cached batch."""
    poll = client.poll_odds()
    snaps = (
        # Analyze exactly the batch we just stored (or the latest cache on a
        # budget refusal) — re-reading stored data costs zero requests.
        _snaps_for(conn, poll.fetched_at)
    )
    candidates = pillar_a.find_candidates(
        snaps,
        sharp_book=config.sharp_book,
        soft_books=config.soft_books,
        ev_threshold=config.ev_threshold,
    )
    tickets: List[Ticket] = []
    if candidates and config.bankroll is not None and config.max_stake_per_bet is not None:
        tickets = size_and_persist(conn, config, candidates, pillar="A")
    elif candidates:
        logger.warning(
            "%d candidate(s) found but BANKROLL/MAX_STAKE_PER_BET unset; "
            "skipping staking. Set them to persist recommendations.",
            len(candidates),
        )

    # Keep closing lines fresh for any still-open recommendations (zero cost).
    harness.capture_all_open(conn, soft_books=config.soft_books)

    logger.info(
        "Run complete: %d snapshots (%s), %d candidates, %d tickets",
        poll.snapshots_written,
        "cache" if poll.from_cache else "live",
        len(candidates),
        len(tickets),
    )
    return RunReport(poll=poll, candidates=len(candidates), tickets=tickets)


def _snaps_for(conn: sqlite3.Connection, fetched_at: int):
    from .store import repo

    snaps = repo.snapshots_at(conn, fetched_at)
    if snaps:
        return snaps
    return repo.latest_snapshots(conn)


def run_world_cup_once(
    conn: sqlite3.Connection,
    config: Config,
    odds_client: OddsClient,
    kalshi_client,
) -> RunReport:
    """One World Cup cycle: budgeted sharp poll + free Kalshi pull + analysis.

    The sharp soccer line (Odds API, metered) sets the fair probability; Kalshi
    (free) is the venue we'd bet at. Both land in the same snapshot batch so
    Pillar A compares them directly, with Kalshi fees folded into the EV gate.
    """
    profile = config.sport_profile()
    # Drive the sharp fetch from the soccer profile (Kalshi is the soft side).
    config.sport = profile.name
    config.odds_api_sport_key = profile.odds_api_sport_key
    config.markets = profile.markets
    config.soft_books = profile.soft_books

    poll = odds_client.poll_odds()  # spends 1 request (or serves cache)

    # Kalshi is free — pull it and align legs to the sharp games we just cached.
    try:
        matches = kalshi_client.fetch_world_cup_markets(config.kalshi_series_ticker)
        kalshi_client.cache_markets(matches, fetched_at=poll.fetched_at)
    except Exception as exc:  # never let the free venue break the budgeted run
        logger.warning("Kalshi fetch failed (%s); analyzing sharp cache only.", exc)

    snaps = _snaps_for(conn, poll.fetched_at)

    fee_model = config.kalshi_fee_model()

    def fee_adjuster(book: str, gross_decimal: float):
        if book == "kalshi":
            return fee_model.adjust(gross_decimal)
        return gross_decimal, 0.0

    candidates = pillar_a.find_candidates(
        snaps,
        sharp_book=config.sharp_book,
        soft_books=config.soft_books,
        ev_threshold=config.ev_threshold,
        fee_adjuster=fee_adjuster,
    )

    tickets: List[Ticket] = []
    if candidates and config.bankroll is not None and config.max_stake_per_bet is not None:
        tickets = size_and_persist(conn, config, candidates, pillar="A")
    elif candidates:
        logger.warning(
            "%d World Cup candidate(s) found but BANKROLL/MAX_STAKE_PER_BET "
            "unset; skipping staking.", len(candidates),
        )

    harness.capture_all_open(conn, soft_books=config.soft_books)
    logger.info(
        "World Cup run: %d snapshots (%s), %d candidates, %d tickets",
        poll.snapshots_written, "cache" if poll.from_cache else "live",
        len(candidates), len(tickets),
    )
    return RunReport(poll=poll, candidates=len(candidates), tickets=tickets)
