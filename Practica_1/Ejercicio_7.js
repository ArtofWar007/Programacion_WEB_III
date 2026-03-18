// Almacenar el resto de los elementos de un arreglo sin tomar en cuenta los dos primeros
// elementos de un arreglo, mediante desestructuración

const colores = ['rojo','amarillo','azul','verde','naranja','morado','negro','blanco'];

const [primerE, segundoE, ...elResto] = colores;
console.log(elResto);