import pytest

from gstack.engine import kelly


def test_kelly_full_matches_closed_form():
    # (p*d - 1)/(d - 1)
    p, d = 0.5, 2.2
    assert kelly.kelly_full(p, d) == pytest.approx((p * d - 1) / (d - 1))
    assert kelly.kelly_full(0.5, 2.2) == pytest.approx(0.1 / 1.2)


def test_kelly_full_zero_at_fair_price():
    assert kelly.kelly_full(0.5, 2.0) == pytest.approx(0.0)


def test_kelly_stake_zero_at_non_positive_edge():
    # p=0.5 at 1.8 -> negative full Kelly -> stake 0
    r = kelly.kelly_stake(0.5, 1.8, bankroll=1000, kelly_multiplier=0.25,
                          max_stake_per_bet=100)
    assert r.stake == 0.0
    assert r.kelly_fraction == 0.0
    assert r.kelly_full < 0


def test_kelly_stake_fractional():
    r = kelly.kelly_stake(0.5, 2.2, bankroll=1000, kelly_multiplier=0.25,
                          max_stake_per_bet=1000)
    # full = 0.1/1.2 = 0.083333; quarter = 0.0208333; stake = 20.83
    assert r.kelly_full == pytest.approx(0.0833333, rel=1e-5)
    assert r.kelly_fraction == pytest.approx(0.0208333, rel=1e-5)
    assert r.stake == pytest.approx(20.8333, rel=1e-4)


def test_kelly_stake_respects_hard_cap():
    r = kelly.kelly_stake(0.5, 2.2, bankroll=100000, kelly_multiplier=0.5,
                          max_stake_per_bet=50)
    # uncapped would be huge; cap pins it at 50
    assert r.stake == 50.0


def test_kelly_full_invalid_odds():
    with pytest.raises(ValueError):
        kelly.kelly_full(0.5, 1.0)
