// src/views/Login.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

// 🚀 MODIFICADO: Ahora el componente recibe la prop de navegación desde App.jsx
const Login = ({ alIrARegistro }) => {
  const { login } = useContext(AuthContext);

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // === ESTADOS PARA EL CAPTCHA ===
  const [idCaptcha, setIdCaptcha] = useState("");
  const [pregunta, setPregunta] = useState("Cargando CAPTCHA...");
  const [respuestaUsuario, setRespuestaUsuario] = useState("");

  // Función para solicitar un nuevo CAPTCHA al backend
  const obtenerCaptcha = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/captcha");
      const data = await res.json();
      if (res.ok) {
        setIdCaptcha(data.idCaptcha);
        setPregunta(data.pregunta);
        setRespuestaUsuario(""); // Limpiar respuesta anterior
      } else {
        setPregunta("Error al generar CAPTCHA");
      }
    } catch (err) {
      setPregunta("Sin conexión con el servidor");
    }
  };

  // Cargar el CAPTCHA automáticamente al montar la vista
  useEffect(() => {
    obtenerCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      // 🚀 CONEXIÓN AL BACKEND: Enviamos credenciales + datos del CAPTCHA
      const respuesta = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo,
          password: password,
          idCaptcha: idCaptcha,              // <-- NUEVO
          respuestaUsuario: respuestaUsuario  // <-- NUEVO
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Si falla (por credenciales o por CAPTCHA), forzamos uno nuevo automáticamente
        obtenerCaptcha();
        throw new Error(datos.error || datos.mensaje || "Error al intentar iniciar sesión.");
      }

      // 🎉 SI TODO ESTÁ BIEN: Pasamos el objeto usuario al contexto global
      login(datos.usuario);

    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={estilos.contenedorContenedor}>
      <div style={estilos.tarjetaLogin}>
        <h2 style={estilos.titulo}>TextilControl</h2>
        <p style={estilos.subtitulo}>Sistema de Gestión de Planta</p>

        <form onSubmit={handleSubmit} style={estilos.formulario}>
          {error && <div style={estilos.alertaError}>{error}</div>}

          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Correo Electrónico:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={estilos.input}
              placeholder="ejemplo@textil.com"
              disabled={enviando}
              required
            />
          </div>

          <div style={estilos.grupoInput}>
            <label style={estilos.label}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={estilos.input}
              placeholder="••••••••"
              disabled={enviando}
              required
            />
          </div>

          {/* 🧱 BLOQUE VISUAL DEL CAPTCHA INTEGRADOR */}
          <div style={estilos.contenedorCaptcha}>
            <label style={estilos.labelCaptcha}>Verificación de Seguridad:</label>
            <span style={estilos.textoPregunta}>{pregunta}</span>
            <div style={estilos.filaAccionesCaptcha}>
              <input
                type="number"
                value={respuestaUsuario}
                onChange={(e) => setRespuestaUsuario(e.target.value)}
                style={estilos.inputCaptcha}
                placeholder="Resultado"
                disabled={enviando}
                required
              />
              <button
                type="button"
                onClick={obtenerCaptcha}
                style={estilos.botonRecargar}
                disabled={enviando}
                title="Recargar CAPTCHA"
              >
                🔄
              </button>
            </div>
          </div>

          <button type="submit" style={estilos.botonIngresar} disabled={enviando}>
            {enviando ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* 🚀 NUEVO: BLOQUE DE ENLACE INFERIOR PARA IR A REGISTRO */}
        <div style={estilos.contenedorEnlace}>
          <button 
            type="button" 
            onClick={alIrARegistro} 
            style={estilos.enlaceBoton}
            disabled={enviando}
          >
            ¿Eres Administrador nuevo? Regístrate aquí
          </button>
        </div>

      </div>
    </div>
  );
};

// Estilos actualizados con la caja del CAPTCHA manteniendo la coherencia visual original
const estilos = {
  contenedorContenedor: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#1a252f", fontFamily: "sans-serif" },
  tarjetaLogin: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", width: "100%", maxWidth: "400px" },
  titulo: { margin: "0 0 5px 0", textAlign: "center", color: "#2c3e50", fontSize: "28px", fontWeight: "bold" },
  subtitulo: { margin: "0 0 25px 0", textAlign: "center", color: "#7f8c8d", fontSize: "14px" },
  formulario: { display: "flex", flexDirection: "column", gap: "15px" },
  grupoInput: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "14px", color: "#2c3e50", fontWeight: "bold" },
  input: { padding: "10px", borderRadius: "4px", border: "1px solid #bdc3c7", fontSize: "15px", outline: "none" },
  
  // Estilos del CAPTCHA
  contenedorCaptcha: { backgroundColor: "#f8f9fa", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px" },
  labelCaptcha: { fontSize: "12px", color: "#7f8c8d", fontWeight: "bold", textTransform: "uppercase" },
  textoPregunta: { fontSize: "16px", color: "#2c3e50", fontWeight: "bold", padding: "2px 0" },
  filaAccionesCaptcha: { display: "flex", gap: "8px", alignItems: "center" },
  inputCaptcha: { padding: "8px", borderRadius: "4px", border: "1px solid #bdc3c7", fontSize: "15px", width: "100px", outline: "none" },
  botonRecargar: { backgroundColor: "#e2e8f0", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "14px" },

  botonIngresar: { backgroundColor: "#3498db", color: "#fff", border: "none", padding: "12px", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", transition: "0.2s" },
  alertaError: { backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", fontSize: "14px", textAlign: "center", border: "1px solid #f5c6cb" },

  // 🚀 NUEVOS ESTILOS PARA EL ENLACE DE CONEXIÓN
  contenedorEnlace: { marginTop: "20px", textAlign: "center" },
  enlaceBoton: { background: "none", border: "none", color: "#3498db", cursor: "pointer", fontSize: "14px", textDecoration: "underline", outline: "none" }
};

export default Login;