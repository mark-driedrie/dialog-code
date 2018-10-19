app.controller('logCtrl', function($scope, $rootScope, $http) {

  //Populate popup
  $scope.initPopup = function(popupId) {
    //only triggerd on popup show
    $(popupId).on('show.bs.modal', function(e) {
      //initiate
      $scope.item = {};
      $scope.isLoaded = false;
      var $invoker = $(e.relatedTarget);
      var id = ($invoker.data('id')) ? $invoker.data('id') : null;
      $scope.getLog(id);
    });
  }

  //API get decision
  $scope.getLog = function(id) {
    //get data
    $http.get("/api/logs/" + id, {
        cache: false
      })
      .then(function(response) {
        $scope.item = response.data;
        $scope.isLoaded = true;
      }).catch(function() {
        $scope.isLoaded = true;
      });
  }

})
