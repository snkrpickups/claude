import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { waitlist as cfg } from '../data/content'
import { Pill } from '../components/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | done | error

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setState('error')
      return
    }
    setState('loading')
    if (cfg.endpoint) {
      try {
        const res = await fetch(cfg.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email }),
        })
        setState(res.ok ? 'done' : 'error')
      } catch {
        setState('error')
      }
    } else {
      // Demo mode (no backend wired yet)
      setTimeout(() => setState('done'), 600)
    }
  }

  return (
    <section className="relative w-full snap-start overflow-hidden bg-char px-5 py-28 sm:px-8 sm:py-36">
      {/* Ember glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(60% 80% at 80% 120%, rgba(217,116,42,0.25), transparent 60%)' }}
      />
      <div className="relative z-10 mx-auto max-w-[1000px] text-center">
        <Pill tone="ember" className="mx-auto">
          {cfg.scarcity}
        </Pill>
        <h2 className="headline mx-auto mt-6 max-w-[16ch] text-5xl lowercase sm:text-7xl">{cfg.heading}</h2>
        <p className="mx-auto mt-5 max-w-md text-bone/70">{cfg.sub}</p>

        <div className="mx-auto mt-10 max-w-xl">
          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 rounded-full border border-ember/60 bg-ember/10 px-6 py-4 font-display text-lg lowercase text-ember"
              >
                <span>◆</span>
                {cfg.success}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (state === 'error') setState('idle')
                  }}
                  placeholder={cfg.placeholder}
                  aria-label="email"
                  className="flex-1 rounded-full border border-bone/20 bg-ink/60 px-6 py-4 text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-ember"
                />
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-ember px-7 py-4 font-display text-base lowercase text-ink transition-all duration-300 hover:bg-bone disabled:opacity-60"
                >
                  {state === 'loading' ? 'forging…' : cfg.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {state === 'error' && (
            <p className="mt-3 text-sm text-ember">
              {EMAIL_RE.test(email) ? cfg.error : 'Please enter a valid email.'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
