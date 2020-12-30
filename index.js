const apiKey = '.....';
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?v=weekly&key=${apiKey}&callback=initMap&language=es`;
script.defer = true;

let map;
let marker;

let latAMX = localStorage.getItem('lat')
  ? parseFloat(localStorage.getItem('lat'))
  : 9.0060184;

let lngAMX = localStorage.getItem('lng')
  ? parseFloat(localStorage.getItem('lng'))
  : -79.5041212;

function obtenerCoordenadas(evt) {
  localStorage.setItem('lat', parseFloat(evt.latLng.lat().toFixed(7)));
  localStorage.setItem('lng', parseFloat(evt.latLng.lng().toFixed(7)));
}

window.initMap = function() {
  const coordenadas = { lat: latAMX, lng: lngAMX };

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

  marker = new google.maps.Marker({
    map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: coordenadas,
  });

  marker.addListener('dragend', obtenerCoordenadas);
  marker.addListener('click', obtenerCoordenadas);

  map.addListener('click', function(evt) {
    localStorage.setItem('lat', parseFloat(evt.latLng.lat().toFixed(7)));
    localStorage.setItem('lng', parseFloat(evt.latLng.lng().toFixed(7)));

    const latAMX = parseFloat(evt.latLng.lat().toFixed(7));
    const lngAMX = parseFloat(evt.latLng.lng().toFixed(7));

    const coordenadas = { lat: latAMX, lng: lngAMX };

    marker.setPosition(coordenadas);
  });
};

document.getElementById('btnAceptar').addEventListener('click', function(e) {
  e.preventDefault();

  const latAMX = localStorage.getItem('lat')
    ? parseFloat(localStorage.getItem('lat'))
    : 9.0060184;

  const lngAMX = localStorage.getItem('lng')
    ? parseFloat(localStorage.getItem('lng'))
    : -79.5041212;

  const coordenadas = { lat: latAMX, lng: lngAMX };

  map.setCenter(coordenadas);
});

document.head.appendChild(script);
