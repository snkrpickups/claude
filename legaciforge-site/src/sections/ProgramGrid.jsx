import { motion } from 'framer-motion'
import { programs, brand } from '../data/content'
import { MediaField, Pill, ArrowLink } from '../components/ui'

export default function ProgramGrid() {
  return (
    <section className="relative w-full bg-char py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="headline text-4xl lowercase sm:text-6xl">explore the programs</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-bone/45 lg:hidden">swipe to view more →</span>
        </div>
      </div>

      {/* Horizontal swipeable carousel */}
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:gap-7 sm:px-8">
        {programs.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-bone/10 sm:w-[58vw] lg:w-[31%]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <MediaField
                src={p.image}
                palette={p.palette}
                className="h-full w-full transition-transform duration-700 ease-[var(--ease-forge)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <span className="absolute left-5 top-5 font-display text-sm tabular-nums text-bone/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="headline text-2xl sm:text-3xl">{p.name}</h3>
                <p className="mt-1 text-sm text-bone/70">{p.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.audience.slice(0, 1).map((a, j) => (
                    <Pill key={j}>{a}</Pill>
                  ))}
                </div>
                <div className="mt-5">
                  <ArrowLink className="text-sm uppercase tracking-[0.15em]">learn more</ArrowLink>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-[1500px] px-5 sm:px-8">
        <ArrowLink href={brand.contactPath} className="headline text-3xl lowercase sm:text-5xl">
          join the forge
        </ArrowLink>
      </div>
    </section>
  )
}
