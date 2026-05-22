import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import { AuthContext } from "../../context/AuthContext";

const OperarioReportes = () => {
  const [historial, setHistorial] = useState([]);
  const user = { id: 3, nombre: "Juan Pérez" }; 


  const obtenerHistorial = async () => {
      try {
        console.log(user)
          const respuesta = await fetch(`http://localhost:5000/api/operario/dashboard/${user.id}`);
          const datos = await respuesta.json();
          setHistorial(datos.serie_estadistica || []);
      } catch (err) {
          setError(err.message);
      }             
  };

  obtenerHistorial();
    

  const exportarPDFReclamo = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("REPORTE HISTÓRICO DE PRODUCCIÓN INTERNA - PLANTA", 14, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Código Operario: ${user.id}`, 14, 30);
      doc.text(`Nombre Completo: ${user.nombre}`, 14, 36);
      doc.text(`Fecha de Impresión: ${new Date().toLocaleDateString()}`, 14, 42);
      doc.line(14, 46, 196, 46);

      const filasTabla = historial.map(item => [
        `Jornada: ${item.etiqueta}`,
        `${item.valor} unidades`
      ]);

      doc.autoTable({
        startY: 52,
        head: [['Fecha de Entrega (Día-Mes)', 'Cantidad de Rendimiento']],
        body: filasTabla,
        theme: 'striped',
        headStyles: { fillColor: [231, 76, 60], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
      });

      const nombreArchivo = user.nombre.replace(/s+/g, '_');
      doc.save(`HISTORIAL_PROD_${nombreArchivo}.pdf`);
    } catch (error) {
      console.error("Error crítico detallado:", error);
      alert("Fallo la generación. Revisa el error rojo en la consola (F12).");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Comprobantes</h2>
      <p className="text-gray-600 mb-6">Descarga tu historial de producción como respaldo.</p>
      
      <button 
        onClick={exportarPDFReclamo}
        className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
        style={estilos.botonPdf}
      >
        📄 Descargar Mi Comprobante (PDF)
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Tu Historial Reciente</h3>
        <table style={estilos.tabla}>
            <thead>
                <tr style={estilos.encabezadoTabla}>
                    <th style={estilos.celda}>Fecha / Jornada</th>
                    <th style={estilos.celda}>Prendas Confeccionadas</th>
                </tr>
            </thead>
            <tbody>
                {historial.map((item, index) => (
                    <tr key={index} style={index % 2 === 0 ? estilos.filaPar : estilos.filaImpar}>
                        <td style={estilos.celdaBody}>Día-Mes: {item.etiqueta}</td>
                        <td style={estilos.celdaBody}><strong>{item.valor} pzas.</strong></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
const estilos = {
    botonPdf: { backgroundColor: "#e74c3c", color: "#ffffff", border: "none", padding: "10px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
    tabla: { width: "100%", borderCollapse: "collapse", backgroundColor: "#ffffff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", borderRadius: "6px" },
    encabezadoTabla: { backgroundColor: "#2c3e50", color: "#ffffff", textAlign: "left" },
    celda: { padding: "12px 15px", fontWeight: "bold", fontSize: "14px" },
    celdaBody: { padding: "12px 15px", fontSize: "14px", borderBottom: "1px solid #f0f0f0" },
    filaPar: { backgroundColor: "#ffffff" },
    filaImpar: { backgroundColor: "#f9fbfd" }
};
export default OperarioReportes;












