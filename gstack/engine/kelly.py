"""Fractional Kelly staking (Section 4.5). Pure functions.

Full Kelly MUST never be used directly. ``MAX_STAKE_PER_BET`` is a hard cap
regardless of what Kelly returns.
"""

from __future__ import annotations

from dataclasses import dataclass


def kelly_full(p: float, d: float) -> float:
    """Full-Kelly fraction of bankroll for a bet at decimal odds `d`.

    Let ``b = d - 1`` (net odds), ``q = 1 - p``.
    ``kelly_full = (b * p - q) / b == (p * d - 1) / (d - 1)``.
    """
    b = d - 1
    if b <= 0:
        raise ValueError(f"Decimal odds must be > 1.0, got {d!r}.")
    q = 1 - p
    return (b * p - q) / b


@dataclass
class StakeResult:
    kelly_full: float
    kelly_fraction: float  # the fraction of bankroll after applying the multiplier
    stake: float           # currency amount after multiplier, bankroll, and cap


def kelly_stake(
    p: float,
    d: float,
    bankroll: float,
    kelly_multiplier: float,
    max_stake_per_bet: float,
) -> StakeResult:
    """Size a fractional-Kelly stake.

    ``kelly_fraction = kelly_multiplier * kelly_full``
    ``stake = min(kelly_fraction * bankroll, max_stake_per_bet)``

    If ``kelly_full <= 0`` the stake is 0 (guard; should not happen past the EV
    gate). The cap is applied unconditionally.
    """
    kf = kelly_full(p, d)
    if kf <= 0:
        return StakeResult(kelly_full=kf, kelly_fraction=0.0, stake=0.0)
    fraction = kelly_multiplier * kf
    stake = min(fraction * bankroll, max_stake_per_bet)
    # Never return a negative stake even if the cap were set oddly.
    stake = max(stake, 0.0)
    return StakeResult(kelly_full=kf, kelly_fraction=fraction, stake=stake)
