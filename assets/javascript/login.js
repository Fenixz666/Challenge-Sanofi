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
                } else {
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const user = users.find(user => user.email === email && user.password === password);

                    if (user) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        document.getElementById('success-modal').style.display = "block";

                        setTimeout(function() {
                            window.location.href = 'site.html';
                        }, 2000);
                    } else {
                        errorMessage.innerText = 'Credenciais inválidas';
                        errorMessage.style.display = 'block';
                    }
                }

                // Remove a classe de loading após a validação
                loginButton.classList.remove('loading');
                loginButton.innerHTML = 'Entrar'; // Restaura o texto do botão
            }, 1000); // Ajuste o tempo conforme necessário
        });
    }

    const closeButtons = document.querySelectorAll('.close-button');
    
    closeButtons.forEach(button => {
        button.onclick = function() {
            document.getElementById('success-modal').style.display = "none";
            document.getElementById('error-modal').style.display = "none"; 
        };
    });

    window.onclick = function(event) {
        const successModal = document.getElementById('success-modal');
        const errorModal = document.getElementById('error-modal');
        
        if (event.target === successModal) {
            successModal.style.display = "none";
        } else if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    }
});
