import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { brand, motifs, assets } from '../data/content'
import { MediaField, ArrowLink, Logo } from '../components/ui'
import ForgeCanvas from '../components/ForgeCanvas'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const lines = motifs.headlinePrimary.split('\n')

  return (
    <section id="enter" ref={ref} className="relative h-[100svh] w-full snap-start overflow-hidden bg-ink">
      {/* Static fallback (shown when WebGL/motion is unavailable) */}
      <div className="absolute inset-0">
        <MediaField src={assets.forge} palette={['#c6822f', '#120a04']} className="h-full w-full" />
      </div>

      {/* Live cursor-reactive forge-fire */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <ForgeCanvas className="h-full w-full" />
      </motion.div>

      {/* Scrims: deepen left + bottom so the headline reads on near-black */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-transparent" />

      {/* Ignite flash on load */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(60% 50% at 25% 80%, rgba(255,180,90,0.55), transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.4, delay: 0.45, ease: 'easeOut' }}
      />

      {/* Minimal corner logo */}
      <motion.div
        className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo src={assets.logo} name={brand.name} className="h-9 w-auto text-xl sm:h-11" />
      </motion.div>

      <motion.div
        className="absolute right-5 top-6 z-20 sm:right-8 sm:top-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <ArrowLink href="#programs" className="text-xs uppercase tracking-[0.2em] text-bone/70">
          our programs
        </ArrowLink>
      </motion.div>

      {/* Brand statement */}
      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 sm:px-8 sm:pb-24"
        style={{ y: textY, opacity: fade }}
      >
        <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-xs uppercase tracking-[0.3em] text-ember sm:text-sm">
          <span>{motifs.motto}</span>
          <span className="text-bone/45">{motifs.mottoTranslation}</span>
        </div>

        <h1 className="headline text-[11.5vw] sm:text-[10vw] lg:text-[7.5vw]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%', color: '#d9742a', textShadow: '0 0 38px rgba(230,120,40,0.95)' }}
                animate={{
                  y: 0,
                  color: '#f5f3ee',
                  textShadow: '0 0 0px rgba(230,120,40,0)',
                }}
                transition={{
                  y: { duration: 1.1, delay: 0.4 + i * 0.14, ease: [0.16, 1, 0.3, 1] },
                  color: { duration: 1.5, delay: 0.7 + i * 0.14, ease: 'easeOut' },
                  textShadow: { duration: 1.6, delay: 0.7 + i * 0.14, ease: 'easeOut' },
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-5 max-w-xl text-lg text-bone/80 sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          {motifs.headlineSecondary}
        </motion.p>
      </motion.div>

      {/* Scroll cue (desktop, bottom-right to avoid the scripture line) */}
      <motion.div
        className="absolute bottom-6 right-8 z-10 hidden flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-bone/50 sm:flex"
        style={{ opacity: fade }}
      >
        <span>scroll</span>
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-ember to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>

      {/* Scripture band */}
      <motion.div
        className="absolute bottom-5 left-1/2 z-10 w-full -translate-x-1/2 px-5 text-center text-[0.7rem] uppercase tracking-[0.22em] text-bone/45 sm:text-xs"
        style={{ opacity: fade }}
      >
        “{motifs.scripture}” — {motifs.scriptureRef}
      </motion.div>
    </section>
  )
}
