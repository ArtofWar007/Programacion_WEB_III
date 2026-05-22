// views/Supervisor/SuperDashboard.jsx
import { useState, useEffect } from "react";

const SuperDashboard = () => {
    const [pendientes, setPendientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");

    const cargarGuiasPendientes = async () => {
        try {
            const respuesta = await fetch("http://localhost:5000/api/supervisor/despachos/pendientes");
            const datos = await respuesta.json();
            setPendientes(datos);
        } catch (error) {
            console.error("Error cargando guías logísticas:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarGuiasPendientes();
    }, []);

    // 🔄 CONMUTADOR LOGÍSTICO: Recibir el camión/sacos y meterlos a almacén físico
    const handleRecibirGuia = async (id_despacho) => {
        try {
            const respuesta = await fetch(`http://localhost:5000/api/supervisor/despachos/recibir/${id_despacho}`, {
                method: "PATCH"
            });
            if (respuesta.ok) {
                setMensaje("✅ Cargamento ingresado al almacén físico de la planta.");
                cargarGuiasPendientes(); // Recarga la lista
            }
        } catch (error) {
            console.error("Error al conmutar guía:", error);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 5px 0" }}>Centro de Control de Planta</h2>
            <p style={{ color: "#7f8c8d", margin: "0 0 25px 0" }}>Monitoreo de rendimiento físico y recepción de mercancía.</p>

            {/* Tarjetas de Métricas Operativas (Sin valores financieros) */}
            <div style={estilos.contenedorTarjetas}>
                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #2980b9" }}>
                    <span style={estilos.etiquetaCard}>Estado de Operarios</span>
                    <h3 style={{ margin: 0, color: "#2980b9" }}>Planta Activa</h3>
                </div>
                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #8e44ad" }}>
                    <span style={estilos.etiquetaCard}>Cargamentos Externos En Ruta</span>
                    <h3 style={{ margin: 0, color: "#8e44ad" }}>{pendientes.length} Guías de Transporte</h3>
                </div>
            </div>

            {/* Bandeja de Entrada de Guías de Despacho (Muelle de Carga) */}
            <div style={{ marginTop: "30px" }}>
                <h4 style={{ color: "#34495e", marginBottom: "15px" }}>🚛 Recepción Logística: Camiones en Camino</h4>
                {mensaje && <div style={estilos.alertaExito}>{mensaje}</div>}
                
                {cargando ? (
                    <div>Sincronizando muelles de carga...</div>
                ) : pendientes.length === 0 ? (
                    <div style={estilos.vacio}>No hay camiones ni sacos de talleres satélites en ruta en este momento.</div>
                ) : (
                    <table style={estilos.tabla}>
                        <thead>
                            <tr style={{ backgroundColor: "#2c3e50", color: "#fff" }}>
                                <th style={estilos.celda}>ID Despacho</th>
                                <th style={estilos.celda}>Contrato Satélite</th>
                                <th style={estilos.celda}>Volumen de Prendas</th>
                                <th style={estilos.celda}>Fecha Envío</th>
                                <th style={estilos.celda}>Acción Operativa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendientes.map(guia => (
                                <tr key={guia.id_despacho} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                    <td style={estilos.celdaBody}>#{guia.id_despacho}</td>
                                    <td style={estilos.celdaBody}>Contrato #{guia.id_contrato}</td>
                                    <td style={estilos.celdaBody}><strong>{guia.cantidad_enviada} pzas.</strong></td>
                                    <td style={estilos.celdaBody}>{guia.fecha_envio}</td>
                                    <td style={estilos.celdaBody}>
                                        <button 
                                            onClick={() => handleRecibirGuia(guia.id_despacho)}
                                            style={estilos.botonRecibir}
                                        >
                                            📥 Validar e Ingresar a Planta
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const estilos = {
    contenedorTarjetas: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" },
    tarjeta: { backgroundColor: "#fff", padding: "20px", borderRadius: "6px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
    etiquetaCard: { fontSize: "11px", color: "#95a5a6", textTransform: "uppercase", fontWeight: "bold", display: "block", marginBottom: "5px" },
    vacio: { padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "6px", color: "#7f8c8d", textAlign: "center", border: "1px dashed #ccc" },
    tabla: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
    celda: { padding: "12px", textAlign: "left" },
    celdaBody: { padding: "12px", fontSize: "14px" },
    botonRecibir: { backgroundColor: "#27ae60", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" },
    alertaExito: { backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "14px" }
};

export default SuperDashboard;