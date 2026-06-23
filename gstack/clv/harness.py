"""CLV harness (Section 9) — the primary validation metric.

For every recommendation:
  1. At emission we store the price GSTACK would take (``rec.decimal``).
  2. At each later poll up to tip we update the best closing price for that
     exact outcome/line.
  3. After close we compute sign-aware ``clv_pct``.
  4. After the game we grade ``result``.
"""

from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence

from ..store import repo


def clv_pct(rec_decimal: float, closing_decimal: float) -> float:
    """Sign-aware CLV: positive means we beat the closing number.

    ``(rec_decimal / closing_decimal - 1) * 100``. A higher decimal price is a
    better price, so getting a higher number than the close is positive CLV.
    """
    if closing_decimal <= 0:
        raise ValueError("closing_decimal must be positive")
    return (rec_decimal / closing_decimal - 1) * 100


def capture_closing(
    conn: sqlite3.Connection,
    rec_id: int,
    *,
    soft_books: Optional[Sequence[str]] = None,
) -> Optional[float]:
    """Update the best closing price seen so far for one recommendation.

    Looks across stored snapshots (from emission time onward) for the exact
    outcome/line and records the best (highest decimal) price plus the resulting
    ``clv_pct``. Reads only stored data — costs zero API requests.
    """
    rec = repo.get_recommendation(conn, rec_id)
    if rec is None:
        return None
    rows = repo.snapshots_for_outcome(
        conn,
        game_id=rec["game_id"],
        market=rec["market"],
        outcome=rec["outcome"],
        line=rec["line"],
        books=list(soft_books) if soft_books else None,
        not_before=rec["created_at"],
    )
    if not rows:
        return None
    # Closing line = best price across books at the most recent poll up to tip.
    latest = max(r["fetched_at"] for r in rows)
    closing = max(r["decimal"] for r in rows if r["fetched_at"] == latest)
    pct = clv_pct(float(rec["decimal"]), float(closing))
    repo.upsert_clv(conn, rec_id=rec_id, closing_decimal=closing, clv_pct=pct)
    conn.commit()
    return pct


def capture_all_open(
    conn: sqlite3.Connection, *, soft_books: Optional[Sequence[str]] = None
) -> int:
    """Refresh closing prices for every recommendation not yet graded."""
    updated = 0
    for row in repo.list_clv(conn):
        if row["result"] is not None:
            continue  # already graded; closing is locked
        if capture_closing(conn, row["id"], soft_books=soft_books) is not None:
            updated += 1
    return updated


# --------------------------------------------------------------------------- #
# Grading
# --------------------------------------------------------------------------- #
def grade_outcome(
    *, market: str, outcome: str, line: Optional[float],
    home_team: str, away_team: str, home_score: int, away_score: int,
) -> str:
    """Decide win/loss/push for a single bet from the final score.

    h2h:     team named by ``outcome`` must win.
    spreads: outcome team's score + its line must exceed the opponent's.
    totals:  'Over'/'Under' vs (home+away) compared to ``line``.
    """
    if market == "h2h":
        if home_score == away_score:
            return "push"
        winner = home_team if home_score > away_score else away_team
        return "win" if outcome == winner else "loss"

    if market == "spreads":
        if line is None:
            raise ValueError("spreads grading requires a line")
        if outcome == home_team:
            margin = (home_score + line) - away_score
        elif outcome == away_team:
            margin = (away_score + line) - home_score
        else:
            raise ValueError(f"outcome {outcome!r} is not a team in this game")
        if margin > 0:
            return "win"
        if margin < 0:
            return "loss"
        return "push"

    if market == "totals":
        if line is None:
            raise ValueError("totals grading requires a line")
        total = home_score + away_score
        if total == line:
            return "push"
        over = total > line
        if outcome.lower() == "over":
            return "win" if over else "loss"
        if outcome.lower() == "under":
            return "loss" if over else "win"
        raise ValueError(f"unexpected totals outcome {outcome!r}")

    raise ValueError(f"unknown market {market!r}")


def grade_game(
    conn: sqlite3.Connection,
    game_id: str,
    *,
    home_score: int,
    away_score: int,
    soft_books: Optional[Sequence[str]] = None,
) -> int:
    """Grade every recommendation for a finished game; lock closing first."""
    game = repo.get_game(conn, game_id)
    if game is None:
        raise ValueError(f"unknown game {game_id!r}")
    home_team, away_team = game["home_team"], game["away_team"]

    graded = 0
    for rec in repo.list_recommendations(conn):
        if rec["game_id"] != game_id:
            continue
        # Make sure the closing line is captured before we lock the row.
        capture_closing(conn, rec["id"], soft_books=soft_books)
        result = grade_outcome(
            market=rec["market"],
            outcome=rec["outcome"],
            line=rec["line"],
            home_team=home_team,
            away_team=away_team,
            home_score=home_score,
            away_score=away_score,
        )
        repo.upsert_clv(
            conn, rec_id=rec["id"], result=result, graded_at=repo.now_epoch()
        )
        graded += 1

    repo.set_game_status(conn, game_id, "final")
    conn.commit()
    return graded


# --------------------------------------------------------------------------- #
# Reporting (gstack clv)
# --------------------------------------------------------------------------- #
@dataclass
class Segment:
    key: str
    n: int
    mean_clv: Optional[float]
    hit_rate: Optional[float]  # wins / graded (pushes excluded)


def _summarize(rows: List[sqlite3.Row]) -> Segment:
    clvs = [r["clv_pct"] for r in rows if r["clv_pct"] is not None]
    decided = [r for r in rows if r["result"] in ("win", "loss")]
    wins = [r for r in decided if r["result"] == "win"]
    return Segment(
        key="",
        n=len(rows),
        mean_clv=(sum(clvs) / len(clvs)) if clvs else None,
        hit_rate=(len(wins) / len(decided)) if decided else None,
    )


def report(
    conn: sqlite3.Connection, *, only_bet_taken: bool = False
) -> Dict[str, List[Segment]]:
    """Mean CLV and hit rate, segmented by pillar and by market.

    ``only_bet_taken`` restricts to recommendations the owner actually bet
    (``bet_taken=1``), reported separately per Section 9.
    """
    rows = [
        r for r in repo.list_clv(conn)
        if (not only_bet_taken) or r["bet_taken"] == 1
    ]

    def segment_by(field: str) -> List[Segment]:
        buckets: Dict[str, List[sqlite3.Row]] = {}
        for r in rows:
            buckets.setdefault(r[field], []).append(r)
        out = []
        for key, group in sorted(buckets.items()):
            seg = _summarize(group)
            seg.key = key
            out.append(seg)
        return out

    overall = _summarize(rows)
    overall.key = "ALL"
    return {
        "overall": [overall],
        "by_pillar": segment_by("pillar"),
        "by_market": segment_by("market"),
    }
