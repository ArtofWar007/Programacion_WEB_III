// views/Admin/AdminReportes.jsx
import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminReportes = () => {
    const [reporteLote, setReporteLote] = useState(null);
    const [idLoteBuscar, setIdLoteBuscar] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const ejecutarLiquidacionCruzada = async (e) => {
        e.preventDefault();
        if (!idLoteBuscar) return;
        setCargando(true);
        setError("");
        setReporteLote(null);

        try {
            const res = await fetch(`http://localhost:5000/api/admin/reportes/liquidacion-cruzada/${idLoteBuscar}`);
            if (!res.ok) throw new Error("El lote no registra movimientos cargados o no existe.");
            
            const datos = await res.json();
            setReporteLote(datos);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    // 🔥 NUEVA FUNCIÓN: PDF DE AUDITORÍA MÁSTER
    const descargarPDFAdmin = () => {
        if (!reporteLote) return;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.textColor(44, 62, 80);
        doc.text("AUDITORÍA MÁSTER E INTELIGENCIA DE COSTOS", 14, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.textColor(127, 137, 141);
        doc.text(`Identificador de Lote Auditado: Lote #${idLoteBuscar}`, 14, 27);
        doc.text(`Fecha de Evaluación Analítica: ${new Date().toLocaleDateString()}`, 14, 33);
        doc.line(14, 37, 196, 37);

        // Tabla de Costos Desglosados
        doc.autoTable({
            startY: 42,
            head: [['Dimensión Operativa', 'Monto Invertido (BOB)']],
            body: [
                ['Inversión en Mano de Obra Interna (Planta)', `${reporteLote.mano_obra_planta_bob.toFixed(2)} BOB`],
                ['Inversión en Talleres Satélites (Contratos)', `${reporteLote.talleres_externos_bob.toFixed(2)} BOB`],
                ['Gastos Logísticos e Insumos Adicionales', `${reporteLote.logistica_insumos_bob.toFixed(2)} BOB`],
                ['COSTO TOTAL DE INVERSIÓN ACUMULADA', `${reporteLote.costo_total_lote_bob.toFixed(2)} BOB`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            styles: { fontStyle: 'bold' }
        });

        // Métricas de Eficiencia
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Métrica de Control', 'Valor Registrado']],
            body: [
                ['Volumen de Prendas Solicitadas', `${reporteLote.prendas_solicitadas} Unidades`],
                ['Costo Unitario Real por Prenda', `${reporteLote.costo_unitario_real.toFixed(2)} BOB / Unidad`]
            ],
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save(`AUDITORIA_LOTE_${idLoteBuscar}.pdf`);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h3 style={{ color: "#2c3e50", margin: "0 0 5px 0" }}>Auditoría Máster e Inteligencia de Costos</h3>
            <p style={{ color: "#7f8c8d", margin: "0 0 20px 0" }}>Cruza destajos internos, contratos externos y logística para obtener costos unitarios reales.</p>

            <form onSubmit={ejecutarLiquidacionCruzada} style={estilos.buscador}>
                <input 
                    type="number" 
                    placeholder="Introduce el ID del Lote a auditar (Ej: 1)" 
                    value={idLoteBuscar}
                    onChange={(e) => setIdLoteBuscar(e.target.value)}
                    style={estilos.inputBuscador}
                />
                <button type="submit" style={estilos.botonBuscar}>Calcular Costos</button>
            </form>

            {cargando && <p>Calculando matrices analíticas...</p>}
            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            {reporteLote && (
                <div style={estilos.contenedorReporte}>
                    <div style={estilos.cabeceraReporte}>
                        <span>RESULTADOS DE LIQUIDACIÓN: LOTE #{idLoteBuscar}</span>
                        <button onClick={descargarPDFAdmin} style={{ ...estilos.botonBuscar, backgroundColor: "#e74c3c" }}>
                            📄 Exportar Informe PDF
                        </button>
                    </div>

                    <div style={estilos.cuerpoAnalisis}>
                        <p><strong>Mano de Obra (Planta):</strong> {reporteLote.mano_obra_planta_bob.toFixed(2)} BOB</p>
                        <p><strong>Talleres Externos:</strong> {reporteLote.talleres_externos_bob.toFixed(2)} BOB</p>
                        <p><strong>Logística e Insumos:</strong> {reporteLote.logistica_insumos_bob.toFixed(2)} BOB</p>
                        <hr style={{ border: "0", borderTop: "1px solid #eee" }} />
                        <h4 style={{ color: "#2c3e50" }}>Inversión Total Acumulada: {reporteLote.costo_total_lote_bob.toFixed(2)} BOB</h4>
                        <p>Cantidad Solicitada en Lote: {reporteLote.prendas_solicitadas} pzas.</p>
                        <h2 style={{ margin: "5px 0 0 0", color: "#2c3e50" }}>
                            {reporteLote.costo_unitario_real.toFixed(2)} BOB <span style={{ fontSize: "16px", color: "#95a5a6" }}>por prenda terminada</span>
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

const estilos = {
    buscador: { display: "flex", gap: "15px", marginBottom: "25px", maxWidth: "600px" },
    inputBuscador: { flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #bdc3c7" },
    botonBuscar: { backgroundColor: "#2c3e50", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" },
    contenedorReporte: { backgroundColor: "#fff", border: "1px solid #e5e8e8", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" },
    cabeceraReporte: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #34495e", paddingBottom: "10px", marginBottom: "20px", color: "#2c3e50", fontWeight: "bold" },
    cuerpoAnalisis: { color: "#34495e", lineHeight: "1.8" }
};

export default AdminReportes;