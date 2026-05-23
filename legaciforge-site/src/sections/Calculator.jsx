import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { calculator as cfg, brand, assets } from '../data/content'
import { AnimatedNumber, Logo, ArrowLink } from '../components/ui'

const usd = (v) =>
  '$' + Math.round(v).toLocaleString('en-US', { maximumFractionDigits: 0 })

export default function Calculator() {
  const { inputs } = cfg
  const [deal, setDeal] = useState(inputs.deal.default)
  const [stateCode, setStateCode] = useState(cfg.defaultState)
  const [agent, setAgent] = useState(inputs.agent.default)
  const [expenses, setExpenses] = useState(inputs.expenses.default)

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

            <Slider cfg={inputs.agent} value={agent} onChange={setAgent} display={`${agent}%`} />
            <Slider cfg={inputs.expenses} value={expenses} onChange={setExpenses} display={`${expenses}%`} />
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
      </div>

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

function Slider({ cfg, value, onChange, display }) {
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
    </label>
  )
}
