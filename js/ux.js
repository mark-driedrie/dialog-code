// //all jquery ux dom manipulations
$(function() {
    $(window).resize(function(){
        // update menu height
        var bodyHeight = $('body').height();
        $('.right_col').height(bodyHeight);
    });
});


$MENUS = $('#sidebar-menu').find('li');
$(document).ready(function() {
  $('body').on('click', '*', function(e) {
    if (!$(e.target).closest('#sidebar-menu').length) {
      collapseMenus();
    }
  });
});

function collapseMenus() {

  for (var i = 0; i < $MENUS.length; i++) {
    let menu = $($MENUS[i]);
    if (menu.is('.active')) {
      menu.removeClass('active active-sm');
      $('ul:first', menu).slideUp();
    }
  };
}
