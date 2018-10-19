app.controller('residentCommunicationCtrl', function ($window, $scope, $rootScope, $filter, $http, DTOptionsBuilder, DTColumnDefBuilder) {

  $scope.middel = {
    'items': []
  };
  $scope.complaints = {
    'items': []
  };
  this.middel = $scope.middel;
  this.complaints = $scope.complaints;

  //Populate page
  $scope.init = function (id) {
    if (id) {
      $scope.getResidentComplaints(id);
      $scope.getResidentMiddels(id);
    }
  };

  $rootScope.$on('UPDATE_RESIDENTS_MIDDEL', function(event, residentId) {
    $scope.getResidentMiddels(residentId);
  });

  $scope.getResidentComplaints = function (residentId) {
    $http.get("/api/residents/" + residentId + "/complaints").then(function (response) {
      if (response.data) {
        $scope.complaints.items = response.data.data;
        $scope.complaints.items.forEach(function (complaint) {
          complaint.formatted_date = moment(complaint.date).format('DD-MM-YYYY');
        });
      }
    });
  };

  $scope.getResidentMiddels = function (residentId) {
    $http.get("/api/residents/" + residentId + "/middel", {
        cache: false,
        params: {
          includeActivities: true
        }
      }
    ).then(function (response) {
      if (response.data) {
        $scope.middel.items = response.data.data;
        $scope.middel.items.forEach(function (middel) {
          if (middel.sent_date) {
            middel.formatted_date = moment(middel.sent_date).format('DD-MM-YYYY');
          }
        });
      }
    });
  };
});
