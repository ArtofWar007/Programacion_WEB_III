// views/Admin/AdminProduccion.jsx
import { useState, useEffect } from "react";

/**
 * AdminProduccion: Gestiona la apertura de lotes, registro de gastos, 
 * y la creación de perfiles de usuario (Supervisores y Talleres).
 */
const AdminProduccion = () => {
    // Estados base para datos sincronizados
    const [lotes, setLotes] = useState([]);
    const [talleres, setTalleres] = useState([]);
    const [mensaje, setMensaje] = useState("");

    // Estados: Apertura de Lotes
    const [descLote, setDescLote] = useState("");
    const [cantSolicitada, setCantSolicitada] = useState("");
    const [precioDestajo, setPrecioDestajo] = useState("");

    // Estados: Costos y Logística
    const [idLoteGasto, setIdLoteGasto] = useState("");
    const [tipoGasto, setTipoGasto] = useState("Insumos por Mayor");
    const [descGasto, setDescGasto] = useState("");
    const [montoGasto, setMontoGasto] = useState("");

    // Estados: Alta de Supervisores
    const [nombreSuper, setNombreSuper] = useState("");
    const [correoSuper, setCorreoSuper] = useState("");
    const [passwordSuper, setPasswordSuper] = useState("");
    const [errorSuper, setErrorSuper] = useState("");

    // Estados: Alta de Talleres Externos
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [idLoteContrato, setIdLoteContrato] = useState("");
    const [cantidadEncargada, setCantidadEncargada] = useState("");
    const [pagoPactado, setPagoPactado] = useState("");
    const [adelantoOtorgado, setAdelantoOtorgado] = useState("");

    // Inicialización: Obtener datos maestros del servidor
    const iniciarDatos = async () => {
        try {
            const resLotes = await fetch("http://localhost:5000/api/admin/lotes");
            const datosLotes = await resLotes.json();
            setLotes(datosLotes);
            
            // Sincronización de selects para evitar estados vacíos
            if (datosLotes.length > 0) {
                setIdLoteGasto(datosLotes[0].id_lote);
                setIdLoteContrato(datosLotes[0].id_lote);
            }

            const resTalleres = await fetch("http://localhost:5000/api/admin/talleres-externos");
            setTalleres(await resTalleres.json());
        } catch (error) {
            console.error("Error inicializando producción:", error);
        }
    };

    useEffect(() => { 
        iniciarDatos(); 
    }, []);

    // 🚀 1. APERTURA DE LOTE MAESTRO
    const handleCrearLote = async (e) => {
        e.preventDefault();
        setMensaje("");
        try {
            const res = await fetch("http://localhost:5000/api/admin/lotes/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    descripcion: descLote,
                    cantidad_solicitada: parseInt(cantSolicitada),
                    precio_destajo: parseFloat(precioDestajo)
                })
            });
            if (res.ok) {
                setMensaje("🚀 Lote de producción aperturado en la base de datos central.");
                setDescLote(""); setCantSolicitada(""); setPrecioDestajo("");
                iniciarDatos();
            }
        } catch (error) { console.error(error); }
    };

    // 🧾 2. REGISTRO DE GASTOS
    const handleRegistrarGasto = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (!idLoteGasto || idLoteGasto === "") {
            alert("Por favor, seleccione un lote válido de la lista.");
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:5000/api/admin/gastos/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_lote: parseInt(idLoteGasto),
                    tipo_gasto: tipoGasto,
                    descripcion: descGasto,
                    monto_bob: parseFloat(montoGasto)
                }),
            });

            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.error || "Error al registrar el gasto logístico.");

            setMensaje(`✅ ${datos.mensaje}`);
            setDescGasto(""); setMontoGasto("");
            if (lotes.length > 0) setIdLoteGasto(lotes[0].id_lote);
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    // 🛡️ 3. REGISTRO DE SUPERVISORES
    const handleCrearSupervisor = async (e) => {
        e.preventDefault();
        setMensaje("");
        setErrorSuper("");

        try {
            const respuesta = await fetch("http://localhost:5000/api/admin/usuarios/crear-supervisor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombreSuper,
                    correo: correoSuper,
                    password: passwordSuper
                }),
            });

            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.error || "No se pudo registrar al supervisor.");

            setMensaje(`🎉 ${datos.mensaje}: ${datos.usuario.nombre}`);
            setNombreSuper(""); setCorreoSuper(""); setPasswordSuper("");
        } catch (err) {
            setErrorSuper(err.message);
        }
    };

    // 🏢 4. REGISTRO DE TALLERES EXTERNOS
    const handleCrearTallerYContrato = async (e) => {
        e.preventDefault();
        setMensaje("");

        try {
            const respuesta = await fetch("http://localhost:5000/api/admin/usuarios/crear-externo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre, correo, password,
                    id_lote: parseInt(idLoteContrato), 
                    cantidad_encargada: parseInt(cantidadEncargada),
                    pago_pactado_total: parseFloat(pagoPactado),
                    adelanto_otorgado: adelantoOtorgado ? parseFloat(adelantoOtorgado) : 0.00
                })
            });

            const resultado = await respuesta.json();
            if (respuesta.ok) {
                setMensaje("🎉 ¡Taller registrado y contrato abierto exitosamente!");
                setNombre(""); setCorreo(""); setPassword("");
                setCantidadEncargada(""); setPagoPactado(""); setAdelantoOtorgado("");
                iniciarDatos();
            } else {
                setMensaje(`❌ Error: ${resultado.error}`);
            }
        } catch (err) {
            setMensaje("❌ No se pudo conectar con el servidor.");
        }
    };



    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Inyección de Capital y Apertura de Líneas</h3>
            
            {/* Notificaciones de operación */}
            {mensaje && <div style={estilos.alerta}>{mensaje}</div>}

            <div style={estilos.contenedorFormularios}>
                
                {/* 1. APERTURA DE LOTES */}
                <div style={estilos.tarjetaForm}>
                    <h4 style={estilos.tituloForm}>🚀 Apertura de Lotes Maestros</h4>
                    <form onSubmit={handleCrearLote}>
                        <label style={estilos.label}>Descripción de la Prenda (Modelo/Corte):</label>
                        <input type="text" placeholder="Ej. Jeans Clásico Varón Slim" value={descLote} onChange={e => setDescLote(e.target.value)} required style={estilos.input} />
                        
                        <label style={estilos.label}>Cantidad Planificada Total (Unidades):</label>
                        <input type="number" placeholder="Ej. 2000" value={cantSolicitada} onChange={e => setCantSolicitada(e.target.value)} required style={estilos.input} />
                        
                        <label style={estilos.label}>Pago Fijo Destajo por Unidad Planta (BOB):</label>
                        <input type="number" step="0.10" placeholder="Ej. 4.50" value={precioDestajo} onChange={e => setPrecioDestajo(e.target.value)} required style={estilos.input} />
                        
                        <button type="submit" style={estilos.botonAzul}>Liberar Orden a Planta</button>
                    </form>
                </div>

                {/* 2. COSTOS Y LOGÍSTICA */}
                <div style={estilos.tarjetaForm}>
                    <h4 style={estilos.tituloForm}>💰 Costos y Logística</h4>
                    <form onSubmit={handleRegistrarGasto}>
                        <label style={estilos.label}>Seleccionar Lote Afectado:</label>
                        <select value={idLoteGasto} onChange={e => setIdLoteGasto(e.target.value)} style={estilos.input} required>
                            <option value="">-- Elegir Lote --</option>
                            {lotes.map(l => (
                                <option key={l.id_lote} value={l.id_lote}>
                                    ID: {l.id_lote} - {l.descripcion}
                                </option>
                            ))}
                        </select>

                        <label style={estilos.label}>Tipo de Gasto Extra:</label>
                        <select value={tipoGasto} onChange={e => setTipoGasto(e.target.value)} style={estilos.input}>
                            <option value="Insumos por Mayor">Insumos por Mayor (Telas, hilos)</option>
                            <option value="Insumos por Unidad">Insumos por Unidad (Cierres, botones)</option>
                            <option value="Lavandería Externa">Lavandería Externa</option>
                            <option value="Inversión Máquinas">Inversión Máquinas (Repuestos/Agujas)</option>
                        </select>

                        <label style={estilos.label}>Descripción / Detalle:</label>
                        <input type="text" value={descGasto} onChange={e => setDescGasto(e.target.value)} style={estilos.input} placeholder="Ej. Lavado de 200 pantalones" />

                        <label style={estilos.label}>Monto Invertido (BOB):</label>
                        <input type="number" step="0.01" value={montoGasto} onChange={e => setMontoGasto(e.target.value)} style={estilos.input} placeholder="0.00" required />

                        <button type="submit" style={estilos.botonAzul}>Registrar Gasto Logístico</button>
                    </form>
                </div>

                {/* 3. ALTA DE SUPERVISORES */}
                <div style={estilos.tarjetaForm}>
                    <h4 style={{ ...estilos.tituloForm, borderBottom: "2px solid #9b59b6" }}>🛡️ Registro de Supervisores</h4>
                    {errorSuper && <div style={{ ...estilos.alerta, backgroundColor: "#f8d7da", color: "#721c24", marginBottom: "15px" }}>⚠️ {errorSuper}</div>}
                    <form onSubmit={handleCrearSupervisor}>
                        <label style={estilos.label}>Nombre Completo del Supervisor:</label>
                        <input type="text" placeholder="Ej. Ing. Carlos Mendoza" value={nombreSuper} onChange={e => setNombreSuper(e.target.value)} required style={estilos.input} />

                        <label style={estilos.label}>Correo Electrónico Corporativo:</label>
                        <input type="email" placeholder="carlos.mendoza@textil.com" value={correoSuper} onChange={e => setCorreoSuper(e.target.value)} required style={estilos.input} />

                        <label style={estilos.label}>Contraseña de Acceso:</label>
                        <input type="password" placeholder="Mínimo 6 caracteres" value={passwordSuper} onChange={e => setPasswordSuper(e.target.value)} required style={estilos.input} />

                        <button type="submit" style={{ ...estilos.botonAzul, backgroundColor: "#9b59b6" }}>Dar de Alta Supervisor</button>
                    </form>
                </div>

                {/* 4. ALTA DE TALLERES EXTERNOS */}
                <div style={estilos.tarjetaForm}>
                    <h4 style={estilos.tituloForm}>🏢 Registrar Taller Externo</h4>
                    <form onSubmit={handleCrearTallerYContrato}>
                        <h5 style={estilos.subseccion}>1. Datos del Taller Satélite</h5>
                        <label style={estilos.label}>Razón Social / Nombre:</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={estilos.input} placeholder="Ej. Confecciones San Martín" />

                        <label style={estilos.label}>Correo Electrónico (Login):</label>
                        <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required style={estilos.input} placeholder="taller@correo.com" />

                        <label style={estilos.label}>Contraseña de Acceso:</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={estilos.input} placeholder="••••••••" />

                        <h5 style={estilos.subseccion}>2. Asignación del Primer Contrato</h5>
                        <label style={estilos.label}>Seleccionar Lote Macro Destinado:</label>
                        <select value={idLoteContrato} onChange={e => setIdLoteContrato(e.target.value)} style={estilos.input} required>
                            {lotes.map(lote => (
                                <option key={lote.id_lote} value={lote.id_lote}>
                                    #{lote.id_lote} - {lote.descripcion}
                                </option>
                            ))}
                        </select>

                        <label style={estilos.label}>Cantidad de Prendas Encargadas (pzas):</label>
                        <input type="number" value={cantidadEncargada} onChange={e => setCantidadEncargada(e.target.value)} required style={estilos.input} placeholder="Ej. 500" />

                        <label style={estilos.label}>Pago Total Pactado (BOB):</label>
                        <input type="number" step="0.01" value={pagoPactado} onChange={e => setPagoPactado(e.target.value)} required style={estilos.input} placeholder="Ej. 2500.00" />

                        <label style={estilos.label}>Adelanto Financiero (Opcional - BOB):</label>
                        <input type="number" step="0.01" value={adelantoOtorgado} onChange={e => setAdelantoOtorgado(e.target.value)} style={estilos.input} placeholder="0.00" />

                        <button type="submit" style={estilos.botonAzul}>Dar de Alta y Vincular Contrato</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const estilos = {
    contenedorFormularios: { display: "flex", gap: "25px", flexWrap: "wrap" },
    tarjetaForm: { flex: 1, minWidth: "320px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" },
    tituloForm: { margin: "0 0 15px 0", color: "#2c3e50", borderBottom: "2px solid #2980b9", paddingBottom: "5px" },
    subseccion: { margin: "10px 0 5px 0", color: "#7f8c8d", fontSize: "14px", textTransform: "uppercase" },
    input: { width: "100%", padding: "10px", margin: "6px 0 15px 0", borderRadius: "4px", border: "1px solid #bdc3c7", boxSizing: "border-box" },
    label: { fontWeight: "bold", fontSize: "13px", color: "#34495e" },
    botonAzul: { backgroundColor: "#2980b9", color: "#fff", border: "none", padding: "12px", width: "100%", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
    botonVerde: { backgroundColor: "#27ae60", color: "#fff", border: "none", padding: "12px", width: "100%", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
    alerta: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "4px", marginBottom: "20px" }
};

export default AdminProduccion;