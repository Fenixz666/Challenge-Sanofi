document.addEventListener("DOMContentLoaded", function () {
    const successPopup = document.getElementById('success-popup');
    const closeSuccessPopup = document.querySelector('#success-popup .close');
    const saveButton = document.getElementById('save-button');
    const editButton = document.getElementById('edit-button');
    const form = document.getElementById('personal-info-form');
    const fields = document.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"], input[type="email"]');

    function lockFields() {
        fields.forEach(field => {
            field.disabled = true;
        });
    }

    function unlockFields() {
        fields.forEach(field => {
            field.disabled = false;
        });
    }

    function saveDataToLocalStorage() {
        const data = {
            fullName: document.getElementById('full-name').value.trim(),
            birthdate: document.getElementById('birthdate').value.trim(),
            cpf: document.getElementById('cpf').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim()
        };

        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    function loadDataFromLocalStorage() {
        const savedData = localStorage.getItem('userInfo');
        
        if (savedData) {
            const data = JSON.parse(savedData);

            document.getElementById('full-name').value = data.fullName || '';
            document.getElementById('birthdate').value = data.birthdate || '';
            document.getElementById('cpf').value = data.cpf || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('email').value = data.email || '';

            lockFields();
            saveButton.style.display = 'none';
            editButton.style.display = 'inline-block';
        }
    }

    loadDataFromLocalStorage();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value.trim();
        const birthdate = document.getElementById('birthdate').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!fullName || !birthdate || !cpf || !phone || !email) {
            return;
        }

        saveDataToLocalStorage();
        lockFields();
        successPopup.style.display = 'block';
        saveButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });

    editButton.addEventListener('click', () => {
        unlockFields();
        saveButton.style.display = 'inline-block';
        editButton.style.display = 'none';
    });

    closeSuccessPopup.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });
});
