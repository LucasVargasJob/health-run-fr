// let PRIVATE = [];
//
// PRIVATE.push('menu');
//
// let menu = document.querySelector('[data-component=sidenav] ul').addEventListener('click', function(el) {
//   el.preventDefault();
//   return el.target.dataset.target;
// });
//
//
//

$(document).ready( function() {

  let COMPONENTS = ['map', 'modal'];

  COMPONENTS.modal = $('[data-target]');

  COMPONENTS.modal.on( "click", function(el) {
    el.preventDefault();

    let target = $(this).data('target');
    let inner = '[data-component="' + target + '"]';

    $(inner).addClass('active');
  })
});
