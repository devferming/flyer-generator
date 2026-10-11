# Generador de Flyer · Tasa del día

App en React + Vite que genera el flyer "Envía dinero a Venezuela" en PNG (1080×1920) a partir de:

- **Dólar BCV del día** (ej. `876,79`)
- **Tasa de cambio** en pesos por bolívar (ej. `3,4`)
- **WhatsApp de contacto** (opcional)

## Cálculos

- **Recibe (Bs)** = pesos enviados ÷ tasa → `100.000 ÷ 3,4 = 29.412 Bs`
- **Equivalente en USD BCV** = bolívares ÷ precio BCV → `29.412 ÷ 876,79 = 33,5`

Los montos van de 10.000 a 200.000 pesos (se cambian en `src/utils.js`, constante `MONTOS`).

## Uso local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Despliegue en Netlify

`netlify.toml` ya está configurado: comando `npm run build`, carpeta `dist`.

## Estructura

- `src/App.jsx` – formulario, vista previa y descarga (html-to-image)
- `src/Flyer.jsx` / `src/Flyer.css` – diseño del flyer
- `src/graphics.jsx` – banderas SVG e íconos
- `src/utils.js` – lectura de números ("876,79" o "876.79"), formato y cálculos
