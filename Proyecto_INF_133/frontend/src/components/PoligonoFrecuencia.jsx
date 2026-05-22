// src/components/PoligonoFrecuencia.jsx
import React from "react";

/**
 * PoligonoFrecuencia: Grafica el rendimiento de piezas mediante un polígono SVG.
 * Recibe 'datos' con formato [{ etiqueta: string, valor: number }].
 */
const PoligonoFrecuencia = ({ datos = [] }) => {
  
  // Validar estado de carga o ausencia de datos
  if (!datos || datos.length === 0) {
    return (
      <div style={estilos.tarjeta}>
        <h3 style={estilos.titulo}>Polígono de Frecuencias (Rendimiento)</h3>
        <p style={{ ...estilos.subtitulo, margin: "20px 0", textAlign: "center", color: "#7f8c8d" }}>
          No se registran costuras o piezas entregadas en esta semana laboral todavía.
        </p>
      </div>
    );
  }

  // Constantes de diseño SVG
  const anchoContenedor = 500;
  const altoContenedor = 300;
  const margen = 40;

  // Cálculo de valor máximo para escalamiento del eje Y
  const valores = datos.map((d) => Number(d.valor) || 0);
  const maxTemporal = Math.max(...valores);
  const valorMaximo = maxTemporal === 0 ? 100 : maxTemporal;

  // Cálculo de coordenadas (mapeo al sistema de coordenadas SVG)
  const puntos = datos.map((d, index) => {
    const x = datos.length > 1 
      ? margen + (index * (anchoContenedor - margen * 2)) / (datos.length - 1)
      : anchoContenedor / 2;
    const y = altoContenedor - margen - ((Number(d.valor) || 0) * (altoContenedor - margen * 2)) / valorMaximo;
    return { x, y, etiqueta: d.etiqueta, valor: d.valor };
  });

  const stringPuntos = puntos.map((p) => `${p.x},${p.y}`).join(" ");
  const stringArea = `${puntos[0].x},${altoContenedor - margen} ${stringPuntos} ${puntos[puntos.length - 1].x},${altoContenedor - margen}`;

  return (
    <div style={estilos.tarjeta}>
      <h3 style={estilos.titulo}>Polígono de Frecuencias (Rendimiento)</h3>
      <p style={estilos.subtitulo}>Monitoreo de avance de piezas de costura por jornada</p>

      <div style={estilos.contenedorGrafico}>
        <svg width="100%" height="100%" viewBox={`0 0 ${anchoContenedor} ${altoContenedor}`}>
          {/* Rejilla de referencia */}
          {[0, 0.25, 0.5, 0.75, 1].map((porcentaje, i) => {
            const y = margen + porcentaje * (altoContenedor - margen * 2);
            const valorLinea = Math.round(valorMaximo * (1 - porcentaje));
            return (
              <g key={i}>
                <line x1={margen} y1={y} x2={anchoContenedor - margen} y2={y} style={estilos.lineaGuia} />
                <text x={margen - 10} y={y + 4} style={estilos.textoEjeY}>{valorLinea}</text>
              </g>
            );
          })}

          <polygon points={stringArea} style={estilos.areaSombreada} />
          <polyline points={stringPuntos} style={estilos.lineaPoligono} />

          {/* Nodos y etiquetas */}
          {puntos.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" style={estilos.puntoNodo} />
              <text x={p.x} y={p.y - 10} style={estilos.textoValor}>{p.valor}</text>
              <text x={p.x} y={altoContenedor - margen + 20} style={estilos.textoEjeX}>{p.etiqueta}</text>
            </g>
          ))}

          {/* Ejes X e Y */}
          <line x1={margen} y1={altoContenedor - margen} x2={anchoContenedor - margen} y2={altoContenedor - margen} style={estilos.ejeAxe} />
          <line x1={margen} y1={margen} x2={margen} y2={altoContenedor - margen} style={estilos.ejeAxe} />
        </svg>
      </div>
    </div>
  );
};

const estilos = {
  tarjeta: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontFamily: "sans-serif" },
  titulo: { margin: "0 0 5px 0", color: "#2c3e50" },
  subtitulo: { margin: "0 0 20px 0", color: "#95a5a6", fontSize: "13px" },
  contenedorGrafico: { width: "100%", height: "300px" },
  lineaGuia: { stroke: "#e0e0e0", strokeWidth: 1, strokeDasharray: "4 4" },
  ejeAxe: { stroke: "#7f8c8d", strokeWidth: 2 },
  lineaPoligono: { fill: "none", stroke: "#27ae60", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }, // Cambiado a verde para hacer juego con ganancias
  areaSombreada: { fill: "#27ae60", opacity: 0.12 },
  puntoNodo: { fill: "#fff", stroke: "#219a52", strokeWidth: 3 },
  textoEjeY: { textAnchor: "end", fontSize: "11px", fill: "#7f8c8d" },
  textoEjeX: { textAnchor: "middle", fontSize: "12px", fill: "#2c3e50", fontWeight: "bold" },
  textoValor: { textAnchor: "middle", fontSize: "11px", fill: "#219a52", fontWeight: "bold" }
};

export default PoligonoFrecuencia;