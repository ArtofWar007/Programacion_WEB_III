// views/Operario/OperarioDashboard.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import PoligonoFrecuencia from "../../components/PoligonoFrecuencia";

const OperarioDashboard = () => {
    const { user } = useContext(AuthContext);
    const [resumen, setResumen] = useState({ total_ganado_bob: 0, total_adelantos_bob: 0, saldo_a_cobrar_bob: 0 });
    const [serieEstadistica, setSerieEstadistica] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerDatosDashboard = async () => {
            try {
                // Consumimos el endpoint especializado del operario que creamos en el backend
                const respuesta = await fetch(`http://localhost:5000/api/operario/dashboard/${user.id}`);
                if (!respuesta.ok) {
                    throw new Error("No se pudo sincronizar la información con el servidor.");
                }
                const datos = await respuesta.json();
                
                setResumen(datos.resumen_financiero);
                setSerieEstadistica(datos.serie_estadistica);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        if (user?.id) {
            obtenerDatosDashboard();
        }
    }, [user]);

    
    if (cargando) return <div style={{ padding: "30px", textAlign: "center" }}>Sincronizando planillas del operario...</div>;
    if (error) return <div style={{ padding: "30px", color: "red" }}>Error: {error}</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            {/* Cabecera del Panel */}
            <div style={{ marginBottom: "25px" }}>
                <h2 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>¡Bienvenido, {user.nombre}!</h2>
                <p style={{ margin: 0, color: "#7f8c8d" }}>Rol: Confección en Planta (Operario)</p>
            </div>

            {/* Bloque Financiero en Línea (Tarjetas de Control) */}
            <div style={estilos.contenedorTarjetas}>
                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #27ae60" }}>
                    <span style={estilos.subtituloTarjeta}>Total Ganado Acumulado</span>
                    <h3 style={{ ...estilos.monto, color: "#27ae60" }}>{resumen.total_ganado_bob} BOB</h3>
                </div>

                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #e74c3c" }}>
                    <span style={estilos.subtituloTarjeta}>Adelantos Recibidos (Caja)</span>
                    <h3 style={{ ...estilos.monto, color: "#e74c3c" }}>{resumen.total_adelantos_bob} BOB</h3>
                </div>

                <div style={{ ...estilos.tarjeta, borderLeft: "5px solid #f39c12" }}>
                    <span style={estilos.subtituloTarjeta}>Saldo Neto a Cobrar</span>
                    <h3 style={{ ...estilos.monto, color: "#f39c12" }}>{resumen.saldo_a_cobrar_bob} BOB</h3>
                </div>
            </div>

            {/* 🛠️ CONTENEDOR VISUAL CORREGIDO PARA EL GRÁFICO DEL OPERARIO */}
            <div style={{ 
                marginTop: "35px", 
                backgroundColor: "#ffffff", 
                borderRadius: "8px", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                padding: "20px"
            }}>
                <div style={{ marginBottom: "15px" }}>
                    <h4 style={{ margin: 0, color: "#2c3e50" }}>Historial de Rendimiento Diario</h4>
                    <p style={{ margin: "2px 0 0 0", color: "#95a5a6", fontSize: "13px" }}>Curva de prendas de vestir entregadas por jornada laboral activa.</p>
                </div>
                
                {/* El componente SVG ahora se adaptará al ancho del contenedor blanco de forma fluida */}
                <div style={{ width: "100%", overflowX: "auto" }}>
                    <PoligonoFrecuencia datos={serieEstadistica} />
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedorTarjetas: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
    },
    tarjeta: {
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "6px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column"
    },
    subtituloTarjeta: {
        fontSize: "13px",
        color: "#95a5a6",
        textTransform: "uppercase",
        fontWeight: "bold",
        marginBottom: "5px"
    },
    monto: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "bold"
    }
};

export default OperarioDashboard;