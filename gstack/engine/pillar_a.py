"""Pillar A — market-based +EV (Section 3).

Treat the sharp book (Pinnacle where present, else market consensus) as the
source of true probability: devig its line to a fair probability, then scan the
soft books for a price whose implied probability is lower than fair. The gap is
the edge. No outcome prediction — only the math from Section 4.

This module is pure given a list of snapshot rows (no DB, no network), so it is
trivially unit-testable against a hand-checked fixture.
"""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence, Tuple

from . import ev as ev_mod
from . import odds_math

# A snapshot is anything with these attributes (sqlite3.Row or dataclass).
OutcomeKey = Tuple[str, str, str, Optional[float]]  # game_id, market, outcome, line


@dataclass
class Candidate:
    game_id: str
    market: str
    outcome: str
    line: Optional[float]
    book: str               # soft book we'd bet at
    american: int
    decimal: float
    fair_prob: float        # devigged sharp (or consensus) probability
    market_implied: float   # soft book implied
    edge: float             # p * d - 1
    fair_source: str        # 'pinnacle' or 'consensus'


def _get(row, key):
    """Access either a sqlite3.Row (mapping) or an attribute-bearing object."""
    try:
        return row[key]
    except (TypeError, KeyError, IndexError):
        return getattr(row, key)


def _group_by_game_market(snaps: Sequence) -> Dict[Tuple[str, str], List]:
    groups: Dict[Tuple[str, str], List] = defaultdict(list)
    for s in snaps:
        groups[(_get(s, "game_id"), _get(s, "market"))].append(s)
    return groups


def _devig_book(rows: Sequence) -> Dict[OutcomeKey, float]:
    """Devig one book's outcomes for a single game/market.

    Pairs the outcomes present (two-way for h2h/spreads/totals, N-way otherwise)
    and returns fair prob keyed by (game_id, market, outcome, line).
    """
    implieds = [float(_get(r, "implied")) for r in rows]
    fair = odds_math.devig_multiway(implieds)
    out: Dict[OutcomeKey, float] = {}
    for r, p in zip(rows, fair):
        key = (
            _get(r, "game_id"),
            _get(r, "market"),
            _get(r, "outcome"),
            _get(r, "line"),
        )
        out[key] = p
    return out


def _consensus_fair(rows: Sequence) -> Dict[OutcomeKey, float]:
    """Consensus fair probabilities when no sharp book is present.

    Average each outcome's implied probability across all books, then normalize
    (devig) over the outcomes. Outcomes are matched on (outcome, line).
    """
    by_outcome: Dict[OutcomeKey, List[float]] = defaultdict(list)
    for r in rows:
        key = (
            _get(r, "game_id"),
            _get(r, "market"),
            _get(r, "outcome"),
            _get(r, "line"),
        )
        by_outcome[key].append(float(_get(r, "implied")))
    keys = list(by_outcome.keys())
    mean_implied = [sum(v) / len(v) for v in by_outcome.values()]
    fair = odds_math.devig_multiway(mean_implied)
    return {k: p for k, p in zip(keys, fair)}


def find_candidates(
    snaps: Sequence,
    *,
    sharp_book: str,
    soft_books: Sequence[str],
    ev_threshold: float = ev_mod.DEFAULT_EV_THRESHOLD,
    use_consensus_fallback: bool = True,
) -> List[Candidate]:
    """Scan a snapshot batch and return +EV candidates that clear the EV gate.

    For each game/market: build fair probabilities from the sharp book if it is
    present (else, if enabled, from market consensus over the other books), then
    compare every soft-book price for the exact same outcome/line.
    """
    candidates: List[Candidate] = []

    for (game_id, market), rows in _group_by_game_market(snaps).items():
        sharp_rows = [r for r in rows if _get(r, "book") == sharp_book]

        if sharp_rows and len(sharp_rows) >= 2:
            fair_map = _devig_book(sharp_rows)
            fair_source = sharp_book
        elif use_consensus_fallback:
            # Build consensus from all non-sharp books (sharp absent/incomplete).
            ref_rows = [r for r in rows if _get(r, "book") != sharp_book]
            if len(ref_rows) < 2:
                continue
            fair_map = _consensus_fair(ref_rows)
            fair_source = "consensus"
        else:
            continue

        for r in rows:
            book = _get(r, "book")
            if book == fair_source:
                continue  # never bet the sharp reference against itself
            if soft_books and book not in soft_books:
                continue
            key: OutcomeKey = (
                game_id, market, _get(r, "outcome"), _get(r, "line"),
            )
            p = fair_map.get(key)
            if p is None:
                continue  # soft line doesn't match a sharp/consensus outcome
            d = float(_get(r, "decimal"))
            edge = ev_mod.ev_per_unit(p, d)
            if edge > ev_threshold:
                candidates.append(
                    Candidate(
                        game_id=game_id,
                        market=market,
                        outcome=_get(r, "outcome"),
                        line=_get(r, "line"),
                        book=book,
                        american=int(_get(r, "american")),
                        decimal=d,
                        fair_prob=p,
                        market_implied=float(_get(r, "implied")),
                        edge=edge,
                        fair_source=fair_source,
                    )
                )
    return candidates
