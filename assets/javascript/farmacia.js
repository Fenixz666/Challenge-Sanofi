let map;
let service;
let userLocation;
let autocomplete;

function initMap() {
    userLocation = { lat: -23.5505, lng: -46.6333 };

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
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
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
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById("farmacia-list").innerHTML = '';
        results.forEach(place => {
            const distance = calculateDistance(userLocation, place.geometry.location);
            const isOpen = place.opening_hours && place.opening_hours.open_now ? "Aberta" : "Fechada";
            const li = document.createElement("li");
            li.innerText = `${place.name} - ${isOpen} - ${distance} km`;
            document.getElementById("farmacia-list").appendChild(li);
            createMarker(place);
        });
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
    });

    google.maps.event.addListener(marker, 'click', function() {
        map.setCenter(marker.getPosition());
    });
}

function calculateDistance(location1, location2) {
    const rad = (x) => x * Math.PI / 180; 
    const R = 6371; 
    const dLat = rad(location2.lat() - location1.lat());
    const dLon = rad(location2.lng() - location1.lng());
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(rad(location1.lat())) * Math.cos(rad(location2.lat())) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
}

function openLocationPopup() {
    document.getElementById("location-popup").style.display = 'block';
}

function setNewLocation() {
    const place = autocomplete.getPlace();
    if (place && place.geometry) {
        userLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
        initMap();
        searchPharmacies();
        closeLocationPopup();
    }
}

function closeLocationPopup() {
    document.getElementById("location-popup").style.display = 'none';
}

document.getElementById('change-location-button').addEventListener('click', openLocationPopup);
document.getElementById('set-location-button').addEventListener('click', setNewLocation);
document.querySelector('#location-popup .close').addEventListener('click', closeLocationPopup);
document.addEventListener("DOMContentLoaded", initMap);
