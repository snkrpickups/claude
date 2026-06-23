"""Expected-value gate (Section 4.4). Pure functions."""

from __future__ import annotations

# Conservative default so noise in `p` does not generate junk recommendations.
DEFAULT_EV_THRESHOLD = 0.03


def ev_per_unit(p: float, d: float) -> float:
    """Expected value per unit staked: ``p * d - 1``.

    `p` is fair win probability, `d` is the soft-book decimal price. This is the
    same quantity reported as ``edge`` (a fraction; *100 for a percentage).
    """
    return p * d - 1


def is_value(p: float, d: float, threshold: float = DEFAULT_EV_THRESHOLD) -> bool:
    """True when the bet clears the EV threshold (strictly greater)."""
    return ev_per_unit(p, d) > threshold
