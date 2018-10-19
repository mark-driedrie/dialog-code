//Bootstrap Tooltip
app.directive('tooltip', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $(element).hover(function() {
        // on mouseenter
        $(element).tooltip('show');
      }, function() {
        // on mouseleave
        $(element).tooltip('hide');
      });
    }
  };
});

//IMPORTANT this required an update in the core file ui-select-min.js
//all 'selectMultiple.getPlaceholder' is replaced for 'select.getPlaceholder'
app.directive('uiselectplaceholderfix', function() {
  return {
    require: 'uiSelect',
    priority: 0,
    link: function($scope, $element, attrs, $select) {
      //adds placeholder for multiple, even when selections are made
      $select.getPlaceholder = function() {
        return $select.placeholder;
      };
      //prevents popover from closing
      $element.bind('click', function(e) {
        e.stopPropagation();
      });
    }
  }
});


app.directive('dismiss', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, $element, attrs) {
      $element.on('click', function() {
        $timeout(function() {
          var $context = $element.closest('.' + attrs.dismiss);
          var $contextScope = $context.scope();
          $contextScope.$apply(function() {
            $contextScope.isOpen = false;
          });
        });
      });
    }
  };
}]);
