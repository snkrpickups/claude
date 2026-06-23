"""GSTACK CLI entrypoint (Section 10).

Commands: poll, recs, budget, clv, backfill-closing, grade, mark-bet.
Run with: ``python -m gstack.main <command> [...]`` or ``gstack <command>`` if
installed.
"""

from __future__ import annotations

import argparse
import logging
import sys
from datetime import datetime, timezone

from .budget import BudgetGuard
from .clients.odds_client import OddsClient
from .clv import harness
from .config import load_config
from .store import db, repo
from .alert.cli import format_ticket
from .alert.telegram import TelegramAlerter
from .recommend import Recommendation
from . import scheduler


def _conn(config):
    return db.connect(config.db_path())


def _row_to_rec(row) -> Recommendation:
    return Recommendation(
        game_id=row["game_id"],
        pillar=row["pillar"],
        market=row["market"],
        outcome=row["outcome"],
        line=row["line"],
        book=row["book"],
        american=row["american"],
        decimal=row["decimal"],
        fair_prob=row["fair_prob"],
        market_implied=row["market_implied"],
        edge=row["edge"],
        kelly_fraction=row["kelly_fraction"],
        stake=row["stake"],
        rationale=row["rationale"],
        created_at=row["created_at"],
        id=row["id"],
    )


# --------------------------------------------------------------------------- #
# commands
# --------------------------------------------------------------------------- #
def cmd_poll(args) -> int:
    config = load_config()
    conn = _conn(config)
    budget = BudgetGuard(conn, config.request_budget)
    client = OddsClient(conn, config, budget)
    report = scheduler.run_once(conn, config, client)

    src = "cache" if report.poll.from_cache else "live"
    print(
        f"poll: {report.poll.snapshots_written} snapshots ({src}), "
        f"{report.poll.requests_spent} request(s) spent, "
        f"{report.candidates} candidate(s), {len(report.tickets)} ticket(s)"
    )
    if report.tickets:
        alerter = TelegramAlerter(config)
        for t in report.tickets:
            game = repo.get_game(conn, t.rec.game_id)
            print()
            print(format_ticket(t.rec, game=game, kelly_multiplier=config.kelly_multiplier))
            alerter.send_recommendation(t.rec, game=game)
    return 0


def cmd_poll_wc(args) -> int:
    from .clients.kalshi_client import KalshiClient

    config = load_config()
    config.sport = "SOCCER_WC"
    conn = _conn(config)
    budget = BudgetGuard(conn, config.request_budget)
    odds_client = OddsClient(conn, config, budget)
    kalshi_client = KalshiClient(conn, maker=config.kalshi_maker)
    report = scheduler.run_world_cup_once(conn, config, odds_client, kalshi_client)

    src = "cache" if report.poll.from_cache else "live"
    print(
        f"poll-wc: {report.poll.snapshots_written} sharp snapshots ({src}), "
        f"{report.poll.requests_spent} request(s) spent, "
        f"{report.candidates} candidate(s), {len(report.tickets)} ticket(s)"
    )
    if report.tickets:
        alerter = TelegramAlerter(config)
        for t in report.tickets:
            game = repo.get_game(conn, t.rec.game_id)
            print()
            print(format_ticket(t.rec, game=game, kelly_multiplier=config.kelly_multiplier))
            alerter.send_recommendation(t.rec, game=game)
    return 0


def cmd_recs(args) -> int:
    config = load_config()
    conn = _conn(config)
    rows = repo.list_recommendations(conn)
    if not rows:
        print("No recommendations yet. Run `gstack poll`.")
        return 0
    for row in rows:
        game = repo.get_game(conn, row["game_id"])
        print()
        print(f"#{row['id']}  " + format_ticket(
            _row_to_rec(row), game=game, kelly_multiplier=config.kelly_multiplier
        ))
    print()
    return 0


def cmd_budget(args) -> int:
    config = load_config()
    conn = _conn(config)
    budget = BudgetGuard(conn, config.request_budget)
    rep = budget.report(
        slates_remaining=args.slates_remaining,
        pulls_per_slate=args.pulls_per_slate,
    )
    print(f"GSTACK budget — {rep['month']}")
    print(f"  used:      {rep['used']}")
    print(f"  remaining: {rep['remaining']}")
    print(f"  budget:    {rep['budget']}")
    print(
        f"  projected month-end: {rep['projected_month_end']} "
        f"(+{args.slates_remaining} slates × {args.pulls_per_slate} pulls)"
    )
    if rep["projected_month_end"] > rep["budget"]:
        print("  WARNING: projected to exceed budget at this cadence.")
    return 0


def cmd_clv(args) -> int:
    config = load_config()
    conn = _conn(config)
    rep = harness.report(conn, only_bet_taken=args.bet_taken)

    def show(title, segs):
        print(title)
        for s in segs:
            mc = f"{s.mean_clv:+.2f}%" if s.mean_clv is not None else "n/a"
            hr = f"{s.hit_rate * 100:.1f}%" if s.hit_rate is not None else "n/a"
            print(f"  {s.key:<14} n={s.n:<4} mean CLV={mc:<8} hit={hr}")

    scope = "bet_taken only" if args.bet_taken else "all recommendations"
    print(f"GSTACK CLV report ({scope})\n")
    show("Overall", rep["overall"])
    show("By pillar", rep["by_pillar"])
    show("By market", rep["by_market"])
    return 0


def cmd_backfill_closing(args) -> int:
    config = load_config()
    conn = _conn(config)
    updated = harness.capture_all_open(conn, soft_books=config.soft_books)
    print(f"Updated closing lines for {updated} open recommendation(s).")
    return 0


def cmd_grade(args) -> int:
    config = load_config()
    conn = _conn(config)
    graded = harness.grade_game(
        conn,
        args.game_id,
        home_score=args.home_score,
        away_score=args.away_score,
        soft_books=config.soft_books,
    )
    print(f"Graded {graded} recommendation(s) for game {args.game_id}.")
    return 0


def cmd_mark_bet(args) -> int:
    config = load_config()
    conn = _conn(config)
    repo.mark_bet_taken(conn, args.rec_id, taken=not args.unset)
    conn.commit()
    state = "not bet" if args.unset else "bet"
    print(f"Recommendation #{args.rec_id} marked as {state}.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="gstack", description="GSTACK CLI")
    sub = p.add_subparsers(dest="command", required=True)

    sub.add_parser("poll", help="run one budgeted fetch + analysis").set_defaults(
        func=cmd_poll
    )
    sub.add_parser(
        "poll-wc", help="World Cup: sharp poll + Kalshi pull + analysis"
    ).set_defaults(func=cmd_poll_wc)
    sub.add_parser("recs", help="print recommendations as tickets").set_defaults(
        func=cmd_recs
    )

    b = sub.add_parser("budget", help="show request budget usage")
    b.add_argument("--slates-remaining", type=int, default=0)
    b.add_argument("--pulls-per-slate", type=int, default=4)
    b.set_defaults(func=cmd_budget)

    c = sub.add_parser("clv", help="report mean CLV and hit rate")
    c.add_argument("--bet-taken", action="store_true", help="only bets owner took")
    c.set_defaults(func=cmd_clv)

    sub.add_parser(
        "backfill-closing", help="update closing lines for open recs"
    ).set_defaults(func=cmd_backfill_closing)

    g = sub.add_parser("grade", help="grade a finished game by final score")
    g.add_argument("game_id")
    g.add_argument("--home-score", type=int, required=True)
    g.add_argument("--away-score", type=int, required=True)
    g.set_defaults(func=cmd_grade)

    m = sub.add_parser("mark-bet", help="mark a recommendation as actually bet")
    m.add_argument("rec_id", type=int)
    m.add_argument("--unset", action="store_true")
    m.set_defaults(func=cmd_mark_bet)

    return p


def main(argv=None) -> int:
    logging.basicConfig(
        level=logging.INFO, format="%(levelname)s %(name)s: %(message)s"
    )
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
