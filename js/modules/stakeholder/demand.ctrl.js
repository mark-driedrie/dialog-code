app.controller('demandCtrl', function($scope, $rootScope, $http) {

  //Populate popup
  $scope.initPopup = function(popupId) {
    //only triggerd on popup show
    $(popupId).on('show.bs.modal', function(e) {
      //initiate
      $scope.currentRecord = {};
      $scope.currentDemand = {};
      $scope.isLoaded = false;
      var $invoker = $(e.relatedTarget);
      $scope.currentRecord = ($invoker.data('info')) ? $invoker.data('info') : null;
      $scope.enableRemove = ($invoker.data('enableremove')) ? $invoker.data('enableremove') : false;
      $scope.getDemand();
    });
  }
  //API Get demand
  $scope.getDemand = function() {
    //check if used in issuedialog or not
    var id = ($scope.currentRecord.guid) ? $scope.currentRecord.guid : $scope.currentRecord.demands_guid;
    //get data
    $http.get("/api/demands/" + id, {
        cache: false
      })
      .then(function(response) {
        $scope.currentDemand = response.data;
        $scope.isLoaded = true;
      }).catch(function(response) {
        $scope.isLoaded = true;
      })
  }

  //API - Remove demand from dialog
  $scope.removeDemandConnection = function() {
    //set demands to null
    $scope.currentRecord.demands_guid = null;
    $scope.currentRecord.status = 'open';
    //save issuedialog with demands_id = null
    $http({
      method: 'PUT',
      url: '/api/issuedialogs/' + $scope.currentRecord.id,
      data: $scope.currentRecord
    }).then(function() {
      //close popup
      $('#sidebar-demand').modal('toggle');
      //reset currentObject
      $scope.currentRecord = {};
      $scope.currentDemand = {};
      //say dialog to refresh
      $rootScope.$broadcast('refreshDialog', {
        page: 1,
        count: -1,
        current: true
      });
    });
  }
});
