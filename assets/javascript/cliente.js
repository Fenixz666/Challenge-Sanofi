document.addEventListener("DOMContentLoaded", function () {
    const addressButton = document.getElementById('address-button');
    const addressPopup = document.getElementById('address-popup');
    const successPopup = document.getElementById('success-popup');
    const closeSuccessPopup = document.querySelector('#success-popup .close');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorPopup = document.querySelector('#error-popup .close');
    const saveButton = document.getElementById('save-button');
    const form = document.getElementById('personal-info-form');
    const fields = document.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"], input[type="email"]');
    const addressField = document.getElementById('autocomplete');

    addressButton.addEventListener('click', () => {
        addressPopup.style.display = 'block';
    });

    closeAddressPopup.addEventListener('click', () => {
        addressPopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === addressPopup) {
            addressPopup.style.display = 'none';
        }
        if (event.target === successPopup) {
            successPopup.style.display = 'none';
        }
        if (event.target === errorPopup) {
            errorPopup.style.display = 'none';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const fullName = document.getElementById('full-name').value.trim();
        const birthdate = document.getElementById('birthdate').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = addressField.value.trim();

        if (!fullName || !birthdate || !cpf || !phone || !email) {
            errorPopup.style.display = 'block';
            return;
        }

        console.log(`
            Nome Completo: ${fullName}
            Data de Nascimento: ${birthdate}
            CPF: ${cpf}
            Telefone: ${phone}
            Email: ${email}
            Endereço: ${address}
        `);

        successPopup.style.display = 'block';
        saveButton.innerText = "Alterar";
    });

    saveButton.addEventListener('click', () => {
        if (saveButton.innerText === "Alterar") {
            fields.forEach(field => {
                if (field !== addressField) {
                    field.disabled = false;
                }
            });
            saveButton.innerText = "Salvar";
            successPopup.style.display = 'none';
        }
    });

    closeSuccessPopup.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });

    closeErrorPopup.addEventListener('click', () => {
        errorPopup.style.display = 'none';
    });
});
