let openBtn = document.querySelector(".open-btn");
let closeBtn = document.querySelector(".close-btn");

let menu = document.querySelector("nav ul");

openBtn.addEventListener("click", function(){
    menu.classList.add("open");
})

closeBtn.addEventListener("click", ()=>{
    menu.classList.remove("open")
})