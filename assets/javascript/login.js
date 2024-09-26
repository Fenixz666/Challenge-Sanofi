document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                document.getElementById('success-modal').style.display = "block";

                setTimeout(function() {
                    window.location.href = 'site.html';
                }, 2000);
            } else {
                document.getElementById('error-modal').style.display = "block";
            }
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
