import pytest

from gstack.budget import BudgetGuard
from gstack.config import Config
from gstack.clients.odds_client import OddsClient, parse_odds_payload
from gstack.store import repo


def test_parse_payload_shapes(nba_payload):
    games, snaps = parse_odds_payload(
        nba_payload, sport="NBA", sharp_book="pinnacle", fetched_at=1000
    )
    assert len(games) == 1
    assert games[0]["home_team"] == "Los Angeles Lakers"
    # 2 books x 1 market x 2 outcomes = 4 snapshots
    assert len(snaps) == 4
    sharp = [s for s in snaps if s.is_sharp == 1]
    assert all(s.book == "pinnacle" for s in sharp)
    assert len(sharp) == 2


def test_poll_spends_exactly_one_request(conn, nba_payload):
    config = Config()
    config.odds_api_key = "dummy"
    calls = []

    def http_get(url, params):
        calls.append((url, params))
        return nba_payload

    guard = BudgetGuard(conn, request_budget=450)
    client = OddsClient(conn, config, guard, http_get=http_get)

    result = client.poll_odds()
    assert result.from_cache is False
    assert result.requests_spent == 1
    assert result.snapshots_written == 4
    assert result.games_written == 1
    assert len(calls) == 1                 # exactly one HTTP call
    assert guard.used() == 1               # exactly one request counted

    # Snapshots and game are cached.
    assert len(repo.latest_snapshots(conn)) == 4
    assert repo.get_game(conn, "g1") is not None


def test_ingest_fixture_spends_no_budget(conn, nba_payload):
    config = Config()
    guard = BudgetGuard(conn, request_budget=450)
    client = OddsClient(conn, config, guard)
    client.ingest_fixture(nba_payload, fetched_at=1000)
    assert guard.used() == 0
    assert len(repo.snapshots_at(conn, 1000)) == 4
