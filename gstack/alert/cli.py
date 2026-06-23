"""Ticket formatting for CLI + Telegram output (Section 10)."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from ..store.repo import Recommendation


def _fmt_pct(x: float) -> str:
    return f"{x * 100:.1f}%"


def _fmt_line(market: str, outcome: str, line) -> str:
    if line is None:
        return outcome
    # totals read 'Over 228.5'; spreads read 'Lakers -5.5'
    sign = "+" if (line is not None and line > 0 and market == "spreads") else ""
    return f"{outcome} {sign}{line}"


def _kelly_label(multiplier: float) -> str:
    # 0.25 -> '1/4-Kelly', 0.5 -> '1/2-Kelly', else 'XKelly'
    mapping = {0.25: "1/4-Kelly", 0.5: "1/2-Kelly"}
    return mapping.get(round(multiplier, 4), f"{multiplier:g}x-Kelly")


def format_ticket(
    rec: Recommendation, *, game=None, kelly_multiplier: float = 0.25
) -> str:
    """Render a recommendation as the ticket in Section 10."""
    sport = game["sport"] if game is not None else ""
    if game is not None:
        matchup = f"{game['away_team']} @ {game['home_team']}"
        tip = datetime.fromtimestamp(
            game["commence_time"], tz=timezone.utc
        ).strftime("%Y-%m-%d %H:%M UTC")
        header = f"{sport} · {matchup} · tips {tip}".strip(" ·")
    else:
        header = f"{sport} · game {rec.game_id}".strip(" ·")

    bet = _fmt_line(rec.market, rec.outcome, rec.line)
    am = f"{rec.american:+d}"
    lines = [
        header,
        f"BET: {bet}  @ {rec.book}  {am}  (dec {rec.decimal:.3f})",
        f"fair p: {_fmt_pct(rec.fair_prob)}   |  market implied: {_fmt_pct(rec.market_implied)}",
        f"edge: +{rec.edge * 100:.1f}%   |   pillar: {rec.pillar}   "
        f"|   {_kelly_label(kelly_multiplier)} stake: ${rec.stake:.2f}",
    ]
    if rec.rationale:
        lines.append(f"why: {rec.rationale}")
    return "\n".join(lines)
