// Proporcione un ejemplo para convertir una promesa en un callback.

function validarStockP(producto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (producto === "Laptop") {
                resolve({producto: "Laptop", cantidad: 10});
            }
            else{
                reject("No hay stock");
            }
        }, 1000);
    });
}

function validarStockCallback(producto, callback) {
    validarStockP(producto)
    .then(stock => {
        callback(null, stock);
    })
    .catch(error  => {
        callback(error, null);
    });
}

validarStockCallback("Laptop", (err, resultado) => {
    if (err) {
        console.error("Error detectado:", err);
        return;
    }
    console.log("Resultado obtenido vía callback:", resultado);
});