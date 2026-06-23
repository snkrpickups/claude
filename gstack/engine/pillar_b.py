"""Pillar B — model-based +EV (Phase 2).

The power model (model/power_ratings.py) produces GSTACK's own probability `p`
for each game; this module feeds that `p` through the SAME EV gate and Kelly
sizing as Pillar A, tagged ``pillar='B'``. Stubbed in Phase 1.
"""

from __future__ import annotations


def find_candidates(*args, **kwargs):  # pragma: no cover - Phase 2
    raise NotImplementedError("Pillar B is implemented in Phase 2.")
