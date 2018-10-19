app.controller('stakeholderCtrl', function($window, $scope, $rootScope, $filter, $http, DTOptionsBuilder, DTColumnDefBuilder, UserService) {

  //Declare vars
  $scope.formData.allUsers = [];
  $scope.formData.users = [];
  $scope.formData.user_primary = {};
  $scope.formData.name = '';
  $scope.isDisabled = false;
  $scope.newLabel = 'Nieuwe Stakeholder';
  $scope.errors = {};
  $scope.formData.types = [];
  $scope.allTypes = [];

  //Populate page
  $scope.init = function(id) {
    $scope.getStakeholderTypes();
    //EDIT
    if (id) {
      $scope.getStakeholder(id);
      $scope.getUsersOfStakeholder(id);
      $scope.getUserHolderOfStakeholder(id);
    }
    //NEW
    else {
      $("#stakeholder-name").html($scope.newLabel);
    }
  };

  // STAKEHOLDER

  //API - Get stakholdertypes
  $scope.getStakeholderTypes = function() {
    $http.get("/api/stakeholdertypes")
      .then(function(response) {
        if (response.data) {
          $scope.allTypes = response.data.stakeholdertypes;
        }
      }).catch(function(response) {
        $rootScope.showFeedback('Er is een error opgetreden', 'error');
      });
  };


  //API - Get stakeholder
  $scope.getStakeholder = function(id) {
    //get stakeholder
    if (id) {
      $http.get("/api/stakeholders/" + id)
        .then(function(response) {
          if (response.data) {
            //populate header outside of scope
            $("#stakeholder-name").html(response.data.name);
            $scope.formData = response.data;
            $scope.formData.types = response.data.stakeholdertypes;
          }
        }).catch(function() {
          $rootScope.showFeedback('Er is een error opgetreden', 'error');
        });
    }
  };

  //API - Save stakeholder
  $scope.submitStakeholder = function(isValid) {
    //save data
    $scope.submittedSH = true;
    if (isValid) {

      //filter ids from object array
      $TypeIds = ($scope.formData.types && $scope.formData.types.length > 0) ? _.map($scope.formData.types, 'id') : [];

      //EDIT
      if ($scope.formData.code) {
        $http.put("/api/stakeholders/" + $scope.formData.code, {
            name: $scope.formData.name,
            description: $scope.formData.description,
            importance: 'hoog',
            address: $scope.formData.address,
            postcode: $scope.formData.postcode,
            city: $scope.formData.city,
            longitude: $scope.formData.longitude,
            latitude: $scope.formData.latitude,
            country: 'Nederland',
            stakeholdertypes: $TypeIds
          })
          .then(function() {
            $rootScope.showFeedback("Opgeslagen");
            $scope.errors = {};
          }).catch(function(error) {
            var message = 'Er is een error opgetreden';
            // It's an array, so only double equal check
            if (error.data.address && error.data.address == 'validation.unique_stakeholder_address') {
              message = 'Adres bestaat al';
            }

            $rootScope.showFeedback(message, 'error');
            $scope.errors = error.data;
          });
      }
      //NEW
      else {
        NProgress.start();
        $scope.isDisabled = true; // disable input to prevent doubles
        $http.post("/api/stakeholders", {
            name: $scope.formData.name,
            description: $scope.formData.description,
            importance: 'hoog',
            address: $scope.formData.address,
            postcode: $scope.formData.postcode,
            city: $scope.formData.city,
            longitude: $scope.formData.longitude,
            latitude: $scope.formData.latitude,
            country: 'Nederland',
            stakeholdertypes: $TypeIds
          })
          .then(function(response) {
            NProgress.done();
            $scope.errors = {};
            $window.location.href = '../stakeholders/' + response.data.code; //temp refresh
          }).catch(function(error) {
            $scope.isDisabled = false;
            NProgress.done();

            var message = 'Er is een error opgetreden';
            // It's an array, so only double equal check
            if (error.data.address && error.data.address == 'validation.unique_stakeholder_address') {
              message = 'Adres bestaat al';
            }

            $rootScope.showFeedback(message, 'error');
            $scope.errors = error.data;
          });
      }
    }
  };

  //USERS

  // API Get all users of stakeholder
  $scope.getUsersOfStakeholder = function(id) {
    //get all users
    UserService.getUsers().then(function(data) {
      //set all users
      $scope.formData.allUsers = data;
      //get users of stakeholder
      if (id) {
        UserService.getStakeholderUsers(id).then(function(data) {
          //set users
          $scope.formData.users = data;
        })
      }
    });
  };

  //API Get User holder of stakeholder
  $scope.getUserHolderOfStakeholder = function(id) {
    UserService.getStakeholderUserHolder(id).then(function(data) {
      $scope.formData.user_primary = data;
    });
  };

  //API Save stakeholder users
  $scope.submitStakeholderUsers = function() {
    //edit
    if ($scope.formData.code) {
      $http.post("/api/stakeholders/" + $scope.formData.code + "/users", {
          'users': $scope.formData.users
        })
        .then(function() {
          $rootScope.showFeedback("Opgeslagen");
        }).catch(function() {
          $rootScope.showFeedback('Er is een error opgetreden', 'error');
        });
    }
  };

  //API Save stakeholders user holder
  $scope.submitStakeholderUserHolder = function() {
    //edit
    if ($scope.formData.code) {
      $http.post("/api/stakeholders/" + $scope.formData.code + "/users/holder", {
          'email': $scope.formData.user_primary.email
        })
        .then(function() {
          $rootScope.showFeedback("Opgeslagen");
        }).catch(function() {
          $rootScope.showFeedback('Er is een error opgetreden', 'error');
        });
    }
  }

});
