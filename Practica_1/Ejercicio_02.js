// Crear una función que invierta el orden de las palabras en una frase.
// let cad = miFuncion(“abcd”)
// console.log(obj) // dcba

function miFuncion(texto) {
    let v = '';
    for (let i = 0; i < texto.length; i ++){
        v = texto[i] + v;
    }
    return v;
}

let cad = miFuncion("abcd");
console.log(cad);