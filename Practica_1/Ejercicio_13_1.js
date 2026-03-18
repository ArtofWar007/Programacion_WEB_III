// Proporcione un ejemplo concreto donde el anidamiento de promesas se puede
// reescribir mejor con async/await haciendo el código más limpio y mantenible.

function validarStock(producto) {
    return new Promise((resolve, reject) => {
        console.log(`Consultando stock para: ${producto}...`);
        setTimeout(() => {
        const hayStock = true;
        if (hayStock) {
            resolve(15);
        } else {
            reject(`Error: No hay stock de ${producto}`);
        }
        }, 1000);
    });
}

function reservarProducto(producto, cantidad) {
    return new Promise((resolve, reject) => {
        console.log(`Reservando ${producto} (Disponibles: ${cantidad})...`);
        setTimeout(() => {
        if (true) { 
            resolve({ id: "RES-99", producto });
        } else {
            reject("Error: El sistema de reservas está caído");
        }
        }, 1000);
    });
}

function procesarPago(reservaId) {
    return new Promise((resolve, reject) => {
        console.log(`Procesando pago de la reserva: ${reservaId}...`);
        setTimeout(() => {
        resolve({ recibo: "REC-2026", estado: "Pagado" });
        }, 1000);
    });
}

function completarPedido(producto){
    validarStock(producto)
    .then(stock => {
        return reservarProducto(producto, stock);
    })
    .then(reserva => {
        return procesarPago(reserva.id);
    })
    .then(recibo => {
        console.log("Pedido exitoso:", recibo);
    })
    .catch(error => {
        console.error("Error en la cadena:", error);
    });
}

completarPedido("Laptop");