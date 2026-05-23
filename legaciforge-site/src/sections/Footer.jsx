import { motion } from 'framer-motion'
import { footer, brand, motifs } from '../data/content'
import { ArrowLink } from '../components/ui'

export default function Footer() {
  const lines = footer.closing.split('\n')
  return (
    <footer className="relative w-full overflow-hidden bg-ink px-5 pb-12 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-[1500px]">
        {/* Large closing brand line */}
        <motion.h2
          className="headline text-[14vw] leading-[0.9] sm:text-[10vw] lg:text-[8vw]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10%' }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Motto + scripture motifs */}
        <div className="mt-10 flex flex-col gap-1 font-display text-sm uppercase tracking-[0.25em] text-ember">
          <span>
            {motifs.motto} <span className="text-bone/40">{motifs.mottoTranslation}</span>
          </span>
        </div>

        <div className="mt-16 grid gap-12 border-t border-bone/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Programs + nav links */}
          <nav className="flex flex-col gap-3 lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.2em] text-bone/40">explore</span>
            {footer.links.map((l) => (
              <ArrowLink
                key={l.label}
                href={l.href}
                external={l.external}
                className="font-display text-xl lowercase"
              >
                {l.label}
              </ArrowLink>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-bone/40">contact</span>
            <ArrowLink href={brand.contactPath} className="font-display text-xl lowercase">
              Contact Us
            </ArrowLink>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-bone/40">follow</span>
            {footer.socials.map((s) => (
              <ArrowLink key={s.label} href={s.href} external className="font-display text-xl lowercase">
                {s.label}
              </ArrowLink>
            ))}
          </div>
        </div>

        {/* Scripture band */}
        <p className="mt-16 text-center text-xs uppercase tracking-[0.2em] text-bone/40">
          “{motifs.scripture}” — {motifs.scriptureRef}
        </p>

        {/* Legal */}
        <p className="mt-8 border-t border-bone/10 pt-8 text-center text-xs text-bone/45">{footer.legal}</p>
      </div>
    </footer>
  )
}
