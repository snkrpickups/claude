-- GSTACK schema (Section 7).
-- SQLite in the free phase. Postgres-portable: INTEGER epoch timestamps (UTC),
-- no SQLite-only types. AUTOINCREMENT is tolerated by Postgres-migration tooling
-- as a serial/identity column.

-- games: one row per game we track
CREATE TABLE IF NOT EXISTS games (
  game_id        TEXT PRIMARY KEY,      -- provider id
  sport          TEXT NOT NULL,         -- 'NBA'
  home_team      TEXT NOT NULL,
  away_team      TEXT NOT NULL,
  commence_time  INTEGER NOT NULL,      -- epoch UTC
  status         TEXT NOT NULL DEFAULT 'scheduled', -- scheduled|live|final
  created_at     INTEGER NOT NULL
);

-- odds_snapshots: every price we ever fetch, per book/market/outcome
CREATE TABLE IF NOT EXISTS odds_snapshots (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id        TEXT NOT NULL REFERENCES games(game_id),
  fetched_at     INTEGER NOT NULL,      -- epoch UTC
  book           TEXT NOT NULL,         -- 'pinnacle','draftkings',...
  is_sharp       INTEGER NOT NULL,      -- 1 if treated as sharp reference
  market         TEXT NOT NULL,         -- 'h2h','spreads','totals'
  outcome        TEXT NOT NULL,         -- team name or 'Over'/'Under'
  line           REAL,                  -- spread/total point; NULL for h2h
  american       INTEGER NOT NULL,
  decimal        REAL NOT NULL,
  implied        REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_odds_game_market
  ON odds_snapshots(game_id, market, fetched_at);

-- ratings: power-model output per team per day (Phase 2)
CREATE TABLE IF NOT EXISTS ratings (
  team           TEXT NOT NULL,
  as_of          INTEGER NOT NULL,
  rating         REAL NOT NULL,
  PRIMARY KEY (team, as_of)
);

-- recommendations: every +EV flag we surface
CREATE TABLE IF NOT EXISTS recommendations (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at     INTEGER NOT NULL,
  game_id        TEXT NOT NULL REFERENCES games(game_id),
  pillar         TEXT NOT NULL,         -- 'A' | 'B' | 'A+reasoning'
  market         TEXT NOT NULL,
  outcome        TEXT NOT NULL,
  line           REAL,
  book           TEXT NOT NULL,         -- soft book we'd bet at
  american       INTEGER NOT NULL,
  decimal        REAL NOT NULL,
  fair_prob      REAL NOT NULL,         -- our p
  market_implied REAL NOT NULL,         -- soft book implied
  edge           REAL NOT NULL,         -- p*d - 1
  kelly_fraction REAL NOT NULL,
  stake          REAL NOT NULL,
  rationale      TEXT,                  -- reasoning text (Phase 3)
  bet_taken      INTEGER DEFAULT 0      -- owner marks if they actually bet
);

-- clv: closing-line grading per recommendation
CREATE TABLE IF NOT EXISTS clv (
  rec_id          INTEGER PRIMARY KEY REFERENCES recommendations(id),
  closing_decimal REAL,                 -- best closing price for that outcome
  clv_pct         REAL,                 -- (rec_decimal / closing_decimal - 1)*100, sign-aware
  result          TEXT,                 -- 'win'|'loss'|'push'|NULL until graded
  graded_at       INTEGER
);

-- budget: persistent monthly request counter
CREATE TABLE IF NOT EXISTS budget (
  month          TEXT PRIMARY KEY,      -- 'YYYY-MM'
  requests_used  INTEGER NOT NULL DEFAULT 0
);
