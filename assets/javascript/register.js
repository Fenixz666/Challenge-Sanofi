document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById('register-form');
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');
    const closeSuccessButton = document.querySelector('.close-button');
    const closeErrorButton = document.querySelector('.close-button', errorModal);

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!email || !password || !confirmPassword) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            if (password !== confirmPassword) {
                alert('As senhas não coincidem. Por favor, tente novamente.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
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
