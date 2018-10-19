app.controller('interestCtrl', function($scope, $rootScope, $http) {

  //Declare vars
  $scope.formInterest = {};
  $scope.allInterests = [];

  //Populate popup
  $scope.initPopup = function(popupId) {

    var all = $(popupId).on('show.bs.modal', function(e) {
      //initiate
      var $invoker = $(e.relatedTarget);
      $scope.issueDialogId = ($invoker.data('id')) ? $invoker.data('id') : null;
      $scope.stakeholderName = ($invoker.data('name')) ? $invoker.data('name') : null;
      //form to submit
      $scope.formInterest.status = ($invoker.data('status')) ? $invoker.data('status') : null;
      $scope.formInterest.standpoint = ($invoker.data('standpoint')) ? $invoker.data('standpoint') : null;
      $scope.formInterest.stakeholders_code = ($invoker.data('stakeholdercode')) ? $invoker.data('stakeholdercode') : null;

      // GetInterestsByStakeholder
      $http.get("/api/stakeholders/" + $scope.formInterest.stakeholders_code + "/interests", {
          cache: false
        })
        .then(function(response) {
          $scope.allInterests = response.data.interests;
        }, function errorCallback(response) {});
    });
  }

  //API - Update Interest
  $scope.submitInterest = function(interestId) {
    //save interest param(issueDialogId, interestId, status, standpoint, stakeholders_code)
    $scope.formInterest.interests_id = interestId;

    $http({
      method: 'PUT',
      url: '/api/issuedialogs/' + $scope.issueDialogId,
      data: $scope.formInterest,
    }).then(function(data) {
      //say dialog to refresh
      $rootScope.$broadcast('refreshDialog', {
        page: 1,
        count: -1,
        current: true
      });
    });
    //close popup
    $('#sidebar-interests').modal('toggle');
  }
})
