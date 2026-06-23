"""Typed read/write helpers over the SQLite store.

Caching is correctness, not optimization (Section 12): analysis reads from
here, never re-fetches. Re-reading stored data costs zero API requests.
"""

from __future__ import annotations

import sqlite3
import time
from dataclasses import dataclass
from typing import Iterable, List, Optional


def now_epoch() -> int:
    return int(time.time())


# --------------------------------------------------------------------------- #
# games
# --------------------------------------------------------------------------- #
def upsert_game(
    conn: sqlite3.Connection,
    *,
    game_id: str,
    sport: str,
    home_team: str,
    away_team: str,
    commence_time: int,
    status: str = "scheduled",
) -> None:
    conn.execute(
        """
        INSERT INTO games (game_id, sport, home_team, away_team, commence_time,
                           status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(game_id) DO UPDATE SET
            sport=excluded.sport,
            home_team=excluded.home_team,
            away_team=excluded.away_team,
            commence_time=excluded.commence_time,
            status=excluded.status
        """,
        (game_id, sport, home_team, away_team, commence_time, status, now_epoch()),
    )


def set_game_status(conn: sqlite3.Connection, game_id: str, status: str) -> None:
    conn.execute("UPDATE games SET status=? WHERE game_id=?", (status, game_id))


def get_game(conn: sqlite3.Connection, game_id: str) -> Optional[sqlite3.Row]:
    cur = conn.execute("SELECT * FROM games WHERE game_id=?", (game_id,))
    return cur.fetchone()


def list_games(conn: sqlite3.Connection) -> List[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM games ORDER BY commence_time ASC"
    ).fetchall()


# --------------------------------------------------------------------------- #
# odds_snapshots
# --------------------------------------------------------------------------- #
@dataclass
class Snapshot:
    game_id: str
    fetched_at: int
    book: str
    is_sharp: int
    market: str
    outcome: str
    line: Optional[float]
    american: int
    decimal: float
    implied: float


def insert_snapshots(conn: sqlite3.Connection, snaps: Iterable[Snapshot]) -> int:
    rows = [
        (
            s.game_id, s.fetched_at, s.book, s.is_sharp, s.market, s.outcome,
            s.line, s.american, s.decimal, s.implied,
        )
        for s in snaps
    ]
    conn.executemany(
        """
        INSERT INTO odds_snapshots
            (game_id, fetched_at, book, is_sharp, market, outcome, line,
             american, decimal, implied)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows,
    )
    return len(rows)


def latest_fetch_time(conn: sqlite3.Connection) -> Optional[int]:
    cur = conn.execute("SELECT MAX(fetched_at) AS t FROM odds_snapshots")
    row = cur.fetchone()
    return row["t"] if row and row["t"] is not None else None


def snapshots_at(
    conn: sqlite3.Connection, fetched_at: int
) -> List[sqlite3.Row]:
    """All snapshots from one fetch batch (one poll)."""
    return conn.execute(
        "SELECT * FROM odds_snapshots WHERE fetched_at=?", (fetched_at,)
    ).fetchall()


def latest_snapshots(conn: sqlite3.Connection) -> List[sqlite3.Row]:
    """The most recent fetch batch, or [] if none stored."""
    t = latest_fetch_time(conn)
    if t is None:
        return []
    return snapshots_at(conn, t)


def snapshots_for_outcome(
    conn: sqlite3.Connection,
    *,
    game_id: str,
    market: str,
    outcome: str,
    line: Optional[float],
    books: Optional[List[str]] = None,
    not_before: Optional[int] = None,
) -> List[sqlite3.Row]:
    """All stored snapshots for an exact outcome/line, optionally book-filtered."""
    q = [
        "SELECT * FROM odds_snapshots",
        "WHERE game_id=? AND market=? AND outcome=?",
    ]
    params: list = [game_id, market, outcome]
    if line is None:
        q.append("AND line IS NULL")
    else:
        q.append("AND line=?")
        params.append(line)
    if books:
        q.append("AND book IN (%s)" % ",".join("?" * len(books)))
        params.extend(books)
    if not_before is not None:
        q.append("AND fetched_at >= ?")
        params.append(not_before)
    q.append("ORDER BY fetched_at ASC, decimal DESC")
    return conn.execute(" ".join(q), params).fetchall()


def best_price_for_outcome(
    conn: sqlite3.Connection,
    *,
    game_id: str,
    market: str,
    outcome: str,
    line: Optional[float],
    soft_books: Optional[List[str]] = None,
    not_before: Optional[int] = None,
) -> Optional[sqlite3.Row]:
    """Best (highest decimal) price ever stored for an exact outcome/line.

    Used by the CLV harness to track the best closing number. If ``soft_books``
    is given, restrict to those. ``not_before`` filters by fetched_at.
    """
    q = [
        "SELECT * FROM odds_snapshots",
        "WHERE game_id=? AND market=? AND outcome=?",
    ]
    params: list = [game_id, market, outcome]
    if line is None:
        q.append("AND line IS NULL")
    else:
        q.append("AND line=?")
        params.append(line)
    if soft_books:
        q.append("AND book IN (%s)" % ",".join("?" * len(soft_books)))
        params.extend(soft_books)
    if not_before is not None:
        q.append("AND fetched_at >= ?")
        params.append(not_before)
    q.append("ORDER BY decimal DESC LIMIT 1")
    return conn.execute(" ".join(q), params).fetchone()


# --------------------------------------------------------------------------- #
# recommendations
# --------------------------------------------------------------------------- #
@dataclass
class Recommendation:
    game_id: str
    pillar: str
    market: str
    outcome: str
    line: Optional[float]
    book: str
    american: int
    decimal: float
    fair_prob: float
    market_implied: float
    edge: float
    kelly_fraction: float
    stake: float
    rationale: Optional[str] = None
    created_at: Optional[int] = None
    id: Optional[int] = None


def insert_recommendation(conn: sqlite3.Connection, rec: Recommendation) -> int:
    created = rec.created_at or now_epoch()
    cur = conn.execute(
        """
        INSERT INTO recommendations
            (created_at, game_id, pillar, market, outcome, line, book, american,
             decimal, fair_prob, market_implied, edge, kelly_fraction, stake,
             rationale, bet_taken)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        """,
        (
            created, rec.game_id, rec.pillar, rec.market, rec.outcome, rec.line,
            rec.book, rec.american, rec.decimal, rec.fair_prob,
            rec.market_implied, rec.edge, rec.kelly_fraction, rec.stake,
            rec.rationale,
        ),
    )
    return int(cur.lastrowid)


def list_recommendations(conn: sqlite3.Connection) -> List[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM recommendations ORDER BY created_at DESC, id DESC"
    ).fetchall()


def get_recommendation(conn: sqlite3.Connection, rec_id: int) -> Optional[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM recommendations WHERE id=?", (rec_id,)
    ).fetchone()


def mark_bet_taken(conn: sqlite3.Connection, rec_id: int, taken: bool = True) -> None:
    conn.execute(
        "UPDATE recommendations SET bet_taken=? WHERE id=?",
        (1 if taken else 0, rec_id),
    )


# --------------------------------------------------------------------------- #
# clv
# --------------------------------------------------------------------------- #
def upsert_clv(
    conn: sqlite3.Connection,
    *,
    rec_id: int,
    closing_decimal: Optional[float] = None,
    clv_pct: Optional[float] = None,
    result: Optional[str] = None,
    graded_at: Optional[int] = None,
) -> None:
    conn.execute(
        """
        INSERT INTO clv (rec_id, closing_decimal, clv_pct, result, graded_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(rec_id) DO UPDATE SET
            closing_decimal=COALESCE(excluded.closing_decimal, clv.closing_decimal),
            clv_pct=COALESCE(excluded.clv_pct, clv.clv_pct),
            result=COALESCE(excluded.result, clv.result),
            graded_at=COALESCE(excluded.graded_at, clv.graded_at)
        """,
        (rec_id, closing_decimal, clv_pct, result, graded_at),
    )


def get_clv(conn: sqlite3.Connection, rec_id: int) -> Optional[sqlite3.Row]:
    return conn.execute("SELECT * FROM clv WHERE rec_id=?", (rec_id,)).fetchone()


def list_clv(conn: sqlite3.Connection) -> List[sqlite3.Row]:
    return conn.execute(
        """
        SELECT r.*, c.closing_decimal, c.clv_pct, c.result, c.graded_at
        FROM recommendations r
        LEFT JOIN clv c ON c.rec_id = r.id
        ORDER BY r.created_at DESC
        """
    ).fetchall()


# --------------------------------------------------------------------------- #
# budget
# --------------------------------------------------------------------------- #
def get_budget_used(conn: sqlite3.Connection, month: str) -> int:
    row = conn.execute(
        "SELECT requests_used FROM budget WHERE month=?", (month,)
    ).fetchone()
    return int(row["requests_used"]) if row else 0


def add_budget_used(conn: sqlite3.Connection, month: str, n: int) -> int:
    conn.execute(
        """
        INSERT INTO budget (month, requests_used) VALUES (?, ?)
        ON CONFLICT(month) DO UPDATE SET requests_used = requests_used + ?
        """,
        (month, n, n),
    )
    return get_budget_used(conn, month)
