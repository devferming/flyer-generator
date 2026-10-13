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

// Montos en dólares BCV que se muestran en la tabla
export const DOLARES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200]

// bolívares = dólares × precio BCV ; pesos a enviar = bolívares × tasa
// Los pesos se redondean hacia arriba al peso entero para que siempre alcance.
export function calcularFilas(tasa, bcv, dolares = DOLARES) {
  return dolares.map((usd) => {
    const bs = bcv > 0 ? usd * bcv : NaN
    const pesos = tasa > 0 ? Math.ceil(Math.round(bs * tasa * 100) / 100) : NaN
    return { usd, bs, pesos }
  })
}
