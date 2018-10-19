//get specific issue
app.controller('issueMasterCtrl', function($scope, $rootScope, $http) {

  //set Global issue data for all tabs
  $scope.init = function(id) {
    $scope.formData = {};
    $scope.formData.code = (id && id != 'create') ? id : null;
  }
});
