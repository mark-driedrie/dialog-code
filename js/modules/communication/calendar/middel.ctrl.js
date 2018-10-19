app.controller('middelCtrl', function($scope, $rootScope, $http) {

  //declare vars
  $scope.isLoaded = false;
  $scope.middelId = null;
  $scope.middel = {};
  $scope.activities = [];
  $scope.users = [];
  $scope.errors = {};
  $scope.process = {
    activitiesLoaded : false,
    middelLoaded : false
  };
  $scope.activitiesSelector = 'select[name="activities"]';

  $scope.init = function(middelId) {
    $scope.middelId = middelId;
    $scope.getActivities();
    $scope.getUsers();
    $scope.getMiddel(middelId);
  };

  // Api calls
  $scope.getActivities = function() {
    $http.get("/api/activities", {
      cache: false
    }).then(function(response) {
      if (response.data.data) {
        $scope.activities = $.map(response.data.data, function (obj) {
          const formattedDate = moment(obj.date).format('DD-MM-YYYY');
          return {
            id: obj.id,
            name: obj.name,
            date: obj.date,
            formatted_date: formattedDate
          };
        });

        $scope.process.activitiesLoaded = true;
      }
    }).catch(function() {
      $rootScope.showFeedback('Error: tijdens ophalen van de activiteiten', 'error');
    });
  };

  $scope.getMiddel = function() {

    NProgress.start();
    $http.get("/api/middel/" + $scope.middelId, {
      cache: false,
      params: {
        includeDocuments : true
      }
    }).then(function(response) {
      NProgress.done();
      if (response.data) {
        $scope.rebuildData(response);
        $scope.initializeDatePicker();
        $scope.process.middelLoaded = true;

        $rootScope.$emit('MIDDEL_LOADED', response);
      }
      $scope.isLoaded = true;
    }).catch(function() {
      $scope.isLoaded = true;
      NProgress.done();
      $rootScope.showFeedback('Error: tijdens ophalen van de middel', 'error');
    });

  };

  $scope.getUsers = function() {
    $http.get("/api/users", {
      cache: false
    }).then(function(response) {
      if (response.data) {
        $scope.users = response.data.users;
      }
    }).catch(function() {
      $rootScope.showFeedback('Error tijdens ophalen van de gebruikers', 'error');
    });
  };

  $scope.updateMiddel = function() {
    if (!$scope.isLoaded) {
      return;
    }

    $http.put("/api/middel/" + $scope.middelId, $scope.prepareData()).then(function (response) {
      $scope.errors = {};
      $scope.rebuildData(response);
      $rootScope.showFeedback("Opgeslagen");
    }).catch(function (error) {
      NProgress.done();
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
      $scope.errors = error.data;
    });
  };

  $scope.rebuildData = function(response) {
    $scope.middel = response.data;
    if (response.data.sent_date) {
      $scope.middel.formatted_sent_date = moment(response.data.sent_date).format('DD-MM-YYYY');
    }
    if (response.data.users && response.data.users.length > 0) {
      $scope.middel.user = $scope.middel.users[0];
    }
  };

  $scope.removeDocument = function(index, docId) {
    bootbox.confirm({
      message: "Weet u het zeker dat u het document wilt verwijderen?",
      className: "d-form-confirm",
      backdrop: false,
      closeButton: false,
      buttons: {
        cancel: {
          label: 'Nee'
        },
        confirm: {
          label: 'Ja'
        }
      },
      callback: function(result) {
        if (result) {
          $http.delete('/api/middel/' + $scope.middelId + '/documents/' + docId).then(function(data) {
            $scope.middel.middel_documents.splice(index, 1);
          });
        }
      }
    });
  };

  $scope.initializeDatePicker = function() {
    $('input.daterangepicker').daterangepicker({
      locale: {
        format: 'DD-MM-YYYY'
      },
      singleDatePicker: true,
      showDropdowns: true,
      startDate: $scope.middel.formatted_sent_date,
      timePicker: false
    });
  };

  angular.element(document).ready(function () {
    $scope.generateActivitiesSelector();
  });

  $scope.generateActivitiesSelector = function() {
    $($scope.activitiesSelector).select2({
      language: "nl",
      containerCssClass: "search-input-row",
      minimumInputLength: 0,
      width: "100%",
      multiple: false
    });
  };

  $scope.middelSent = function() {
    if ($scope.middel && $scope.middel.sent_date) {
      return moment().isAfter($scope.middel.sent_date);
    }

    return false;
  };

  $rootScope.$on('FILE_UPDATED', function(event, response) {
    $scope.upload = response;
    $scope.updateDocs();
  });

  // It seems that ng-selected with select2 doesn't work hand to hand, so let's trigger it here
  $scope.$watchCollection('process', function() {
    if ($scope.process.activitiesLoaded && $scope.process.middelLoaded) {
      $($scope.activitiesSelector).val($scope.middel.activities_id).trigger('change.select2');

      // Attach change listener
      $($scope.activitiesSelector).on('select2:select', function (e) {
        var data = e.params.data;
        if (data && data.id) {
          // Update middel
          $scope.middel.activities_id = data.id;
          $scope.updateMiddel();
        }
      });
    }
  });

  //API - Get docs
  $scope.updateDocs = function() {
    $scope.isLoaded = false;
    $http.get("/api/middel/" + $scope.middelId + "/documents", {
      cache: false
    }).then(function(response) {
      $scope.middel.middel_documents = response.data;
      $scope.isLoaded = true;
    }).catch(function() {
      console.log('Error deleting document');
      $rootScope.showFeedback('Error tijdens verwijderen van de document', 'error');
    });
  };

  $scope.prepareData = function () {
    const data = $scope.middel;
    // Put single object into an array to be persisted.
    // Meant to prepare possibility in the future for multiple users
    if ($scope.middel.user) {
      data.users = [
        $scope.middel.user
      ];
    }

    //Sync the date
    $scope.middel.sent_date = moment($scope.middel.formatted_sent_date, 'DD-MM-YYYY').format('YYYY-MM-DD');

    return data;
  };

  $scope.checkForm = function(type) {
    var isError = false;
    var form = $scope.middelForm;
    if (form && form.$error && form.$error.required && form.$error.required.length > 0) {

      form.$error.required.forEach(function(error) {
        if (error.$name === type) {
          isError = true;
          return;
        }
      });
    }

    return isError;
  };
});
