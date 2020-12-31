const apiKey = '....';
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?v=weekly&key=${apiKey}&callback=initMap&language=es`;
script.defer = true;

let map;
let marker;

function obtenerCoordenadas(evt) {
  const lat = parseFloat(evt.latLng.lat().toFixed(7));
  const lng = parseFloat(evt.latLng.lng().toFixed(7));

  return { lat, lng };
}

function actualizarInputsLatitudLongitud(lat, lng) {
  document.getElementById('lat').value = lat;
  document.getElementById('lng').value = lng;
}

function actualizarCoordenadas(evt) {
  const { lat, lng } = obtenerCoordenadas(evt);

  actualizarInputsLatitudLongitud(lat, lng);
}

function iniciarMarkerSiNoExiste(position) {
  if (map && !marker) {
    marker = new google.maps.Marker({
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position,
    });
  
    marker.addListener('dragend', actualizarCoordenadas);
    marker.addListener('click', actualizarCoordenadas);
  }
}

function removerMarker() {
  if (marker) {
    marker.setMap(null);
    marker = null;
  }
}

function actualizarCoordenadasEnMapa() {
  let lat = document.getElementById('lat').value.trim();
  let lng = document.getElementById('lng').value.trim();

  lat = parseFloat(lat); lng = parseFloat(lng);

  if (isNaN(lat) || isNaN(lng)) {
    removerMarker();
    return false;
  }

  const coordenadas = { lat, lng };

  iniciarMarkerSiNoExiste(coordenadas);
  marker.setPosition(coordenadas);
  map.setCenter(coordenadas);
}

window.initMap = function() {
  const coordenadas = { lat: 9.0060184, lng: -79.5041212 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: coordenadas,
    zoom: 14,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ],
  });

  map.addListener('click', function(evt) {
    const { lat, lng } = obtenerCoordenadas(evt);

    const coordenadas = { lat, lng };

    actualizarInputsLatitudLongitud(lat, lng);
    iniciarMarkerSiNoExiste(marker);

    marker.setPosition(coordenadas);
  });
};

function handlerActualizarCoordenadas (evt) {
  evt.preventDefault();

  actualizarCoordenadasEnMapa();
}

document.getElementById('lat').addEventListener('blur', handlerActualizarCoordenadas);
document.getElementById('lng').addEventListener('blur', handlerActualizarCoordenadas);
document.getElementById('btnAceptar').addEventListener('click', handlerActualizarCoordenadas);

document.head.appendChild(script);
