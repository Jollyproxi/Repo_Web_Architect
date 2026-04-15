class Prodotto {
    constructor(nome, desc, img, prezzo) {
        this.nome = nome;
        this.desc = desc;
        this.img = img;
        this.prezzo = prezzo;
    }

}

let prodotti = [
    new Prodotto("Smartphone", "Lorem ecc ecc", "https://i.guim.co.uk/img/media/6ead18d1b23b6cdaa33f6731c0c417a8f0576552/539_452_3726_2236/master/3726.jpg?width=445&dpr=1&s=none&crop=none", 599),
    new Prodotto("PC", "Lorem ecc ecc", "https://t3.ftcdn.net/jpg/05/44/71/62/360_F_544716203_PkX2ZAij0YWqvgDpd8P8bF32zTSxzO1K.jpg", 699),
    new Prodotto("Tablet", "Lorem ecc ecc", "https://cdn.thewirecutter.com/wp-content/media/2025/04/BEST-TABLETS-2048px-3x2-1.jpg?auto=webp&quality=75&crop=4:3,smart&width=1024", 450)
]

const main = document.querySelector("#main");
const container = document.querySelector("#main .container");

/**
 * @param {Prodotto} prodotto 
 */
function creaCard(prodotto) {
    // <div class="card">
    //    <h3>Smartphone</h3>
    //    <img src="..." alt="immagine dello smartphone">
    //    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, repudiandae?</p>
    //  </div>
    let card = document.createElement("div");
    card.setAttribute("class", "card");

    let nome = document.createElement("h3");
    nome.textContent = prodotto.nome;

    let desc = document.createElement("p");
    desc.textContent = prodotto.desc;

    let img = document.createElement("img");
    img.setAttribute("src", prodotto.img);

    let prezzo = document.createElement("h4");
    prezzo.textContent = "€ " + prodotto.prezzo;

    let btnCompra = document.createElement("button");
    btnCompra.textContent = "Acquista";

    btnCompra.addEventListener("click", function(){
        console.log("Stai acquistando ", prodotto, " al prezzo di ", prodotto.prezzo);
    })

    // card.appendChild(nome);
    // card.appendChild(img);
    // card.appendChild(desc);
    // card.appendChild(prezzo);
    // card.appendChild(btnCompra);
    card.append(nome, img, desc, prezzo, btnCompra);

    return card;
}


function caricaProdotti(){
    prodotti.forEach(prod => {
        let card = creaCard(prod)
        container.appendChild(card);
    })
}

document.addEventListener("DOMContentLoaded", caricaProdotti)