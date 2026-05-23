import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { programs } from '../data/content'
import { Pill, MediaField, ArrowLink, Ticker, SequenceTabs } from '../components/ui'

export default function DetailPanels() {
  return (
    <div className="relative bg-ink">
      {programs.map((p, i) => (
        <ProgramPanel key={p.id} program={p} index={i} flip={i % 2 === 1} />
      ))}
    </div>
  )
}

function ProgramPanel({ program, index, flip }) {
  return (
    <section id={`offering-${program.id}`} className="relative w-full border-t border-bone/10">
      <PinnedStage program={program} index={index} flip={flip} />
      <Details program={program} index={index} />
      {program.veterans && <VeteransBlock block={program.veterans} palette={program.palette} />}
    </section>
  )
}

// ── Pinned cinematic stage: rotating program image + name/taglines ────────
function PinnedStage({ program, index, flip }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const rotate = useTransform(scrollYProgress, [0, 1], [-16, 16])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1, 0.82])
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <div ref={ref} className="relative min-h-[150svh] w-full">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Full-bleed background tinted by palette */}
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <MediaField src={program.image} palette={program.palette} className="h-full w-full scale-110" />
          <div className="absolute inset-0 bg-ink/72" />
        </motion.div>

        {/* Oversized index numeral */}
        <span className="pointer-events-none absolute right-3 top-[12vh] select-none font-display text-[32vw] leading-none text-bone/[0.05] sm:text-[16vw]">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div
          className={`relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 ${
            flip ? 'lg:[direction:rtl]' : ''
          }`}
        >
          {/* Rotating program image */}
          <motion.div className="flex justify-center [direction:ltr]" style={{ y: imgY }}>
            <motion.div style={{ rotate, scale }} className="w-[64%] max-w-sm sm:w-[72%]">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-bone/10">
                <MediaField src={program.image} palette={program.palette} className="h-full w-full" />
              </div>
            </motion.div>
          </motion.div>

          {/* Headline copy */}
          <motion.div
            className="[direction:ltr]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline gap-3 font-display text-xs uppercase tracking-[0.25em] text-bone/60">
              <span>program</span>
              <Ticker value={index + 1} className="text-ember" />
            </div>

            <h2 className="headline mt-4 text-5xl sm:text-6xl lg:text-7xl">{program.name}</h2>
            <p className="mt-4 font-display text-xl lowercase text-ember sm:text-2xl">{program.tagline}</p>
            <p className="mt-1 text-base text-bone/70 sm:text-lg">{program.subtagline}</p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="font-display text-sm lowercase text-bone/60">for the</span>
              {program.audience.map((a, i) => (
                <Pill key={i} tone="ember">
                  {a}
                </Pill>
              ))}
            </div>

            {program.partner && (
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-bone/45">{program.partner}</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── Editorial detail: three pillars + tabbed sequence + quote ─────────────
function Details({ program, index }) {
  return (
    <div className="relative bg-char">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
        {program.note && (
          <p className="mb-12 max-w-2xl font-display text-2xl lowercase leading-tight text-bone/80 sm:text-3xl">
            {program.note}
          </p>
        )}

        {/* Three pillars */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 sm:grid-cols-3">
          {program.pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 bg-char p-7 sm:p-8"
            >
              <Ticker value={i + 1} className="text-sm text-ember" />
              <h3 className="headline text-2xl lowercase sm:text-3xl">{p.title}</h3>
              {p.tag && <Pill className="self-start">{p.tag}</Pill>}
            </motion.div>
          ))}
        </div>

        {/* Tabbed sequence + founder quote */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SequenceTabs title={program.sequence.title} tabs={program.sequence.tabs} />

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="border-l-2 border-ember pl-6"
          >
            <blockquote className="font-display text-2xl lowercase leading-snug text-bone sm:text-3xl">
              “{program.quote.text}”
            </blockquote>
            <figcaption className="mt-4 text-sm uppercase tracking-[0.18em] text-bone/55">
              — {program.quote.who}
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-14">
          <ArrowLink
            href={program.href}
            external={program.href?.startsWith('http')}
            className="font-display text-2xl lowercase"
          >
            join the forge
          </ArrowLink>
        </div>
      </div>
    </div>
  )
}

// ── Veterans block (Hustle Academy) ───────────────────────────────────────
function VeteransBlock({ block, palette }) {
  return (
    <div className="relative min-h-[80svh] w-full overflow-hidden">
      <MediaField src={block.image} palette={palette} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="relative z-10 mx-auto flex min-h-[80svh] max-w-[1100px] flex-col justify-center px-5 py-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Pill tone="ember">u.s. armed forces veterans</Pill>
          <h3 className="headline mt-5 text-4xl sm:text-6xl lg:text-7xl">{block.heading}</h3>
          <p className="mt-8 max-w-2xl font-display text-2xl lowercase leading-tight text-ember sm:text-3xl">
            {block.closing}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
