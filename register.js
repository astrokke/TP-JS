
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}


function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}


document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

   
    const users = getUsers();


    
    users.push({
        email: email,
        password: password,
        role: role
    });

    saveUsers(users);

    alert('Inscription réussie !');
    window.location.href = 'index.html';
}); 