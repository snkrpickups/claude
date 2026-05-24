import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import QRCode from 'qrcode'
import { calculator as cfg } from '../data/content'
import { buildShareUrl, renderCard, shareCard, downloadCanvas, copyLink } from '../lib/share'

const c = cfg.share

export default function ShareModal({ data, onClose }) {
  const [name, setName] = useState('')
  const [variant, setVariant] = useState('square')
  const [preview, setPreview] = useState(null)
  const [qr, setQr] = useState(null)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef(null)

  const url = buildShareUrl({ ...data, name: name.trim() || undefined })
  const cardData = { ...data, name: name.trim() || undefined }

  // (Re)generate the card preview + standalone QR whenever inputs change.
  useEffect(() => {
    let alive = true
    ;(async () => {
      const canvas = await renderCard({ variant, data: cardData, url })
      if (!alive) return
      canvasRef.current = canvas
      setPreview(canvas.toDataURL('image/png'))
    })()
    QRCode.toDataURL(url, { margin: 1, width: 320, color: { dark: '#0d0d0f', light: '#f5f3ee' } }).then(
      (d) => alive && setQr(d),
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, name, data.keep, data.projected, data.pathId, data.horizon])

  const onShare = async () => {
    if (!canvasRef.current) return
    const res = await shareCard({ canvas: canvasRef.current, text: c.text, url })
    if (res === 'unsupported') downloadCanvas(canvasRef.current)
  }
  const onSave = () => canvasRef.current && downloadCanvas(canvasRef.current, `legaci-forge-${variant}.png`)
  const onCopy = async () => {
    if (await copyLink(url)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="my-auto w-full max-w-3xl rounded-3xl border border-bone/15 bg-char p-6 sm:p-8"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="headline text-3xl lowercase sm:text-4xl">{c.title}</h3>
              <p className="mt-1 text-sm text-bone/60">{c.sub}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="close"
              className="shrink-0 rounded-full border border-bone/20 px-3 py-1 text-bone/60 transition-colors hover:border-bone/50 hover:text-bone"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto]">
            {/* Card preview */}
            <div>
              <div className="flex items-center gap-2">
                {['square', 'story'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`rounded-full border px-3 py-1 font-display text-xs uppercase tracking-[0.12em] transition-all ${
                      v === variant ? 'border-ember bg-ember text-ink' : 'border-bone/25 text-bone/60 hover:border-bone/50'
                    }`}
                  >
                    {v === 'square' ? 'post / dm' : 'story'}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-center rounded-2xl border border-bone/10 bg-ink/50 p-3">
                {preview ? (
                  <img
                    src={preview}
                    alt="your shareable card"
                    className={`rounded-lg ${variant === 'story' ? 'max-h-[46vh]' : 'max-h-[40vh] w-full max-w-sm'}`}
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm text-bone/40">forging your card…</div>
                )}
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c.namePlaceholder}
                aria-label="your name"
                className="mt-3 w-full rounded-full border border-bone/20 bg-ink/60 px-5 py-2.5 text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-ember"
              />
            </div>

            {/* QR + actions */}
            <div className="flex flex-col items-center gap-4 sm:w-56">
              <div className="rounded-2xl bg-bone p-3">
                {qr ? <img src={qr} alt="scan to open" className="h-40 w-40" /> : <div className="h-40 w-40" />}
              </div>
              <span className="text-center text-xs uppercase tracking-[0.15em] text-bone/50">
                hold up · let them scan
              </span>

              <div className="mt-1 flex w-full flex-col gap-2">
                <button
                  onClick={onShare}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-ember px-5 py-3 font-display text-base lowercase text-ink transition-all hover:bg-bone"
                >
                  {c.shareCta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
                <button
                  onClick={onSave}
                  className="rounded-full border border-bone/25 px-5 py-3 font-display text-base lowercase text-bone transition-colors hover:border-bone/50"
                >
                  {c.saveCta}
                </button>
                <button
                  onClick={onCopy}
                  className="rounded-full border border-bone/25 px-5 py-3 font-display text-base lowercase text-bone transition-colors hover:border-bone/50"
                >
                  {copied ? c.copied : c.copyCta}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
