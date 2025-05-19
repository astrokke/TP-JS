import { Bibliotheque } from './services/Bibliotheque.js';
import { LivrePapier, LivreNumerique } from './models/Livre.js';


const app = new Bibliotheque();


if (!app.users.size) {
    app.ajouterUser('admin@bibliotheque.com', 'bibliothecaire');
    app.ajouterUser('membre@bibliotheque.com', 'membre');
}


document.getElementById('form-ajout').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titre = document.getElementById('titre').value;
    const auteur = document.getElementById('auteur').value;
    const annee = parseInt(document.getElementById('annee').value);
    const type = document.getElementById('type').value;

    let livre;
    if (type === 'papier') {
        const pages = parseInt(document.getElementById('pages').value);
        livre = new LivrePapier(titre, auteur, annee, pages);
    } else {
        const taille = parseInt(document.getElementById('taille').value);
        livre = new LivreNumerique(titre, auteur, annee, taille);
    }

    app.ajouterLivre(livre);
    app.afficherLivres();
    e.target.reset();
});

document.getElementById('btn-rechercher').addEventListener('click', () => {
    const titre = document.getElementById('recherche').value;
    const livres = app.rechercherLivre(titre);
    const display = document.getElementById('bibliothequeDisplay');
    display.innerHTML = livres.map(livre => livre.afficher()).join('');
});

document.getElementById('btn-afficher').addEventListener('click', () => {
    app.afficherLivres();
});

document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
   
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
       
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('user-display').style.display = 'flex';
        document.getElementById('user-name').textContent = user.email;
        
        if (user.role === 'bibliothecaire') {
            document.getElementById('add-book-section').style.display = 'block';
        }
    } else {
        alert('Email ou mot de passe incorrect !');
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('user-display').style.display = 'none';
    document.getElementById('add-book-section').style.display = 'none';
});

document.getElementById('type').addEventListener('change', (e) => {
    const type = e.target.value;
    document.getElementById('papier-fields').style.display = type === 'papier' ? 'block' : 'none';
    document.getElementById('numerique-fields').style.display = type === 'numerique' ? 'block' : 'none';
});


window.addEventListener('load', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('user-display').style.display = 'flex';
        document.getElementById('user-name').textContent = currentUser.email;
        if (currentUser.role === 'bibliothecaire') {
            document.getElementById('add-book-section').style.display = 'block';
        }
    }
});


window.app = app; 