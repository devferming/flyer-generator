import { forwardRef } from 'react'
import { calcularFilas, fmt, fmtTasa } from './utils.js'
import {
  WavyFlag,
  VE_STRIPES,
  CO_STRIPES,
  StopwatchIcon,
  ShieldIcon,
  BoltIcon,
  GlobeIcon,
  ChatPhoneIcon,
  HeartIcon,
  CurvedArrow,
  Swoosh,
  Sparks,
} from './graphics.jsx'
import './Flyer.css'

const BADGES = [
  { Icon: ShieldIcon, title: 'SEGURO', sub: 'Y CONFIABLE' },
  { Icon: BoltIcon, title: 'RÁPIDO', sub: 'Y EFICIENTE' },
  { Icon: GlobeIcon, title: 'TU FAMILIA', sub: 'SIEMPRE CERCA' },
]

// Tamaño de letra que hace caber un texto en un ancho dado (aprox. para Poppins Black)
function fitSize(text, maxWidth, maxSize, ratio = 0.62) {
  const len = Math.max(1, String(text).length)
  return Math.min(maxSize, Math.floor(maxWidth / (len * ratio)))
}

const Flyer = forwardRef(function Flyer({ tasa, bcv, telefono }, ref) {
  const filas = calcularFilas(tasa, bcv)
  const tasaTxt = fmtTasa(tasa)
  const bcvTxt = '$' + fmt(bcv, 2)
  const tel = telefono?.trim() || ''

  return (
    <div className="fl" ref={ref}>
      <div className="fl-bg" />
      <div className="fl-beams" />

      {/* ---------- Encabezado ---------- */}
      <div className="fl-tag">
        <StopwatchIcon size={62} />
        <span>TASA DEL DÍA</span>
      </div>
      <Sparks className="fl-sparks-top" size={84} />

      <div className="fl-head-row">
        <div className="fl-rate">
          <span style={{ fontSize: fitSize(tasaTxt, 330, 190, 0.55) }}>{tasaTxt}</span>
        </div>
        <div className="fl-bcv">
          <div className="fl-bcv-label">BCV</div>
          <div className="fl-bcv-value" style={{ fontSize: fitSize(bcvTxt, 280, 72, 0.58) }}>
            {bcvTxt}
          </div>
          <Swoosh width={250} thick={6} className="fl-bcv-swoosh" />
        </div>
      </div>

      <div className="fl-script fl-slogan">
        <div>Tu dinero</div>
        <div>llega seguro</div>
        <Swoosh width={300} thick={7} className="fl-slogan-swoosh" />
      </div>

      {/* ---------- Banner ---------- */}
      <div className="fl-banner">
        <div className="fl-banner-small">ENVÍA DINERO A</div>
        <div className="fl-banner-big">VENEZUELA</div>
      </div>
      <WavyFlag id="ve-top" stripes={VE_STRIPES} stars width={230} height={165} amp={10} phase={0.4} className="fl-flag fl-flag-ve" />
      <WavyFlag id="co-top" stripes={CO_STRIPES} width={230} height={165} amp={10} phase={2.2} className="fl-flag fl-flag-co" />

      {/* ---------- Cintas inferiores ---------- */}
      <WavyFlag id="ve-bl" stripes={VE_STRIPES} stars width={420} height={150} amp={14} phase={1} className="fl-ribbon fl-ribbon-left" />
      <WavyFlag id="ve-br" stripes={VE_STRIPES} stars width={420} height={150} amp={14} phase={2.6} className="fl-ribbon fl-ribbon-right" />

      {/* ---------- Tabla ---------- */}
      <div className="fl-table">
        <div className="fl-thead">
          <div className="fl-th fl-th-usd">
            <span>DÓLARES</span>
            <small>BCV</small>
          </div>
          <div className="fl-th fl-th-cop">
            <span>PESOS</span>
            <small>ENVÍAS</small>
          </div>
          <div className="fl-th fl-th-ves">
            <span>BOLÍVARES</span>
            <small>RECIBEN</small>
          </div>
        </div>
        <div className="fl-tbody">
          {filas.map((f, i) => (
            <div className={'fl-tr' + (i % 2 ? ' odd' : '')} key={f.usd}>
              <div className="fl-td fl-td-usd">${fmt(f.usd)}</div>
              <div className="fl-td fl-td-cop">{fmt(f.pesos)}</div>
              <div className="fl-td fl-td-ves">{fmt(f.bs, 2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Columna izquierda ---------- */}
      <div className="fl-badges">
        {BADGES.map(({ Icon, title, sub }) => (
          <div className="fl-badge" key={title}>
            <div className="fl-badge-circle">
              <Icon size={62} />
            </div>
            <div className="fl-badge-title">{title}</div>
            <div className="fl-badge-sub">{sub}</div>
            <Swoosh width={150} thick={5} />
          </div>
        ))}
      </div>

      {/* ---------- Columna derecha ---------- */}
      <CurvedArrow className="fl-arrow" width={100} height={135} />
      <div className="fl-script fl-close">
        <div className="w">Más</div>
        <div className="y">cerca</div>
        <div className="w">de los</div>
        <div className="y big">tuyos</div>
      </div>
      <div className="fl-heart">
        <HeartIcon size={66} />
      </div>

      {/* ---------- Contacto ---------- */}
      {tel && (
        <div className="fl-contact">
          <Sparks className="fl-sparks-l" size={80} />
          <div className="fl-chat">
            <ChatPhoneIcon size={118} />
          </div>
          <div className="fl-contact-pill">CONTÁCTANOS</div>
          <div className="fl-contact-box">
            <span style={{ fontSize: fitSize(tel, 600, 92, 0.6) }}>{tel}</span>
          </div>
          <Sparks className="fl-sparks-r" size={80} />
        </div>
      )}

      {/* ---------- Pie ---------- */}
      <div className="fl-footer">
        <i />
        <span>RÁPIDO&nbsp;&nbsp;•&nbsp;&nbsp;SEGURO&nbsp;&nbsp;•&nbsp;&nbsp;CONFIABLE</span>
        <i />
      </div>
    </div>
  )
})

export default Flyer
