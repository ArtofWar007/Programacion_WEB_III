// Crear una promesa que devuelva un mensaje de éxito después de 3 segundos

const miPromesa = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve('Exito');
    }, 3000);
})

miPromesa.then((mensaje) => {
    console.log(mensaje);
})
console.log('Esperando...');