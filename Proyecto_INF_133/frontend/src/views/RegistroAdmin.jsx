// src/views/RegistroAdmin.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const RegistroAdmin = ({ alIrALogin }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [claveCorporativa, setClaveCorporativa] = useState("");
  
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [nivelFuerza, setNivelFuerza] = useState({ texto: "Inexistente", color: "#bdc3c7" });

  // La contraseña estática requerida para poder registrar un Admin
  const CLAVE_ESTATICA_REQUERIDA = "TEXTIL_MASTER_2026";

  const evaluarFuerzaPassword = (clave) => {
    if (clave.length === 0) return { texto: "Inexistente", color: "#bdc3c7" };
    if (clave.length < 6) return { texto: "Débil (Insegura)", color: "#e74c3c" };
    
    const regexFuerte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regexFuerte.test(clave)) return { texto: "Fuerte (Segura)", color: "#2ecc71" };
    return { texto: "Intermedia (Aceptable)", color: "#f1c40f" };
  };

  const handlePasswordChange = (e) => {
    const valor = e.target.value;
    setPassword(valor);
    setNivelFuerza(evaluarFuerzaPassword(valor));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    // VALIDACIÓN CRÍTICA: Validar pase de seguridad estático
    if (claveCorporativa !== CLAVE_ESTATICA_REQUERIDA) {
      setError("La Clave de Invitación Corporativa es incorrecta. Acceso denegado.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/usuarios/crear-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, password })
      });

      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error || "Error al registrar administrador.");

      setExito("🎉 Administrador creado con éxito. Redirigiendo...");
      setTimeout(() => alIrALogin(), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={estilos.contenedorContenedor}>
      <div style={estilos.tarjetaLogin}>
        <h2 style={estilos.titulo}>TextilControl</h2>
        <p style={estilos.subtitulo}>Registro de Personal Administrativo</p>

        <form onSubmit={handleSubmit} style={estilos.formulario}>
          {error && <div style={estilos.alertaError}>{error}</div>}
          {exito && <div style={estilos.alertaExito}>{exito}</div>}

          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Nombre Completo:</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={estilos.input} placeholder="Ej. Admin Principal" required />
          </div>

          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Correo Electrónico:</label>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} style={estilos.input} placeholder="admin@textil.com" required />
          </div>

          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Contraseña Personal:</label>
            <input type="password" value={password} onChange={handlePasswordChange} style={estilos.input} placeholder="••••••••" required />
            {password.length > 0 && (
              <div style={estilos.contenedorFuerza}>
                <div style={{ ...estilos.barraProgreso, backgroundColor: nivelFuerza.color, width: nivelFuerza.texto.includes("Débil") ? "33%" : nivelFuerza.texto.includes("Intermedia") ? "66%" : "100%" }} />
                <span style={{ ...estilos.textoFuerza, color: nivelFuerza.color }}>Seguridad: {nivelFuerza.texto}</span>
              </div>
            )}
          </div>

          {/* CAMPO DE FILTRO DE SEGURIDAD ESTATICA */}
          <div style={{ ...estilos.grupoInput, backgroundColor: "#fff3cd", padding: "10px", borderRadius: "4px", border: "1px solid #ffeeba" }}>
            <label style={{ ...estilos.label, color: "#856404" }}>🔑 Clave de Invitación Máster:</label>
            <input type="password" value={claveCorporativa} onChange={e => setClaveCorporativa(e.target.value)} style={estilos.input} placeholder="Clave requerida para Admins" required />
          </div>

          <button type="submit" style={estilos.botonIngresar}>Registrar Cuenta Administrador</button>
        </form>

        <div style={estilos.enlaceContenedor}>
          <button onClick={alIrALogin} style={estilos.enlaceBoton}>¿Ya tienes cuenta? Inicia Sesión</button>
        </div>
      </div>
    </div>
  );
};

// Se heredan exactamente tus mismos estilos del login original + agregados
const estilos = {
  contenedorContenedor: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#1a252f", fontFamily: "sans-serif" },
  tarjetaLogin: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", width: "100%", maxWidth: "400px" },
  titulo: { margin: "0 0 5px 0", textAlign: "center", color: "#2c3e50", fontSize: "28px", fontWeight: "bold" },
  subtitulo: { margin: "0 0 25px 0", textAlign: "center", color: "#7f8c8d", fontSize: "14px" },
  formulario: { display: "flex", flexDirection: "column", gap: "15px" },
  grupoInput: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "14px", color: "#2c3e50", fontWeight: "bold" },
  input: { padding: "10px", borderRadius: "4px", border: "1px solid #bdc3c7", fontSize: "15px", outline: "none", boxSizing: "border-box", width: "100%" },
  botonIngresar: { backgroundColor: "#27ae60", color: "#fff", border: "none", padding: "12px", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  alertaError: { backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", fontSize: "14px", textAlign: "center", border: "1px solid #f5c6cb" },
  alertaExito: { backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "4px", fontSize: "14px", textAlign: "center", border: "1px solid #c3e6cb" },
  contenedorFuerza: { marginTop: "3px", display: "flex", flexDirection: "column", gap: "4px" },
  barraProgreso: { height: "4px", borderRadius: "2px", transition: "all 0.3s ease" },
  textoFuerza: { fontSize: "11px", fontWeight: "bold" },
  enlaceContenedor: { marginTop: "20px", textAlign: "center" },
  enlaceBoton: { background: "none", border: "none", color: "#3498db", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }
};

export default RegistroAdmin;