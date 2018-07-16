function carregaRotasSelect(){
	
	select = document.getElementById('listaRotas');
	
	for (var i = 0 ; i<=rotas.length ; i++) {
		console.log(rotas[i]);
		var opt = document.createElement('option');
		opt.value = rotas[i]['cod_rota'];
		opt.innerHTML = rotas[i]['nome'];
		select.appendChild(opt);
	}
}

var botaoCadastrar = document.getElementById("cadastrarDesenhoRota");
botaoCadastrar.onclick = function() {
    var nome = document.getElementById("nomeRota").value;

	    var novaRota = {
            "cod_rota": 4,
            "nome": nome,
            "pontos": points  
        };
        console.log(points);
        select = document.getElementById('listaRotas');
        var opt = document.createElement('option');
        opt.value = novaRota['cod_rota'];
        opt.innerHTML = novaRota['nome'];
        select.appendChild(opt);
		alert("Rota compartilhada com sucesso.");
        rotas.push(novaRota);
		$('.modal').removeClass('active');
		initMap();
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
        });
    } else {
        alert('Problema na pesquisa de endereço: ' + status);
    }
    });
}

rotas.forEach(function(rotas) {
    var marker = new google.maps.Marker({
       position: new google.maps.LatLng(rotas['pontos'][0][0], rotas['pontos'][0][1]),
       icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png',
       map: map
    });
});

initMap();
carregaRotasSelect();