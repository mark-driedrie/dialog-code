app.controller('complaintMasterCtrl', function($scope) {
  //Set global residents data for all tabs
  $scope.init = function(id) {
    $scope.formData = {};
    //for usage in child controllers
    $scope.formData.id = (id && id != 'create') ? id : null;
  }
});
