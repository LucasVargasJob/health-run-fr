$(document).ready( function() {


  $('[data-component=sidenav] .menu-items a').on('click', function() {
    let _this = $(this),
        _target = $(_this).data('target'),
        _submenu = $(_target);

    _submenu.toggleClass('active');
  });

  $('.dropback').on('click', function() {
    $(this).parents().removeClass('active');
  });

});
