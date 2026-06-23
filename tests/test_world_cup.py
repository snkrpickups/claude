"""End-to-end World Cup flow: sharp 3-way devig vs Kalshi, fees in the gate."""

import pytest

from gstack.budget import BudgetGuard
from gstack.clients.kalshi_client import KalshiClient, KalshiLeg, KalshiMatch
from gstack.clients.odds_client import OddsClient
from gstack.config import Config
from gstack.engine import pillar_a
from gstack.engine.fees import KalshiFeeModel
from gstack.recommend import size_and_persist
from gstack.store import db, repo


FETCHED_AT = 1_750_000_000


@pytest.fixture
def conn():
    return db.connect(":memory:")


@pytest.fixture
def wc_config():
    c = Config()
    c.sport = "SOCCER_WC"
    c.sharp_book = "pinnacle"
    c.soft_books = ["kalshi"]
    c.markets = ["h2h"]
    c.bankroll = 1000.0
    c.max_stake_per_bet = 100.0
    return c


def _sharp_payload():
    # Pinnacle 3-way. Devig: Brazil ~0.5021, Draw ~0.2557, France ~0.2422.
    return [{
        "id": "wc1",
        "commence_time": "2026-06-26T18:00:00Z",
        "home_team": "Brazil", "away_team": "France",
        "bookmakers": [{"key": "pinnacle", "markets": [{"key": "h2h", "outcomes": [
            {"name": "Brazil", "price": -120},
            {"name": "Draw", "price": 260},
            {"name": "France", "price": 280},
        ]}]}],
    }]


def _kalshi_match(brazil_ask):
    return KalshiMatch(
        team_a="Brazil", team_b="France", commence_time=1782496800,
        legs=[
            KalshiLeg(yes_team="Brazil", yes_ask=brazil_ask),
            KalshiLeg(yes_team="Draw", yes_ask=30),    # -EV
            KalshiLeg(yes_team="France", yes_ask=30),  # -EV
        ],
    )


def _setup(conn, wc_config, brazil_ask):
    OddsClient(conn, wc_config, BudgetGuard(conn, 450)).ingest_fixture(
        _sharp_payload(), fetched_at=FETCHED_AT
    )
    KalshiClient(conn).cache_markets([_kalshi_match(brazil_ask)], fetched_at=FETCHED_AT)
    return repo.snapshots_at(conn, FETCHED_AT)


def _fee_adjuster(coeff=0.07):
    model = KalshiFeeModel(coeff=coeff)
    return lambda book, d: model.adjust(d) if book == "kalshi" else (d, 0.0)


def test_brazil_yes_is_flagged_net_of_fees(conn, wc_config):
    snaps = _setup(conn, wc_config, brazil_ask=45)
    cands = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["kalshi"],
        ev_threshold=0.03, fee_adjuster=_fee_adjuster(),
    )
    assert len(cands) == 1
    c = cands[0]
    assert c.book == "kalshi"
    assert c.outcome == "Brazil"
    assert c.fair_prob == pytest.approx(0.5021, abs=1e-3)
    assert c.decimal == pytest.approx(1 / 0.45)        # raw price on the ticket
    assert c.fee_per_unit == pytest.approx(0.017325)
    # net edge ~ +7.4%, clearly above the +11.6% raw because fees were applied
    assert c.edge == pytest.approx(0.0744, abs=2e-3)
    assert c.stake_decimal < c.decimal


def test_fees_kill_a_phantom_edge(conn, wc_config):
    # At 48c the RAW edge is ~+4.6% (would flag) but net of fees ~+0.9% (must not).
    snaps = _setup(conn, wc_config, brazil_ask=48)

    raw = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["kalshi"], ev_threshold=0.03,
    )
    assert any(c.outcome == "Brazil" for c in raw)  # phantom edge without fees

    net = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["kalshi"], ev_threshold=0.03,
        fee_adjuster=_fee_adjuster(),
    )
    assert net == []  # fee correctly erases it


def test_full_pipeline_sizes_on_net_odds(conn, wc_config):
    snaps = _setup(conn, wc_config, brazil_ask=45)
    cands = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["kalshi"],
        ev_threshold=0.03, fee_adjuster=_fee_adjuster(),
    )
    tickets = size_and_persist(conn, wc_config, cands, pillar="A")
    assert len(tickets) == 1
    rec = tickets[0].rec
    # ticket shows the raw Kalshi price...
    assert rec.decimal == pytest.approx(1 / 0.45)
    # ...but Kelly sized on the net odds, so stake is smaller than a raw sizing.
    from gstack.engine.kelly import kelly_stake
    raw_stake = kelly_stake(rec.fair_prob, rec.decimal, 1000.0, 0.25, 100.0).stake
    assert 0 < rec.stake < raw_stake
