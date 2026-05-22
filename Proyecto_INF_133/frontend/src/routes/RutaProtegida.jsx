// routes/RutaProtegida.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * RutaProtegida: Middleware de seguridad.
 * Valida la existencia de sesión y autoriza rutas según el rol del usuario.
 */
const RutaProtegida = ({ rolesPermitidos }) => {
    const { user, cargando } = useContext(AuthContext);

    // Estado de carga (mientras se validan credenciales)
    if (cargando) {
        return <div>Validando credenciales criptográficas...</div>;
    }

    // 1. Verificación de sesión: Si no hay usuario, redirige a Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Verificación de roles: Si el rol no es permitido, restringe el acceso
    if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
        return <Navigate to="/login" replace />; 
    }

    // Acceso concedido: Renderiza el contenido hijo
    return <Outlet />;
};

export default RutaProtegida;