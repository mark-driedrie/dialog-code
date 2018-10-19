app.directive('datePicker', function() {
  return {
    restrict: 'E',
    require: ['ngModel'],
    scope: {
      ngModel: '='
    },
    replace: true,
    template: '<div class="input-group">' +
      '<input type="text"  class="form-control" ngModel required>' +
      '<span class="input-group-addon datepicker-toggle"><i class="glyphicon glyphicon-calendar"></i></span>' +
      '</div>',
    link: function(scope, element, attrs) {
      var input = element.find('input');
      var icon = element.find('.datepicker-toggle');
      var defDate = new Date();
      //set defualt value
      if (scope.ngModel) {
        defDate = new Date(scope.ngModel);
      }

      var now = new Date(defDate.getFullYear(), defDate.getMonth(), defDate.getDate(), 0, 0, 0, 0);

      input.daterangepicker({
          locale: {
            format: 'DD-MM-YYYY'
          },
          singleDatePicker: true,
          showDropdowns: true,
          startDate: defDate,
          timePicker: false,
        })
        .on('onRender', function(ev, date) {
          return date.valueOf() < now.valueOf() ? 'disabled' : '';
        });
      //Makes icon clickable
      if (icon.length) {
        icon.on('click', function() {
          input.trigger('focus');
        });
      }
      //Updates model with value on events
      element.bind('blur keyup change', function() {
        scope.ngModel = input.val();
      });
      //Updates model on load
      element.trigger("change");
    }
  }
});
