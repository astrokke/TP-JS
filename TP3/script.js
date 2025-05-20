let bibliotheque = [];
let utilisateurActuel = null;

function chargerDonnees() {
    const bibliothequeData = JSON.parse(localStorage.getItem('bibliotheque')) || [];
    bibliotheque = bibliothequeData.map(livre => {
        if (livre.type === 'LivreNumerique') {
            return LivreNumerique.fromJSON(livre);
        } else if (livre.type === 'LivrePapier') {
            return LivrePapier.fromJSON(livre);
        }
        return Livre.fromJSON(livre);
    });
}

function sauvegarderDonnees() {
    localStorage.setItem('bibliotheque', JSON.stringify(bibliotheque));
}

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;

        if (role === 'bibliothecaire') {
            utilisateurActuel = new Bibliothecaire(email);
        } else {
            utilisateurActuel = new Membre(email);
        }

        localStorage.setItem('utilisateurActuel', JSON.stringify(utilisateurActuel));
        window.location.href = 'index.html';
    });
}

function verifierConnexion() {
    const utilisateurData = JSON.parse(localStorage.getItem('utilisateurActuel'));
    if (!utilisateurData) {
        window.location.href = 'login.html';
        return;
    }

    if (utilisateurData.type === 'Bibliothecaire') {
        utilisateurActuel = Bibliothecaire.fromJSON(utilisateurData);
    } else {
        utilisateurActuel = Membre.fromJSON(utilisateurData);
    }
}

if (document.getElementById('livreForm')) {
    document.getElementById('livreForm').addEventListener('submit', function(e) {
        e.preventDefault();
        verifierConnexion();

        if (!(utilisateurActuel instanceof Bibliothecaire)) {
            alert('Seul un bibliothécaire peut ajouter des livres');
            return;
        }

        const titre = document.getElementById('titre').value;
        const auteur = document.getElementById('auteur').value;
        const annee = document.getElementById('annee').value;
        const type = document.getElementById('type').value;

        let livre;
        if (type === 'numerique') {
            const taille = document.getElementById('taille').value;
            livre = new LivreNumerique(titre, auteur, annee, taille);
        } else {
            const pages = document.getElementById('pages').value;
            livre = new LivrePapier(titre, auteur, annee, pages);
        }

        if (utilisateurActuel.ajouterLivre(livre, bibliotheque)) {
            sauvegarderDonnees();
            window.location.href = 'index.html';
        } else {
            alert('Ce livre existe déjà !');
        }
    });
}

function afficherLivres() {
    verifierConnexion();
    const liste = document.getElementById('livresListe');
    liste.innerHTML = '';
    bibliotheque.forEach((livre, index) => {
        const div = document.createElement('div');
        div.className = 'livre-item';
        div.innerHTML = `
            <span>${livre.afficherInfos()}</span>
            <div>
                ${utilisateurActuel instanceof Membre ? 
                    `<button onclick="emprunterLivre(${index})">Emprunter</button>` : ''}
                ${utilisateurActuel instanceof Bibliothecaire ? 
                    `<button class="supprimer" onclick="supprimerLivre(${index})">Supprimer</button>` : ''}
            </div>
        `;
        liste.appendChild(div);
    });
}

function emprunterLivre(index) {
    verifierConnexion();
    if (!(utilisateurActuel instanceof Membre)) {
        alert('Seul un membre peut emprunter des livres');
        return;
    }

    if (utilisateurActuel.emprunterLivre(bibliotheque[index])) {
        localStorage.setItem('utilisateurActuel', JSON.stringify(utilisateurActuel));
        alert('Livre emprunté !');
    } else {
        alert('Vous avez déjà emprunté ce livre !');
    }
}

function supprimerLivre(index) {
    verifierConnexion();
    if (!(utilisateurActuel instanceof Bibliothecaire)) {
        alert('Seul un bibliothécaire peut supprimer des livres');
        return;
    }

    bibliotheque.splice(index, 1);
    sauvegarderDonnees();
    afficherLivres();
}

function afficherEmprunts() {
    verifierConnexion();
    if (!(utilisateurActuel instanceof Membre)) {
        alert('Seul un membre peut voir ses emprunts');
        return;
    }

    const liste = document.getElementById('livresListe');
    liste.innerHTML = '<h2>Mes emprunts</h2>';
    if (utilisateurActuel.livresEmpruntes.length === 0) {
        liste.innerHTML += '<p>Aucun livre emprunté</p>';
        return;
    }
    utilisateurActuel.livresEmpruntes.forEach(livre => {
        const div = document.createElement('div');
        div.className = 'livre-item';
        div.innerHTML = `<span>${livre.afficherInfos()}</span>`;
        liste.appendChild(div);
    });
}

function rechercherLivres() {
    verifierConnexion();
    const recherche = document.getElementById('recherche').value.toLowerCase();
    const resultats = document.getElementById('resultats');
    resultats.innerHTML = '';

    const livresFiltres = bibliotheque.filter(livre => 
        livre.titre.toLowerCase().includes(recherche) ||
        livre.auteur.toLowerCase().includes(recherche)
    );

    if (livresFiltres.length === 0) {
        resultats.innerHTML = '<p>Aucun résultat trouvé</p>';
        return;
    }

    livresFiltres.forEach((livre, index) => {
        const div = document.createElement('div');
        div.className = 'livre-item';
        div.innerHTML = `
            <span>${livre.afficherInfos()}</span>
            <div>
                ${utilisateurActuel instanceof Membre ? 
                    `<button onclick="emprunterLivre(${bibliotheque.indexOf(livre)})">Emprunter</button>` : ''}
                ${utilisateurActuel instanceof Bibliothecaire ? 
                    `<button class="supprimer" onclick="supprimerLivre(${bibliotheque.indexOf(livre)})">Supprimer</button>` : ''}
            </div>
        `;
        resultats.appendChild(div);
    });
}

function deconnexion() {
    localStorage.removeItem('utilisateurActuel');
    window.location.href = 'login.html';
}

chargerDonnees(); 