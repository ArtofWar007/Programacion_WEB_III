// Proporcione un ejemplo concreto donde el anidamiento de callbacks se puede
// reescribir mejor con async/await haciendo el código más limpio y mantenible.

function login(callback) {
    setTimeout(() => callback(null, "usuario_123"), 1000);
}

function getPerfil(id, callback) {
    setTimeout(() => callback(null, { id, nombre: "Mario" }), 1000);
}

function getPreferencias(perfil, callback) {
    setTimeout(() => callback(null, { tema: "azul" }), 1000);
}


login((err, id) => {
    if (err) return console.error("Error login:", err);
    getPerfil(id, (err, perfil) => {
        if (err) return console.error("Error perfil:", err);
        getPreferencias(perfil, (err, prefs) => {
        if (err) return console.error("Error prefs:", err);
        console.log("Datos finales:", perfil, prefs);
        });
    });
});
