# GSTACK

Sports-betting **edge-detection** agent. Decision-support only — the human is
always the bettor; GSTACK never transacts (PRD §2.2).

This is **Phase 1: the engine** — odds ingestion (cached, budgeted), the exact
math (§4), Pillar A (sharp-devig vs soft-book scan), the EV gate, fractional
Kelly sizing, recommendation emission, and CLV capture. NBA main markets only.

## Install

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"          # installs requests + pytest, exposes `gstack`
cp gstack/.env.example .env       # fill in ODDS_API_KEY, BANKROLL, MAX_STAKE_PER_BET
```

## CLI (PRD §10)

```bash
gstack poll                       # one budgeted fetch + analysis, emits tickets
gstack recs                       # print stored recommendations as tickets
gstack budget --slates-remaining 20 --pulls-per-slate 4
gstack clv                        # mean CLV + hit rate, by pillar and market
gstack backfill-closing           # refresh closing lines for open recs (0 cost)
gstack grade <game_id> --home-score 110 --away-score 100
gstack mark-bet <rec_id>          # owner marks a bet they actually placed
```

`python -m gstack.main <cmd>` works without installing.

## The request budget is the binding constraint (PRD §6)

Every metered Odds API call routes through `budget.spend()`. The monthly counter
persists in the DB (`budget` table) so restarts don't lose count. Default
`REQUEST_BUDGET=450` (margin under the free 500/mo cap). On exhaustion the system
serves the most recent **cached** snapshot and logs a warning — it never crashes
and never silently overspends. **All** devig/EV/model/CLV computation runs
against stored snapshots; re-reading stored data costs zero requests.

## Layout (PRD §5.1)

```
gstack/
  config.py          budget.py            scheduler.py     main.py
  clients/  odds_client.py  stats_client.py(P2)  news_client.py(P3)
  store/    db.py  schema.sql  repo.py
  engine/   odds_math.py  ev.py  kelly.py  pillar_a.py  pillar_b.py(P2)
  model/    power_ratings.py(P2)  calibration.py(P2)
  reasoning/ dossier.py(P3)  adjuster.py(P3)
  alert/    telegram.py  cli.py
  clv/      harness.py
tests/
```

## Tests

```bash
pytest -q
```

Covers (Phase 1 acceptance, PRD §8): odds math on +/- American odds, vig removal
summing to 1.0, the EV-gate boundary, Kelly returning 0 at non-positive edge,
budget exhaustion serving cache without calling the API, Pillar A on a
hand-checked fixture, recommendation persistence, and CLV capture + grading.

## The math (PRD §4)

- `engine/odds_math.py` — American↔decimal, implied prob, devig (normalization;
  a TODO seam is left to swap in the power method).
- `engine/ev.py` — `ev_per_unit = p*d - 1`; `is_value` is strictly `> threshold`.
- `engine/kelly.py` — fractional Kelly; full Kelly is never used directly;
  `MAX_STAKE_PER_BET` is a hard cap.

## Not yet built (by design)

Pillar B (power model, Phase 2), the reasoning/LLM layer (Phase 3), and
paid/prop data (Phase 4) are stubbed with clean seams so they bolt on without
rework. Do not enable them until each prior phase's acceptance criteria pass.
```
