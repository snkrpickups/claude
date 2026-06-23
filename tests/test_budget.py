import pytest

from gstack.budget import BudgetGuard, BudgetExceeded, current_month
from gstack.config import Config
from gstack.store import db


@pytest.fixture
def conn():
    return db.connect(":memory:")


def test_spend_increments_and_persists(conn):
    guard = BudgetGuard(conn, request_budget=10)
    assert guard.used() == 0
    assert guard.spend(1) == 1
    assert guard.spend(2) == 3
    assert guard.used() == 3
    assert guard.remaining() == 7


def test_spend_refuses_over_budget(conn):
    guard = BudgetGuard(conn, request_budget=3)
    guard.spend(3)
    assert guard.used() == 3
    with pytest.raises(BudgetExceeded):
        guard.spend(1)
    # counter not incremented on refusal
    assert guard.used() == 3


def test_would_exceed(conn):
    guard = BudgetGuard(conn, request_budget=2)
    assert guard.would_exceed(2) is False
    guard.spend(2)
    assert guard.would_exceed(1) is True


def test_report_projection(conn):
    guard = BudgetGuard(conn, request_budget=450)
    guard.spend(10)
    rep = guard.report(slates_remaining=5, pulls_per_slate=4)
    assert rep["used"] == 10
    assert rep["remaining"] == 440
    assert rep["projected_month_end"] == 30  # 10 + 5*4


def test_exhaustion_serves_cache_without_calling_api(conn):
    """Phase 1 criterion: simulate exhaustion -> serve cache, do not call API."""
    from gstack.clients.odds_client import OddsClient

    config = Config()
    config.odds_api_key = "dummy"

    def exploding_http_get(url, params):
        raise AssertionError("HTTP must NOT be called when budget is exhausted")

    # Seed a cached batch (no budget spent) so there's something to serve.
    client = OddsClient(conn, config, BudgetGuard(conn, request_budget=0),
                        http_get=exploding_http_get)
    payload = [{
        "id": "g1", "home_team": "A", "away_team": "B",
        "commence_time": "2026-06-23T02:10:00Z",
        "bookmakers": [{"key": "pinnacle", "markets": [
            {"key": "h2h", "outcomes": [
                {"name": "A", "price": -110}, {"name": "B", "price": -110},
            ]}]}],
    }]
    client.ingest_fixture(payload, fetched_at=1000)

    # Budget is 0 -> spend(1) refused -> poll serves cache, no HTTP call.
    result = client.poll_odds()
    assert result.from_cache is True
    assert result.requests_spent == 0
    assert BudgetGuard(conn, 0).used() == 0  # no request was counted
