import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ── Content resolver ──────────────────────────────────────────────────────
// Returns the real value once it's filled in; until then shows the polished
// fallback. A value is considered "unfilled" if it's still a [BRACKET].
export const txt = (value, fallback) => {
  if (Array.isArray(value)) {
    return value.map((v, i) => txt(v, fallback?.[i] ?? v))
  }
  if (typeof value === 'string' && value.trim() && !value.trim().startsWith('[')) {
    return value
  }
  return fallback ?? value
}

// ── Bracket pill — the core recurring visual motif: [ like this ] ──────────
export function Pill({ children, tone = 'bone', className = '' }) {
  const tones = {
    bone: 'border-bone/30 text-bone/80',
    ember: 'border-ember/60 text-ember',
    ink: 'border-ink/30 text-ink/70',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] sm:text-xs ${tones[tone]} ${className}`}
    >
      <span className="opacity-50">[</span>
      {children}
      <span className="opacity-50">]</span>
    </span>
  )
}

// ── Arrow-suffixed link — Link → ───────────────────────────────────────────
export function ArrowLink({ href = '#', children, className = '', external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group inline-flex items-center gap-2 transition-colors duration-300 hover:text-ember ${className}`}
    >
      <span>{children}</span>
      <span className="inline-block transition-transform duration-300 ease-[var(--ease-forge)] group-hover:translate-x-1.5">
        →
      </span>
    </a>
  )
}

// ── Section eyebrow with numeric ticker accent — "label 0N" ────────────────
export function SectionLabel({ label, index, total, tone = 'bone' }) {
  const color = tone === 'ink' ? 'text-ink/60' : 'text-bone/60'
  return (
    <div className={`flex items-baseline gap-3 font-display text-sm uppercase tracking-[0.25em] ${color}`}>
      <span>{label}</span>
      <Ticker value={index} className="text-current" />
      {total != null && <span className="opacity-40">/ {String(total).padStart(2, '0')}</span>}
    </div>
  )
}

// ── Numeric ticker — 00–09 style rolling numeral accent ────────────────────
export function Ticker({ value, className = '' }) {
  const padded = String(value).padStart(2, '0')
  return (
    <span className={`inline-flex tabular-nums ${className}`} aria-hidden="true">
      {padded.split('').map((d, i) => (
        <Digit key={i} digit={Number(d)} />
      ))}
    </span>
  )
}

function Digit({ digit }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline">
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: `${-digit * 10}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

// ── Gradient fallback background (used when no image is supplied) ──────────
export function GradientField({ palette, className = '', children }) {
  const [a, b] = palette ?? ['#c2542a', '#1a0c06']
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 30% 20%, ${a}33 0%, transparent 55%), radial-gradient(120% 120% at 80% 90%, ${a}22 0%, transparent 50%), linear-gradient(150deg, ${b} 0%, #060606 100%)`,
      }}
    >
      {/* subtle film grain / noise via SVG */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {children}
    </div>
  )
}

// ── Image with graceful forged-metal gradient fallback on error/missing ───
export function MediaField({ src, palette, alt = '', className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <GradientField palette={palette} className={className}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[22vw] leading-none text-bone/[0.04] sm:text-[14vw]">◆</span>
        </div>
      </GradientField>
    )
  }
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
        loading="lazy"
      />
    </div>
  )
}

// ── Logo image with wordmark fallback ─────────────────────────────────────
export function Logo({ src, name, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <span className={`font-display font-extrabold tracking-tight ${className}`}>
        {name}
        <span className="text-ember">.</span>
      </span>
    )
  }
  return <img src={src} alt={name} onError={() => setFailed(true)} className={className} />
}

// ── Tabbed sequence — e.g. "Iron Sharpens Iron" → VENI / VIDI / NOVI ───────
export function SequenceTabs({ title, tabs, tone = 'bone' }) {
  const [active, setActive] = useState(0)
  const onInk = tone === 'ink'
  return (
    <div>
      <div className="font-display text-xs uppercase tracking-[0.25em] text-ember">{title}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            className={`rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
              i === active
                ? 'border-ember bg-ember text-ink'
                : onInk
                  ? 'border-ink/25 text-ink/60 hover:border-ink/50'
                  : 'border-bone/25 text-bone/60 hover:border-bone/50'
            }`}
          >
            {t.term}
          </button>
        ))}
      </div>
      <div className="mt-5 h-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline gap-3"
          >
            <span className="headline text-4xl lowercase sm:text-5xl">{tabs[active].term}</span>
            <span className={onInk ? 'text-ink/50' : 'text-bone/50'}>—</span>
            <span className={`text-lg ${onInk ? 'text-ink/70' : 'text-bone/70'}`}>{tabs[active].meaning}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
