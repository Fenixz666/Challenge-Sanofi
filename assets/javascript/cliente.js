document.addEventListener("DOMContentLoaded", function () {
    const successPopup = document.getElementById('success-popup');
    const closeSuccessPopup = document.querySelector('#success-popup .close');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorPopup = document.querySelector('#error-popup .close');
    const saveButton = document.getElementById('save-button');
    const form = document.getElementById('personal-info-form');
    const fields = document.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"], input[type="email"]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const fullName = document.getElementById('full-name').value.trim();
        const birthdate = document.getElementById('birthdate').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!fullName || !birthdate || !cpf || !phone || !email) {
            errorPopup.style.display = 'block';
            return;
        }

        successPopup.style.display = 'block';
        saveButton.innerText = "Alterar"; // Muda o texto do botão
    });

    closeSuccessPopup.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });

    closeErrorPopup.addEventListener('click', () => {
        errorPopup.style.display = 'none';
    });
});
