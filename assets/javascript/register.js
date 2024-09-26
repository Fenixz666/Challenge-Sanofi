document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById('register-form');
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const registerButton = document.getElementById('register-button');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            errorMessage.style.display = 'none';
            registerButton.classList.add('loading');
            registerButton.innerHTML = '<div class="loader"></div><div class="loader"></div><div class="loader"></div>';

            setTimeout(() => {
                if (!email || !password || !confirmPassword) {
                    registerButton.classList.remove('loading');
                    registerButton.innerHTML = 'Cadastrar';
                    errorMessage.innerText = 'Por favor, preencha todos os campos.';
                    errorMessage.style.display = 'block';
                    return;
                }

                if (password !== confirmPassword) {
                    registerButton.classList.remove('loading');
                    registerButton.innerHTML = 'Cadastrar';
                    errorMessage.innerText = 'As senhas não coincidem. Por favor, tente novamente.';
                    errorMessage.style.display = 'block';
                    return;
                }

                const users = JSON.parse(localStorage.getItem('users')) || [];
                const existingUser = users.find(user => user.email === email);

                if (existingUser) {
                    registerButton.classList.remove('loading');
                    registerButton.innerHTML = 'Cadastrar';
                    errorModal.style.display = 'block';
                    return;
                }

                const newUser = { email, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                successModal.style.display = 'block';

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }, 1000);
        });
    }

    const closeButtons = document.querySelectorAll('.close-button');
    
    closeButtons.forEach(button => {
        button.onclick = function() {
            successModal.style.display = "none";
            errorModal.style.display = "none"; 
        };
    });

    window.onclick = function(event) {
        if (event.target === successModal) {
            successModal.style.display = "none";
        } else if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    }
});
