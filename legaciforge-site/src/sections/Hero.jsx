import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { brand, motifs, assets } from '../data/content'
import { MediaField, ArrowLink, Logo } from '../components/ui'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.25])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const lines = motifs.headlinePrimary.split('\n')

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      {/* Slow forge-image reveal on load + parallax on scroll */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale, y: bgY }}
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <MediaField src={assets.forge} palette={['#c6822f', '#120a04']} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
      </motion.div>

      {/* Minimal corner logo — fades in, no traditional nav menu */}
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

      {/* Brand statement — two stacked headlines + mission line */}
      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 sm:px-8 sm:pb-24"
        style={{ y: textY, opacity: fade }}
      >
        {/* Latin motto motif */}
        <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-xs uppercase tracking-[0.3em] text-ember">
          <span>{motifs.motto}</span>
          <span className="text-bone/40">{motifs.mottoTranslation}</span>
        </div>

        <h1 className="headline text-[11.5vw] sm:text-[10vw] lg:text-[7.5vw]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-5 max-w-xl text-lg text-bone/75 sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          {motifs.headlineSecondary}
        </motion.p>
      </motion.div>

      {/* Scripture band */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-5 text-center text-[0.7rem] uppercase tracking-[0.22em] text-bone/45 sm:text-xs"
        style={{ opacity: fade }}
      >
        “{motifs.scripture}” — {motifs.scriptureRef}
      </motion.div>
    </section>
  )
}
