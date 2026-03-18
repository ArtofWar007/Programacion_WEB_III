// Proporcione un ejemplo concreto donde el anidamiento de callbacks se puede
// reescribir mejor con async/await haciendo el código más limpio y mantenible.

const loginP = () => new Promise((res) => {
    setTimeout(() => {
        res("usuario_123")
    }, 1000)
});

const getPerfilP = (id) => new Promise((res) => {
    setTimeout(() => {
        res({ id, nombre: "Mario" })
    }, 1000)
});

const getPreferenciasP = (perfil) => new Promise((res) => {
    setTimeout(() => {
        res({ tema: "azul" })
    }, 1000)
});

async function ejecutarFlujo() {
  try {
    const id = await loginP();
    const perfil = await getPerfilP(id);
    const prefs = await getPreferenciasP(perfil);
    
    console.log("Datos finales:", perfil, prefs);
  } catch (err) {
    console.error("Algo falló en la cadena:", err);
  }
}

ejecutarFlujo();