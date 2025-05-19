import { Livre, LivrePapier, LivreNumerique } from '../models/Livre.js';
import { Bibliothecaire, Membre } from '../models/User.js';

export class Bibliotheque {
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

    ajouterUser(email, role, password) {
        if (this.users.has(email)) {
            throw new Error('Cet email est déjà utilisé');
        }

        const user = role === 'bibliothecaire' ? 
            new Bibliothecaire(email, password) : 
            new Membre(email, password);
        this.users.set(email, user);
        this.saveToLocalStorage();
    }

    connecter(email, password) {
        const user = this.users.get(email);
        if (user && user.verifierMotDePasse(password)) {
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
                    new Bibliothecaire(email, userData.password) : 
                    new Membre(email, userData.password);
                user.livresEmpruntes = userData.livresEmpruntes;
                return [email, user];
            }));
        }
    }
} 