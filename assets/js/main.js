$(document).ready( function() {


  $('[data-component=sidenav] ul li a').on('click', function() {
    let _this = $(this),
        _target = $(_this).data('target'),
        _modal = $('[data-component="' + _target + '"]');

    _modal.addClass('active');
  });

  $('.dropback').on('click', function() {
    $(this).parents().removeClass('active');
  });

});
