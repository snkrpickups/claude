import { useRef } from 'react'
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  useMotionValue,
  wrap,
} from 'framer-motion'

// Scroll-reactive marquee: drifts on its own, speeds up and flips direction
// with scroll velocity. The signature "alive" kinetic-type band.
export default function Marquee({
  items = [],
  baseVelocity = 2.5,
  separator = '◆',
  className = '',
  tone = 'ember',
}) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) dir.current = -1
    else if (velocityFactor.get() > 0) dir.current = 1
    move += dir.current * move * velocityFactor.get()
    baseX.set(baseX.get() + move)
  })

  const colors = {
    ember: 'text-ember',
    bone: 'text-bone',
    ink: 'text-ink',
  }

  // One unit of content; rendered four times so the -25%..0% wrap is seamless.
  const unit = items.map((it, i) => (
    <span key={i} className="inline-flex items-center">
      <span>{it}</span>
      <span className="mx-6 opacity-40 sm:mx-10">{separator}</span>
    </span>
  ))

  return (
    <div className={`relative w-full overflow-hidden border-y border-bone/10 py-5 sm:py-7 ${className}`}>
      <motion.div className={`flex whitespace-nowrap ${colors[tone]}`} style={{ x }}>
        {[0, 1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex shrink-0 items-center font-display text-3xl uppercase tracking-tight sm:text-5xl lg:text-6xl"
          >
            {unit}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
