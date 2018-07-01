$(document).ready( function() {

  let PRIVATE = ['sidenav', 'map'];


  PRIVATE.sidenav = $('[data-component=sidenav]');
  PRIVATE.map = $('[data-component=map]');

  $('[data-component=sidenav] .menu-items a').on('click', function() {
    let _this = $(this),
        _target = $(_this).data('target'),
        _submenu = $(_target);

    _submenu.toggleClass('active');
  });

  $('.dropback').on('click', function() {
    $(this).parents().removeClass('active');
  });

  $('.menu').on('click', function() {
    let _this = $(this);

    $(PRIVATE.sidenav).toggleClass('collapse');
    $(PRIVATE.map).toggleClass('expanded');
  });

});
