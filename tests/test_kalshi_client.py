import pytest

from gstack.clients.kalshi_client import (
    KalshiClient, KalshiLeg, KalshiMatch, normalize_kalshi_events,
)
from gstack.store import db, repo


@pytest.fixture
def conn():
    return db.connect(":memory:")


def _seed_game(conn):
    repo.upsert_game(
        conn, game_id="wc1", sport="SOCCER_WC",
        home_team="Brazil", away_team="France",
        commence_time=1_750_000_000,
    )
    conn.commit()


def test_normalize_events_shapes():
    raw = [{
        "event_ticker": "KXWCGAME-BRAFRA",
        "team_a": "Brazil", "team_b": "France",
        "commence_time": "2026-06-26T18:00:00Z",
        "markets": [
            {"ticker": "T1", "yes_team": "Brazil", "yes_ask": 45, "yes_bid": 43},
            {"ticker": "T2", "yes_team": "Draw", "yes_ask": 30, "yes_bid": 28},
        ],
    }]
    matches = normalize_kalshi_events(raw)
    assert len(matches) == 1
    assert matches[0].team_a == "Brazil"
    assert matches[0].commence_time == 1782496800  # epoch of 2026-06-26T18:00Z
    assert matches[0].legs[0].yes_ask == 45


def test_cache_markets_links_and_writes(conn):
    _seed_game(conn)
    client = KalshiClient(conn)
    match = KalshiMatch(
        team_a="Brazil", team_b="France", commence_time=1_750_000_000,
        legs=[
            KalshiLeg(yes_team="Brazil", yes_ask=45),
            KalshiLeg(yes_team="Draw", yes_ask=30),
            KalshiLeg(yes_team="France", yes_ask=30),
        ],
    )
    written = client.cache_markets([match], fetched_at=1_750_000_100)
    assert written == 3
    rows = repo.snapshots_at(conn, 1_750_000_100)
    assert {r["outcome"] for r in rows} == {"Brazil", "Draw", "France"}
    assert all(r["book"] == "kalshi" for r in rows)
    brazil = next(r for r in rows if r["outcome"] == "Brazil")
    assert brazil["decimal"] == pytest.approx(1 / 0.45)
    assert brazil["implied"] == pytest.approx(0.45)


def test_cache_markets_skips_unmatched(conn):
    _seed_game(conn)
    client = KalshiClient(conn)
    match = KalshiMatch(
        team_a="Brazil", team_b="Spain", commence_time=1_750_000_000,
        legs=[KalshiLeg(yes_team="Brazil", yes_ask=45)],
    )
    # Spain isn't in any stored game -> nothing written.
    assert client.cache_markets([match], fetched_at=1_750_000_100) == 0


def test_maker_uses_bid(conn):
    _seed_game(conn)
    client = KalshiClient(conn, maker=True)
    match = KalshiMatch(
        team_a="Brazil", team_b="France", commence_time=1_750_000_000,
        legs=[KalshiLeg(yes_team="Brazil", yes_ask=45, yes_bid=43)],
    )
    client.cache_markets([match], fetched_at=1_750_000_100)
    row = repo.snapshots_at(conn, 1_750_000_100)[0]
    assert row["implied"] == pytest.approx(0.43)  # posted at the bid
