import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { programs, brand } from '../data/content'
import { MediaField, Pill, ArrowLink } from '../components/ui'

export default function ProgramGrid() {
  return (
    <section className="relative w-full snap-start bg-char py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="headline text-4xl lowercase sm:text-6xl">explore the programs</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-bone/45 lg:hidden">swipe to view more →</span>
        </div>
      </div>

      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:gap-7 sm:px-8">
        {programs.map((p, i) => (
          <Card key={p.id} program={p} index={i} />
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

function Card({ program, index }) {
  const ref = useRef(null)
  const [glow, setGlow] = useState({ x: 50, y: 50, on: false })
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setGlow({ x: px * 100, y: py * 100, on: true })
    setTilt({ ry: (px - 0.5) * 8, rx: -(py - 0.5) * 8 })
  }
  const onLeave = () => {
    setGlow((g) => ({ ...g, on: false }))
    setTilt({ rx: 0, ry: 0 })
  }

  return (
    <motion.a
      ref={ref}
      href={program.href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-bone/10 sm:w-[58vw] lg:w-[31%]"
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 0.2s ease-out',
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <MediaField
          src={program.image}
          palette={program.palette}
          className="h-full w-full transition-transform duration-700 ease-[var(--ease-forge)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        {/* Cursor-tracking ember glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glow.on ? 1 : 0,
            background: `radial-gradient(36% 30% at ${glow.x}% ${glow.y}%, rgba(230,140,50,0.45), transparent 70%)`,
            mixBlendMode: 'screen',
          }}
        />

        <span className="absolute left-5 top-5 font-display text-sm tabular-nums text-bone/70">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <h3 className="headline text-2xl sm:text-3xl">{program.name}</h3>
          <p className="mt-1 text-sm text-bone/70">{program.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {program.audience.slice(0, 1).map((a, j) => (
              <Pill key={j}>{a}</Pill>
            ))}
          </div>
          <div className="mt-5">
            <ArrowLink className="text-sm uppercase tracking-[0.15em]">learn more</ArrowLink>
          </div>
        </div>
      </div>
    </motion.a>
  )
}
