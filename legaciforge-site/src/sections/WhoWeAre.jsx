import { motion } from 'framer-motion'
import { whoWeAre as data } from '../data/content'

// Bold molten color block — the one full-bleed brand-color punch between the
// dark sections (Bluebird-style color moment).
export default function WhoWeAre() {
  return (
    <section className="relative flex min-h-[100svh] w-full snap-start items-center overflow-hidden">
      {/* Molten amber field */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 20% 0%, #e08a2e 0%, #c2641f 38%, #8f3f12 72%, #5e2409 100%)',
        }}
      />
      {/* Heat shimmer texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Giant watermark emblem */}
      <span className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-display text-[60vw] leading-none text-ink/10 sm:text-[36vw]">
        ◆
      </span>

      <div className="relative z-10 mx-auto w-full max-w-[1300px] px-5 py-28 sm:px-8">
        <p className="font-display text-sm uppercase tracking-[0.25em] text-ink/70">{data.label}</p>
        <motion.div
          className="mt-8 space-y-1"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15%' }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {data.lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="headline block text-4xl leading-[1.02] text-ink sm:text-7xl lg:text-8xl"
                variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
