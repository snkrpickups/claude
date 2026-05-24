import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getShareParams } from '../lib/share'
import { calculator as cfg } from '../data/content'

const usd = (v) => '$' + Math.round(v).toLocaleString('en-US')

// Personalized landing shown when arriving via a shared deep link.
export default function SharedWelcome() {
  const sp = getShareParams()
  const [open, setOpen] = useState(sp.present)
  if (!sp.present) return null

  const stateObj = cfg.states.find((s) => s.code === sp.stateCode)
  const tax = stateObj ? cfg.federalRate + stateObj.rate : null
  const keep =
    sp.deal != null && tax != null
      ? sp.deal * (1 - tax / 100 - (sp.agent ?? 0) / 100 - (sp.expenses ?? 0) / 100)
      : null
  const who = sp.name || 'a teammate'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-ink px-5"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(70% 60% at 50% 110%, rgba(217,116,42,0.3), transparent 60%)' }}
          />
          <motion.div
            className="relative z-10 max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-display text-sm uppercase tracking-[0.25em] text-ember">
              {who} thinks you should see this
            </span>
            {keep != null ? (
              <h2 className="headline mt-5 text-4xl lowercase sm:text-6xl">
                on a {usd(sp.deal)} deal, {who.toLowerCase()} keeps{' '}
                <span className="text-ember">{usd(keep)}</span>.
              </h2>
            ) : (
              <h2 className="headline mt-5 text-4xl lowercase sm:text-6xl">
                see what you actually keep.
              </h2>
            )}
            <p className="mx-auto mt-5 max-w-md text-bone/70">
              Most athletes have no idea what they really take home. Run your own numbers — it takes ten seconds.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="group mt-9 inline-flex items-center gap-3 font-display text-3xl lowercase text-bone transition-colors hover:text-ember sm:text-4xl"
            >
              run my numbers
              <span className="text-ember transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
