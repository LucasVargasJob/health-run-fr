let FIREBASE = window.firebase;
let FUNC = {};
let MAPS = {
	points: []
};

FIREBASE.initializeApp({
	apiKey: "AIzaSyCYdoB7w1-T6Aogb6RCUDpVSWtu-n5AMpY",
	authDomain: "healthrun-21110.firebaseapp.com",
	databaseURL: "https://healthrun-21110.firebaseio.com",
	projectId: "healthrun-21110",
	storageBucket: "",
	messagingSenderId: "541187771630"
});


// SESSION REDIRECT
FIREBASE.auth().onAuthStateChanged((user) => {
	let isSigninPathname = window.location.pathname === '/';

	if(user && !isSigninPathname) {
		window.location.replace('/');
		return;
	}

	if(!user && isSigninPathname) {
		window.location.replace('/login');
		return;
	}


  	FUNC.setName();
});


FUNC.loginCred = function() {
	return {
		user: document.querySelector('#user').value,
		pwd: document.querySelector('#pwd').value
	}
};


FUNC.loginBind= function() {
	let formLogin = document.querySelector('#loginForm');
	
	if(!formLogin) {
		return;
	}	

	formLogin.addEventListener('submit', function(ev) {
		ev.preventDefault();

		let cred = FUNC.loginCred();
		
		FIREBASE
		.auth()
		.signInWithEmailAndPassword(cred.user, cred.pwd)
		.catch(function(error) {
			console.log(error);
			alert(error.message);
		});
	});
};


FUNC.setName = function() {
	let el = document.querySelectorAll('.nav-text')[0];
	
	if(!el) {
		return;
	}
	
	el.innerHTML = FIREBASE.auth().currentUser.email;
};


FUNC.signoutBind = function() {
	let btnLogout = document.querySelector('#btnLogout');
	
	if(!btnLogout) {
		return;
	}

	btnLogout.addEventListener('click', function() {
		FIREBASE.auth().signOut();
	});	
};


MAPS.saveRoute = (d) => {
	let uid = FIREBASE.auth().currentUser.uid;
	return FIREBASE.database().ref().child(uid+'@route').push(d);
};


MAPS.getRouteList = () => {
	let uid = FIREBASE.auth().currentUser.uid;
	let routeTable = uid + '@route';

	return FIREBASE
	.database()
	.ref()
	.child(routeTable)
	.once('value')
	.then(function(snapshot) {
		return snapshot;
	});
};


MAPS.addLatLng = (ev, poly, map) => {
	var posicao = [
		ev.latLng.lat(),
		ev.latLng.lng()
	];

	MAPS.points.push(posicao);

	var path = poly.getPath();
	path.push(ev.latLng);

	var marker = new window.google.maps.Marker({
		position: ev.latLng,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 5
		},
		title: '#' + path.getLength(),
		map: map
	});
};


MAPS.init = () => {
	let map;
	let infoWindow;
	let poly;

	map = new window.google.maps.Map(
		document.querySelector('#internalContent'),
		{
			zoom: 18,
			center: {
				lat: -30.030200877581464,
				lng: -51.23094320297241
			},
		}
	);

	infoWindow = new google.maps.InfoWindow; // jshint ignore: line

	if (!navigator.geolocation) {
		return;
	}

	navigator.geolocation.getCurrentPosition( (position) => {
		let pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};

		infoWindow.setPosition(pos);
		infoWindow.setContent('Você está aqui.');
		infoWindow.open(map);

		map.setCenter(pos);
	}, function(err) {
		alert(err.message);
	});

	poly = new google.maps.Polyline({
		strokeColor: '#000000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});

	poly.setMap(map);

	map.addListener('click', (ev) => {
		MAPS.addLatLng(ev, poly, map);
	});

};


FUNC.loginBind();
FUNC.signoutBind();


let current = new Date();
let dd = current.getDate();
let mm = current.getMonth() + 1;
let yyyy = current.getFullYear();


$(document).ready( function() {

  let PRIVATE = ['sidenav', 'map', 'form', 'history'];


  PRIVATE.sidenav = $('[data-component=sidenav]');
  PRIVATE.map = $('[data-component=map]');
  PRIVATE.form = $('[data-component=topnav] form');
  PRIVATE.history = $('[data-component=history]');

  $('[data-component=sidenav] .menu-items a').on('click', function() {
    let _this = $(this),
        _target = $(_this).data('target'),
        _submenu = $(_target);

    _submenu.toggleClass('active');
    _submenu.find('.sub-menu-title a').remove();
    _submenu.find('.sub-menu-title').append('<a href=""><i class="fas fa-chevron-left"></i></a>');

  _submenu.find('.sub-menu-title a').click( function(event) {
      event.preventDefault();
      _submenu.removeClass('active');
      setTimeout( function() {
        _submenu.find('.sub-menu-title a').remove();
      }, 125)
    });
  });

  $('.dropback').on('click', function() {
    $(this).parents().removeClass('active');
  });

  $('.toggleMenu').on('click', function() {
    let _this = $(this);

    PRIVATE.sidenav.toggleClass('collapse');
    PRIVATE.map.toggleClass('expanded');
    PRIVATE.sidenav.find('.active').removeClass('active');
  });

  $('.toggleSearch').on('click', function() {
    PRIVATE.form.toggleClass('active');
  });

  $('.toggleHistory').on('click', function() {
    PRIVATE.history.toggleClass('active');
  });

  if( window.matchMedia('(min-width: 768px)').matches ){
    PRIVATE.sidenav.removeClass('collapse');
    PRIVATE.map.removeClass('expanded');
  }

  $(window).resize( function(){
    if( window.matchMedia('(min-width: 768px)').matches ){
      $(PRIVATE.sidenav).removeClass('collapse');
      $(PRIVATE.map).removeClass('expanded');
    } else{
      $(PRIVATE.sidenav).addClass('collapse');
      $(PRIVATE.map).addClass('expanded');
    }
  });

  setAllRoutes();
  toggleContent($('.modal-schedule .modal-close'), $('.modal-schedule'));
  toggleContent($('.create-route .button'), $('.modal-routes'));
  toggleContent($('.modal-routes .modal-close'), $('.modal-routes'));
  toggleContent($('.to-create-routes'), $('.create-route'));
  isChecked($('.sub-menu-invites a'));

  $('.to-create-route').on('click', function() {
    $('.create-route').addClass('active');

    if($(window).width() < 768){
      $('[data-component=sidenav]').addClass('collapse');
    }
  })
});


$(document).ready(function(){
  $.ajaxSetup({ cache: false });
  $('[data-component=topnav] form .input').keyup(function(){

    let _this = $(this);
        _val = $(_this).val(),
        _expression = new RegExp(_val, 'i'),
        _output = '',
        _icon = '',
        _note = '',
        _private = '';

    $.getJSON(APP_ROOT + 'assets/js/data.json', function( data ) {
      $.each(data, function(key, value){
        if (value.name.search(_expression) != -1 || value.slug.search(_expression) != -1){

          if( value.fav ){
            _icon = 'fas fa-heart';
          } else {
            _icon = 'far fa-heart';
          }

          if( value.private ){
            _private = 'fas fa-eye-slash'
          }

          switch (value.note) {
            case 1:
              _note = 'far fa-angry';
              break;
            case 2:
              _note = 'far fa-frown';
              break;
            case 3:
              _note = 'far fa-meh';
              break;
            case 4:
              _note = 'far fa-smile';
              break;
            case 5:
              _note = 'far fa-grin-beam';
          }

          _output += '<div class="dropdown-item">';
          _output += '<a href="">' + value.name + '</a>';
          _output += '<div class="dropdown-options">';
          _output += '<a><i class="' + _private + '"></i></a>';
          _output += '<a href=""><i class="' + _icon + '"></i></a>';
          _output += '<a href=""><i class="' + _note + '"></i></a>';
          _output += '</div>';
          _output += '</div>';
        }
      });

      $('[data-component=dropdown]').html( _output );

      if( !_val ){
        $('.dropdown-item').remove();
      }
    });
  });
});

$(document).ready( function() {

  let mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  setMonth(document.getElementById('mes'), mes);
  setDay(document.getElementById('dia'), dd);
  console.log(dd);

  $('#mes').on('change', function() {
    setDay(document.getElementById('dia'), this.value);
    console.log(this.value);
  });

});

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function setMonth(t, a){

  let r = '',
      s = a.length,
      attr;

  for (var i = 0; i < s; i++) {
    if ( mm > (i+1) ){
      attr = 'disabled';
    } else if ( mm == (i+1) ) {
      attr = 'selected';
    } else {
      attr = ''
    }

    setDay(document.getElementById('dia'), getDaysInMonth(yyyy, mm));

    r += '<option value="'+ (i+1) +'" ' + attr + '>'+ a[i] +'</option>\n';
  }
  t.innerHTML = r;
}

function setDay(t, m){
  let r = '';

  for (var i = 0; i < getDaysInMonth(yyyy, m); i++) {
    if ( dd > (i+1) ){
      attr = 'disabled';
    } else if ( dd == (i+1) ) {
      attr = 'selected';
    } else {
      attr = ''
    }

    r += '<option value="'+ (i+1) +'" ' + attr + '>'+ (i+1) +'</option>\n';
  }

  t.innerHTML = r;
}


function setAllRoutes() {

  let _output = '',
      _icon = '',
      _note = '',
      _private = '';

  $.getJSON(APP_ROOT + 'assets/js/data.json', function( data ) {
    $.each(data, function(key, value){

      console.log(key, value);

      if( value.fav ){
        _icon = 'fas fa-heart';
      } else {
        _icon = 'far fa-heart';
      }

      if( value.private ){
        _private = 'fas fa-eye-slash'
      } else {
        _private = 'd-none';
      }

      switch (value.note) {
        case 1:
          _note = 'far fa-angry';
          break;
        case 2:
          _note = 'far fa-frown';
          break;
        case 3:
          _note = 'far fa-meh';
          break;
        case 4:
          _note = 'far fa-smile';
          break;
        case 5:
          _note = 'far fa-grin-beam';
      }

      _output += '<a href="#">';
      _output += '<span>' + value.name + '</span>';
      _output += '<div class="icons">';
      _output += '<i class="' + _private + '"></i>';
      _output += '<i class="' + _icon + '"></i>';
      _output += '<i class="' + _note + '"></i>';
      _output += '</div>';
      _output += '</a>';
    });

    $('.sub-menu-routes').html( _output );

    toggleContent($('.sub-menu-routes a'), $('.modal-schedule'));
  });
}

function toggleContent(_btn, _target){
  $(_btn).on('click', function() {
    $(_target).toggleClass('active');
  });
}

function addContent(_btn, _target){
  $(_btn).on('click', function() {
    $(_target).addClass('active');
  });
}

function isChecked(_btn){
  $(_btn).on('click', function() {
    $(this).addClass('select');
    $(this).siblings().addClass('disabled');
  });
}
