"""Kalshi trading-fee model (used by the EV gate when the venue is Kalshi).

Why this exists: on a sportsbook the vig is already baked into the price, but on
Kalshi you pay a separate trading fee on top of the contract price, and you
cross a bid/ask spread. If GSTACK compared a sharp fair probability against the
*raw* Kalshi price it would flag phantom edges that the fee erases. So every
Kalshi candidate is evaluated on a fee-adjusted ("effective") decimal price.

Model (per contract, in dollars):
  price P      = contract price, 0 < P < 1   (== the venue's implied prob)
  fee f        = coeff * P * (1 - P)          (Kalshi's general schedule, ~0.07)
  total outlay = P + f                         (what you put up to win $1.00)
  effective decimal = 1 / (P + f)

Maker (resting limit) orders are fee-free on many Kalshi markets; set
``maker=True`` to model posting at the bid instead of taking the ask.

The coefficient is configurable because Kalshi's schedule varies by market and
changes over time — do not hardcode a number you can't verify. Default 0.07
matches Kalshi's published general formula ``fees = ceil(0.07 * C * P * (1-P))``;
we use the un-rounded per-contract rate for marginal EV.
"""

from __future__ import annotations

from dataclasses import dataclass

DEFAULT_FEE_COEFF = 0.07


@dataclass(frozen=True)
class KalshiFeeModel:
    coeff: float = DEFAULT_FEE_COEFF
    maker: bool = False  # True = post at bid (fee-free on most markets)

    def fee_per_contract(self, price_dollars: float) -> float:
        """Un-rounded trading fee for one contract at ``price_dollars``."""
        if not 0 < price_dollars < 1:
            raise ValueError(f"price must be in (0,1), got {price_dollars!r}")
        if self.maker:
            return 0.0
        return self.coeff * price_dollars * (1 - price_dollars)

    def effective_decimal(self, gross_decimal: float) -> float:
        """Fee-adjusted decimal odds for a YES buy at ``gross_decimal``.

        ``gross_decimal == 1 / price``; effective ``= 1 / (price + fee)``.
        Returns odds <= gross because the fee raises your cost basis.
        """
        if gross_decimal <= 1.0:
            raise ValueError(f"gross_decimal must be > 1.0, got {gross_decimal!r}")
        price = 1 / gross_decimal
        return 1.0 / (price + self.fee_per_contract(price))

    def adjust(self, gross_decimal: float) -> tuple[float, float]:
        """Return ``(effective_decimal, fee_per_contract)`` for a gross price."""
        price = 1 / gross_decimal
        return self.effective_decimal(gross_decimal), self.fee_per_contract(price)
