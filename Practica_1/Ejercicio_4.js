// Crear una función que reciba un arreglo de números y devuelva el número mayor y el
// menor, en un objeto.
// let obj = miFuncion([3,1,5,4,2])
// console.log(obj) // { mayor: 5, menor: 1 }

function miFuncion(arr) {
    const mayMen = {
        mayor: arr[0],
        menor: arr[0]
    }
    for (let i = 1; i <= arr.length; i ++){
        if (arr[i] > mayMen['mayor']){
            mayMen['mayor'] = arr[i];
        }
        if (arr[i] < mayMen['menor']){
            mayMen['menor'] = arr[i];
        }
    }
    return mayMen;
}

let obj = miFuncion([3, 1, 5, 4, 2]);
console.log(obj);