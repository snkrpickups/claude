import { motion } from 'framer-motion'
import { whyItMatters as data } from '../data/content'
import { Ticker } from '../components/ui'

export default function WhyItMatters() {
  return (
    <section className="relative w-full bg-ink px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-baseline gap-3 font-display text-sm uppercase tracking-[0.25em] text-bone/60">
          <span>{data.label}</span>
          <Ticker value={data.statements.length} className="text-ember" />
        </div>

        <ul className="mt-12 space-y-2 sm:mt-16">
          {data.statements.map((s, i) => (
            <li key={i} className="overflow-hidden">
              <motion.p
                initial={{ opacity: 0, y: '60%' }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="headline flex gap-4 text-3xl lowercase leading-tight text-bone/90 sm:text-5xl lg:text-6xl"
              >
                <span className="mt-2 shrink-0 font-display text-base text-ember sm:text-xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{s}</span>
              </motion.p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
