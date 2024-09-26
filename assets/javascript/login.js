document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            errorMessage.style.display = 'none'; // Oculta a mensagem de erro ao tentar logar

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Adiciona a classe de loading ao botão e oculta o texto
            loginButton.classList.add('loading');
            loginButton.innerHTML = '<div class="loader"></div><div class="loader"></div><div class="loader"></div>';

            setTimeout(() => { // Simula um tempo de validação de dados
                if (!email || !password) {
                    errorMessage.innerText = 'Por favor, preencha todos os campos.';
                    errorMessage.style.display = 'block';

                    // Remove a classe de loading após a validação falha
                    loginButton.classList.remove('loading');
                    loginButton.innerHTML = 'Entrar'; // Restaura o texto do botão

                } else {
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const user = users.find(user => user.email === email && user.password === password);

                    if (user) {
                        localStorage.setItem('currentUser', JSON.stringify(user));

                        // Simulação de sucesso: remove a animação de carregamento e redireciona após 2 segundos
                        setTimeout(function() {
                            loginButton.classList.remove('loading');
                            loginButton.innerHTML = 'Entrar'; // Restaura o texto do botão

                            // Redireciona para a página "site.html"
                            window.location.href = 'site.html';
                        }, 1000);

                    } else {
                        errorMessage.innerText = 'Credenciais inválidas.';
                        errorMessage.style.display = 'block';

                        // Remove a classe de loading após falha
                        loginButton.classList.remove('loading');
                        loginButton.innerHTML = 'Entrar'; // Restaura o texto do botão
                    }
                }
            }, 1000); // Ajuste o tempo conforme necessário
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');

    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Alterna a imagem entre olho aberto e fechado
        if (type === 'password') {
            togglePassword.src = 'assets/Imagens/eye-password-hide-svgrepo-com.png'; // Caminho para a imagem de olho fechado
        } else {
            togglePassword.src = 'assets/Imagens/eye-password-hide-svgrepo-com.png'; // Caminho para a imagem de olho aberto
        }
    });
});
