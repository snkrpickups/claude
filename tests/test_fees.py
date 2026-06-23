import pytest

from gstack.engine import odds_math
from gstack.engine.fees import KalshiFeeModel


def test_kalshi_price_to_decimal():
    assert odds_math.kalshi_price_to_decimal(50) == pytest.approx(2.0)
    assert odds_math.kalshi_price_to_decimal(45) == pytest.approx(1 / 0.45)
    assert odds_math.kalshi_price_to_decimal(80) == pytest.approx(1.25)
    with pytest.raises(ValueError):
        odds_math.kalshi_price_to_decimal(0)
    with pytest.raises(ValueError):
        odds_math.kalshi_price_to_decimal(100)


def test_fee_per_contract_taker():
    m = KalshiFeeModel(coeff=0.07)
    # 0.07 * 0.45 * 0.55 = 0.0173250
    assert m.fee_per_contract(0.45) == pytest.approx(0.017325)
    # fee is symmetric and peaks at 0.5
    assert m.fee_per_contract(0.5) == pytest.approx(0.0175)
    assert m.fee_per_contract(0.1) == pytest.approx(m.fee_per_contract(0.9))


def test_fee_zero_for_maker():
    m = KalshiFeeModel(coeff=0.07, maker=True)
    assert m.fee_per_contract(0.45) == 0.0
    # maker effective decimal == gross (no fee drag)
    gross = odds_math.kalshi_price_to_decimal(45)
    assert m.effective_decimal(gross) == pytest.approx(gross)


def test_effective_decimal_taker_lowers_odds():
    m = KalshiFeeModel(coeff=0.07)
    gross = odds_math.kalshi_price_to_decimal(45)   # 2.2222
    eff = m.effective_decimal(gross)
    # cost = 0.45 + 0.017325 = 0.467325 -> 1/0.467325
    assert eff == pytest.approx(1 / 0.467325, rel=1e-6)
    assert eff < gross


def test_adjust_returns_decimal_and_fee():
    m = KalshiFeeModel(coeff=0.07)
    gross = odds_math.kalshi_price_to_decimal(45)
    eff, fee = m.adjust(gross)
    assert fee == pytest.approx(0.017325)
    assert eff == pytest.approx(1 / 0.467325, rel=1e-6)
