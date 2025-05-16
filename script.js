document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form-ajout").addEventListener("submit", addBook);
    document.getElementById("btn-rechercher").addEventListener("click", findBook);
    document.getElementById("btn-afficher").addEventListener("click", displayBooks);
});

let library = [];

function createBook(title, year, author) {
    return {
        title: title,
        year: year,
        author: author,
        info: function() {
            return `${this.title} (${this.year}) par ${this.author}`;
        }
    };
}

function addBook(e) {
    e.preventDefault();

    const title = document.getElementById("titre").value.trim();
    const year = document.getElementById("annee").value.trim();
    const author = document.getElementById("auteur").value.trim();

    if (!title || !year || !author) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    library.push(createBook(title, year, author));
    
    document.getElementById("titre").value = "";
    document.getElementById("annee").value = "";
    document.getElementById("auteur").value = "";
    displayBooks();
}

function displayBooks() {
    const display = document.getElementById("bibliothequeDisplay");
    display.innerHTML = "";

    if (library.length === 0) {
        display.innerText = "Aucun livre dans la bibliothèque.";
        return;
    }

    for (let i = 0; i < library.length; i++) {
        const book = library[i];
        
        const bookDiv = document.createElement("div");
        bookDiv.className = "livre";
        
        bookDiv.innerHTML = `
            <span>${book.info()}</span>
            <button onclick="editBook(${i})">Modifier</button>
            <button onclick="deleteBook(${i})">Supprimer</button>
        `;
        
        display.appendChild(bookDiv);
    }
}

function findBook() {
    const title = document.getElementById("recherche").value.trim();
    const display = document.getElementById("bibliothequeDisplay");
    
    if (!title) {
        alert("Veuillez entrer un titre à rechercher");
        return;
    }
    
    display.innerHTML = "";
    
    let found = false;
    for (let i = 0; i < library.length; i++) {
        if (library[i].title.toLowerCase() === title.toLowerCase()) {
            display.innerHTML = `<div>Livre trouvé: ${library[i].info()}</div>`;
            found = true;
            break;
        }
    }
    
    if (!found) {
        display.innerHTML = "Livre non trouvé.";
    }
}

function editBook(index) {
    const book = library[index];
    
    const newTitle = prompt("Titre:", book.title);
    if (newTitle !== null) book.title = newTitle;
    
    const newYear = prompt("Année:", book.year);
    if (newYear !== null) book.year = newYear;
    
    const newAuthor = prompt("Auteur:", book.author);
    if (newAuthor !== null) book.author = newAuthor;
    
    displayBooks();
}

function deleteBook(index) {
    if (confirm("Voulez-vous vraiment supprimer ce livre?")) {
        library.splice(index, 1);
        displayBooks();
    }
}