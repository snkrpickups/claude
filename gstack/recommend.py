"""Recommendation engine: filter → rank → size → emit (Section 13.5).

Candidates from Pillar A (or, later, Pillar B) already cleared the EV gate. Here
we rank by edge, size each with fractional Kelly, persist a recommendation row,
and open a CLV tracking row.
"""

from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from typing import List, Optional, Sequence

from .config import Config
from .engine import kelly as kelly_mod
from .engine.pillar_a import Candidate
from .store import repo
from .store.repo import Recommendation


@dataclass
class Ticket:
    rec_id: int
    rec: Recommendation


def size_and_persist(
    conn: sqlite3.Connection,
    config: Config,
    candidates: Sequence[Candidate],
    *,
    pillar: str = "A",
    rationale: Optional[str] = None,
) -> List[Ticket]:
    """Rank candidates by edge, size with Kelly, persist, and open CLV rows."""
    config.require_staking()
    ranked = sorted(candidates, key=lambda c: c.edge, reverse=True)
    tickets: List[Ticket] = []

    for c in ranked:
        # Size on the odds net of venue fees (Kalshi); the ticket still shows the
        # raw price (c.decimal). For fee-free books stake_decimal == decimal.
        stake = kelly_mod.kelly_stake(
            p=c.fair_prob,
            d=c.stake_decimal or c.decimal,
            bankroll=config.bankroll,            # validated above
            kelly_multiplier=config.kelly_multiplier,
            max_stake_per_bet=config.max_stake_per_bet,
        )
        rec = Recommendation(
            game_id=c.game_id,
            pillar=pillar,
            market=c.market,
            outcome=c.outcome,
            line=c.line,
            book=c.book,
            american=c.american,
            decimal=c.decimal,
            fair_prob=c.fair_prob,
            market_implied=c.market_implied,
            edge=c.edge,
            kelly_fraction=stake.kelly_fraction,
            stake=stake.stake,
            rationale=rationale,
        )
        rec_id = repo.insert_recommendation(conn, rec)
        rec.id = rec_id
        # Open a CLV row immediately so the harness can track this outcome.
        repo.upsert_clv(conn, rec_id=rec_id)
        tickets.append(Ticket(rec_id=rec_id, rec=rec))

    conn.commit()
    return tickets
