// Crear una función que cuente cuántas veces aparece cada vocal en un texto y devuelva el
// resultado en un objeto.
// let obj = miFuncion(“euforia”)
// console.log(obj) // { a: 1, e: 1, i: 1, o: 1, u: 1 }

function miFuncion (texto) {
    const conteo = {a: 0, e: 0, i: 0, o: 0, u: 0};
    const textoLimpio = texto.toLowerCase();
    
    for (let i of textoLimpio) {
        if (i in conteo){
            conteo[i]++;
        }
    }
    return conteo;
}

let obj = miFuncion("euforia")
console.log(obj);