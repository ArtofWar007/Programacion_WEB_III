// views/Externo/ExternoDashboard.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ExternoDashboard = () => {
    const { user } = useContext(AuthContext);
    const [contratos, setContratos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerDatosDashboard = async () => {
            try {
                if (!user?.id) return;

                const respuesta = await fetch(`http://localhost:5000/api/externo/dashboard/${user.id}`);
                if (!respuesta.ok) throw new Error("Error de red al sincronizar con la central de producción.");
                
                const datos = await respuesta.json();
                setContratos(datos);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        obtenerDatosDashboard();
    }, [user]);

    if (cargando) return <div style={{ padding: "30px", textAlign: "center" }}>Sincronizando estado de subcontratos de la microempresa...</div>;
    if (error) return <div style={{ padding: "30px", color: "#e74c3c" }}>❌ Error: {error}</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 5px 0" }}>Panel de Control Técnico - Taller Satélite</h2>
            <p style={{ color: "#7f8c8d", margin: "0 0 25px 0" }}>Órdenes de confección asignadas y flujo financiero privado.</p>

            {contratos.length === 0 ? (
                <div style={estilos.vacio}>Actualmente no registra contratos de lotes 'Activos' asignados a su razón social.</div>
            ) : (
                contratos.map((contrato) => (
                    <div key={contrato.id_contrato} style={estilos.tarjetaContrato}>
                        <div style={estilos.encabezadoContrato}>
                            <div>
                                {/* Sincronizado con la relación de la tabla lotes_prendas */}
                                <h4 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>
                                    {contrato.LotePrenda?.nombre_prenda || "Lote Textil en Proceso"}
                                </h4>
                                <span style={{ fontSize: "12px", color: "#95a5a6" }}>Código de Contrato: #{contrato.id_contrato} | Lote Macro: #{contrato.id_lote}</span>
                            </div>
                            <span style={estilos.badgeEstado}>{contrato.estado_contrato}</span>
                        </div>

                        <div style={estilos.grillaFinanciera}>
                            <div style={estilos.bloqueMonto}>
                                <span style={estilos.etiquetaMonto}>Prendas Encargadas</span>
                                <span style={estilos.valorMonto}>{contrato.cantidad_encargada} pzas.</span>
                            </div>
                            <div style={estilos.bloqueMonto}>
                                <span style={estilos.etiquetaMonto}>Pago Pactado Total</span>
                                <span style={{ ...estilos.valorMonto, color: "#27ae60" }}>{parseFloat(contrato.pago_pactado_total).toFixed(2)} BOB</span>
                            </div>
                            <div style={estilos.bloqueMonto}>
                                <span style={estilos.etiquetaMonto}>Adelanto en Cuenta (Deuda)</span>
                                <span style={{ ...estilos.valorMonto, color: "#c0392b" }}>{parseFloat(contrato.adelanto_otorgado).toFixed(2)} BOB</span>
                            </div>
                            <div style={estilos.bloqueMonto}>
                                <span style={estilos.etiquetaMonto}>Saldo Neto a Liquidar</span>
                                <span style={{ ...estilos.valorMonto, color: "#2980b9", fontWeight: "bold" }}>
                                    {(parseFloat(contrato.pago_pactado_total) - parseFloat(contrato.adelanto_otorgado)).toFixed(2)} BOB
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const estilos = {
    vacio: { padding: "30px", backgroundColor: "#fff", borderRadius: "8px", border: "1px dashed #bdc3c7", color: "#7f8c8d", textAlign: "center" },
    tarjetaContrato: { backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "20px", border: "1px solid #e5e8e8" },
    encabezadoContrato: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f2f4f4", paddingBottom: "15px", marginBottom: "20px" },
    badgeEstado: { backgroundColor: "#ebf5fb", color: "#2980b9", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" },
    grillaFinanciera: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", backgroundColor: "#fcfcfc", padding: "15px", borderRadius: "6px" },
    bloqueMonto: { display: "flex", flexDirection: "column" },
    etiquetaMonto: { fontSize: "11px", color: "#a6acaf", textTransform: "uppercase", fontWeight: "bold", marginBottom: "3px" },
    valorMonto: { fontSize: "18px", color: "#2c3e50" }
};

export default ExternoDashboard;