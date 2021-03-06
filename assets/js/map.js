var geocoder;
var poly;
var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var points = [];
var posicaoAtual = {
	lat: -30.030200877581464,
	lng: -51.23094320297241
};
var mapRender = false;

// Cria o primeiro map, para o usuário criar as rotas.
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: posicaoAtual['lat'], lng: posicaoAtual['lng']},
        clickableIcons: false,
		disableDefaultUI: true
    });

    var infoWindow = new google.maps.InfoWindow({map: map});

    //Função para pegar a posição atual.
	if(mapRender == false)
	{
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				
				var pos = {
				  lat: position.coords.latitude,
				  lng: position.coords.longitude
				};
				posicaoAtual = pos;
				mapRender = true;

			}, function() {
					handleLocationError(true, infoWindow, map.getCenter());
				});
		} else {
			// Navegador não possui suporte para o geolocation.
			handleLocationError(false, infoWindow, map.getCenter());
		}
	}

	infoWindow.setPosition(posicaoAtual);
    infoWindow.setContent('Você está aqui');
    infoWindow['map']['zoom'] = 18;
    map.setCenter(posicaoAtual);
	
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

	var beachMarker = new google.maps.Marker({
		position: {lat: posicaoAtual['lat'], lng: posicaoAtual['lng']},
		map: map,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 5,
			fillColor: 'white',
			fillOpacity: 0.8,
			strokeColor: 'DarkCyan'
		}
	});

    //FUNCAO PARA CRIAR ICON DE CORRIDA
    rotas.forEach(function(rotas) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(rotas['pontos'][0][0], rotas['pontos'][0][1]),
			icon: 'assets/images/run.png',
			map: map,
			title: rotas['nome']
		});

		var infoRota = 
			'<div id="content">'+
				'<div id="siteNotice"> </div>'+
				'<h1 id="firstHeading" class="firstHeading"> '+ rotas['nome'] +' </h1>'+
				'<div id="bodyContent">'+
					'<b>Data:</b> '+ rotas['info']['data'] +' <br>' +
					'<b>Largada:</b> '+ rotas['info']['largada'] +'<br>' +
					'<b>Local:</b> '+ rotas['info']['local'] +' <br>' +
					'<b>Distancia:</b> '+ rotas['info']['distancia'] +'<br>' +
					'<input id="iniciarRota" type="button" value="Visualizar rota" onclick="criaRota('+ rotas['cod_rota'] +')">'
				'</div>'+
			'</div>';

		var infowindow = new google.maps.InfoWindow({
			content: infoRota
		});

		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
    });
	
    //Gatilho para funcao de digitar o endereço e ir até o local
    var geocoder = new google.maps.Geocoder();
        document.getElementById('PesquisarEndereco').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
    });

	// Cria o objeto polígono
    poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    poly.setMap(map);
    map.addListener('click', addLatLng);
}

// Função para desenhar pontos no map e pegar a latitude e longitude.
function addLatLng(event) {
    var posicao = [
        event.latLng.lat(),
        event.latLng.lng()
    ];
    points.push(posicao);
	
    var path = poly.getPath();
    path.push(event.latLng);
    
    var marker = new google.maps.Marker({
        position: event.latLng,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5
        },
        title: '#' + path.getLength(),
        map: map
    });
}

//Função para criar rota a partir do desenho.
function criaRota(cod_rota) {
    var locations;
	
    for (i = 0; i < rotas.length; i++) { 
        if(cod_rota == rotas[i]['cod_rota'])
        {
            locations = rotas[i]['pontos'];
        }
    }

    directionsDisplay = new google.maps.DirectionsRenderer();
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(posicaoAtual['lat'], posicaoAtual['lng']),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
    });
	
    directionsDisplay.setMap(map);
    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    var request = {
         travelMode: 'WALKING'
    };

    for (i = 0; i < locations.length; i++) {
					
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][0], locations[i][1]),
		});
		
        if (i == 0){
            request.origin = marker.getPosition();  
        } else if (i == locations.length - 1) {
             request.destination = marker.getPosition();
        } else {
            if (!request.waypoints){
                request.waypoints = [];
            }
            request.waypoints.push({
                location: marker.getPosition(),
                stopover: true
            });
        }

    }

    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });

    google.maps.event.addDomListener(window, "load", criaRota);
}

function initMap2() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: {lat: posicaoAtual['lat'], lng: posicaoAtual['lng']},
        clickableIcons: false,
		disableDefaultUI: true
    });
	
	var beachMarker = new google.maps.Marker({
		position: {lat: posicaoAtual['lat'], lng: posicaoAtual['lng']},
		map: map,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 5,
			fillColor: 'white',
			fillOpacity: 0.8,
			strokeColor: 'DarkCyan'
		}
	});

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    
	centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    var infoWindow = new google.maps.InfoWindow({map: map});

	// Cria o objeto polígono
    poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    poly.setMap(map);
    map.addListener('click', addLatLng);
}