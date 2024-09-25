let map;
let service;
let userLocation;
let autocomplete;

function initMap() {
    // Verifica se o navegador suporta geolocalização e se o usuário permite o acesso
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Você está aqui",
                });
            },
            () => {
                // Caso o usuário negue a geolocalização, usar o valor padrão (São Paulo)
                console.log("Geolocalização não permitida pelo usuário.");
                userLocation = { lat: -23.5505, lng: -46.6333 }; // Padrão para São Paulo
                map.setCenter(userLocation);
            }
        );
    } else {
        // Caso o navegador não suporte geolocalização, usar o valor padrão
        console.log("Geolocalização não suportada.");
        userLocation = { lat: -23.5505, lng: -46.6333 }; // Padrão para São Paulo
        map.setCenter(userLocation);
    }

    // Inicializa o mapa com a localização do usuário ou a padrão
    map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 14,
    });

    // Cria um marcador na localização do usuário
    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Você está aqui",
    });

    // Inicializa o serviço de busca e o autocomplete
    service = new google.maps.places.PlacesService(map);
     // Inicializa o autocomplete com restrição para o Brasil
     autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {
        componentRestrictions: { country: ['BR'] } // Restringe as sugestões ao Brasil
    });
    autocomplete.setFields(['address_component', 'geometry']);
}

function searchPharmacies() {
    const request = {
        location: userLocation,
        radius: '5000',
        type: ['pharmacy'],
    };

    service.nearbySearch(request, callback);
}

function callback(results, status) {
    const farmaciaList = document.getElementById("farmacia-list");
    farmaciaList.innerHTML = ''; // Limpa a lista de farmácias antes de adicionar novos resultados

    // Verifica o status da resposta
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (results.length === 0) {
            farmaciaList.innerHTML = '<li>Nenhuma farmácia encontrada nas proximidades.</li>';
        } else {
            results.forEach(place => {
                // Obtém os detalhes da farmácia
                service.getDetails({ placeId: place.place_id }, (placeDetails, detailsStatus) => {
                    if (detailsStatus === google.maps.places.PlacesServiceStatus.OK) {
                        const distance = calculateDistance(userLocation, place.geometry.location);
                        
                        // Verifica se o local tem informação sobre horário de funcionamento
                        let isOpenText = "Fechada";
                        let isOpenClass = "fechada"; // Classe CSS para texto vermelho
                        if (placeDetails.opening_hours && placeDetails.opening_hours.open_now) {
                            isOpenText = "Aberta";
                            isOpenClass = "aberta"; // Classe CSS para texto verde
                        }
                        
                        // Obtém o telefone e o endereço
                        const phoneNumber = placeDetails.formatted_phone_number || 'Não disponível';
                        const address = placeDetails.formatted_address || 'Endereço não disponível';
                        
                        // Cria um item de lista para cada farmácia
                        const li = document.createElement("li");
                        li.innerHTML = `${placeDetails.name} - <span class="${isOpenClass}">${isOpenText}</span> - ${distance} km<br>
                                        Telefone: ${phoneNumber}<br>
                                        Endereço: ${address}`;
                        
                        farmaciaList.appendChild(li);
                        createMarker(place);  // Cria um marcador no mapa para o local
                    }
                });
            });
        }
    } else {
        farmaciaList.innerHTML = `<li>Erro ao buscar farmácias: ${status}</li>`;
    }
}



function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
    });

    google.maps.event.addListener(marker, 'click', function () {
        map.setCenter(marker.getPosition());
    });
}

function calculateDistance(location1, location2) {
    if (!location1 || !location2) return '0'; // Verifica se as localizações são válidas

    const rad = (x) => x * Math.PI / 180;
    const R = 6371; // Raio da Terra em km
    const dLat = rad(location2.lat() - location1.lat);
    const dLon = rad(location2.lng() - location1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(location1.lat)) * Math.cos(rad(location2.lat())) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Retorna a distância em km com 2 casas decimais
}

function openLocationPopup() {
    document.getElementById("location-popup").style.display = 'block';
    
    // Limpa o campo de texto para que ele esteja vazio ao abrir o popup
    const autocompleteField = document.getElementById('autocomplete');
    autocompleteField.value = ''; // Limpa o valor do campo
    autocompleteField.focus(); // Define o foco no campo de texto
}


function setNewLocation() {
    const place = autocomplete.getPlace();

    // Verifica se o lugar é válido e se a geometria foi retornada
    if (!place || !place.geometry) {
        document.getElementById('error-message').innerText = "Por favor, selecione um local válido.";
        document.getElementById('error-message').style.display = 'block'; // Exibe a mensagem de erro
        return;
    }

    // Limpa a mensagem de erro se a seleção for válida
    document.getElementById('error-message').style.display = 'none';

    // Atualiza a localização do usuário com os dados do Autocomplete
    userLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };

    // Atualiza o mapa com a nova localização
    map.setCenter(userLocation);
    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Nova localização"
    });

    // Após definir a nova localização, refaz a busca por farmácias
    searchPharmacies();

    // Limpa o campo de texto de localização
    document.getElementById('autocomplete').value = '';

    // Fecha o popup de localização
    closeLocationPopup();
}



function closeLocationPopup() {
    document.getElementById("location-popup").style.display = 'none';
}

// Event Listeners
document.getElementById('change-location-button').addEventListener('click', openLocationPopup);
document.getElementById('set-location-button').addEventListener('click', setNewLocation);
document.querySelector('#location-popup .close').addEventListener('click', closeLocationPopup);
document.addEventListener("DOMContentLoaded", initMap);

