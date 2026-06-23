"""GSTACK configuration (Section 11).

All knobs read from the environment with safe defaults. No secrets in code:
see ``.env.example``. ``BANKROLL`` and ``MAX_STAKE_PER_BET`` are required for
live staking; helpers below validate them only when actually needed so the
pure math/unit-test paths never depend on environment state.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import List, Optional


def _env_float(name: str, default: Optional[float]) -> Optional[float]:
    raw = os.environ.get(name)
    if raw is None or raw == "":
        return default
    return float(raw)


def _env_int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if raw is None or raw == "":
        return default
    return int(raw)


def _env_list(name: str, default: List[str]) -> List[str]:
    raw = os.environ.get(name)
    if raw is None or raw == "":
        return list(default)
    return [item.strip() for item in raw.split(",") if item.strip()]


@dataclass
class Config:
    # --- Sport / markets ---
    sport: str = os.environ.get("SPORT", "NBA")
    # The Odds API sport key for the configured sport.
    odds_api_sport_key: str = os.environ.get("ODDS_API_SPORT_KEY", "basketball_nba")
    markets: List[str] = field(
        default_factory=lambda: _env_list("MARKETS", ["h2h", "spreads", "totals"])
    )
    regions: str = os.environ.get("ODDS_API_REGIONS", "us")

    # --- Books ---
    sharp_book: str = os.environ.get("SHARP_BOOK", "pinnacle")
    soft_books: List[str] = field(
        default_factory=lambda: _env_list(
            "SOFT_BOOKS", ["draftkings", "fanduel", "betmgm", "espnbet"]
        )
    )

    # --- Budget ---
    request_budget: int = _env_int("REQUEST_BUDGET", 450)

    # --- Math / staking ---
    ev_threshold: float = _env_float("EV_THRESHOLD", 0.03)  # type: ignore[assignment]
    kelly_multiplier: float = _env_float("KELLY_MULTIPLIER", 0.25)  # type: ignore[assignment]
    bankroll: Optional[float] = _env_float("BANKROLL", None)
    max_stake_per_bet: Optional[float] = _env_float("MAX_STAKE_PER_BET", None)

    # --- Kalshi venue (World Cup execution venue; free API, not budgeted) ---
    kalshi_series_ticker: str = os.environ.get("KALSHI_SERIES_TICKER", "KXWORLDCUP")
    kalshi_maker: bool = os.environ.get("KALSHI_MAKER", "").lower() in ("1", "true", "yes")
    kalshi_fee_coeff: float = _env_float("KALSHI_FEE_COEFF", 0.07)  # type: ignore[assignment]

    # --- Storage ---
    db_url: str = os.environ.get("DB_URL", "sqlite:///gstack.db")

    # --- Secrets / integrations ---
    odds_api_key: Optional[str] = os.environ.get("ODDS_API_KEY")
    telegram_bot_token: Optional[str] = os.environ.get("TELEGRAM_BOT_TOKEN")
    telegram_chat_id: Optional[str] = os.environ.get("TELEGRAM_CHAT_ID")

    # --- Phase 3 (reserved) ---
    llm_api_key: Optional[str] = os.environ.get("LLM_API_KEY")
    llm_monthly_cap_usd: Optional[float] = _env_float("LLM_MONTHLY_CAP_USD", None)

    def sport_profile(self):
        """Resolve the active sport profile (NBA, SOCCER_WC, ...)."""
        from .sports import get_profile

        return get_profile(self.sport)

    def kalshi_fee_model(self):
        """Build the Kalshi fee model from config (used by the EV gate)."""
        from .engine.fees import KalshiFeeModel

        return KalshiFeeModel(coeff=self.kalshi_fee_coeff, maker=self.kalshi_maker)

    def db_path(self) -> str:
        """Resolve a SQLite file path from ``db_url``.

        Supports ``sqlite:///relative.db`` and ``sqlite:////abs/path.db``.
        Anything else is returned as-is so a future Postgres URL passes through.
        """
        prefix = "sqlite:///"
        if self.db_url.startswith(prefix):
            return self.db_url[len(prefix) :]
        return self.db_url

    def require_staking(self) -> "Config":
        """Validate the fields needed to size a real stake."""
        missing = []
        if self.bankroll is None:
            missing.append("BANKROLL")
        if self.max_stake_per_bet is None:
            missing.append("MAX_STAKE_PER_BET")
        if missing:
            raise ValueError(
                "Missing required staking config: "
                + ", ".join(missing)
                + ". Set them in your environment / .env."
            )
        return self

    def require_odds_api(self) -> "Config":
        if not self.odds_api_key:
            raise ValueError("ODDS_API_KEY is required to fetch live odds.")
        return self


def load_config() -> Config:
    """Construct a Config from the current environment."""
    return Config()
