// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

/**
 * AuthProvider: Gestiona el estado global de autenticación y la persistencia en LocalStorage.
 * Asegura que el usuario no pierda su sesión ni su vista activa al refrescar el navegador.
 */
export const AuthProvider = ({ children }) => {
  
  // Inicialización de estado con persistencia (localStorage)
  const [user, setUser] = useState(() => {
    const persistencia = localStorage.getItem("usuario_sesion");
    return persistencia ? JSON.parse(persistencia) : null;
  });

  const [vistaActiva, setVistaActiva] = useState(() => {
    return localStorage.getItem("vista_actual") || "";
  });

  // Lógica de inicio de sesión: Asigna rol y redirige al dashboard correspondiente
  const login = (datosUsuario) => {
    setUser(datosUsuario);
    localStorage.setItem("usuario_sesion", JSON.stringify(datosUsuario));

    let vista = "operario-dashboard";
    if (datosUsuario.rol === "Administrador") vista = "admin-dashboard";
    else if (datosUsuario.rol === "Supervisor") vista = "supervisor-dashboard";
    else if (datosUsuario.rol === "Taller Externo") vista = "externo-dashboard";

    setVistaActiva(vista);
    localStorage.setItem("vista_actual", vista);
  };

  // Cierre de sesión: Limpia el estado y el almacenamiento local
  const logout = () => {
    setUser(null);
    setVistaActiva("");
    localStorage.clear();
  };

  // Actualizador de vista sincronizado con localStorage
  const cambiarVista = (nuevaVista) => {
    setVistaActiva(nuevaVista);
    localStorage.setItem("vista_actual", nuevaVista);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      vistaActiva, 
      setVistaActiva: cambiarVista, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};