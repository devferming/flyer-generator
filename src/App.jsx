import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import Flyer from './Flyer.jsx'
import { parseNum, fmt, fmtTasa } from './utils.js'

const FLYER_W = 1080
const FLYER_H = 1920

function hoy() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export default function App() {
  const [bcvTxt, setBcvTxt] = useState('876,79')
  const [tasaTxt, setTasaTxt] = useState('3,4')
  const [telefono, setTelefono] = useState('+57 3114396761')
  const [descargando, setDescargando] = useState(false)
  const [error, setError] = useState('')
  const [escala, setEscala] = useState(0.3)

  const flyerRef = useRef(null)
  const marcoRef = useRef(null)

  const bcv = parseNum(bcvTxt)
  const tasa = parseNum(tasaTxt)
  const bcvOk = bcv > 0
  const tasaOk = tasa > 0
  const valido = bcvOk && tasaOk

  // Ajusta la vista previa al ancho disponible
  useEffect(() => {
    const el = marcoRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setEscala(w / FLYER_W)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  async function descargar() {
    if (!valido || !flyerRef.current) return
    setDescargando(true)
    setError('')
    try {
      await document.fonts.ready
      const opciones = { width: FLYER_W, height: FLYER_H, pixelRatio: 1, cacheBust: true }
      // La primera llamada "calienta" fuentes e imágenes (evita PNG incompletos en algunos navegadores)
      await toPng(flyerRef.current, opciones)
      const dataUrl = await toPng(flyerRef.current, opciones)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `flyer-tasa-${fmtTasa(tasa).replace(',', '_')}-${hoy()}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (e) {
      console.error(e)
      setError('No se pudo generar la imagen. Intenta de nuevo.')
    } finally {
      setDescargando(false)
    }
  }

  const ejemploBs = bcvOk ? 100 * bcv : NaN
  const ejemploPesos = valido ? Math.ceil(Math.round(ejemploBs * tasa * 100) / 100) : NaN

  return (
    <div className="app">
      <header className="app-header">
        <h1>Generador de flyer</h1>
        <p>Escribe la tasa del día y el precio BCV; el flyer se actualiza solo y lo descargas en PNG.</p>
      </header>

      <main className="app-main">
        <section className="panel">
          <form className="form" onSubmit={(e) => { e.preventDefault(); descargar() }}>
            <label className="field">
              <span>Dólar BCV del día (Bs)</span>
              <input
                inputMode="decimal"
                value={bcvTxt}
                onChange={(e) => setBcvTxt(e.target.value)}
                placeholder="876,79"
                aria-invalid={!bcvOk}
              />
              {!bcvOk && <em>Ingresa un número mayor a 0</em>}
            </label>

            <label className="field">
              <span>Tasa de cambio (pesos por bolívar)</span>
              <input
                inputMode="decimal"
                value={tasaTxt}
                onChange={(e) => setTasaTxt(e.target.value)}
                placeholder="3,4"
                aria-invalid={!tasaOk}
              />
              {!tasaOk && <em>Ingresa un número mayor a 0</em>}
            </label>

            <label className="field">
              <span>WhatsApp de contacto</span>
              <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+57 3114396761" />
            </label>

            <div className="ejemplo">
              <strong>Ejemplo:</strong> para que lleguen <b>$100</b> BCV → 100 × {bcvOk ? fmt(bcv, 2) : '—'} ={' '}
              <b>{fmt(ejemploBs, 2)} Bs</b>, y se envían {fmt(ejemploBs, 2)} × {tasaOk ? fmtTasa(tasa) : '—'} ={' '}
              <b>{fmt(ejemploPesos)} pesos</b>.
            </div>

            <button type="submit" className="btn" disabled={!valido || descargando}>
              {descargando ? 'Generando…' : 'Descargar PNG'}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </section>

        <section className="preview">
          <div className="preview-frame" ref={marcoRef}>
            <div className="preview-scale" style={{ transform: `scale(${escala})` }}>
              <Flyer ref={flyerRef} tasa={tasa} bcv={bcv} telefono={telefono} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
