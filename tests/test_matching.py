import pytest

from gstack.engine import matching


class G(dict):
    """Tiny game-row stand-in supporting mapping access."""


def _game(game_id, home, away, ct=1000):
    return G(game_id=game_id, home_team=home, away_team=away, commence_time=ct)


def test_normalize_accents_and_punctuation():
    assert matching._normalize("Côte d'Ivoire") == "cote d ivoire"
    assert matching._normalize("  Brazil  ") == "brazil"


def test_normalize_aliases():
    assert matching._normalize("USA") == "united states"
    assert matching._normalize("South Korea") == "korea republic"


def test_is_draw():
    assert matching.is_draw("Draw")
    assert matching.is_draw("tie")
    assert not matching.is_draw("Brazil")


def test_link_team_to_game_orientation():
    games = [_game("g1", "Brazil", "France")]
    res = matching.link_team_to_game(games, team_a="France", team_b="Brazil")
    assert res is not None
    game, home_is_a = res
    assert game["game_id"] == "g1"
    assert home_is_a is False  # team_a (France) is the away side


def test_link_kalshi_market_resolves_outcome():
    games = [_game("g1", "Brazil", "France")]
    link = matching.link_kalshi_market(
        games, team_a="Brazil", team_b="France", yes_team="France"
    )
    assert link.game_id == "g1"
    assert link.outcome == "France"  # exact stored away-team string

    draw = matching.link_kalshi_market(
        games, team_a="Brazil", team_b="France", yes_team="Draw"
    )
    assert draw.outcome == "Draw"


def test_link_uses_alias():
    games = [_game("g1", "United States", "Mexico")]
    link = matching.link_kalshi_market(
        games, team_a="USA", team_b="Mexico", yes_team="USA"
    )
    assert link is not None
    assert link.outcome == "United States"


def test_link_refuses_unknown_team():
    games = [_game("g1", "Brazil", "France")]
    assert matching.link_kalshi_market(
        games, team_a="Brazil", team_b="Spain", yes_team="Brazil"
    ) is None  # Spain not in any stored game


def test_link_respects_date_tolerance():
    games = [_game("g1", "Brazil", "France", ct=1_000_000)]
    # commence far from stored time -> no match
    assert matching.link_team_to_game(
        games, team_a="Brazil", team_b="France",
        commence_time=1_000_000 + 10 * 24 * 3600,
    ) is None
