async function creaDocente({id, nome, email}) {
    try {
        
        const response = await fetch("http://localhost:3000/utenti", {
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({id, nome, email})
        });

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);            
        }

        const created = await response.json();

        console.log(`Hai creato uno user con id ${created.id}`);
        
        return created;

    } catch (error) {
        console.log(`Fallito:  ${error.message}`);
        
    }finally{
        console.log("Richiesta terminata");
    }
}

const btn = document.querySelector("#btn");

btn.addEventListener("click", function(){
    let user ={
        id: 9,
        nome: "Maria Bianchi",
        email: "maria@mail.com"
    }
    creaDocente(user)
})