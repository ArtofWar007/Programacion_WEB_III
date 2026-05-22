import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importación directa (inyecta autoTable en jsPDF)

const SuperReportes = () => {
  const [partesProduccion] = useState([
    { id: 101, operario: 'Carlos Mendoza', lote: 'L-5001', cantidad: 150, estado: 'Aprobado' },
    { id: 102, operario: 'Ana Torres', lote: 'L-5002', cantidad: 80, estado: 'Revisión' },
    { id: 103, operario: 'Taller Sur', lote: 'L-5003', cantidad: 300, estado: 'Aprobado' }
  ]);

  const descargarParteSupervisor = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("REPORTE GENERAL DE PRODUCCIÓN - SUPERVISOR", 14, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 28);
      doc.line(14, 32, 196, 32);

      const filas = partesProduccion.map(p => [
        p.id.toString(), 
        p.operario, 
        p.lote, 
        `${p.cantidad} pzas`, 
        p.estado
      ]);

      // Al importar 'jspdf-autotable' directamente, doc.autoTable ya existe
      doc.autoTable({
        startY: 38,
        head: [['ID Registro', 'Operario / Taller', 'Lote Asignado', 'Cantidad', 'Auditoría']],
        body: filas,
        theme: 'grid',
        headStyles: { fillColor: [230, 126, 34], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      });

      doc.save("Reporte_Supervision_Planta.pdf");
    } catch (error) {
      console.error("Error crítico detallado:", error);
      alert("Fallo la generación. Revisa el error rojo en la consola (F12).");
    }
  };

      return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <h3 style={{ color: "#2c3e50", margin: "0 0 5px 0" }}>Hojas de Control de Piso y Planta</h3>
                    <p style={{ color: "#7f8c8d", margin: 0 }}>Registro de volúmenes físicos aprobados y camiones recibidos en tu turno.</p>
                </div>
                <button onClick={descargarParteSupervisor} style={{ backgroundColor: "#e67e22", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                    📄 Descargar Parte Diario PDF
                </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#2c3e50", color: "#fff", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>ID</th>
                        <th style={{ padding: "12px" }}>Estación / Origen</th>
                        <th style={{ padding: "12px" }}>Lote</th>
                        <th style={{ padding: "12px" }}>Cantidad</th>
                        <th style={{ padding: "12px" }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {partesProduccion.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "12px" }}>{p.id}</td>
                            <td style={{ padding: "12px" }}><strong>{p.operario}</strong></td>
                            <td style={{ padding: "12px" }}>{p.lote}</td>
                            <td style={{ padding: "12px" }}>{p.cantidad} pzas.</td>
                            <td style={{ padding: "12px", color: p.estado === "Aprobado" ? "green" : "orange" }}>• {p.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



export default SuperReportes;