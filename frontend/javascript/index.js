document.addEventListener('DOMContentLoaded', () => {
    registerForm.style.display = 'none';
    document.getElementById('showRegister').addEventListener('click', toggleLoginOrRegister);
    document.getElementById('showLogin').addEventListener('click', toggleLoginOrRegister);
});

function toggleLoginOrRegister() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm.style.display === 'none') {
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
    }
    else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
    }
}