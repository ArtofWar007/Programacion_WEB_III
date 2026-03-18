// Proporcione un ejemplo para convertir un callback en una promesa

function validarStockCallback(producto, callback) {
    setTimeout(() => {
        if (producto === "Laptop") {
            callback(null, {producto: "Laptop", cantidad: 10});
        }
        else {
            callback("No hay stock", null);
        }
    }, 1000);
}

function validarStockP(producto) {
    return new Promise((resolve, reject) => {
        validarStockCallback(producto, (err, datos) => {
            if (err) {
                return reject(err);
            }
            resolve(datos);
        })
    })
}

async function iniciarValidacion() {
    try {
        const resultado = await validarStockP("Laptop");
        console.log("Resultado obtenido vía callback:", resultado);
    } catch (error) {
        console.error("Error detectado:", error);
    }
}

iniciarValidacion();