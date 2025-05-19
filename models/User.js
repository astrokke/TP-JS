export class User {
    constructor(email, password) {
        this.email = email;
        this.password = password; // Dans un vrai système, il faudrait hasher le mot de passe
        this.livresEmpruntes = [];
    }

    emprunterLivre(livre) {
        if (livre.emprunter(this.email)) {
            this.livresEmpruntes.push(livre);
            return true;
        }
        return false;
    }

    retournerLivre(livre) {
        if (livre.retourner()) {
            this.livresEmpruntes = this.livresEmpruntes.filter(l => l.titre !== livre.titre);
            return true;
        }
        return false;
    }

    verifierMotDePasse(password) {
        return this.password === password;
    }
}

export class Bibliothecaire extends User {
    constructor(email, password) {
        super(email, password);
        this.role = 'bibliothecaire';
    }
}

export class Membre extends User {
    constructor(email, password) {
        super(email, password);
        this.role = 'membre';
    }
} 