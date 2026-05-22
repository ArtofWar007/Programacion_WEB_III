// views/Admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import PoligonoFrecuencia from "../../components/PoligonoFrecuencia";

/**
 * AdminDashboard: Panel de control financiero para la Administración General.
 * Realiza la carga asíncrona de métricas y renderiza el análisis gráfico de costos.
 */
const AdminDashboard = () => {
    const [metricas, setMetricas] = useState({ 
        flujo_caja_bob: 0, 
        deudas_adelantos_bob: 0, 
        inversion_total_bob: 0 
    });
    const [datosGrafico, setDatosGrafico] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Obtención de datos financieros desde el API local
    useEffect(() => {
        const obtenerMetricasMacro = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/admin/dashboard/financiero");
                const datos = await res.json();
                
                setMetricas(datos);
                setDatosGrafico(datos.grafico_lotes || []);
            } catch (error) {
                console.error("Error al sincronizar finanzas macro:", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerMetricasMacro();
    }, []);

    // Estado de carga mientras se consultan los servicios
    if (cargando) {
        return <div style={{ padding: "30px" }}>Calculando estados financieros globales...</div>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <h2 style={{ color: "#2c3e50", margin: "0 0 5px 0" }}>Panel de Control Financiero Macro</h2>
            <p style={{ color: "#7f8c8d", margin: "0 0 25px 0" }}>Vista corporativa exclusiva para la Administración General.</p>

            {/* Panel de métricas clave */}
            <div style={estilos.grillaMetricas}>
                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #2ecc71" }}>
                    <span style={estilos.etiqueta}>Flujo de Caja Disponible</span>
                    <h3 style={{ ...estilos.monto, color: "#27ae60" }}>{metricas.flujo_caja_bob.toFixed(2)} BOB</h3>
                </div>

                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #e67e22" }}>
                    <span style={estilos.etiqueta}>Deudas de Adelantos (En Planta)</span>
                    <h3 style={{ ...estilos.monto, color: "#d35400" }}>{metricas.deudas_adelantos_bob.toFixed(2)} BOB</h3>
                </div>

                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #2980b9" }}>
                    <span style={estilos.etiqueta}>Inversión Total en Producción</span>
                    <h3 style={{ ...estilos.monto, color: "#2980b9" }}>{metricas.inversion_total_bob.toFixed(2)} BOB</h3>
                </div>
            </div>

            {/* Sección de análisis gráfico */}
            <div style={{ marginTop: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "8px", backgroundColor: "#fff", padding: "10px" }}>
                <div style={{ padding: "15px 20px 0 20px" }}>
                    <h4 style={{ margin: 0, color: "#34495e" }}>Distribución de Capital Invertido</h4>
                    <p style={{ margin: "4px 0 0 0", color: "#95a5a6", fontSize: "13px" }}>
                        Comparativa analítica del costo total acumulado por lote de confección (Mano de obra + Insumos + Satélites)
                    </p>
                </div>
                
                {/* Reutilización del componente PoligonoFrecuencia */}
                <PoligonoFrecuencia datos={datosGrafico} />
            </div>
        </div>
    );
};

const estilos = {
    grillaMetricas: { 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "25px" 
    },
    tarjeta: { 
        backgroundColor: "#fff", 
        padding: "25px", 
        borderRadius: "8px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)" 
    },
    etiqueta: { 
        fontSize: "12px", 
        color: "#95a5a6", 
        textTransform: "uppercase", 
        fontWeight: "bold", 
        display: "block", 
        marginBottom: "8px" 
    },
    monto: { 
        margin: 0, 
        fontSize: "26px", 
        fontWeight: "bold" 
    }
};

export default AdminDashboard;