// Crear una función que determine si una cadena es palíndromo (se lee igual al derecho y
// al revés).
// let band = miFuncion(“oruro”)
// console.log(band) // true
// let band = miFuncion(“hola”)
// console.log(band) // false

function miFuncion (texto) {
    let v = '';
    for (let i = 0; i < texto.length; i ++){
        v = texto[i] + v;
    }
    
    if (texto == v) return true;
    return false;
}

let band;
band = miFuncion('oruro');
console.log(band);

band = miFuncion('hola');
console.log(band);