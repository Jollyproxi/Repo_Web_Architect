function saluta(nome){
    console.log(`Ciao ${nome}`); 
}

//Modo 2
const btn1 = document.querySelector("#btn1");

btn1.onclick = function(){
    saluta("Laura")
};

//Modo3
function accendiPC(){
    let avviso = "Stai attivando il tuo PC";
    console.log(avviso);
}

const btn2 = document.querySelector("#btn2");

btn2.addEventListener("click", function(){
    saluta("Marco");
})

btn2.addEventListener("click", accendiPC); //Le funzioni richiamate nell'eventListener non hanno le ()

btn2.addEventListener("click", function(event){
    console.log(event);
})

const contenitore = document.querySelector("#contenitore");

contenitore.addEventListener("dblclick", function(event){
    console.log("Stai cliccando in posizione: X - " + event.clientX + " Y - " + event.clientY);
})

contenitore.addEventListener("mouseenter", function(event){
    console.log(event);
    console.log("Sei entrato nel container");
    
})

contenitore.addEventListener("mouseleave", function(event){
    console.log(event);
    console.log("Sei uscito dal container");   
})

contenitore.addEventListener("mousemove", function(event){
    let a = Math.ceil(Math.random() * 255);
    let b = Math.ceil(Math.random() * 255);
    let c = Math.ceil(Math.random() * 255);
    console.log(a,b,c);
    //Da decommentare per lo strobo
    // contenitore.setAttribute("style", `background-color: rgb(${a}, ${b}, ${c}`);    
})