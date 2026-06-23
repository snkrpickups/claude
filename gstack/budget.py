"""Request-budget guard (Section 6.2) — the top constraint of the free phase.

Every metered API call MUST pass through ``BudgetGuard.spend``. The counter is
persistent (keyed to the calendar month) and survives restarts because it lives
in the DB. On refusal we never crash: the caller serves the most recent cached
snapshot and we log a budget-exhaustion warning.
"""

from __future__ import annotations

import logging
import sqlite3
from datetime import datetime, timezone

from .store import repo

logger = logging.getLogger("gstack.budget")


class BudgetExceeded(Exception):
    """Raised by ``spend`` when a call would exceed the monthly budget."""


def current_month(now: datetime | None = None) -> str:
    now = now or datetime.now(timezone.utc)
    return now.strftime("%Y-%m")


class BudgetGuard:
    def __init__(self, conn: sqlite3.Connection, request_budget: int):
        self.conn = conn
        self.request_budget = request_budget

    # -- read-only accounting -------------------------------------------------
    def used(self, month: str | None = None) -> int:
        return repo.get_budget_used(self.conn, month or current_month())

    def remaining(self, month: str | None = None) -> int:
        return max(self.request_budget - self.used(month), 0)

    def would_exceed(self, n: int = 1, month: str | None = None) -> bool:
        return self.used(month) + n > self.request_budget

    # -- the guard ------------------------------------------------------------
    def spend(self, n: int = 1, month: str | None = None) -> int:
        """Reserve ``n`` metered requests, or refuse.

        Returns the new monthly total on success. Raises ``BudgetExceeded`` (and
        logs a warning) when the spend would breach ``request_budget``; the
        counter is NOT incremented in that case.
        """
        month = month or current_month()
        if self.would_exceed(n, month):
            used = self.used(month)
            logger.warning(
                "Budget exhausted: %d used + %d requested > %d budget (%s). "
                "Serving cache.",
                used, n, self.request_budget, month,
            )
            raise BudgetExceeded(
                f"Request budget for {month} exhausted "
                f"({used}/{self.request_budget}); refused {n} request(s)."
            )
        new_total = repo.add_budget_used(self.conn, month, n)
        self.conn.commit()
        return new_total

    # -- reporting (gstack budget) -------------------------------------------
    def report(self, slates_remaining: int = 0, pulls_per_slate: int = 4,
               month: str | None = None) -> dict:
        """Numbers for the ``gstack budget`` command.

        ``projected_month_end`` adds the expected remaining spend at the current
        cadence (slates_remaining * pulls_per_slate) to what's already used.
        """
        month = month or current_month()
        used = self.used(month)
        projected = used + slates_remaining * pulls_per_slate
        return {
            "month": month,
            "used": used,
            "budget": self.request_budget,
            "remaining": max(self.request_budget - used, 0),
            "projected_month_end": projected,
            "projection_basis": {
                "slates_remaining": slates_remaining,
                "pulls_per_slate": pulls_per_slate,
            },
        }
