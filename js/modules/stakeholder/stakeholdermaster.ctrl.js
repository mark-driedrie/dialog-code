//get specific issue
app.controller('stakeholderMasterCtrl', function($scope, $rootScope, $http) {

  //Set global stakeholders data for all tabs
  $scope.init = function(id) {
    $scope.formData = {};
    //for usage in child controllers
    $scope.formData.code = (id && id != 'create') ? id : null;
    var master = this;
    //for usage in child controllers (meetings/employees)
    master.stakeholderEmployees = [];
  }
});
