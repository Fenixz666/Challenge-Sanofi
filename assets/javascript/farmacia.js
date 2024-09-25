let map;
let service;
let userLocation;
let autocomplete;

function initMap() {
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
                userLocation = { lat: -23.5505, lng: -46.6333 };
                map.setCenter(userLocation);
            }
        );
    } else {
        userLocation = { lat: -23.5505, lng: -46.6333 };
        map.setCenter(userLocation);
    }

    map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 14,
    });

    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Você está aqui",
    });

    service = new google.maps.places.PlacesService(map);
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {
        componentRestrictions: { country: ['BR'] }
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
    farmaciaList.innerHTML = '';

    if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (results.length === 0) {
            farmaciaList.innerHTML = '<li>Nenhuma farmácia encontrada nas proximidades.</li>';
        } else {
            results.forEach(place => {
                service.getDetails({ placeId: place.place_id }, (placeDetails, detailsStatus) => {
                    if (detailsStatus === google.maps.places.PlacesServiceStatus.OK) {
                        const distance = calculateDistance(userLocation, place.geometry.location);
                        let isOpenText = "Fechada";
                        let isOpenClass = "fechada";
                        if (placeDetails.opening_hours && placeDetails.opening_hours.open_now) {
                            isOpenText = "Aberta";
                            isOpenClass = "aberta";
                        }
                        const phoneNumber = placeDetails.formatted_phone_number || 'Não disponível';
                        const address = placeDetails.formatted_address || 'Endereço não disponível';
                        const li = document.createElement("li");
                        li.innerHTML = `${placeDetails.name} - <span class="${isOpenClass}">${isOpenText}</span> - ${distance} km<br>
                                        Telefone: ${phoneNumber}<br>
                                        Endereço: ${address}`;
                        farmaciaList.appendChild(li);
                        createMarker(place);
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
    if (!location1 || !location2) return '0';

    const rad = (x) => x * Math.PI / 180;
    const R = 6371;
    const dLat = rad(location2.lat() - location1.lat);
    const dLon = rad(location2.lng() - location1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(location1.lat)) * Math.cos(rad(location2.lat())) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
}

function openLocationPopup() {
    document.getElementById("location-popup").style.display = 'block';
    const autocompleteField = document.getElementById('autocomplete');
    autocompleteField.value = '';
    autocompleteField.focus();
}

function setNewLocation() {
    const place = autocomplete.getPlace();

    if (!place || !place.geometry) {
        document.getElementById('error-message').innerText = "Por favor, selecione um local válido.";
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    document.getElementById('error-message').style.display = 'none';

    userLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };

    map.setCenter(userLocation);
    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Nova localização"
    });

    searchPharmacies();

    document.getElementById('autocomplete').value = '';
    closeLocationPopup();
}

function closeLocationPopup() {
    document.getElementById("location-popup").style.display = 'none';
}

document.getElementById('change-location-button').addEventListener('click', openLocationPopup);
document.getElementById('set-location-button').addEventListener('click', setNewLocation);
document.querySelector('#location-popup .close').addEventListener('click', closeLocationPopup);
document.addEventListener("DOMContentLoaded", initMap);
