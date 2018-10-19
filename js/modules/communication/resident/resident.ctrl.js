app.controller('residentCtrl', function ($window, $scope, $rootScope, $filter, $http, DTOptionsBuilder, DTColumnDefBuilder) {

  //Declare vars
  $scope.formData.name = '';
  $scope.formData.allTypes = [{name: 'Omwonende'}, {name: 'Bedrijf'}];
  $scope.isDisabled = false;
  $scope.newLabel = 'Nieuwe Omwonende/Bedrijf';
  $scope.errors = {};

  //Populate page
  $scope.init = function (id) {
    //EDIT
    if (id) {
      $scope.getResident(id);
    }
    //NEW
    else {
      $("#resident-name").html($scope.newLabel);
    }
  };
  // RESIDENT
  //API - Get resident
  $scope.getResident = function (id) {

    if (id) {
      $http.get("/api/residents/" + id)
        .then(function (response) {
          if (response.data) {
            //populate header outside of scope
            $("#resident-name").html(response.data.name);
            $scope.formData = response.data;
            $scope.formData.type = {name: response.data.type};
          }
        }).catch(function () {
        $rootScope.showFeedback('Er is een error opgetreden', 'error');
      });
    }
  };

  //API Create residents
  $scope.createResident = function () {
    NProgress.start();
    $scope.isDisabled = true; // disable input to prevent doubles
    $http.post("/api/residents", $scope.prepareData())
      .then(function (response) {
        NProgress.done();
        $scope.errors = {};
        $window.location.href = '../omwonenden/' + response.data.id; //temp refresh
      }).catch(function (error) {
        $scope.isDisabled = false;
        NProgress.done();

        var message = 'Er is een error opgetreden';
        // It's an array, so only double equal check
        if (error.data.address && error.data.address == 'validation.unique_resident_address') {
          message = 'Adres bestaat al';
        }

        $rootScope.showFeedback(message, 'error');
        $scope.errors = error.data;
    });
  };

  //API Update residents
  $scope.updateResident = function () {
    $http.put("/api/residents/" + $scope.formData.id, $scope.prepareData())
      .then(function (response) {
        $rootScope.showFeedback("Opgeslagen");
        $scope.errors = {};
        $rootScope.$emit('UPDATE_RESIDENTS_MIDDEL', $scope.formData.id);
      }).catch(function (error) {
        var message = 'Er is een error opgetreden';
        // It's an array, so only double equal check
        if (error.data.address && error.data.address == 'validation.unique_resident_address') {
          message = 'Adres bestaat al';
        }

        $rootScope.showFeedback(message, 'error');
        $scope.errors = error.data;
    });
  };

  $scope.prepareData = function () {
    return {
      name: $scope.formData.name,
      phone: $scope.formData.phone,
      email: $scope.formData.email,
      type: $scope.formData.type.name,
      address: $scope.formData.address,
      postcode: $scope.formData.postcode,
      city: $scope.formData.city,
      longitude: $scope.formData.longitude,
      latitude: $scope.formData.latitude,
      country: 'Nederland'
    };
  };

  //API - Save resident
  $scope.submitResident = function (isValid) {
    //save data
    $scope.submittedResident = true;
    if (isValid) {
      //EDIT
      if ($scope.formData.id) {
        $scope.updateResident();
      }
      //NEW
      else {
        $scope.createResident();
      }
    }
  }

});
