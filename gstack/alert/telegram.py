"""Telegram alerter (Section 10). Optional in the free phase.

Pushes new +EV recommendations as a clean ticket the moment they clear the gate.
CLI output is the source of truth; Telegram is best-effort and never blocks the
pipeline.
"""

from __future__ import annotations

import logging
from typing import Optional

from ..config import Config
from ..store.repo import Recommendation
from .cli import format_ticket

logger = logging.getLogger("gstack.telegram")

TELEGRAM_API = "https://api.telegram.org"


class TelegramAlerter:
    def __init__(self, config: Config):
        self.config = config

    @property
    def enabled(self) -> bool:
        return bool(self.config.telegram_bot_token and self.config.telegram_chat_id)

    def send_recommendation(self, rec: Recommendation, *, game=None) -> bool:
        if not self.enabled:
            logger.debug("Telegram disabled (no token/chat id); skipping.")
            return False
        text = format_ticket(rec, game=game, kelly_multiplier=self.config.kelly_multiplier)
        return self._send(text)

    def _send(self, text: str) -> bool:
        try:
            import requests

            url = f"{TELEGRAM_API}/bot{self.config.telegram_bot_token}/sendMessage"
            resp = requests.post(
                url,
                json={
                    "chat_id": self.config.telegram_chat_id,
                    "text": text,
                    "parse_mode": "Markdown",
                },
                timeout=15,
            )
            resp.raise_for_status()
            return True
        except Exception as exc:  # never let alerting break the pipeline
            logger.warning("Telegram send failed: %s", exc)
            return False
