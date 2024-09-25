document.addEventListener("DOMContentLoaded", () => {
    const farmaciaForm = document.getElementById('farmacia-form');
    const farmaciaList = document.getElementById('farmacia-list');
    const messageSection = document.getElementById('message-section');
    let farmacias = JSON.parse(localStorage.getItem('farmacias')) || [];
    let editIndex = -1;

    function renderFarmaciaList() {
        farmaciaList.innerHTML = '';
        farmacias.forEach((farmacia, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${farmacia.nome}</strong><br>
                Endereço: ${farmacia.endereco}<br>
                Horário: ${farmacia.horario}<br>
                Produtos: ${farmacia.produtos}<br>
                <button onclick="editFarmacia(${index})">Editar</button>
                <button onclick="deleteFarmacia(${index})">Apagar</button>
            `;
            farmaciaList.appendChild(li);

            requestAnimationFrame(() => {
                li.classList.add('show');
            });
        });
    }

    window.editFarmacia = (index) => {
        const farmacia = farmacias[index];
        document.getElementById('nome').value = farmacia.nome;
        document.getElementById('endereco').value = farmacia.endereco;
        document.getElementById('horario').value = farmacia.horario;
        document.getElementById('produtos').value = farmacia.produtos;
        editIndex = index;
    };

    window.deleteFarmacia = (index) => {
        const liToDelete = farmaciaList.children[index];
        liToDelete.classList.add('hide');
        setTimeout(() => {
            farmacias.splice(index, 1);
            localStorage.setItem('farmacias', JSON.stringify(farmacias));
            renderFarmaciaList();
            showNotification("Farmácia apagada com sucesso!");
        }, 300);
    };

    farmaciaForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const novaFarmacia = {
            nome: document.getElementById('nome').value,
            endereco: document.getElementById('endereco').value,
            horario: document.getElementById('horario').value,
            produtos: document.getElementById('produtos').value,
        };

        if (editIndex === -1) {
            farmacias.push(novaFarmacia);
            showNotification("Farmácia cadastrada com sucesso!");
        } else {
            farmacias[editIndex] = novaFarmacia;
            showNotification("Farmácia alterada com sucesso!");
            editIndex = -1;
        }

        localStorage.setItem('farmacias', JSON.stringify(farmacias));
        farmaciaForm.reset();
        renderFarmaciaList();
    });

    function showNotification(message) {
        messageSection.innerHTML = `<strong>${message}</strong>`;
        messageSection.style.display = "block";
        setTimeout(() => {
            messageSection.style.display = "none";
        }, 3000);
    }

    renderFarmaciaList();
});
