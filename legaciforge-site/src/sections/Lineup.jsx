import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { programs, brand } from '../data/content'
import { Pill, Ticker, MediaField, ArrowLink } from '../components/ui'

export default function Lineup() {
  const [active, setActive] = useState(0)
  const item = programs[active]

  return (
    <section id="programs" className="relative min-h-[100svh] w-full overflow-hidden bg-ink">
      {/* Full-bleed background that swaps with the active selection */}
      <AnimatePresence mode="sync">
        <motion.div
          key={item.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <MediaField src={item.image} palette={item.palette} className="h-full w-full" />
          <div className="absolute inset-0 bg-ink/60" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-5 py-24 sm:px-8">
        {/* Eyebrow + ticker matching the "All Flavors 06" treatment */}
        <div className="flex items-baseline gap-3 font-display text-sm uppercase tracking-[0.25em] text-bone/70">
          <span>{brand.programsLabel}</span>
          <Ticker value={programs.length} className="text-base text-ember" />
        </div>

        {/* Giant numeral accent for the active item */}
        <div className="pointer-events-none mt-2 select-none">
          <motion.div
            key={item.id + '-num'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[34vw] leading-[0.8] text-bone sm:text-[22vw] lg:text-[15vw]"
          >
            {String(active + 1).padStart(2, '0')}
          </motion.div>
        </div>

        <div className="mt-auto grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          {/* Numbered selector list */}
          <ul className="flex flex-col">
            {programs.map((o, i) => {
              const isActive = i === active
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group flex w-full items-center gap-4 border-t border-bone/15 py-4 text-left sm:gap-6 sm:py-5"
                  >
                    <span
                      className={`font-display text-sm tabular-nums transition-colors ${
                        isActive ? 'text-ember' : 'text-bone/40'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`headline flex-1 text-3xl transition-all duration-500 ease-[var(--ease-forge)] sm:text-5xl ${
                        isActive ? 'translate-x-2 text-bone' : 'text-bone/45'
                      }`}
                    >
                      {o.name}
                    </span>
                    <span
                      className={`text-xl transition-all duration-500 ${
                        isActive ? 'translate-x-0 text-ember opacity-100' : '-translate-x-3 opacity-0'
                      }`}
                    >
                      →
                    </span>
                  </button>
                </li>
              )
            })}
            <span className="border-t border-bone/15" />
          </ul>

          {/* Detail panel revealed for the active item */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id + '-panel'}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-bone/15 bg-ink/40 p-6 backdrop-blur-md sm:p-8"
            >
              <p className="font-display text-xl lowercase text-bone sm:text-2xl">{item.tagline}</p>
              <p className="mt-1 text-sm text-bone/60">{item.subtagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.audience.map((a, i) => (
                  <Pill key={i} tone="ember">
                    {a}
                  </Pill>
                ))}
              </div>
              <div className="mt-6">
                <ArrowLink href={`#offering-${item.id}`} className="font-display text-lg lowercase">
                  view program
                </ArrowLink>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
