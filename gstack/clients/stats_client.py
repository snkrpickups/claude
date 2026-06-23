"""Stats client (Phase 2): ESPN JSON endpoints / nba_api wrapper.

Free, unmetered sources — these do NOT pass through the request budget (which
guards only the paid Odds API). Stubbed in Phase 1; the seam exists so the
power model (Pillar B) can bolt on without rework.
"""

from __future__ import annotations

from typing import List


class StatsClient:
    """Placeholder for Phase 2. Free endpoints, no budget guard needed."""

    def recent_games(self, team: str) -> List[dict]:  # pragma: no cover - Phase 2
        raise NotImplementedError("StatsClient is implemented in Phase 2.")
