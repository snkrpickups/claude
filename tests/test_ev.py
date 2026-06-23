import pytest

from gstack.engine import ev


def test_ev_per_unit():
    # p=0.5 at decimal 2.2 -> 0.5*2.2 - 1 = 0.10
    assert ev.ev_per_unit(0.5, 2.2) == pytest.approx(0.10)
    # fair price (no edge): p=0.5 at 2.0 -> 0
    assert ev.ev_per_unit(0.5, 2.0) == pytest.approx(0.0)
    # negative EV
    assert ev.ev_per_unit(0.5, 1.8) == pytest.approx(-0.10)


def test_is_value_boundary():
    # exactly at threshold is NOT value (strictly greater). Use the computed
    # edge itself as the threshold to avoid float-literal mismatch.
    edge = ev.ev_per_unit(0.5, 2.2)
    assert ev.is_value(0.5, 2.2, threshold=edge) is False        # equal -> not value
    assert ev.is_value(0.5, 2.2, threshold=edge - 1e-9) is True  # just under -> value
    assert ev.is_value(0.5, 2.0, threshold=0.0) is False         # zero edge at 0 thresh
    assert ev.is_value(0.5, 1.8, threshold=0.0) is False         # negative edge


def test_is_value_default_threshold():
    # default 0.03: need edge > 3%
    assert ev.is_value(0.52, 2.0) is True   # 0.04 edge
    assert ev.is_value(0.51, 2.0) is False  # 0.02 edge
