import { motion } from 'framer-motion'
import { whoWeAre as data } from '../data/content'
import { MediaField } from '../components/ui'

export default function WhoWeAre() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden">
      {/* Full-bleed forge image with parallax-free fixed feel */}
      <div className="absolute inset-0">
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ForgeBg image={data.image} />
        </motion.div>
        <div className="absolute inset-0 bg-ink/78" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1300px] px-5 py-28 sm:px-8">
        <p className="font-display text-sm uppercase tracking-[0.25em] text-ember">{data.label}</p>
        <div className="mt-8 space-y-1">
          {data.lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="headline block text-4xl leading-[1.02] sm:text-7xl lg:text-8xl"
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ForgeBg({ image }) {
  return <MediaField src={image} palette={['#c6822f', '#0e0905']} className="h-full w-full" />
}
