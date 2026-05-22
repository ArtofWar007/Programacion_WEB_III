// src/components/LayoutUniversal.jsx
import React from "react";

/**
 * Componente LayoutUniversal: Define la estructura base de la aplicación.
 * Gestiona la navegación según el rol del usuario y el layout principal.
 */
const LayoutUniversal = ({ children, user, logout, setVistaActiva }) => {
    return (
        <div style={estilos.layoutContainer}>
            {/* --- BARRA LATERAL (SIDEBAR) --- */}
            <aside style={estilos.sidebar}>
                <div style={estilos.logoSeccion}>
                    <h3 style={{ margin: 0, color: "#fff" }}>TextilControl</h3>
                    <header style={{ margin: 0, color: "#fff" }}>
                        <span>Usuario: <strong>{user?.nombre}</strong></span>
                    </header>
                    <span style={estilos.badgeRol}>{user?.rol}</span>
                </div>
                
                <nav style={estilos.navegacion}>
                    {/* MENÚ ADMINISTRADOR */}
                    {user?.rol === "Administrador" && (
                        <>
                            <button onClick={() => setVistaActiva("admin-dashboard")} style={estilos.botonMenu}>💰 Flujo de Caja</button>
                            <button onClick={() => setVistaActiva("admin-produccion")} style={estilos.botonMenu}>🧵 Abrir Lotes</button>
                            <button onClick={() => setVistaActiva("admin-reportes")} style={estilos.botonMenu}>📊 Liquidación Cruzada</button>
                        </>
                    )}

                    {/* MENÚ SUPERVISOR */}
                    {user?.rol === "Supervisor" && (
                        <>
                            <button onClick={() => setVistaActiva("supervisor-dashboard")} style={estilos.botonMenu}>📥 Control Recepción</button>
                            <button onClick={() => setVistaActiva("supervisor-produccion")} style={estilos.botonMenu}>👷 Gestión Planta</button>
                            <button onClick={() => setVistaActiva("supervisor-reportes")} style={estilos.botonMenu}>📋 Asistencia Biométrica</button>
                        </>
                    )}

                    {/* MENÚ TALLER EXTERNO */}
                    {user?.rol === "Taller Externo" && (
                        <>
                            <button onClick={() => setVistaActiva("externo-dashboard")} style={estilos.botonMenu}>🏢 Mis Subcontratos</button>
                            <button onClick={() => setVistaActiva("externo-produccion")} style={estilos.botonMenu}>🚚 Emitir Despacho</button>
                            <button onClick={() => setVistaActiva("externo-reportes")} style={estilos.botonMenu}>🗄️ Historial Cerrados</button>
                        </>
                    )}

                    {/* MENÚ OPERARIO */}
                    {user?.rol === "Operario" && (
                        <>
                            <button onClick={() => setVistaActiva("operario-dashboard")} style={estilos.botonMenu}>📈 Mis Métricas</button>
                            <button onClick={() => setVistaActiva("operario-reportes")} style={estilos.botonMenu}>📄 Boletas de Pago</button>
                        </>
                    )}
                </nav>

                <button onClick={logout} style={estilos.botonLogout}>🔒 Cerrar Sistema</button>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main style={estilos.contenidoPrincipal}>
                <div style={{ padding: "20px" }}>
                    {children} 
                </div>
            </main>
        </div>
    );
};

// Definición de estilos del componente
const estilos = {
    layoutContainer: { display: "flex", height: "100vh", backgroundColor: "#f4f6f9", fontFamily: "sans-serif" },
    sidebar: { width: "260px", backgroundColor: "#2c3e50", display: "flex", flexDirection: "column", padding: "20px" },
    logoSeccion: { paddingBottom: "20px", borderBottom: "1px solid #34495e", marginBottom: "20px" },
    badgeRol: { fontSize: "11px", backgroundColor: "#3498db", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: "bold", display: "inline-block", marginTop: "5px" },
    navegacion: { display: "flex", flexDirection: "column", gap: "10px", flex: 1 },
    botonMenu: { backgroundColor: "transparent", color: "#ecf0f1", border: "none", textAlign: "left", padding: "10px", borderRadius: "4px", fontSize: "15px", cursor: "pointer", width: "100%", transition: "0.2s" },
    botonLogout: { backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginTop: "auto" },
    contenidoPrincipal: { flex: 1, overflowY: "auto" }
};

export default LayoutUniversal;