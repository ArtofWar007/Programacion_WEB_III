// Proporcione un ejemplo concreto de encadenamiento de promesas.

function validarUsuario(user) {
    return new Promise((resolve, reject) => {
        console.log("1. Validando usuario...");
        if (user === "admin"){
            resolve(user);
        }
        else{
            reject("Usuario inválido");
        }
    });
}
    
function obtenerToken(user) {
    return new Promise((resolve, reject) => {
        console.log("2. Generando token para:", user);
        setTimeout(() => resolve("TOKEN_12345"), 1000);
    });
}

function obtenerPerfil(token) {
    return new Promise((resolve) => {
        console.log("3. Descargando perfil con token:", token);
        resolve({ nombre: "Administrador", rol: "Superuser" });
    });
}

validarUsuario("admin")
    .then(user => obtenerToken(user))
    .then(token => obtenerPerfil(token))
    .then(perfil => console.log("Perfil final:", perfil))
    .catch(error => console.error("Error en la cadena:", error));