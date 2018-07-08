$(document).ready( function() {

  let PRIVATE = ['sidenav', 'map', 'form'];


  PRIVATE.sidenav = $('[data-component=sidenav]');
  PRIVATE.map = $('[data-component=map]');
  PRIVATE.form = $('[data-component=topnav] form');

  $('[data-component=sidenav] .menu-items a').on('click', function() {
    let _this = $(this),
        _target = $(_this).data('target'),
        _submenu = $(_target);

    _submenu.toggleClass('active');
  });

  $('.dropback').on('click', function() {
    $(this).parents().removeClass('active');
  });

  $('.toggleMenu').on('click', function() {
    let _this = $(this);

    $(PRIVATE.sidenav).toggleClass('collapse');
    $(PRIVATE.map).toggleClass('expanded');
  });

  $('.toggleSearch').on('click', function() {
    PRIVATE.form.toggleClass('active');
  });

  if( window.matchMedia('(min-width: 768px)').matches ){
    $(PRIVATE.sidenav).removeClass('collapse');
    $(PRIVATE.map).removeClass('expanded');
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
        _note = '';

    $.getJSON(APP_ROOT + 'assets/js/data.json', function( data ) {
      $.each(data, function(key, value){
        if (value.name.search(_expression) != -1){

          if( value.fav ){
            _icon = 'fas fa-heart';
          } else {
            _icon = 'far fa-heart';
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
          _output += '<a href=""><i class="' + _icon + '"></i></a>';
          _output += '<a href=""><i class="' + _note + '"></i></a>'
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
