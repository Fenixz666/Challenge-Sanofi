document.addEventListener("DOMContentLoaded", function () {
    const successPopup = document.getElementById('success-popup');
    const closeSuccessPopup = document.querySelector('#success-popup .close');
    const saveButton = document.getElementById('save-button');
    const editButton = document.getElementById('edit-button');
    const form = document.getElementById('personal-info-form');
    const fields = document.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"], input[type="email"]');
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');

    const errorMessages = {
        fullName: document.getElementById('full-name-error'),
        birthdate: document.getElementById('birthdate-error'),
        cpf: document.getElementById('cpf-error'),
        phone: document.getElementById('phone-error'),
        email: document.getElementById('email-error')
    };

    // Bloquear campos
    function lockFields() {
        fields.forEach(field => {
            field.disabled = true;
        });
    }

    // Desbloquear campos
    function unlockFields() {
        fields.forEach(field => {
            field.disabled = false;
        });
    }

    // Formatar CPF (000.000.000-00)
    cpfInput.addEventListener('input', function () {
        let cpf = cpfInput.value.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        cpfInput.value = cpf;
    });

    // Formatar Telefone (00) 00000-0000
    phoneInput.addEventListener('input', function () {
        let phone = phoneInput.value.replace(/\D/g, '');
        phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        phoneInput.value = phone;
    });

    // Validação de CPF (Simples, mas pode ser aprimorada para seguir as regras de validação real de CPF)
    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        let sum = 0, remainder;
        for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;
        if ((remainder == 10) || (remainder == 11)) remainder = 0;
        if (remainder != parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;
        if ((remainder == 10) || (remainder == 11)) remainder = 0;
        if (remainder != parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    // Validação de Telefone
    function isValidPhone(phone) {
        phone = phone.replace(/\D/g, '');
        return phone.length === 11;
    }

    // Exibe erro
    function showError(inputName, message) {
        errorMessages[inputName].innerText = message;
        errorMessages[inputName].style.display = 'block';
    }

    // Oculta erro
    function hideError(inputName) {
        errorMessages[inputName].innerText = '';
        errorMessages[inputName].style.display = 'none';
    }

    // Valida campos individualmente
    function validateField(inputName, value) {
        if (!value) {
            showError(inputName, 'Este campo é obrigatório');
            return false;
        }
        hideError(inputName);
        return true;
    }

    // Valida CPF e Telefone com mensagens específicas
    function validateCPFAndPhone() {
        const cpf = document.getElementById('cpf').value.trim();
        const phone = document.getElementById('phone').value.trim();
        let valid = true;

        if (!isValidCPF(cpf)) {
            showError('cpf', 'CPF inválido');
            valid = false;
        } else {
            hideError('cpf');
        }

        if (!isValidPhone(phone)) {
            showError('phone', 'Número de telefone inválido');
            valid = false;
        } else {
            hideError('phone');
        }

        return valid;
    }

    // Função para salvar os dados no LocalStorage
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

    // Função para carregar os dados do LocalStorage
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

    // Evento ao clicar no botão Salvar
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value.trim();
        const birthdate = document.getElementById('birthdate').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        let valid = true;

        // Validar todos os campos individualmente
        valid &= validateField('fullName', fullName);
        valid &= validateField('birthdate', birthdate);
        valid &= validateField('cpf', cpf);
        valid &= validateField('phone', phone);
        valid &= validateField('email', email);

        // Validações específicas para CPF e Telefone
        valid &= validateCPFAndPhone();

        if (!valid) return;

        saveDataToLocalStorage();
        lockFields();
        successPopup.style.display = 'block';
        saveButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });

    // Evento ao clicar no botão Alterar
    editButton.addEventListener('click', () => {
        unlockFields();
        saveButton.style.display = 'inline-block';
        editButton.style.display = 'none';
    });

    closeSuccessPopup.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });
});
