//Con il Promise.all() posso lanciare due o più richieste avviandole in contemporanea
//Avvio entrambe le Promise semza un await immediato e poi aspetto l'array completo con Promise.all()

//Chiamate in PARALLELO

async function lancioParallelo() {
    

    const userPromise = fetch("https://jsonplaceholder.typicod.com/users").then(r => r.json());
    const docPromise = fetch("http://localhost:3000/docenti").then(r => r.json());

    
    //Se una delle due Promise fallisce allora vengono scartati anche i risultati dell'altra.
    // const [user, docs] = await Promise.all([userPromise, docPromise]);

    //Se voglio conoscere l'esito delle chiamate indipendentemente dagli errori uso Promise.allSettled()
    const [user, docs] = await Promise.allSettled([userPromise, docPromise]);
    
    console.log(user);
    console.log(docs);
}

lancioParallelo();