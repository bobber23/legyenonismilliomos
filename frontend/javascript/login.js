document.addEventListener('DOMContentLoaded', () => {
    registerForm.style.display = 'none';
    document.getElementById('showRegister').addEventListener('click', toggleLoginOrRegister);
    document.getElementById('showLogin').addEventListener('click', toggleLoginOrRegister);
    document.getElementById('loginButton').addEventListener('click', loginPost);
    document.getElementById('registerButton').addEventListener('click', registerPost);
});

function toggleLoginOrRegister() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm.style.display === 'none') {
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
    }
}

const registerPost = async () => {
    try {
        const username = document.getElementById('registerUsernameInput').value;
        const password = document.getElementById('registerPasswordInput').value;
        const passwordAgain = document.getElementById('registerPasswordInputAgain').value;
        if (password !== passwordAgain) {
            showAlert('Nem azonosak a jelszavak!');
        } else if (username === '' || password === '' || passwordAgain === '') {
            showAlert('Nem töltött ki mindent!');
        } else {
            try {
                await postMethodFetch('http://127.0.0.1:3000/api/register', { username, password });
            } catch (error) {
                showAlert('Foglalt felhasználónév!');
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const loginPost = async () => {
    try {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        if (username === '' || password === '') {
            showAlert('Nem töltött ki mindent!');
        } else {
            try {
                await postMethodFetch('http://127.0.0.1:3000/api/login', {
                    username,
                    password
                });

                window.location.href = '/';
            } catch (error) {
                showAlert('Hibás felhasználónév vagy jelszó!');
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const getMethodFetch = async (url) => {
    try {
        const response = await fetch(url, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`GET Hiba: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Hiba történt: ${error}`);
    }
};

const postMethodFetch = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`POST Hiba: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Hiba történt: ${error}`);
    }
};

function showAlert(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('alert').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alert').style.display = 'none';
}
