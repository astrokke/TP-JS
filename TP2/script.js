let livres = JSON.parse(localStorage.getItem('livres')) || [];

if (document.getElementById('livreForm')) {
    document.getElementById('livreForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const titre = document.getElementById('titre').value.trim();
        if (titre) {
            livres.push(titre);
            localStorage.setItem('livres', JSON.stringify(livres));
            window.location.href = 'index.html';
        }
    });
}

function afficherLivres() {
    const liste = document.getElementById('livresListe');
    liste.innerHTML = '';
    livres.forEach((livre, index) => {
        const div = document.createElement('div');
        div.className = 'livre-item';
        div.innerHTML = `
            <span>${livre}</span>
            <button class="supprimer" onclick="supprimerLivre(${index})">Supprimer</button>
        `;
        liste.appendChild(div);
    });
}

function supprimerLivre(index) {
    livres.splice(index, 1);
    localStorage.setItem('livres', JSON.stringify(livres));
    if (document.getElementById('livresListe')) {
        afficherLivres();
    } else {
        rechercherLivres();
    }
}

function rechercherLivres() {
    const recherche = document.getElementById('recherche').value.toLowerCase();
    const resultats = document.getElementById('resultats');
    resultats.innerHTML = '';

    const livresFiltres = livres.filter(livre => 
        livre.toLowerCase().includes(recherche)
    );

    if (livresFiltres.length === 0) {
        resultats.innerHTML = '<p>Aucun résultat trouvé</p>';
        return;
    }

    livresFiltres.forEach((livre, index) => {
        const div = document.createElement('div');
        div.className = 'livre-item';
        div.innerHTML = `
            <span>${livre}</span>
            <button class="supprimer" onclick="supprimerLivre(${livres.indexOf(livre)})">Supprimer</button>
        `;
        resultats.appendChild(div);
    });
}

function quitter() {
    window.close();
}
