// Proporcione un ejemplo para migrar una función con promesas a async/await.

function obtenerPrecio(idProducto) {
    return new Promise((resolve, reject) => {
        if (idProducto === 1){
        return resolve(1500);
        }
        reject("No existe");
    })
}

function procesarPago(precio) {
    return new Promise((resolve, reject) => {
        if (precio){
        return resolve({producto: "Laptop", precio: 1500, estado: "Pagado"});
        }
        reject("Algo salió mal");
    })
}

function realizarCompra1(idProducto) {
    console.log("Iniciando proceso...");

    obtenerPrecio(idProducto)
        .then((precio) => {
        console.log("Precio obtenido", precio);
        return procesarPago(precio);
        })
        .then((confirmacion) => {
        console.log("Pago exitoso:", confirmacion);
        })
        .catch((error) => {
        console.error("Hubo un error en la compra:", error);
        });
}

console.log("Para migrar a async/await:\n1. Agregamos la palabra async antes de la función.\n2. Cambiamos los .then() por la palabra await delante de la ejecución.\n3. Envolvemos todo en un bloque try/catch para sustituir al .catch().");
async function realizarCompra2(idProducto) {
    console.log("Iniciando proceso...");

    try {
        const precio = await obtenerPrecio(idProducto);
        console.log("Precio obtenido", precio);

        const confirmacion = await procesarPago(precio);
        console.log("Pago exitoso:", confirmacion);
        
    } catch (error) {
        console.error("Hubo un error en la compra:", error);
    }
}

console.log("Resultado del codigo Original:")
realizarCompra1(1);


setTimeout(() => {
    console.log("\n\nResultado despues de migrar a async/await:");
    realizarCompra2(1);
}, 1000);