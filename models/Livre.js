export class Livre {
    constructor(titre, auteur, annee) {
        this.titre = titre;
        this.auteur = auteur;
        this.annee = annee;
    }

    afficher() {
        return `
            <div class="livre">
                <h3>${this.titre}</h3>
                <p>Auteur: ${this.auteur}</p>
                <p>Année: ${this.annee}</p>
            </div>
        `;
    }
}

export class LivrePapier extends Livre {
    constructor(titre, auteur, annee, pages) {
        super(titre, auteur, annee);
        this.pages = pages;
    }

    afficher() {
        return `
            <div class="livre">
                <h3>${this.titre}</h3>
                <p>Auteur: ${this.auteur}</p>
                <p>Année: ${this.annee}</p>
                <p>Pages: ${this.pages}</p>
            </div>
        `;
    }
}

export class LivreNumerique extends Livre {
    constructor(titre, auteur, annee, taille) {
        super(titre, auteur, annee);
        this.taille = taille;
    }

    afficher() {
        return `
            <div class="livre">
                <h3>${this.titre}</h3>
                <p>Auteur: ${this.auteur}</p>
                <p>Année: ${this.annee}</p>
                <p>Taille: ${this.taille} MB</p>
            </div>
        `;
    }
} 