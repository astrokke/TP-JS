class Livre {
    constructor(titre, auteur, annee) {
        this.titre = titre;
        this.auteur = auteur;
        this.annee = annee;
        this.id = Date.now().toString();
    }

    afficherInfos() {
        return `${this.titre} - ${this.auteur} (${this.annee})`;
    }

    toJSON() {
        return {
            type: 'Livre',
            titre: this.titre,
            auteur: this.auteur,
            annee: this.annee,
            id: this.id
        };
    }

    static fromJSON(data) {
        return new Livre(data.titre, data.auteur, data.annee);
    }
}

class LivreNumerique extends Livre {
    constructor(titre, auteur, annee, tailleFichier) {
        super(titre, auteur, annee);
        this.tailleFichier = tailleFichier;
    }

    afficherInfos() {
        return `${super.afficherInfos()} - ${this.tailleFichier} Mo`;
    }

    toJSON() {
        return {
            type: 'LivreNumerique',
            titre: this.titre,
            auteur: this.auteur,
            annee: this.annee,
            id: this.id,
            tailleFichier: this.tailleFichier
        };
    }

    static fromJSON(data) {
        return new LivreNumerique(data.titre, data.auteur, data.annee, data.tailleFichier);
    }
}

class LivrePapier extends Livre {
    constructor(titre, auteur, annee, nombrePages) {
        super(titre, auteur, annee);
        this.nombrePages = nombrePages;
    }

    afficherInfos() {
        return `${super.afficherInfos()} - ${this.nombrePages} pages`;
    }

    toJSON() {
        return {
            type: 'LivrePapier',
            titre: this.titre,
            auteur: this.auteur,
            annee: this.annee,
            id: this.id,
            nombrePages: this.nombrePages
        };
    }

    static fromJSON(data) {
        return new LivrePapier(data.titre, data.auteur, data.annee, data.nombrePages);
    }
}

class Utilisateur {
    constructor(nom) {
        this.nom = nom;
        this.idUtilisateur = Date.now().toString();
    }

    voirProfil() {
        return `Nom: ${this.nom}`;
    }

    toJSON() {
        return {
            type: 'Utilisateur',
            nom: this.nom,
            idUtilisateur: this.idUtilisateur
        };
    }

    static fromJSON(data) {
        return new Utilisateur(data.nom);
    }
}

class Membre extends Utilisateur {
    constructor(nom) {
        super(nom);
        this.livresEmpruntes = [];
    }

    emprunterLivre(livre) {
        if (!this.livresEmpruntes.some(l => l.id === livre.id)) {
            this.livresEmpruntes.push(livre);
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            type: 'Membre',
            nom: this.nom,
            idUtilisateur: this.idUtilisateur,
            livresEmpruntes: this.livresEmpruntes
        };
    }

    static fromJSON(data) {
        const membre = new Membre(data.nom);
        membre.livresEmpruntes = data.livresEmpruntes.map(livre => {
            if (livre.type === 'LivreNumerique') {
                return LivreNumerique.fromJSON(livre);
            } else if (livre.type === 'LivrePapier') {
                return LivrePapier.fromJSON(livre);
            }
            return Livre.fromJSON(livre);
        });
        return membre;
    }
}

class Bibliothecaire extends Utilisateur {
    ajouterLivre(livre, bibliotheque) {
        if (!bibliotheque.some(l => l.id === livre.id)) {
            bibliotheque.push(livre);
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            type: 'Bibliothecaire',
            nom: this.nom,
            idUtilisateur: this.idUtilisateur
        };
    }

    static fromJSON(data) {
        return new Bibliothecaire(data.nom);
    }
} 