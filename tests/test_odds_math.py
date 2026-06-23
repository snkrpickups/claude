import math

import pytest

from gstack.engine import odds_math as om


def test_american_to_decimal_positive():
    assert om.american_to_decimal(100) == 2.0
    assert om.american_to_decimal(120) == pytest.approx(2.20)
    assert om.american_to_decimal(250) == pytest.approx(3.50)


def test_american_to_decimal_negative():
    assert om.american_to_decimal(-110) == pytest.approx(1.9090909, rel=1e-6)
    assert om.american_to_decimal(-200) == pytest.approx(1.50)
    assert om.american_to_decimal(-100) == 2.0


def test_american_to_decimal_invalid_range():
    with pytest.raises(ValueError):
        om.american_to_decimal(50)
    with pytest.raises(ValueError):
        om.american_to_decimal(-99)


def test_decimal_to_american_roundtrip():
    for a in (100, 120, 250, -110, -200, -150):
        d = om.american_to_decimal(a)
        assert om.decimal_to_american(d) == a


def test_decimal_to_implied():
    assert om.decimal_to_implied(2.0) == 0.5
    assert om.decimal_to_implied(4.0) == 0.25
    assert om.decimal_to_implied(2.20) == pytest.approx(0.4545454, rel=1e-6)


def test_american_to_implied():
    assert om.american_to_implied(100) == 0.5
    assert om.american_to_implied(-110) == pytest.approx(0.5238095, rel=1e-6)


def test_devig_two_way_sums_to_one():
    imp_a = om.american_to_implied(-110)
    imp_b = om.american_to_implied(-110)
    fa, fb = om.devig_two_way(imp_a, imp_b)
    assert fa == pytest.approx(0.5)
    assert fb == pytest.approx(0.5)
    assert fa + fb == pytest.approx(1.0)


def test_devig_two_way_asymmetric_sums_to_one():
    imp_a = om.american_to_implied(-150)  # favorite
    imp_b = om.american_to_implied(130)   # dog
    fa, fb = om.devig_two_way(imp_a, imp_b)
    assert fa + fb == pytest.approx(1.0)
    assert fa > fb  # favorite has higher fair prob


def test_devig_multiway_sums_to_one():
    implieds = [om.american_to_implied(x) for x in (150, 200, -120)]
    fair = om.devig_multiway(implieds)
    assert sum(fair) == pytest.approx(1.0)
    assert all(0 < p < 1 for p in fair)


def test_devig_multiway_matches_two_way():
    imp_a = om.american_to_implied(-110)
    imp_b = om.american_to_implied(-110)
    fa, fb = om.devig_two_way(imp_a, imp_b)
    m = om.devig_multiway([imp_a, imp_b])
    assert m[0] == pytest.approx(fa)
    assert m[1] == pytest.approx(fb)


def test_devig_invalid():
    with pytest.raises(ValueError):
        om.devig_two_way(0, 0)
    with pytest.raises(ValueError):
        om.decimal_to_implied(0)
