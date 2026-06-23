"""Odds math (Section 4.1-4.3). Pure functions, no side effects.

These are the deterministic core of GSTACK: American<->decimal conversion,
implied probability, and devigging. Everything downstream (EV gate, Kelly,
Pillar A) depends on these being exactly correct.
"""

from __future__ import annotations

from typing import List, Sequence


def american_to_decimal(american: int | float) -> float:
    """Convert American odds to decimal odds (Section 4.1).

    >>> american_to_decimal(100)
    2.0
    >>> american_to_decimal(-110)
    1.909090909090909
    """
    if american >= 100:
        return 1 + american / 100
    if american <= -100:
        return 1 + 100 / abs(american)
    raise ValueError(
        f"Invalid American odds: {american!r}. Magnitude must be >= 100."
    )


def decimal_to_american(decimal: float) -> int:
    """Convert decimal odds back to American odds (inverse of 4.1).

    Rounds to the nearest integer, matching how books quote American prices.
    """
    if decimal <= 1.0:
        raise ValueError(f"Decimal odds must be > 1.0, got {decimal!r}.")
    if decimal >= 2.0:
        return round((decimal - 1) * 100)
    return round(-100 / (decimal - 1))


def decimal_to_implied(decimal: float) -> float:
    """Convert decimal odds to implied probability (Section 4.2)."""
    if decimal <= 0:
        raise ValueError(f"Decimal odds must be positive, got {decimal!r}.")
    return 1 / decimal


def kalshi_price_to_decimal(cents: float) -> float:
    """Convert a Kalshi contract price (1-99 cents) to GROSS decimal odds.

    A YES contract costs ``cents/100`` dollars and settles at $1.00, so the
    gross decimal odds are ``1 / price``. Fees are applied separately
    (see engine/fees.py) — this is the no-fee price the market quotes, i.e. the
    venue's own implied probability is exactly ``cents/100``.

    >>> kalshi_price_to_decimal(48)
    2.0833333333333335
    """
    if not 0 < cents < 100:
        raise ValueError(f"Kalshi price must be in (0, 100) cents, got {cents!r}.")
    price = cents / 100
    return 1 / price



def american_to_implied(american: int | float) -> float:
    """Convenience: American odds straight to implied probability."""
    return decimal_to_implied(american_to_decimal(american))


def devig_two_way(imp_a: float, imp_b: float) -> tuple[float, float]:
    """Remove vig from a two-way market by normalization (Section 4.3).

    Returns (fair_a, fair_b) which sum to 1.0.
    """
    total = imp_a + imp_b
    if total <= 0:
        raise ValueError("Sum of implied probabilities must be positive.")
    return imp_a / total, imp_b / total


def devig_multiway(implieds: Sequence[float]) -> List[float]:
    """Remove vig from an N-way market by normalization (Section 4.3).

    Each fair probability is ``imp_i / sum(imp)``; the result sums to 1.0.
    Works for the two-way case as well.
    """
    total = sum(implieds)
    if total <= 0:
        raise ValueError("Sum of implied probabilities must be positive.")
    return [imp / total for imp in implieds]


# --- Upgrade path (Section 4.3) -------------------------------------------------
# TODO(devig-power-method): swap normalization for the power method, which finds
# exponent k such that sum(imp_i ** k) == 1, then fair_i = imp_i ** k. The
# logarithmic method is an alternative. Both handle favorite-longshot bias
# better than normalization. `devig_multiway` is the single seam to replace;
# keep its signature stable so callers (pillar_a) need no changes.
