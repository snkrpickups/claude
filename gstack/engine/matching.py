"""Match a Kalshi market to a sharp-reference game/outcome.

This is the load-bearing, error-prone seam of the Kalshi integration: the EV
engine can only compare two prices if they describe the *same* outcome. Kalshi
and the sharp book name teams differently ("USA" vs "United States",
"Korea Republic" vs "South Korea"), so we normalize both and link by the set of
teams plus the match date.

Safety rule: if we cannot confidently identify both teams and the home/away
side, we return ``None`` and the caller skips the market. We never guess a team
and risk flagging the wrong bet.
"""

from __future__ import annotations

import unicodedata
from dataclasses import dataclass
from typing import Dict, Optional, Sequence

# Canonical alias map: normalized variant -> canonical normalized name.
# Extend freely; keys/values are compared after _normalize().
TEAM_ALIASES: Dict[str, str] = {
    "usa": "united states",
    "us": "united states",
    "united states of america": "united states",
    "south korea": "korea republic",
    "north korea": "korea dpr",
    "iran": "ir iran",
    "ivory coast": "cote d ivoire",
    "czech republic": "czechia",
    "bosnia": "bosnia and herzegovina",
    "uae": "united arab emirates",
    "cape verde": "cabo verde",
    "drc": "congo dr",
    "dr congo": "congo dr",
}

DRAW_TOKENS = {"draw", "tie", "drawn", "x"}


def _normalize(name: str) -> str:
    """Lowercase, strip accents/punctuation, collapse whitespace, de-alias."""
    if name is None:
        return ""
    # strip diacritics: "Côte d'Ivoire" -> "cote divoire"
    decomposed = unicodedata.normalize("NFKD", name)
    ascii_only = "".join(c for c in decomposed if not unicodedata.combining(c))
    cleaned = []
    for ch in ascii_only.lower():
        cleaned.append(ch if ch.isalnum() or ch.isspace() else " ")
    norm = " ".join("".join(cleaned).split())
    return TEAM_ALIASES.get(norm, norm)


def is_draw(label: str) -> bool:
    return _normalize(label) in DRAW_TOKENS


@dataclass
class MatchLink:
    game_id: str
    outcome: str        # the exact stored outcome string (sharp side) to align to
    home_team: str
    away_team: str


def link_team_to_game(
    games: Sequence,
    *,
    team_a: str,
    team_b: str,
    commence_time: Optional[int] = None,
    date_tolerance_s: int = 36 * 3600,
) -> Optional[tuple]:
    """Find the stored game whose two teams match {team_a, team_b}.

    ``games`` are rows/objects exposing game_id, home_team, away_team,
    commence_time. Returns ``(game_row, home_is_a: bool)`` or ``None``.
    """
    na, nb = _normalize(team_a), _normalize(team_b)
    if not na or not nb or na == nb:
        return None
    target = {na, nb}
    for g in games:
        home = _normalize(_get(g, "home_team"))
        away = _normalize(_get(g, "away_team"))
        if {home, away} != target:
            continue
        if commence_time is not None:
            gct = _get(g, "commence_time")
            if gct and abs(int(gct) - int(commence_time)) > date_tolerance_s:
                continue
        return g, (home == na)
    return None


def link_kalshi_market(
    games: Sequence,
    *,
    team_a: str,
    team_b: str,
    yes_team: str,
    commence_time: Optional[int] = None,
) -> Optional[MatchLink]:
    """Resolve a single Kalshi YES market to a (game, outcome) link.

    ``yes_team`` is what the YES contract pays on: one of the two teams, or a
    draw label. The returned ``outcome`` is the exact sharp-side string
    (the stored home_team / away_team, or 'Draw') so Pillar A can align them.
    """
    linked = link_team_to_game(
        games, team_a=team_a, team_b=team_b, commence_time=commence_time
    )
    if linked is None:
        return None
    game, _home_is_a = linked
    home_team = _get(game, "home_team")
    away_team = _get(game, "away_team")

    if is_draw(yes_team):
        outcome = "Draw"
    else:
        ny = _normalize(yes_team)
        if ny == _normalize(home_team):
            outcome = home_team
        elif ny == _normalize(away_team):
            outcome = away_team
        else:
            return None  # YES team isn't one of the two sides -> refuse
    return MatchLink(
        game_id=_get(game, "game_id"),
        outcome=outcome,
        home_team=home_team,
        away_team=away_team,
    )


def _get(row, key):
    try:
        return row[key]
    except (TypeError, KeyError, IndexError):
        return getattr(row, key)
