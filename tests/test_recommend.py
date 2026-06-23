import pytest

from gstack.config import Config
from gstack.clients.odds_client import OddsClient
from gstack.budget import BudgetGuard
from gstack.engine import pillar_a
from gstack.recommend import size_and_persist
from gstack.store import repo


def _setup(conn, nba_payload):
    config = Config()
    config.bankroll = 1000.0
    config.max_stake_per_bet = 100.0
    config.kelly_multiplier = 0.25
    OddsClient(conn, config, BudgetGuard(conn, 450)).ingest_fixture(
        nba_payload, fetched_at=1000
    )
    snaps = repo.snapshots_at(conn, 1000)
    cands = pillar_a.find_candidates(
        snaps, sharp_book=config.sharp_book, soft_books=config.soft_books,
        ev_threshold=config.ev_threshold,
    )
    return config, cands


def test_size_and_persist_creates_rows_and_clv(conn, nba_payload):
    config, cands = _setup(conn, nba_payload)
    tickets = size_and_persist(conn, config, cands, pillar="A")
    assert len(tickets) == 1
    t = tickets[0]
    # quarter-Kelly on +10% edge at 2.2: full=0.0833, quarter=0.0208, stake=20.83
    assert t.rec.stake == pytest.approx(20.8333, rel=1e-4)
    assert t.rec.edge == pytest.approx(0.10)

    # persisted
    rows = repo.list_recommendations(conn)
    assert len(rows) == 1
    assert rows[0]["pillar"] == "A"
    assert rows[0]["stake"] == pytest.approx(20.8333, rel=1e-4)

    # CLV row opened
    clv = repo.get_clv(conn, t.rec_id)
    assert clv is not None
    assert clv["result"] is None


def test_size_and_persist_requires_staking_config(conn, nba_payload):
    config, cands = _setup(conn, nba_payload)
    config.bankroll = None  # unset
    with pytest.raises(ValueError):
        size_and_persist(conn, config, cands, pillar="A")
