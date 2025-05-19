
class Livre {
    constructor(titre, auteur, annee) {
        this.titre = titre;
        this.auteur = auteur;
        this.annee = annee;
        this.emprunte = false;
        this.emprunteur = null;
    }

    afficher() {
        return `
            <div class="livre">
                <h3>${this.titre}</h3>
                <p>Auteur: ${this.auteur}</p>
                <p>Année: ${this.annee}</p>
                <p>Statut: ${this.emprunte ? 'Emprunté' : 'Disponible'}</p>
                ${this.emprunte ? `<p>Emprunté par: ${this.emprunteur}</p>` : ''}
                <div class="actions">
                    ${!this.emprunte ? 
                        `<button onclick="bibliotheque.emprunterLivre('${this.titre}')">Emprunter</button>` :
                        `<button onclick="bibliotheque.retournerLivre('${this.titre}')" ${!bibliotheque.estConnecte() ? 'disabled' : ''}>Retourner</button>`
                    }
                </div>
            </div>
        `;
    }

    emprunter(emprunteur) {
        if (!this.emprunte) {
            this.emprunte = true;
            this.emprunteur = emprunteur;
            return true;
        }
        return false;
    }

    retourner() {
        if (this.emprunte) {
            this.emprunte = false;
            this.emprunteur = null;
            return true;
        }
        return false;
    }
}

class LivrePapier extends Livre {
    constructor(titre, auteur, annee, isbn, pages) {
        super(titre, auteur, annee);
        this.isbn = isbn;
        this.pages = pages;
    }

    afficher() {
        return `
            <div class="livre">
                <h3>${this.titre}</h3>
                <p>Auteur: ${this.auteur}</p>
                <p>Année: ${this.annee}</p>
                <p>ISBN: ${this.isbn}</p>
                <p>Pages: ${this.pages}</p>
                <p>Statut: ${this.emprunte ? 'Emprunté' : 'Disponible'}</p>
                ${this.emprunte ? `<p>Emprunté par: ${this.emprunteur}</p>` : ''}
                <div class="actions">
                    ${!this.emprunte ? 
                        `<button onclick="bibliotheque.emprunterLivre('${this.titre}')">Emprunter</button>` :
                        `<button onclick="bibliotheque.retournerLivre('${this.titre}')" ${!bibliotheque.estConnecte() ? 'disabled' : ''}>Retourner</button>`
                    }
                </div>
            </div>
        `;
    }
}

class LivreNumerique extends Livre {
    constructor(titre, auteur, annee, format, taille) {
        super(titre, auteur, annee);
        this.format = format;
        this.taille = taille;
    }

    afficher() {
        return `
            <div class="livre">
                <h3>${this.titre}</h3>
                <p>Auteur: ${this.auteur}</p>
                <p>Année: ${this.annee}</p>
                <p>Format: ${this.format}</p>
                <p>Taille: ${this.taille} MB</p>
                <p>Statut: ${this.emprunte ? 'Emprunté' : 'Disponible'}</p>
                ${this.emprunte ? `<p>Emprunté par: ${this.emprunteur}</p>` : ''}
                <div class="actions">
                    ${!this.emprunte ? 
                        `<button onclick="bibliotheque.emprunterLivre('${this.titre}')">Emprunter</button>` :
                        `<button onclick="bibliotheque.retournerLivre('${this.titre}')" ${!bibliotheque.estConnecte() ? 'disabled' : ''}>Retourner</button>`
                    }
                </div>
            </div>
        `;
    }
}

class User {
    constructor(email) {
        this.email = email;
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
}

class Bibliothecaire extends User {
    constructor(email) {
        super(email);
        this.role = 'bibliothecaire';
    }
}

class Membre extends User {
    constructor(email) {
        super(email);
        this.role = 'membre';
    }
}

class Bibliotheque {
    constructor() {
        this.livres = [];
        this.users = new Map();
        this.currentUser = null;
        this.loadFromLocalStorage();
    }

    ajouterLivre(livre) {
        this.livres.push(livre);
        this.saveToLocalStorage();
    }

    supprimerLivre(titre) {
        this.livres = this.livres.filter(livre => livre.titre !== titre);
        this.saveToLocalStorage();
    }

    rechercherLivre(titre) {
        return this.livres.filter(livre => 
            livre.titre.toLowerCase().includes(titre.toLowerCase())
        );
    }

    afficherLivres() {
        const display = document.getElementById('bibliothequeDisplay');
        display.innerHTML = this.livres.map(livre => livre.afficher()).join('');
    }

    emprunterLivre(titre) {
        if (!this.currentUser) {
            alert('Veuillez vous connecter pour emprunter un livre');
            return;
        }

        const livre = this.livres.find(l => l.titre === titre);
        if (livre && this.currentUser.emprunterLivre(livre)) {
            this.saveToLocalStorage();
            this.afficherLivres();
        }
    }

    retournerLivre(titre) {
        if (!this.currentUser) {
            alert('Veuillez vous connecter pour retourner un livre');
            return;
        }

        const livre = this.livres.find(l => l.titre === titre);
        if (livre && this.currentUser.retournerLivre(livre)) {
            this.saveToLocalStorage();
            this.afficherLivres();
        }
    }

    ajouterUser(email, role) {
        const user = role === 'bibliothecaire' ? 
            new Bibliothecaire(email) : 
            new Membre(email);
        this.users.set(email, user);
        this.saveToLocalStorage();
    }

    connecter(email) {
        const user = this.users.get(email);
        if (user) {
            this.currentUser = user;
            this.updateUI();
            return true;
        }
        return false;
    }

    deconnecter() {
        this.currentUser = null;
        this.updateUI();
    }

    estConnecte() {
        return this.currentUser !== null;
    }

    estBibliothecaire() {
        return this.currentUser && this.currentUser.role === 'bibliothecaire';
    }

    updateUI() {
        const loginForm = document.getElementById('login-form');
        const userDisplay = document.getElementById('user-display');
        const addBookSection = document.getElementById('add-book-section');
        const userName = document.getElementById('user-name');

        if (this.currentUser) {
            loginForm.style.display = 'none';
            userDisplay.style.display = 'flex';
            userName.textContent = this.currentUser.email;
            addBookSection.style.display = this.estBibliothecaire() ? 'block' : 'none';
        } else {
            loginForm.style.display = 'flex';
            userDisplay.style.display = 'none';
            addBookSection.style.display = 'none';
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('bibliotheque', JSON.stringify({
            livres: this.livres,
            users: Array.from(this.users.entries())
        }));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('bibliotheque');
        if (data) {
            const parsed = JSON.parse(data);
            this.livres = parsed.livres.map(livre => {
                if (livre.format) {
                    return new LivreNumerique(livre.titre, livre.auteur, livre.annee, livre.format, livre.taille);
                } else if (livre.isbn) {
                    return new LivrePapier(livre.titre, livre.auteur, livre.annee, livre.isbn, livre.pages);
                } else {
                    return new Livre(livre.titre, livre.auteur, livre.annee);
                }
            });
            this.users = new Map(parsed.users.map(([email, userData]) => {
                const user = userData.role === 'bibliothecaire' ? 
                    new Bibliothecaire(email) : 
                    new Membre(email);
                user.livresEmpruntes = userData.livresEmpruntes;
                return [email, user];
            }));
        }
    }
}

const bibliotheque = new Bibliotheque();

if (!bibliotheque.users.size) {
    bibliotheque.ajouterUser('admin@bibliotheque.com', 'bibliothecaire');
    bibliotheque.ajouterUser('membre@bibliotheque.com', 'membre');
}

document.getElementById('form-ajout').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titre = document.getElementById('titre').value;
    const auteur = document.getElementById('auteur').value;
    const annee = parseInt(document.getElementById('annee').value);
    const type = document.getElementById('type').value;

    let livre;
    if (type === 'papier') {
        const isbn = document.getElementById('isbn').value;
        const pages = parseInt(document.getElementById('pages').value);
        livre = new LivrePapier(titre, auteur, annee, isbn, pages);
    } else {
        const format = document.getElementById('format').value;
        const taille = parseInt(document.getElementById('taille').value);
        livre = new LivreNumerique(titre, auteur, annee, format, taille);
    }

    bibliotheque.ajouterLivre(livre);
    bibliotheque.afficherLivres();
    e.target.reset();
});

document.getElementById('btn-rechercher').addEventListener('click', () => {
    const titre = document.getElementById('recherche').value;
    const livres = bibliotheque.rechercherLivre(titre);
    const display = document.getElementById('bibliothequeDisplay');
    display.innerHTML = livres.map(livre => livre.afficher()).join('');
});

document.getElementById('btn-afficher').addEventListener('click', () => {
    bibliotheque.afficherLivres();
});

document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('user-email').value;
    if (bibliotheque.connecter(email)) {
        alert('Connexion réussie !');
    } else {
        alert('Utilisateur non trouvé !');
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    bibliotheque.deconnecter();
});

document.getElementById('type').addEventListener('change', (e) => {
    const type = e.target.value;
    document.getElementById('papier-fields').style.display = type === 'papier' ? 'block' : 'none';
    document.getElementById('numerique-fields').style.display = type === 'numerique' ? 'block' : 'none';
});