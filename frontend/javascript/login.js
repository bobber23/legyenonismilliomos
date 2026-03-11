document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerLink').addEventListener('click', register);
    document.getElementById('loginBtn').addEventListener('click', login);
});

const register = () => {
    try {
        const card = document.querySelector('.card');
        card.id = 'registerForm';
        card.innerHTML = `<div class="card-header text-center">
                        <h2>Regisztráció</h2>
                    </div>
                    <div class="card-body">
                        <div class="username">
                            <label for="usernameInput" class="form-label">Felhasználónév</label>
                            <input type="text" required class="form-control" id="usernameInput" placeholder="Adja meg a felhasználónevet"/>
                        </div>
                        <div class="password">
                            <label for="passwordInput" class="form-label">Jelszó</label>
                            <input type="password" required class="form-control" id="passwordInput" placeholder="Adja meg a jelszavát"/>
                        </div>
                        <div class="password">
                            <label for="passwordInputAgain" class="form-label">Jelszó</label>
                            <input type="password" required class="form-control" id="passwordInputAgain" placeholder="Adja meg a jelszavát újra"/>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <button class="registerBtn btn" id="registerBtn">
                            Regisztráció
                        </button>
                    </div>`;

        document.getElementById('registerBtn').addEventListener('click', registerPost);
    } catch (error) {
        console.log(error);
    }
};

const registerPost = async () => {
    try {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        const passwordAgain = document.getElementById('passwordInputAgain').value;
        if (password !== passwordAgain) {
            alert('Nem azonosak a jelszavak!');
        } else if (username === '' || password === '' || passwordAgain === '') {
            alert('Nem töltött ki mindent!');
        } else {
            try {
                await postMethodFetch('http://127.0.0.1:3000/api/register', { username, password });
            } catch (error) {
                alert('Foglalt felhasználónév!');
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const login = async () => {
    try {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        if (username === '' || password === '') {
            alert('Nem töltött ki mindent!');
        } else {
            try {
                await postMethodFetch('http://127.0.0.1:3000/api/login', {
                    username,
                    password
                });

                window.location.href = '/';
            } catch (error) {
                alert('Hibás felhasználónév vagy jelszó!');
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
