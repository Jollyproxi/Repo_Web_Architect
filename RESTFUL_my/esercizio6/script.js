//faccio partire il tutto con un btn
bottone1 = document.querySelector("#getAll");
bottone2 = document.querySelector("#getFiltered");
bottone3 = document.querySelector("#post");
bottone4 = document.querySelector("#put");
bottone5 = document.querySelector("#patch");
bottone6 = document.querySelector("#delete");


   
let nome ;
let cognome;
let email ; 


bottone1.addEventListener("click", function () {
    fetch("http://localhost:3000/applicazione")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
            }
            return response.json()
        })  
        .then(data => {
            console.log(data);
        })   
        .catch(error => {
            console.log(error.message);
        });

    fetch("http://localhost:3000/utenti")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
            }
            return response.json()
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error.message);
        });

    fetch("http://localhost:3000/docenti")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error.message);
        });

    fetch("http://localhost:3000/versioneDistribuita")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error.message);
        });
});
bottone2.addEventListener("click", function () {
    fetch("http://localhost:3000/utenti/1")
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error.message);
    });
});
bottone3.addEventListener("click", function () {
    nome = document.querySelector("#nome").value;
    cognome = document.querySelector("#cognome").value;
    email = document.querySelector("#email").value;

    postala(nome, cognome, email);
    
});
bottone4.addEventListener("click", function () {
    fetch(`http://localhost:3000/utenti?nome=${nome}&cognome=${cognome}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
        }
        return response.json()
    })
    .then(data => {
        console.log(data);
        fetch(`http://localhost:3000/utenti/${data[0].id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: "Marco",
                cognome: "Bianchi",
                email: "marco.bianchi@example.com"
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error.message);
            });

    })
    .catch(error => {
        console.log(error.message);
    });
});
bottone5.addEventListener("click", function () {
    fetch("http://localhost:3000/utenti?nome=Marco&cognome=Bianchi")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
            }
        return response.json()
    })
    .then(data => {
        console.log(data);
        fetch(`http://localhost:3000/utenti/${data[0].id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cognome: "Bianco"
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error.message);
            });
    })
    .catch(error => {
        console.log(error.message);
    });
});
bottone6.addEventListener("click", function () {
    fetch("http://localhost:3000/utenti?nome=Marco&cognome=Bianco")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
            }
            return response.json();
    })
    .then(data => {
        console.log(data);
        fetch(`http://localhost:3000/utenti/${data[0].id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
                }
                console.log("Utente eliminato con successo");
            })
            .catch(error => {
                console.log(error.message);
            });
    })
    .catch(error => {
        console.log(error.message);
    });
});
function postala(nome, cognome, email) 
{ 
    //prendo i valori dal form
   
    //mostro lo spinner
    const spinner = document.querySelector("#spinnerPost");
    const btnPost = document.querySelector("#post");
    spinner.classList.remove("d-none");
    btnPost.disabled = true;

    fetch("http://localhost:3000/utenti", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            cognome: cognome,
            email: email
        })

    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nella richiesta di tipo " + `${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error.message);
    })
    .finally(() => {
        //nascondo lo spinner dopo 1 secondo per assicurare visibilità
        setTimeout(() => {
            spinner.classList.add("d-none");
            btnPost.disabled = false;
        }, 1000);
    });
};


