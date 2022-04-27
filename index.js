const apiKey = '....';
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?v=weekly&key=${apiKey}&callback=initMap&language=es&libraries=places`;
script.defer = true;

let map,
  marker;

function handlerMensajeDeAlerta(mensaje = '') {
  const displayBlockOrNone = 'block';
  if (!mensaje) {
    displayBlockOrNone = 'none;'
  }

  document.querySelector('.alert-container').innerHTML = mensaje;
  document.querySelector('.alert-container').style = `display:${displayBlockOrNone}`;
}

function obtenerUbicacionInicial() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(obtenerCoordenadas, mostrarError);
  } else {
    handlerMensajeDeAlerta('Parece que tu navegador no soporta geolalizacion, intenta acceder desde otro navegador.');
  }
}

function mostrarError(error) {
  if (error.PERMISSION_DENIED) {
    handlerMensajeDeAlerta('Parece que has denegado la posibilidad que el browser obtenga tu información de geolocalización, esto es el requerimiento minimo para que puedas jugar con esta pagina, tu información no se envia a nuestro server, esta pagina es solo para efectos ilustrativos de como interactuar con la api de google map :) .');
  }
}

function obtenerCoordenadas(evt) {
  if (evt.coords) {
    actualizarInputsLatitudLongitud(evt.coords.latitude, evt.coords.longitude);
    actualizarCoordenadasEnMapa()
    return;
  }

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

window.initMap = function () {
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




  const input = document.getElementById("buscarUbicacion");
  const autocomplete = new google.maps.places.Autocomplete(input);
  // const autocomplete = new google.maps.places.Autocomplete(input, { componentRestrictions: { country: "pa" } });

  autocomplete.addListener("place_changed", () => {
    input.value = '';
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const coordenadas = { lat, lng };
    actualizarInputsLatitudLongitud(lat, lng);
    iniciarMarkerSiNoExiste(marker);

    marker.setPosition(coordenadas);
    map.setCenter(coordenadas);
  });

  map.addListener('click', function (evt) {
    const { lat, lng } = obtenerCoordenadas(evt);

    const coordenadas = { lat, lng };

    actualizarInputsLatitudLongitud(lat, lng);
    iniciarMarkerSiNoExiste(marker);

    marker.setPosition(coordenadas);
  });

  obtenerUbicacionInicial();
};

function handlerActualizarCoordenadas(evt) {
  evt.preventDefault();

  actualizarCoordenadasEnMapa();
}

document.getElementById('lat').addEventListener('blur', handlerActualizarCoordenadas);
document.getElementById('lng').addEventListener('blur', handlerActualizarCoordenadas);

document.head.appendChild(script);