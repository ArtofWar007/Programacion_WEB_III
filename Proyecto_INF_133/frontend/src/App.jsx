// src/App.jsx
import { useContext, useState } from "react"; // 🚀 CAMBIO 1: Importamos useState
import { AuthContext } from "./context/AuthContext";
import Login from "./views/Login";
import RegistroAdmin from "./views/RegistroAdmin"; // 🚀 CAMBIO 2: Importamos la nueva vista

import AdminDashboard from "./views/Admin/AdminDashboard";
import AdminProduccion from "./views/Admin/AdminProduccion";
import AdminReportes from "./views/Admin/AdminReportes";

import SuperDashboard from "./views/Supervisor/SuperDashboard";
import SuperProduccion from "./views/Supervisor/SuperProduccion";
import SuperReportes from "./views/Supervisor/SuperReportes";

import ExternoDashboard from "./views/Externo/ExternoDashboard";
import ExternoProduccion from "./views/Externo/ExternoProduccion";
import ExternoReportes from "./views/Externo/ExternoReportes";

import OperarioDashboard from "./views/Operario/OperarioDashboard";
import OperarioReportes from "./views/Operario/OperarioReportes";

import LayoutUniversal from "./components/LayoutUniversal";

function App() {
  const { user, logout, vistaActiva, setVistaActiva } = useContext(AuthContext);
  
  // 🚀 CAMBIO 3: Estado local para alternar entre Login y Registro cuando NO hay sesión
  const [pantallaSinSesion, setPantallaSinSesion] = useState("login");

  // 🚀 CAMBIO 4: Si no hay usuario, evaluamos cuál de las dos pantallas mostrar
  if (!user) {
    if (pantallaSinSesion === "registro") {
      return <RegistroAdmin alIrALogin={() => setPantallaSinSesion("login")} />;
    }
    return <Login alIrARegistro={() => setPantallaSinSesion("registro")} />;
  }

  const renderizarVistaProcesada = () => {
    switch (vistaActiva) {
      case "admin-dashboard":
        return user.rol === "Administrador" ? <AdminDashboard /> : <Login />;
      case "admin-produccion":
        return user.rol === "Administrador" ? <AdminProduccion /> : <Login />;
      case "admin-reportes":
        return user.rol === "Administrador" ? <AdminReportes /> : <Login />;

      case "supervisor-dashboard":
        return user.rol === "Supervisor" ? <SuperDashboard /> : <Login />;
      case "supervisor-produccion":
        return user.rol === "Supervisor" ? <SuperProduccion /> : <Login />;
      case "supervisor-reportes":
        return user.rol === "Supervisor" ? <SuperReportes /> : <Login />;

      // --- Módulo Taller Externo Sincronizado Nativamente ---
      case "externo-dashboard":
        return user.rol === "Taller Externo" ? <ExternoDashboard /> : <Login />;
      case "externo-produccion":
        return user.rol === "Taller Externo" ? <ExternoProduccion /> : <Login />;
      case "externo-reportes":
        return user.rol === "Taller Externo" ? <ExternoReportes /> : <Login />;

      case "operario-dashboard":
        return user.rol === "Operario" ? <OperarioDashboard /> : <Login />;
      case "operario-reportes":
        return user.rol === "Operario" ? <OperarioReportes /> : <Login />;

      default:
        if (user.rol === "Administrador") return <AdminDashboard />;
        if (user.rol === "Supervisor") return <SuperDashboard />;
        if (user.rol === "Taller Externo") return <ExternoDashboard />;
        return <OperarioDashboard />;
    }
  };

  return (
    <LayoutUniversal user={user} logout={logout} setVistaActiva={setVistaActiva}>
      {renderizarVistaProcesada()}
    </LayoutUniversal>
  );
}

export default App;