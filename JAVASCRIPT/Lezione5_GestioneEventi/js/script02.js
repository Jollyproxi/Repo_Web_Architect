const testo = document.querySelector("#testo");
const btn = document.querySelector("#btn");
const demo = document.querySelector("#demo");
const helper = document.querySelector("#helper");

function stampa(){
    demo.innerHTML = `<p> ${testo.value} </p>`;
}

testo.addEventListener("keydown", function(event){
    console.log(event); 
    if(event.key === "Enter"){
        // stampa();
        btn.click(); //Richiama l'eventListener della riga 17 dove richiamo la funzione stampa()
    }  
})

btn.addEventListener("click", stampa);

testo.addEventListener("focus", function(){
    helper.innerHTML = "<p> Inserisci un testo di almeno 10 caratteri </p>"
});

testo.addEventListener("blur", function(){
    if(testo.value.length < 10){
        helper.innerHTML = "<strong> Il tuo testo NON è di 10 caratteri </strong>";
        // testo.setAttribute("class", "brdRed");
        testo.classList.add("brdRed")
    }else{
        helper.innerHTML = "";
        // testo.removeAttribute("class");
        testo.classList.remove("brdRed");
    }
})