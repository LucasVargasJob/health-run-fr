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
    _submenu.find('.sub-menu-title').append('<a href=""><i class="fas fa-chevron-left"></i></a>');

  _submenu.find('a').click( function(event) {
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
        if (value.name.search(_expression) != -1){

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
