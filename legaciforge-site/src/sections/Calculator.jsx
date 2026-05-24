import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { calculator as cfg, brand, assets } from '../data/content'
import { AnimatedNumber, Logo, ArrowLink } from '../components/ui'
import { getShareParams } from '../lib/share'
import ShareModal from '../components/ShareModal'

const usd = (v) =>
  '$' + Math.round(v).toLocaleString('en-US', { maximumFractionDigits: 0 })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sp = getShareParams()
const inRange = (v, lo, hi) => v != null && !Number.isNaN(v) && v >= lo && v <= hi
const validState = sp.stateCode && cfg.states.some((s) => s.code === sp.stateCode)
const validPath = sp.pathId && cfg.paths.options.some((o) => o.id === sp.pathId)

export default function Calculator() {
  const { inputs } = cfg
  const [deal, setDeal] = useState(
    inRange(sp.deal, inputs.deal.min, inputs.deal.max) ? sp.deal : inputs.deal.default,
  )
  const [stateCode, setStateCode] = useState(validState ? sp.stateCode : cfg.defaultState)
  const [agent, setAgent] = useState(inRange(sp.agent, inputs.agent.min, inputs.agent.max) ? sp.agent : inputs.agent.default)
  const [expenses, setExpenses] = useState(
    inRange(sp.expenses, inputs.expenses.min, inputs.expenses.max) ? sp.expenses : inputs.expenses.default,
  )
  const [pathOpen, setPathOpen] = useState(!!validPath)
  const [pathId, setPathId] = useState(validPath ? sp.pathId : null)
  const [horizon, setHorizon] = useState(cfg.paths.horizons.includes(sp.horizon) ? sp.horizon : cfg.paths.defaultHorizon)
  const [showShare, setShowShare] = useState(false)

  const stateObj = cfg.states.find((s) => s.code === stateCode) ?? cfg.states[0]
  const tax = cfg.federalRate + stateObj.rate

  const { fedAmt, stateAmt, agentAmt, expAmt, keep, keepPct } = useMemo(() => {
    const fedAmt = deal * (cfg.federalRate / 100)
    const stateAmt = deal * (stateObj.rate / 100)
    const agentAmt = deal * (agent / 100)
    const expAmt = deal * (expenses / 100)
    const keep = Math.max(0, deal - fedAmt - stateAmt - agentAmt - expAmt)
    return { fedAmt, stateAmt, agentAmt, expAmt, keep, keepPct: deal ? (keep / deal) * 100 : 0 }
  }, [deal, stateObj.rate, agent, expenses])

  const segments = [
    { label: 'federal tax', amt: fedAmt, color: '#7c8590' },
    { label: `${stateObj.code} tax`, amt: stateAmt, color: '#cf3a2e' },
    { label: 'agent', amt: agentAmt, color: '#8f3f12' },
    { label: 'expenses', amt: expAmt, color: '#2b303a' },
    { label: 'you keep', amt: keep, color: '#d9742a' },
  ]

  const selPath = cfg.paths.options.find((o) => o.id === pathId && !o.contact)
  const projected = selPath ? Math.round(keep * Math.pow(1 + selPath.rate / 100, horizon)) : null
  const shareData = {
    deal,
    stateCode: stateObj.code,
    stateName: stateObj.name,
    taxPct: Number(tax.toFixed(1)),
    agent,
    expenses,
    keep: Math.round(keep),
    keepPct: Math.round(keepPct),
    pathId: selPath?.id,
    pathLabel: selPath?.label,
    horizon,
    projected,
  }

  return (
    <section id="top" className="relative flex min-h-[100svh] w-full snap-start flex-col bg-ink px-5 pb-14 pt-5 sm:px-8 sm:pt-7">
      {/* Landing top bar */}
      <header className="flex items-center justify-between">
        <Logo src={assets.logo} name={brand.name} className="h-9 w-auto text-xl sm:h-11" />
        <ArrowLink href="#enter" className="text-xs uppercase tracking-[0.2em] text-bone/70">
          enter
        </ArrowLink>
      </header>

      <div className="mx-auto flex w-full max-w-[1300px] flex-1 flex-col justify-center py-10">
        <div className="flex items-baseline gap-3 font-display text-sm uppercase tracking-[0.25em] text-ember">
          {cfg.label}
        </div>
        <h2 className="headline mt-3 text-5xl lowercase sm:text-7xl">{cfg.heading}</h2>
        <p className="mt-4 max-w-xl text-bone/70">{cfg.sub}</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Controls */}
          <div className="flex flex-col gap-8">
            <Slider
              cfg={inputs.deal}
              value={deal}
              onChange={setDeal}
              display={usd(deal)}
            />

            {/* State selector → auto-calculates the tax rate */}
            <div className="block">
              <div className="flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-[0.12em] text-bone/60">Your state</span>
                <span className="font-display text-xl text-bone">{tax.toFixed(1)}% tax</span>
              </div>
              <div className="relative mt-3">
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  aria-label="Select your state"
                  className="w-full appearance-none rounded-full border border-bone/20 bg-ink/60 px-6 py-3.5 pr-12 font-display text-lg text-bone outline-none transition-colors focus:border-ember"
                >
                  {cfg.states.map((s) => (
                    <option key={s.code} value={s.code} className="bg-ink text-bone">
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-ember">▾</span>
              </div>
              <p className="mt-2 text-xs text-bone/45">
                {stateObj.rate === 0 ? (
                  <span className="text-ember">{cfg.noTaxNote}</span>
                ) : (
                  `federal ${cfg.federalRate}% + ${stateObj.code} ${stateObj.rate}%`
                )}
              </p>
            </div>

            <DealType value={agent} onPick={setAgent} />
            <Slider
              cfg={inputs.agent}
              value={agent}
              onChange={setAgent}
              display={`${agent}%`}
              help={cfg.agentHelp}
            />
            <Slider
              cfg={inputs.expenses}
              value={expenses}
              onChange={setExpenses}
              display={`${expenses}%`}
              help={cfg.expensesHelp}
            />
          </div>

          {/* Result */}
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.2em] text-bone/45">you actually keep</span>
            <div className="headline mt-2 text-6xl text-ember sm:text-7xl lg:text-8xl">
              <AnimatedNumber value={keep} format={usd} />
            </div>
            <div className="mt-1 font-display text-xl text-bone/60">
              <AnimatedNumber value={keepPct} format={(v) => `${v.toFixed(0)}¢ of every dollar`} />
            </div>

            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="group mt-5 inline-flex items-center gap-2 rounded-full border border-ember/60 px-5 py-2.5 font-display text-sm lowercase text-ember transition-all duration-300 hover:bg-ember hover:text-ink"
            >
              <span aria-hidden="true">⤴</span>
              {cfg.share.button}
            </button>

            {/* Breakdown bar */}
            <div className="mt-8 flex h-4 w-full overflow-hidden rounded-full">
              {segments.map((s) => (
                <div
                  key={s.label}
                  className="h-full transition-all duration-500 ease-[var(--ease-forge)]"
                  style={{ width: `${deal ? (s.amt / deal) * 100 : 0}%`, background: s.color }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-5">
              {segments.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-bone/55">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-display text-bone">
                    <AnimatedNumber value={s.amt} format={usd} />
                  </span>
                </div>
              ))}
            </div>

            <motion.p
              className="mt-8 border-l-2 border-ember pl-5 text-lg text-bone/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {cfg.hook}
            </motion.p>

            <p className="mt-6 text-xs leading-relaxed text-bone/40">
              <span className="text-bone/30">[ </span>
              {cfg.disclaimer}
              <span className="text-bone/30"> ]</span>
            </p>
          </div>
        </div>

        {/* "What do you do with it?" reveal step */}
        <WhatNow
          keep={keep}
          ctx={{ deal, state: stateObj.name, taxPct: Number(tax.toFixed(1)), takeHome: Math.round(keep) }}
          open={pathOpen}
          setOpen={setPathOpen}
          pathId={pathId}
          setPathId={setPathId}
          horizon={horizon}
          setHorizon={setHorizon}
          onShare={() => setShowShare(true)}
        />
      </div>

      {showShare && <ShareModal data={shareData} onClose={() => setShowShare(false)} />}

      {/* Bottom CTA — enter the rest of the site */}
      <div className="mx-auto flex w-full max-w-[1300px] flex-col items-center gap-3 border-t border-bone/15 pt-10 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-bone/45">{cfg.enterNote}</span>
        <ArrowLink href="#enter" className="headline text-4xl lowercase sm:text-6xl">
          {cfg.enterCta}
        </ArrowLink>
        <motion.span
          className="mt-1 block h-8 w-px bg-gradient-to-b from-ember to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
    </section>
  )
}

function Slider({ cfg, value, onChange, display, help }) {
  const pct = ((value - cfg.min) / (cfg.max - cfg.min)) * 100
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm uppercase tracking-[0.12em] text-bone/60">{cfg.label}</span>
        <span className="font-display text-xl text-bone">{display}</span>
      </div>
      <input
        type="range"
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lf-range mt-3 w-full"
        style={{
          background: `linear-gradient(to right, var(--color-ember) ${pct}%, rgba(245,243,238,0.15) ${pct}%)`,
        }}
      />
      {help && <p className="mt-2 text-xs text-bone/40">{help}</p>}
    </label>
  )
}

// Deal-type quick-set: snaps the agent fee to a realistic value per deal type.
function DealType({ value, onPick }) {
  const active = cfg.dealTypes.find((d) => d.agent === value)
  return (
    <div className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm uppercase tracking-[0.12em] text-bone/60">{cfg.dealTypeLabel}</span>
        {active && <span className="font-display text-sm text-bone/55">{active.agent}% agent</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {cfg.dealTypes.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onPick(d.agent)}
            title={d.note}
            className={`rounded-full border px-3.5 py-1.5 font-display text-xs uppercase tracking-[0.1em] transition-all ${
              active?.id === d.id
                ? 'border-ember bg-ember text-ink'
                : 'border-bone/25 text-bone/60 hover:border-bone/50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-bone/40">{active ? active.note : 'pick the deal type that fits — or set the fee yourself below'}</p>
    </div>
  )
}

// ── "What do you do with it?" reveal: paths → compound projection / contact ──
function WhatNow({ keep, ctx, open, setOpen, pathId, setPathId, horizon, setHorizon, onShare }) {
  const { paths } = cfg
  const ease = [0.16, 1, 0.3, 1]
  const selected = paths.options.find((o) => o.id === pathId)

  return (
    <div className="mt-16 border-t border-bone/15 pt-12">
      {!open ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-3 font-display text-3xl lowercase text-bone transition-colors hover:text-ember sm:text-4xl"
          >
            {paths.prompt}
            <span className="text-ember transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-center font-display text-2xl lowercase text-bone/90 sm:text-3xl">
            {paths.question} <span className="text-ember">{usd(keep)}</span>?
          </p>

          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {paths.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setPathId(o.id)}
                    className="group flex flex-col rounded-2xl border border-bone/15 bg-char/60 p-6 text-left transition-all duration-300 hover:border-ember hover:bg-char"
                  >
                    <span className="headline text-2xl lowercase">{o.label}</span>
                    <span className="mt-2 text-sm text-bone/75">{o.tagline}</span>
                    <span className="mt-1 text-xs text-bone/45">{o.detail}</span>
                    <span className="mt-4 text-ember transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                ))}
              </motion.div>
            ) : selected.contact ? (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto mt-8 max-w-xl rounded-2xl border border-bone/15 bg-char/60 p-8 text-center"
              >
                <p className="text-lg text-bone/85">{selected.message}</p>
                <div className="mt-6 flex flex-col items-center gap-4">
                  <CtaForm
                    cta={selected.cta}
                    payload={{ interest: selected.interest, ...ctx, path: 'undecided' }}
                  />
                  <BackButton label={paths.backLabel} onClick={() => setPathId(null)} />
                </div>
              </motion.div>
            ) : (
              <Projection
                key="proj"
                path={selected}
                keep={keep}
                ctx={ctx}
                years={horizon}
                setYears={setHorizon}
                onShare={onShare}
                onBack={() => setPathId(null)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

function Projection({ path, keep, ctx, years, setYears, onShare, onBack }) {
  const { paths } = cfg
  const fv = keep * Math.pow(1 + path.rate / 100, years)
  const pctOfFv = fv ? (keep / fv) * 100 : 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto mt-8 max-w-2xl rounded-2xl border border-bone/15 bg-char/60 p-8 text-center"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm uppercase tracking-[0.15em] text-bone/55">{path.label.toLowerCase()} —</span>
        {paths.horizons.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYears(y)}
            className={`rounded-full border px-3 py-1 font-display text-sm uppercase tracking-[0.1em] transition-all ${
              y === years ? 'border-ember bg-ember text-ink' : 'border-bone/25 text-bone/60 hover:border-bone/50'
            }`}
          >
            {y}y
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-bone/50">{paths.projectionLead}</p>
      <div className="headline mt-2 text-6xl text-ember sm:text-7xl">
        <AnimatedNumber value={fv} format={usd} />
      </div>
      <p className="mt-1 font-display text-lg text-bone/60">
        {paths.horizonLabel.replace('{years}', years)}
      </p>

      {/* today vs projected bars */}
      <div className="mt-7 space-y-3 text-left">
        <Bar label="today" amount={keep} widthPct={pctOfFv} color="#7c8590" />
        <Bar label={`in ${years} years`} amount={fv} widthPct={100} color="#d9742a" />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-bone/40">
        <span className="text-bone/30">[ </span>
        {paths.note.replace('{rate}', path.rate)}
        <span className="text-bone/30"> ]</span>
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        <CtaForm
          cta={path.cta}
          payload={{
            interest: path.interest,
            ...ctx,
            path: path.label,
            horizonYears: years,
            projectedValue: Math.round(fv),
          }}
        />
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onShare}
            className="text-xs uppercase tracking-[0.15em] text-ember transition-colors hover:text-bone"
          >
            ⤴ {cfg.share.button}
          </button>
          <BackButton label={paths.backLabel} onClick={onBack} />
        </div>
      </div>
    </motion.div>
  )
}

function Bar({ label, amount, widthPct, color }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-[0.7rem] uppercase tracking-[0.12em] text-bone/55">{label}</span>
        <span className="font-display text-bone">{usd(amount)}</span>
      </div>
      <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-bone/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, widthPct)}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

function BackButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs uppercase tracking-[0.15em] text-bone/45 transition-colors hover:text-bone"
    >
      ← {label}
    </button>
  )
}

// CTA that reveals an inline lead form carrying the full calculator context.
function CtaForm({ cta, payload }) {
  const [show, setShow] = useState(false)
  if (show) return <LeadForm payload={payload} />
  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      className="group inline-flex items-center gap-2 font-display text-2xl lowercase text-bone transition-colors hover:text-ember"
    >
      {cta}
      <span className="text-ember transition-transform duration-300 group-hover:translate-x-1">→</span>
    </button>
  )
}

function LeadForm({ payload }) {
  const c = cfg.paths.lead
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !EMAIL_RE.test(email)) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const body = { name: name.trim(), email: email.trim(), ...payload }
    if (c.endpoint) {
      try {
        const res = await fetch(c.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        })
        setStatus(res.ok ? 'done' : 'error')
      } catch {
        setStatus('error')
      }
    } else {
      setTimeout(() => setStatus('done'), 600) // demo mode
    }
  }

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 font-display text-lg lowercase text-ember"
      >
        <span>◆</span>
        {c.success}
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md text-center"
    >
      <p className="text-sm text-bone/60">{c.sub}</p>
      <div className="mt-4 flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder={c.name}
          aria-label="first name"
          className="rounded-full border border-bone/20 bg-ink/60 px-5 py-3 text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-ember"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder={c.email}
          aria-label="email"
          className="rounded-full border border-bone/20 bg-ink/60 px-5 py-3 text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-ember"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 font-display text-base lowercase text-ink transition-all duration-300 hover:bg-bone disabled:opacity-60"
        >
          {status === 'loading' ? 'forging…' : c.cta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-2 text-sm text-ember">
          {!name.trim() ? 'Enter your name.' : !EMAIL_RE.test(email) ? 'Enter a valid email.' : c.error}
        </p>
      )}
    </motion.form>
  )
}
