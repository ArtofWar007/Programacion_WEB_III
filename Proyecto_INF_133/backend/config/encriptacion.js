const encriptar = (password) => {
    if (!password) return "";
    const stringInvertido = password.split("").reverse().join();

    return stringInvertido;
}

console.log(encriptar("taller123"));
export default encriptar;