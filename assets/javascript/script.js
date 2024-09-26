document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const finalizadosList = document.getElementById('finalizados-cadastrados');

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.forEach((product, index) => addProductToDOM(product, index, productList));
    }

    function loadFinalizados() {
        const finalizados = JSON.parse(localStorage.getItem('finalizados')) || [];
        finalizados.forEach((finalizado, index) => addFinalizadoToDOM(finalizado, index));
    }

    function addProductToDOM(product, index, parentList) {
        const li = document.createElement('li');
        li.classList.add('product-item');

        const ul = document.createElement('ul');
        ul.classList.add('product-details');

        const orderNumberLi = document.createElement('li');
        orderNumberLi.textContent = `Número do Pedido: ${product.orderNumber}`;
        ul.appendChild(orderNumberLi);

        const nameLi = document.createElement('li');
        nameLi.textContent = `Nome: ${product.name}`;
        ul.appendChild(nameLi);

        const phoneLi = document.createElement('li');
        phoneLi.textContent = `Telefone: ${product.phone}`;
        ul.appendChild(phoneLi);

        const productToTradeLi = document.createElement('li');
        productToTradeLi.textContent = `Produto que vai trocar: ${product.productToTrade}`;
        ul.appendChild(productToTradeLi);

        const productNeededLi = document.createElement('li');
        productNeededLi.textContent = `Produto que precisa: ${product.productNeeded}`;
        ul.appendChild(productNeededLi);

        const statusSpan = document.createElement('span');
        statusSpan.textContent = `Status: ${product.status}`;
        ul.appendChild(statusSpan);

        const toggleStatusButton = document.createElement('button');
        toggleStatusButton.textContent = product.status === 'Recebido' ? 'Finalizar' : 'Reverter';
        toggleStatusButton.addEventListener('click', function () {
            toggleStatus(index);
        });
        ul.appendChild(toggleStatusButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Apagar';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            deleteProduct(index);
        });
        ul.appendChild(deleteButton);

        li.appendChild(ul);
        parentList.appendChild(li);
    }

    function addFinalizadoToDOM(finalizado, index) {
        const li = document.createElement('li');
        li.classList.add('finalizado-item');

        li.textContent = `Número do Pedido: ${finalizado.orderNumber}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Apagar';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            deleteFinalizado(index);
        });
        li.appendChild(deleteButton);

        finalizadosList.appendChild(li);
    }

    function toggleStatus(index) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let finalizados = JSON.parse(localStorage.getItem('finalizados')) || [];

        if (products[index].status === 'Recebido') {
            products[index].status = 'Finalizado';
            finalizados.push(products[index]);
            products.splice(index, 1);
        } else {
            finalizados[index].status = 'Recebido';
            products.push(finalizados[index]);
            finalizados.splice(index, 1);
        }

        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('finalizados', JSON.stringify(finalizados));
        renderProducts();
        renderFinalizados();
    }

    function deleteProduct(index) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    }

    function deleteFinalizado(index) {
        const finalizados = JSON.parse(localStorage.getItem('finalizados')) || [];
        finalizados.splice(index, 1);
        localStorage.setItem('finalizados', JSON.stringify(finalizados));
        renderFinalizados();
    }

    function renderProducts() {
        productList.innerHTML = '';
        loadProducts();
    }

    function renderFinalizados() {
        finalizadosList.innerHTML = '';
        loadFinalizados();
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const orderNumber = formData.get('order-number');
        const name = formData.get('name');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const productToTrade = formData.get('product-to-trade');
        const productNeeded = formData.get('product-needed');
        const message = formData.get('message');

        const newProduct = {
            orderNumber,
            name,
            phone,
            address,
            productToTrade,
            productNeeded,
            message,
            status: 'Recebido'
        };

        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        alert('Formulário enviado com sucesso!');
        form.reset();
    });

    loadProducts();
    loadFinalizados();

    document.getElementById('cadastrar-farmacia').addEventListener('click', function() {
        window.location.href = 'cadastrar-farmacia.html';
    });

    function loadFarmacias() {
        const farmacias = JSON.parse(localStorage.getItem('farmacias')) || [];
        const farmaciasList = document.getElementById('farmacias-cadastradas');
        farmaciasList.innerHTML = ''; // Limpar a lista antes de adicionar novos elementos
        farmacias.forEach((farmacia, index) => {
            const li = document.createElement('li');
            li.textContent = `Nome: ${farmacia.nome}, Endereço: ${farmacia.endereco}, Horário: ${farmacia.horario}, Produtos: ${farmacia.produtos}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Apagar';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function () {
                deleteFarmacia(index);
            });
            li.appendChild(deleteButton);

            farmaciasList.appendChild(li);
        });
    }

    function deleteFarmacia(index) {
        const farmacias = JSON.parse(localStorage.getItem('farmacias')) || [];
        farmacias.splice(index, 1);
        localStorage.setItem('farmacias', JSON.stringify(farmacias));
        loadFarmacias();
    }

    loadFarmacias();

    document.getElementById('upload-button').addEventListener('click', function() {
    const fileInput = document.getElementById('upload-file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);

            console.log(json);
        };

        reader.readAsArrayBuffer(file);
    }
});

});
