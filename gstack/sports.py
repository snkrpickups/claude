"""Sport profiles — the per-sport knobs that used to be NBA-only constants.

Adding the World Cup is mostly data: a different Odds API sport key, a 3-way
moneyline (Home/Draw/Away instead of two-way), and Kalshi as the execution venue
instead of US sportsbooks. Pillar A's devig already handles N-way markets, so a
profile is all that's needed.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass(frozen=True)
class SportProfile:
    name: str                 # GSTACK sport label, e.g. 'SOCCER_WC'
    odds_api_sport_key: str   # The Odds API sport key for the sharp reference
    markets: List[str]        # markets to scan
    three_way: bool           # True for soccer h2h (Home/Draw/Away)
    draw_outcome: str = "Draw"
    # Where we actually take the price. For the World Cup this is Kalshi.
    soft_books: List[str] = field(default_factory=list)


NBA = SportProfile(
    name="NBA",
    odds_api_sport_key="basketball_nba",
    markets=["h2h", "spreads", "totals"],
    three_way=False,
    soft_books=["draftkings", "fanduel", "betmgm", "espnbet"],
)

# The Odds API exposes the men's World Cup under this key during the tournament.
SOCCER_WC = SportProfile(
    name="SOCCER_WC",
    odds_api_sport_key="soccer_fifa_world_cup",
    # Match-by-match: 3-way result first; totals (goals) slot in via the same
    # generic devig once a Kalshi<->sharp line mapping exists for them.
    markets=["h2h"],
    three_way=True,
    soft_books=["kalshi"],
)

PROFILES: Dict[str, SportProfile] = {p.name: p for p in (NBA, SOCCER_WC)}


def get_profile(name: str) -> SportProfile:
    try:
        return PROFILES[name]
    except KeyError:
        raise ValueError(
            f"Unknown sport {name!r}. Known: {', '.join(sorted(PROFILES))}."
        )
