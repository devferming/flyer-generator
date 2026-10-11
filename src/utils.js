// Convierte textos como "876,79", "876.79", "3,4" o "1.234,5" en número.
export function parseNum(txt) {
  if (txt == null) return NaN
  let s = String(txt).trim().replace(/\s/g, '').replace(/[$]/g, '')
  if (!s) return NaN
  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '')
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : NaN
}

function group(intStr) {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Formato latino: miles con punto, decimales con coma.
export function fmt(n, decimals = 0) {
  if (!Number.isFinite(n)) return '—'
  const neg = n < 0
  const [i, d] = Math.abs(n).toFixed(decimals).split('.')
  return (neg ? '-' : '') + group(i) + (d ? ',' + d : '')
}

// Muestra la tasa con hasta 2 decimales, sin ceros sobrantes (3,4 · 3,45 · 4)
export function fmtTasa(n) {
  if (!Number.isFinite(n)) return '—'
  const s = n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  const [i, d] = s.split('.')
  return group(i) + (d ? ',' + d : '')
}

export const MONTOS = Array.from({ length: 20 }, (_, i) => (i + 1) * 10000)

// recibe (Bs) = pesos / tasa ; dólares BCV = Bs / precio BCV
export function calcularFilas(tasa, bcv, montos = MONTOS) {
  return montos.map((pesos) => {
    const bs = tasa > 0 ? pesos / tasa : NaN
    const usd = bcv > 0 ? bs / bcv : NaN
    return { pesos, bs, usd }
  })
}
