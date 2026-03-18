// Crear una función que reciba un arreglo de números y devuelva en un objeto a los pares
// e impares:
// let obj = miFuncion([1,2,3,4,5])
// console.log(obj) // { pares: [2,4], impares: [1,3,5]}

function miFuncion(arr) {
    const num = {
        pares: [],
        impares: [],
    }
    for (let i = 0; i < arr.length; i ++){
        if (arr[i] % 2 == 0){
            num['pares'].push(arr[i]);
        }else{
            num['impares'].push(arr[i]);
        }
    }
    return num;
}

const obj = miFuncion([1, 2, 3, 4, 5]);
console.log(obj);