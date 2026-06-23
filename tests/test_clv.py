import pytest

from gstack.clients.odds_client import OddsClient
from gstack.budget import BudgetGuard
from gstack.config import Config
from gstack.clv import harness
from gstack.engine import odds_math, pillar_a
from gstack.recommend import size_and_persist
from gstack.store import repo
from gstack.store.repo import Snapshot


def _staking_config():
    c = Config()
    c.bankroll = 1000.0
    c.max_stake_per_bet = 100.0
    return c


def test_clv_pct_sign_aware():
    # got a better (higher) price than the close -> positive
    assert harness.clv_pct(2.20, 2.05) == pytest.approx((2.20 / 2.05 - 1) * 100)
    assert harness.clv_pct(2.20, 2.05) > 0
    # got a worse price than the close -> negative
    assert harness.clv_pct(2.00, 2.20) < 0
    # equal -> zero
    assert harness.clv_pct(2.0, 2.0) == 0.0


def _make_rec(conn, nba_payload):
    config = _staking_config()
    OddsClient(conn, config, BudgetGuard(conn, 450)).ingest_fixture(
        nba_payload, fetched_at=1000
    )
    snaps = repo.snapshots_at(conn, 1000)
    cands = pillar_a.find_candidates(
        snaps, sharp_book=config.sharp_book, soft_books=config.soft_books,
        ev_threshold=config.ev_threshold,
    )
    tickets = size_and_persist(conn, config, cands, pillar="A")
    return config, tickets[0]


def test_capture_closing_computes_clv(conn, nba_payload):
    config, ticket = _make_rec(conn, nba_payload)
    # rec was taken at +120 (decimal 2.20). Add a later (closing) DK price that
    # shortened to +105 (decimal 2.05): we beat the close. The closing snapshot
    # must be fetched after the rec's emission time.
    closing_at = repo.get_recommendation(conn, ticket.rec_id)["created_at"] + 3600
    dec = odds_math.american_to_decimal(105)
    repo.insert_snapshots(conn, [Snapshot(
        game_id="g1", fetched_at=closing_at, book="draftkings", is_sharp=0,
        market="h2h", outcome="Los Angeles Lakers", line=None,
        american=105, decimal=dec, implied=odds_math.decimal_to_implied(dec),
    )])
    conn.commit()

    pct = harness.capture_closing(conn, ticket.rec_id, soft_books=config.soft_books)
    assert pct == pytest.approx((2.20 / dec - 1) * 100)
    assert pct > 0
    row = repo.get_clv(conn, ticket.rec_id)
    assert row["closing_decimal"] == pytest.approx(dec)


def test_grade_game_sets_result(conn, nba_payload):
    config, ticket = _make_rec(conn, nba_payload)
    # Lakers (home) win 110-100 -> our Lakers h2h bet wins.
    graded = harness.grade_game(
        conn, "g1", home_score=110, away_score=100, soft_books=config.soft_books
    )
    assert graded == 1
    row = repo.get_clv(conn, ticket.rec_id)
    assert row["result"] == "win"
    assert row["graded_at"] is not None
    assert repo.get_game(conn, "g1")["status"] == "final"


def test_grade_outcome_markets():
    # h2h
    assert harness.grade_outcome(
        market="h2h", outcome="Home", line=None, home_team="Home",
        away_team="Away", home_score=5, away_score=3) == "win"
    # spread: Home -3.5, win by 4 -> covers
    assert harness.grade_outcome(
        market="spreads", outcome="Home", line=-3.5, home_team="Home",
        away_team="Away", home_score=104, away_score=100) == "win"
    # spread: Home -3.5, win by 3 -> no cover
    assert harness.grade_outcome(
        market="spreads", outcome="Home", line=-3.5, home_team="Home",
        away_team="Away", home_score=103, away_score=100) == "loss"
    # total Under 228.5, total 220 -> under wins
    assert harness.grade_outcome(
        market="totals", outcome="Under", line=228.5, home_team="Home",
        away_team="Away", home_score=110, away_score=110) == "win"
    # total push
    assert harness.grade_outcome(
        market="totals", outcome="Over", line=220.0, home_team="Home",
        away_team="Away", home_score=110, away_score=110) == "push"


def test_report_segments(conn, nba_payload):
    config, ticket = _make_rec(conn, nba_payload)
    harness.grade_game(conn, "g1", home_score=110, away_score=100,
                       soft_books=config.soft_books)
    rep = harness.report(conn)
    assert rep["overall"][0].n == 1
    assert rep["overall"][0].hit_rate == 1.0
    pillars = {s.key for s in rep["by_pillar"]}
    assert "A" in pillars
