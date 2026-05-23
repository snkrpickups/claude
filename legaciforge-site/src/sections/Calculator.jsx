import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { calculator as cfg } from '../data/content'
import { AnimatedNumber } from '../components/ui'

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

  const { taxAmt, agentAmt, expAmt, keep, keepPct } = useMemo(() => {
    const taxAmt = deal * (tax / 100)
    const agentAmt = deal * (agent / 100)
    const expAmt = deal * (expenses / 100)
    const keep = Math.max(0, deal - taxAmt - agentAmt - expAmt)
    return { taxAmt, agentAmt, expAmt, keep, keepPct: deal ? (keep / deal) * 100 : 0 }
  }, [deal, tax, agent, expenses])

  const segments = [
    { label: 'taxes', amt: taxAmt, color: '#6f7882' },
    { label: 'agent', amt: agentAmt, color: '#8f3f12' },
    { label: 'expenses', amt: expAmt, color: '#3d4350' },
    { label: 'you keep', amt: keep, color: '#d9742a' },
  ]

  return (
    <section className="relative w-full snap-start bg-ink px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1300px]">
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
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
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
