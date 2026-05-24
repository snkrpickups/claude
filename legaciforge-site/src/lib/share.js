import QRCode from 'qrcode'

// ─────────────────────────────────────────────────────────────────────────
//  Deep-link params: encode/decode a shared calculator scenario.
//  Compact keys: f=from(name) d=deal s=state a=agent e=expenses p=path y=years
// ─────────────────────────────────────────────────────────────────────────
export function buildShareUrl({ name, deal, term, stateCode, agent, expenses, pathId, horizon, dealType }) {
  const base = window.location.origin + import.meta.env.BASE_URL
  const q = new URLSearchParams()
  if (name) q.set('f', name)
  q.set('d', deal)
  if (term) q.set('n', term)
  q.set('s', stateCode)
  q.set('a', agent)
  q.set('e', expenses)
  if (dealType) q.set('t', dealType)
  if (pathId) q.set('p', pathId)
  if (horizon) q.set('y', horizon)
  return `${base}?${q.toString()}`
}

export function getShareParams() {
  if (typeof window === 'undefined') return { present: false }
  const q = new URLSearchParams(window.location.search)
  if (![...q.keys()].some((k) => ['d', 's', 'p'].includes(k))) return { present: false }
  const num = (v) => (v == null || v === '' ? undefined : Number(v))
  return {
    present: true,
    name: q.get('f') || undefined,
    deal: num(q.get('d')),
    term: num(q.get('n')),
    stateCode: q.get('s') || undefined,
    agent: num(q.get('a')),
    expenses: num(q.get('e')),
    dealType: q.get('t') || undefined,
    pathId: q.get('p') || undefined,
    horizon: num(q.get('y')),
  }
}

// ─────────────────────────────────────────────────────────────────────────
//  Card rendering — draws a branded result card on a canvas (square or story)
// ─────────────────────────────────────────────────────────────────────────
const usd = (v) => '$' + Math.round(v).toLocaleString('en-US')

async function ensureFonts() {
  if (!document.fonts) return
  try {
    await Promise.all([
      document.fonts.load('800 120px Archivo'),
      document.fonts.load('600 40px Archivo'),
      document.fonts.load('400 32px Inter'),
    ])
    await document.fonts.ready
  } catch {
    /* fall back to system fonts */
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export async function renderCard({ variant = 'square', data, url }) {
  await ensureFonts()
  const W = 1080
  const H = variant === 'story' ? 1920 : 1080
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0d0d0f'
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W * 0.25, H * 0.92, 0, W * 0.25, H * 0.92, H * 0.9)
  glow.addColorStop(0, 'rgba(217,116,42,0.42)')
  glow.addColorStop(0.5, 'rgba(150,60,20,0.12)')
  glow.addColorStop(1, 'rgba(13,13,15,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  const pad = 96
  const topY = variant === 'story' ? 200 : 110

  // Wordmark
  ctx.textBaseline = 'alphabetic'
  ctx.font = '800 44px Archivo, sans-serif'
  ctx.fillStyle = '#f5f3ee'
  ctx.fillText('LEGACI FORGE', pad, topY)
  ctx.fillStyle = '#d9742a'
  ctx.fillText('.', pad + ctx.measureText('LEGACI FORGE').width, topY)

  // Hook line
  let y = topY + (variant === 'story' ? 220 : 150)
  ctx.font = '600 40px Archivo, sans-serif'
  ctx.fillStyle = 'rgba(245,243,238,0.6)'
  const hook = data.name ? `${data.name} ran the numbers.` : 'I ran the numbers.'
  ctx.fillText(hook.toLowerCase(), pad, y)

  // Label
  y += 90
  ctx.font = '500 30px Inter, sans-serif'
  ctx.fillStyle = 'rgba(245,243,238,0.45)'
  const dealLabel = data.term
    ? `ON A ${usd(data.deal)} / ${data.term}-YR DEAL, I KEEP`
    : `ON A ${usd(data.deal)} DEAL, I ACTUALLY KEEP`
  ctx.fillText(dealLabel, pad, y)

  // Big number
  y += variant === 'story' ? 170 : 150
  ctx.font = '800 150px Archivo, sans-serif'
  ctx.fillStyle = '#d9742a'
  ctx.fillText(usd(data.keep), pad, y)

  // Sub
  y += 70
  ctx.font = '600 46px Archivo, sans-serif'
  ctx.fillStyle = 'rgba(245,243,238,0.85)'
  ctx.fillText(`${data.keepPct}¢ of every dollar.`, pad, y)

  // Projection (optional)
  if (data.projected) {
    y += variant === 'story' ? 150 : 120
    ctx.font = '500 30px Inter, sans-serif'
    ctx.fillStyle = 'rgba(245,243,238,0.45)'
    ctx.fillText(`${data.pathLabel.toUpperCase()} — PUT TO WORK, COULD BECOME`, pad, y)
    y += 90
    ctx.font = '800 92px Archivo, sans-serif'
    ctx.fillStyle = '#f5f3ee'
    ctx.fillText(usd(data.projected), pad, y)
    y += 54
    ctx.font = '400 34px Inter, sans-serif'
    ctx.fillStyle = 'rgba(245,243,238,0.5)'
    ctx.fillText(`in ${data.horizon} years`, pad, y)
  }

  // QR tile + footer
  const qrSize = 240
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: qrSize,
    color: { dark: '#0d0d0f', light: '#f5f3ee' },
  })
  const qrImg = await loadImage(qrDataUrl)
  const tile = qrSize + 36
  const qrX = W - pad - tile
  const qrY = H - (variant === 'story' ? 320 : 160) - tile + 36
  ctx.fillStyle = '#f5f3ee'
  roundRect(ctx, qrX, qrY, tile, tile, 28)
  ctx.fill()
  ctx.drawImage(qrImg, qrX + 18, qrY + 18, qrSize, qrSize)

  // Footer text
  ctx.font = '600 40px Archivo, sans-serif'
  ctx.fillStyle = '#f5f3ee'
  ctx.fillText('scan & run your own →', pad, qrY + tile - 44)
  ctx.font = '400 30px Inter, sans-serif'
  ctx.fillStyle = 'rgba(245,243,238,0.5)'
  ctx.fillText('legaciforge.org', pad, qrY + tile - 4)

  return canvas
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

export function canvasToBlob(canvas) {
  return new Promise((res) => canvas.toBlob((b) => res(b), 'image/png'))
}

// ─────────────────────────────────────────────────────────────────────────
//  Sharing
// ─────────────────────────────────────────────────────────────────────────
export async function shareCard({ canvas, text, url }) {
  const blob = await canvasToBlob(canvas)
  const file = new File([blob], 'legaci-forge.png', { type: 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, url })
      return 'shared'
    } catch {
      return 'cancelled'
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ text, url })
      return 'shared'
    } catch {
      return 'cancelled'
    }
  }
  return 'unsupported'
}

export function downloadCanvas(canvas, filename = 'legaci-forge.png') {
  const a = document.createElement('a')
  a.download = filename
  a.href = canvas.toDataURL('image/png')
  a.click()
}

export async function copyLink(url) {
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return false
  }
}
