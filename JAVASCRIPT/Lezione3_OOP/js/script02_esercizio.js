function Studente(nome, cognome, corso, email){
    //Proprietà
    this.nome = nome;
    this.cognome = cognome;
    this.corso = corso;
    this.email = email;

    //Metodi
    this.presentati = function(){
        return `Ciao, mi chiamo ${this.nome} ${this.cognome} e sono iscritto al corso di ${this.corso}`;
    }
}