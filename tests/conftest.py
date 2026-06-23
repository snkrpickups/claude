import pytest

from gstack.store import db


@pytest.fixture
def conn():
    """Fresh in-memory DB with schema applied."""
    return db.connect(":memory:")


@pytest.fixture
def nba_payload():
    """Hand-checkable Odds API payload.

    Pinnacle posts both sides at -110 -> devig to exactly 0.5 each.
    DraftKings posts the home side at +120 (decimal 2.20). EV for home:
        0.5 * 2.20 - 1 = +0.10  -> a clean +10% edge (the only candidate).
    DraftKings away at -130 is negative EV and must NOT be flagged.
    """
    return [
        {
            "id": "g1",
            "sport_key": "basketball_nba",
            "commence_time": "2026-06-23T02:10:00Z",
            "home_team": "Los Angeles Lakers",
            "away_team": "Denver Nuggets",
            "bookmakers": [
                {
                    "key": "pinnacle",
                    "title": "Pinnacle",
                    "markets": [
                        {
                            "key": "h2h",
                            "outcomes": [
                                {"name": "Los Angeles Lakers", "price": -110},
                                {"name": "Denver Nuggets", "price": -110},
                            ],
                        }
                    ],
                },
                {
                    "key": "draftkings",
                    "title": "DraftKings",
                    "markets": [
                        {
                            "key": "h2h",
                            "outcomes": [
                                {"name": "Los Angeles Lakers", "price": 120},
                                {"name": "Denver Nuggets", "price": -130},
                            ],
                        }
                    ],
                },
            ],
        }
    ]
