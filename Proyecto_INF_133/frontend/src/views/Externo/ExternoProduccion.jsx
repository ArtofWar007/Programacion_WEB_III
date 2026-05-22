// views/Externo/ExternoProduccion.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ExternoProduccion = () => {
    const { user } = useContext(AuthContext);
    const [contratos, setContratos] = useState([]);
    const [idContrato, setIdContrato] = useState("");
    const [cantidadEnviada, setCantidadEnviada] = useState("");
    const [fechaEnvio, setFechaEnvio] = useState(new Date().toISOString().split('T')[0]); // Fecha de hoy por defecto
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        const cargarContratosDisponibles = async () => {
            try {
                const respuesta = await fetch(`http://localhost:5000/api/externo/dashboard/${user.id}`);
                const datos = await respuesta.json();
                setContratos(datos);
                if (datos.length > 0) setIdContrato(datos[0].id_contrato); // Selecciona el primero por defecto
            } catch (err) {
                console.error("Error al cargar contratos para el formulario:", err);
            }
        };
        if (user?.id) cargarContratosDisponibles();
    }, [user]);

    const handleEmitirDespacho = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        setProcesando(true);

        try {
            const respuesta = await fetch("http://localhost:5000/api/externo/despacho/enviar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_contrato: parseInt(idContrato),
                    cantidad_enviada: parseInt(cantidadEnviada),
                    fecha_envio: fechaEnvio
                })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) throw new Error(resultado.error || "No se pudo emitir la guía de despacho.");

            setMensaje(`✅ Guía emitida exitosamente. El cargamento textil se encuentra 'En Camino' a los almacenes de la planta.`);
            setCantidadEnviada("");
        } catch (err) {
            setError(err.message);
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>Área de Despachos y Logística Externa</h3>
                <p style={{ margin: 0, color: "#7f8c8d", fontSize: "14px" }}>
                    Registre las salidas físicas del taller para habilitar el control de conmutación del Supervisor.
                </p>
            </div>

            <div style={estilos.contenedorFormulario}>
                <h4 style={{ margin: "0 0 20px 0", color: "#34495e", borderBottom: "2px solid #3498db", paddingBottom: "5px" }}>
                    Nueva Guía de Despacho (Salida de Mercadería)
                </h4>

                {mensaje && <div style={estilos.alertaExito}>{mensaje}</div>}
                {error && <div style={estilos.alertaError}>{error}</div>}

                <form onSubmit={handleEmitirDespacho}>
                    <div style={estilos.grupoForm}>
                        <label style={estilos.etiqueta}>Seleccionar Contrato Marco de Destino:</label>
                        <select 
                            value={idContrato} 
                            onChange={(e) => setIdContrato(e.target.value)}
                            style={estilos.controlSelect}
                            required
                        >
                            {contratos.map(c => (
                                <option key={c.id_contrato} value={c.id_contrato}>
                                    Contrato #{c.id_contrato} - Lote: {c.LotePrenda?.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={estilos.grupoForm}>
                        <label style={estilos.etiqueta}>Cantidad de Prendas Confeccionadas a Enviar:</label>
                        <input 
                            type="number" 
                            value={cantidadEnviada}
                            onChange={(e) => setCantidadEnviada(e.target.value)}
                            placeholder="Ej. 500"
                            min="1"
                            required
                            style={estilos.controlInput}
                        />
                    </div>

                    <div style={estilos.grupoForm}>
                        <label style={estilos.etiqueta}>Fecha de Salida del Transporte:</label>
                        <input 
                            type="date" 
                            value={fechaEnvio}
                            onChange={(e) => setFechaEnvio(e.target.value)}
                            required
                            style={estilos.controlInput}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={procesando || contratos.length === 0} 
                        style={contratos.length === 0 ? {...estilos.boton, opacity: 0.5} : estilos.boton}
                    >
                        {procesando ? "Emitiendo Documento..." : "Despachar Cargamento ('En Camino')"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const estilos = {
    contenedorFormulario: {
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "8px",
        border: "1px solid #e5e8e8",
        maxWidth: "600px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
    },
    grupoForm: { marginBottom: "18px" },
    etiqueta: { display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px", color: "#2c3e50" },
    controlSelect: { width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #bdc3c7", backgroundColor: "#fff" },
    controlInput: { width: "100%", padding: "9px", borderRadius: "4px", border: "1px solid #bdc3c7", boxSizing: "border-box" },
    boton: {
        backgroundColor: "#3498db",
        color: "#ffffff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        width: "100%",
        marginTop: "10px"
    },
    alertaExito: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "4px", marginBottom: "15px", fontSize: "14px" },
    alertaError: { backgroundColor: "#f8d7da", color: "#721c24", padding: "12px", borderRadius: "4px", marginBottom: "15px", fontSize: "14px" }
};

export default ExternoProduccion;