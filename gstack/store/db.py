"""SQLite connection + schema bootstrap (free phase).

Schema is kept Postgres-portable; this module is the only place that knows
we're on SQLite today.
"""

from __future__ import annotations

import os
import sqlite3
from pathlib import Path

SCHEMA_PATH = Path(__file__).with_name("schema.sql")


def connect(db_path: str) -> sqlite3.Connection:
    """Open a SQLite connection with sensible defaults and the schema applied.

    ``:memory:`` is supported for tests. Foreign keys are enabled; rows come
    back as ``sqlite3.Row`` for name-based access.
    """
    if db_path != ":memory:":
        parent = os.path.dirname(os.path.abspath(db_path))
        os.makedirs(parent, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    init_schema(conn)
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    """Apply schema.sql idempotently (all CREATE ... IF NOT EXISTS)."""
    sql = SCHEMA_PATH.read_text(encoding="utf-8")
    conn.executescript(sql)
    conn.commit()
