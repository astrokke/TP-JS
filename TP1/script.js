let books = JSON.parse(localStorage.getItem('books')) || [];

document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    try {
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();

        if (!title || !author) {
            throw new Error('Veuillez remplir tous les champs');
        }

        const book = { title, author };
        books.push(book);
        saveBooks();
        displayBooks();
        this.reset();
    } catch (error) {
        alert(error.message);
    }
});

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function displayBooks() {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';
    
    books.forEach((book, index) => {
        const li = document.createElement('li');
        li.className = 'book-item';
        li.innerHTML = `
            <span>${book.title} - ${book.author}</span>
            <button class="delete-btn" onclick="deleteBook(${index})">Supprimer</button>
        `;
        booksList.appendChild(li);
    });
}

function deleteBook(index) {
    try {
        if (index < 0 || index >= books.length) {
            throw new Error('Livre non trouvé');
        }
        books.splice(index, 1);
        saveBooks();
        displayBooks();
    } catch (error) {
        alert(error.message);
    }
}

function searchBook() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm)
    );

    if (filteredBooks.length === 0) {
        booksList.innerHTML = '<li>Aucun livre trouvé</li>';
        return;
    }

    filteredBooks.forEach((book, index) => {
        const li = document.createElement('li');
        li.className = 'book-item';
        li.innerHTML = `
            <span>${book.title} - ${book.author}</span>
            <button class="delete-btn" onclick="deleteBook(${books.indexOf(book)})">Supprimer</button>
        `;
        booksList.appendChild(li);
    });
}

displayBooks();
