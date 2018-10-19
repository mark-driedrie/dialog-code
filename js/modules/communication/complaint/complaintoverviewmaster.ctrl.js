app.controller('complaintOverviewMasterCtrl', function($scope) {

  /**
   * Hacky solution so that the map is rendered first with visibility hidden
   * and then when the tab is clicked, we show it.
   * @type {{visibility: string}}
   */
  $scope.showMapStyle = {
    'visibility': 'hidden'
  };

  $scope.mapShown = false;
  $scope.renderMap = function() {
    if (!$scope.mapShown) {
      $scope.showMapStyle = {
        'visibility': 'visible'
      };
      $scope.mapShown = true;
    }
  };

  angular.element(document).ready(function () {
    $('#complaint-list')[0].click();
  });
});
