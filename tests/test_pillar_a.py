import pytest

from gstack.clients.odds_client import OddsClient, parse_odds_payload
from gstack.budget import BudgetGuard
from gstack.config import Config
from gstack.engine import pillar_a
from gstack.store import repo


def _snaps(nba_payload):
    _, snaps = parse_odds_payload(
        nba_payload, sport="NBA", sharp_book="pinnacle", fetched_at=1000
    )
    return snaps


def test_pillar_a_flags_hand_checked_candidate(nba_payload):
    snaps = _snaps(nba_payload)
    cands = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle",
        soft_books=["draftkings", "fanduel", "betmgm", "espnbet"],
        ev_threshold=0.03,
    )
    # Exactly one +EV flag: Lakers @ DraftKings +120.
    assert len(cands) == 1
    c = cands[0]
    assert c.book == "draftkings"
    assert c.outcome == "Los Angeles Lakers"
    assert c.market == "h2h"
    assert c.fair_prob == pytest.approx(0.5)         # devig of -110/-110
    assert c.decimal == pytest.approx(2.20)
    assert c.edge == pytest.approx(0.10)             # 0.5*2.2 - 1
    assert c.fair_source == "pinnacle"


def test_pillar_a_excludes_negative_ev_side(nba_payload):
    snaps = _snaps(nba_payload)
    cands = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["draftkings"], ev_threshold=0.03
    )
    # The Nuggets side at -130 is negative EV; never flagged.
    assert all(c.outcome != "Denver Nuggets" for c in cands)


def test_pillar_a_never_bets_sharp_book(nba_payload):
    snaps = _snaps(nba_payload)
    cands = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["pinnacle", "draftkings"],
        ev_threshold=0.03,
    )
    assert all(c.book != "pinnacle" for c in cands)


def test_pillar_a_consensus_fallback_when_no_sharp(nba_payload):
    # Drop Pinnacle: only DraftKings remains -> consensus fallback can't make a
    # market from a single book/outcome set, so no candidates (needs >=2 books).
    snaps = [s for s in _snaps(nba_payload) if s.book != "pinnacle"]
    cands = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["draftkings"], ev_threshold=0.03
    )
    # consensus over draftkings' own two sides devigs to fair; betting DK against
    # its own devig yields no edge -> no candidates.
    assert cands == []


def test_pillar_a_threshold_filters(nba_payload):
    snaps = _snaps(nba_payload)
    # raise threshold above the 10% edge -> nothing clears
    cands = pillar_a.find_candidates(
        snaps, sharp_book="pinnacle", soft_books=["draftkings"], ev_threshold=0.20
    )
    assert cands == []
