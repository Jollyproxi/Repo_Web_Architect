
let libro1 = document.querySelector("#listaLibri li.red");
console.log(libro1.textContent);


let libro2 = document.querySelectorAll("#listaLibri li.red")[0];  // è una Nodelist quindi posso
console.log(libro2);

let libro3 = document.querySelector("#listaLibri").firstElementChild;   //top 3 metodo
console.log(libro3);

let libro4 = document.querySelector("#listaLibri").children[0];   //top 3 metodo
console.log(libro4);

let libro5 = document.querySelector("#listaLibri").childNodes[1];// occhio agli spazi
console.log(libro5);




