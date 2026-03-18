// Realizar un código para ejecutar una función callback después 2 segundos.

function ejecutarCallback(callback){
    setTimeout(()=>{
        callback("Pasaron dos segundos");
    }, 2000)
}

ejecutarCallback((mensaje) =>{
    console.log(mensaje);
})