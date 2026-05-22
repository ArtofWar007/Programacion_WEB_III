// src/views/Supervisor/SuperProduccion.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SuperProduccion = () => {
    const { user } = useContext(AuthContext);
    const [operarios, setOperarios] = useState([]);
    const [lotesDisponibles, setLotesDisponibles] = useState([]); // Nuevo Estado
    
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const [idOperarioSel, setIdOperarioSel] = useState("");
    const [idLote, setIdLote] = useState(""); 
    const [prendas, setPrendas] = useState("");
    const [adelanto, setAdelanto] = useState("0");
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [mensaje, setMensaje] = useState("");

    const cargarDatosIniciales = async () => {
        try {
            // 1. Obtener Operarios
            const res = await fetch("http://localhost:5000/api/supervisor/operarios");
            const datos = await res.json();
            setOperarios(datos);
            if(datos.length > 0) setIdOperarioSel(datos[0].id);

            // 2. Obtener Lotes del Administrador para evitar errores tipográficos
            const resLotes = await fetch("http://localhost:5000/api/admin/lotes");
            const datosLotes = await resLotes.json();
            setLotesDisponibles(datosLotes);
            if(datosLotes.length > 0) setIdLote(datosLotes[0].id_lote);
        } catch (error) {
            console.error("Error al cargar datos iniciales:", error);
        }
    };

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const handleCrearOperario = async (e) => {
        e.preventDefault();
        setMensaje("");
        try {
            const res = await fetch("http://localhost:5000/api/supervisor/operarios/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, correo, password })
            });
            if(res.ok) {
                setMensaje("✅ Operario dado de alta correctamente.");
                setNombre(""); setCorreo(""); setPassword("");
                cargarDatosIniciales();
            }
        } catch (err) {
            setMensaje("❌ Error al procesar alta de operario.");
        }
    };

    const handleCierreDiario = async (e) => {
        e.preventDefault();
        setMensaje("");
        try {
            const res = await fetch("http://localhost:5000/api/supervisor/planta/cierre-diario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_operario: Number(idOperarioSel),
                    id_lote: Number(idLote),
                    id_supervisor: user.id,
                    prendas_entregadas: Number(prendas),
                    adelanto_dinero: parseFloat(adelanto),
                    fecha
                })
            });
            if(res.ok) {
                setMensaje("🚀 Boleta diaria consolidada con éxito.");
                setPrendas(""); setAdelanto("0");
            }
        } catch (err) {
            setMensaje("❌ Fallo crítico al subir la boleta.");
        }
    };

    return (
        <div style={{ fontFamily: "sans-serif" }}>
            <h2>Gestión de Operarios y Planta Textil</h2>
            {mensaje && <div style={{ padding: "10px", backgroundColor: "#ebf5fb", marginBottom: "15px", borderRadius: "4px" }}>{mensaje}</div>}
            
            <div style={estilos.contenedorSecciones}>
                {/* FORM 1 */}
                <div style={estilos.columna}>
                    <h3 style={estilos.tituloSeccion}>Alta de Personal de Costura</h3>
                    <form onSubmit={handleCrearOperario}>
                        <label style={estilos.label}>Nombre Completo:</label>
                        <input type="text" value={nombre} onChange={e=>setNombre(e.target.value)} required style={estilos.input} />
                        <label style={estilos.label}>Correo Corporativo:</label>
                        <input type="email" value={correo} onChange={e=>setCorreo(e.target.value)} required style={estilos.input} />
                        <label style={estilos.label}>Contraseña de Acceso:</label>
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={estilos.input} />
                        <button type="submit" style={estilos.botonAzul}>Registrar Operario</button>
                    </form>
                </div>

                {/* FORM 2 - CORREGIDO CON SELECT DINÁMICO */}
                <div style={estilos.columna}>
                    <h3 style={estilos.tituloSeccion}>Asentar Cierre Diario (Destajo)</h3>
                    <form onSubmit={handleCierreDiario}>
                        <label style={estilos.label}>Seleccionar Operario:</label>
                        <select value={idOperarioSel} onChange={e=>setIdOperarioSel(e.target.value)} style={estilos.input}>
                            {operarios.map(op => <option key={op.id} value={op.id}>{op.nombre}</option>)}
                        </select>

                        <label style={estilos.label}>Lote de Trabajo Asociado:</label>
                        <select value={idLote} onChange={e=>setIdLote(e.target.value)} style={estilos.input}>
                            {lotesDisponibles.map(lot => (
                                <option key={lot.id_lote} value={lot.id_lote}>
                                    {lot.descripcion} ({lot.precio_destajo} BOB/pza)
                                </option>
                            ))}
                        </select>

                        <label style={estilos.label}>Prendas Confeccionadas hoy:</label>
                        <input type="number" value={prendas} onChange={e=>setPrendas(e.target.value)} required style={estilos.input} />
                        <label style={estilos.label}>Adelanto en Efectivo (BOB):</label>
                        <input type="number" value={adelanto} onChange={e=>setAdelanto(e.target.value)} required style={estilos.input} />
                        <label style={estilos.label}>Fecha Contable:</label>
                        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required style={estilos.input} />
                        <button type="submit" style={estilos.botonVerde}>Consolidar Boleta</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedorSecciones: { display: "flex", gap: "30px", flexWrap: "wrap" },
    columna: { flex: 1, minWidth: "300px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.03)" },
    tituloSeccion: { margin: "0 0 15px 0", color: "#34495e", borderBottom: "2px solid #3498db", paddingBottom: "5px" },
    input: { width: "100%", padding: "10px", margin: "5px 0 12px 0", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" },
    label: { fontWeight: "bold", fontSize: "13px", color: "#2c3e50" },
    botonAzul: { backgroundColor: "#2980b9", color: "#fff", border: "none", padding: "10px", width: "100%", borderRadius: "#4px", cursor: "pointer", fontWeight: "bold" },
    botonVerde: { backgroundColor: "#27ae60", color: "#fff", border: "none", padding: "12px", width: "100%", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }
};

export default SuperProduccion;