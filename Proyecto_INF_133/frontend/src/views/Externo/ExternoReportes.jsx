// src/views/Externo/ExternoReportes.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExternoReportes = () => {
    const { user } = useContext(AuthContext);
    const [historialContratos, setHistorialContratos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerHistorialCerrado = async () => {
            try {
                const respuesta = await fetch(`http://localhost:5000/api/externo/dashboard/${user.id}`);
                if (!respuesta.ok) throw new Error("No se pudo conectar con el servidor central.");
                const datos = await respuesta.json();
                setHistorialContratos(datos);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        if (user?.id) obtenerHistorialCerrado();
    }, [user]);

    // 🔥 EXPORTACIÓN PDF TALLER SATÉLITE
    const descargarPDFContratosExternos = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.textColor(41, 128, 185);
        doc.text("ESTADO DE CONTRATOS Y TRABAJOS EXTERNOS (SATÉLITE)", 14, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`Razón Social Taller: ${user.nombre}`, 14, 28);
        doc.text(`Fecha del Listado: ${new Date().toLocaleDateString()}`, 14, 34);
        doc.line(14, 38, 196, 38);

        const filas = historialContratos.map(c => [
            `Contrato #${c.id_contrato}`,
            `Lote #${c.id_lote}`,
            `${c.cantidad_encargada} pzas`,
            `${parseFloat(c.pago_pactado_total).toFixed(2)} BOB`,
            c.estado_contrato
        ]);

        doc.autoTable({
            startY: 42,
            head: [['Nº Contrato', 'Lote Vinculado', 'Cantidad Encargada', 'Presupuesto Pactado', 'Estado']],
            body: filas,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save(`MIS_CONTRATOS_TEXTILES.pdf`);
    };

    if (cargando) return <div style={{ padding: "20px" }}>Cargando archivo histórico de contratos...</div>;
    if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <h3 style={{ color: "#2c3e50", margin: "0 0 5px 0" }}>Historial de Contratos Externos</h3>
                    <p style={{ color: "#7f8c8d", margin: 0 }}>Archivo de lotes asignados a tu taller por la administración central.</p>
                </div>
                <button onClick={descargarPDFContratosExternos} style={{ backgroundColor: "#2980b9", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                    📄 Exportar Contratos PDF
                </button>
            </div>

            {historialContratos.length === 0 ? (
                <div style={estilos.vacio}>No registras ningún contrato asignado en el sistema central.</div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={estilos.tabla}>
                        <thead>
                            <tr style={{ backgroundColor: "#34495e", color: "#fff" }}>
                                <th style={estilos.celda}>ID Contrato</th>
                                <th style={estilos.celda}>Lote</th>
                                <th style={estilos.celda}>Cantidad Encargada</th>
                                <th style={estilos.celda}>Pago Pactado</th>
                                <th style={estilos.celda}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historialContratos.map((contrato, index) => (
                                <tr key={index} style={index % 2 === 0 ? estilos.filaPar : estilos.filaImpar}>
                                    <td style={estilos.celdaBody}>Contrato #{contrato.id_contrato}</td>
                                    <td style={estilos.celdaBody}><strong>Lote #{contrato.id_lote}</strong></td>
                                    <td style={estilos.celdaBody}>{contrato.cantidad_encargada} pzas.</td>
                                    <td style={estilos.celdaBody}>{parseFloat(contrato.pago_pactado_total).toFixed(2)} BOB</td>
                                    <td style={estilos.celdaBody}>
                                        <span style={estilos.badgeCerrado}>{contrato.estado_contrato}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const estilos = {
    tabla: { width: "100%", borderCollapse: "collapse", backgroundColor: "#ffffff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", borderRadius: "6px" },
    celda: { padding: "12px 15px", textAlign: "left", fontWeight: "bold", fontSize: "14px" },
    celdaBody: { padding: "12px 15px", fontSize: "14px", borderBottom: "1px solid #f0f0f0" },
    filaPar: { backgroundColor: "#ffffff" },
    filaImpar: { backgroundColor: "#f9fbfd" },
    badgeCerrado: { backgroundColor: "#d4efdf", color: "#196f3d", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" },
    vacio: { backgroundColor: "#fff", padding: "20px", borderRadius: "6px", textAlign: "center", color: "#7f8c8d" }
};

export default ExternoReportes;