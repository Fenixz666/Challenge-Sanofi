document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            errorMessage.style.display = 'none';

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            loginButton.classList.add('loading');
            loginButton.innerHTML = '<div class="loader"></div><div class="loader"></div><div class="loader"></div>';

            setTimeout(() => {
                if (!email || !password) {
                    errorMessage.innerText = 'Por favor, preencha todos os campos.';
                    errorMessage.style.display = 'block';
                    loginButton.classList.remove('loading');
                    loginButton.innerHTML = 'Entrar';
                } else {
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const user = users.find(user => user.email === email && user.password === password);

                    if (user) {
                        localStorage.setItem('currentUser', JSON.stringify(user));

                        setTimeout(function() {
                            loginButton.classList.remove('loading');
                            loginButton.innerHTML = 'Entrar';
                            window.location.href = 'site.html';
                        }, 1000);
                    } else {
                        errorMessage.innerText = 'Credenciais inválidas.';
                        errorMessage.style.display = 'block';
                        loginButton.classList.remove('loading');
                        loginButton.innerHTML = 'Entrar';
                    }
                }
            }, 1000);
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');

    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'password') {
            togglePassword.src = 'assets/Imagens/eye-password-hide-svgrepo-com.png';
        } else {
            togglePassword.src = 'assets/Imagens/eye-password-hide-svgrepo-com.png';
        }
    });
});
