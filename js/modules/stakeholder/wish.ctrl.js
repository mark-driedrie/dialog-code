app.controller('wishCtrl', function($scope, $rootScope, $http) {

  //Populate popup
  $scope.initPopup = function(popupId) {
    //only triggerd on popup show
    $(popupId).on('show.bs.modal', function(e) {
      //initiate
      $scope.currentRecord = {};
      $scope.currentWish = {};
      $scope.isLoaded = false;
      var $invoker = $(e.relatedTarget);
      $scope.currentRecord = ($invoker.data('info')) ? $invoker.data('info') : null;
      $scope.enableRemove = ($invoker.data('enableremove')) ? $invoker.data('enableremove') : false;
      $scope.getWish();
    });
  }

  //API get decision
  $scope.getWish = function() {
    //check if used in issuedialog or not
    var id = ($scope.currentRecord.decisions_id) ? $scope.currentRecord.decisions_id : $scope.currentRecord.id;
    //get data
    $http.get("/api/decisions/" + id, {
        cache: false
      })
      .then(function(response) {
        $scope.currentWish = response.data;
        $scope.isLoaded = true;
      }).catch(function() {
        $scope.isLoaded = true;
      });
  }

  //API - Remove decision from dialog row
  $scope.removeWishConnection = function() {
    //set decisions to null
    $scope.currentRecord.decisions_id = null;
    $scope.currentRecord.status = 'open';
    //save issuedialog with decisions = null
    $http({
      method: 'PUT',
      url: '/api/issuedialogs/' + $scope.currentRecord.id,
      data: $scope.currentRecord,
    }).then(function(data) {
      //close popup
      $('#sidebar-wish').modal('toggle');
      //reset currentObject
      $scope.currentRecord = {};
      $scope.currentWish = {};
      //say dialog to refresh
      $rootScope.$broadcast('refreshDialog', {
        page: 1,
        count: -1,
        current: true
      });
    });
  }


})
