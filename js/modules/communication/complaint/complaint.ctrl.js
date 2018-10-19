app.controller('complaintCtrl', function ($window, $scope, $rootScope, $filter, $http) {
  //Declare vars
  $scope.formData.name = '';
  $scope.isDisabled = false;
  $scope.users = [];
  $scope.complaintThemes = [];
  $scope.complaint = {};
  $scope.complaintSelector = 'select[for="complainant-select"]';
  $scope.complainees = [];
  $scope.submittedComplaint = false;
  $scope.errors = {};

  $scope.init = function (id) {
    //EDIT
    if (id) {
      $scope.getComplaint(id);
    } else {
      $rootScope.create = true;
      $scope.initializeDatePicker();
    }

    $scope.getUsers();
    $scope.getComplaintThemes();
    $scope.initializeComplaineeSelector();
  };

  //API - Get complaint
  $scope.getComplaint = function (id) {

    if (id) {
      $http.get("/api/complaints/" + id).then(function (response) {
        if (response.data) {
          $scope.rebuildData(response);

          // Make it available to root for page title
          $rootScope.complaint = $scope.complaint;

          // Set the melder dropdown selected value
          $scope.updateSelectedComplainant();
          $scope.initializeDatePicker();
        }
      }).catch(function (e) {
        $rootScope.showFeedback('Er is een error opgetreden', 'error');
      });
    }
  };

  //API Create complaints
  $scope.createComplaint = function () {
    NProgress.start();
    $scope.isDisabled = true; // disable input to prevent doubles
    $http.post("/api/complaints", $scope.prepareData()).then(function (response) {
      NProgress.done();
      $window.location.href = '../klachten/' + response.data.id; //temp refresh
      $scope.isDisabled = false;
    }).catch(function (error) {
      NProgress.done();
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
      $scope.errors = error.data;
      $scope.isDisabled = false;
    });
  };

  //API Update complaints
  $scope.updateComplaint = function () {
    $http.put("/api/complaints/" + $scope.formData.id, $scope.prepareData()).then(function (response) {
      $scope.rebuildData(response);
      $scope.errors = {};
      $rootScope.showFeedback("Opgeslagen");
    }).catch(function (error) {
      NProgress.done();
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
      $scope.errors = error.data;
    });
  };

  $scope.prepareData = function () {
    const data = $.extend(true, {}, $scope.complaint);
    data.country = 'Nederland';

    // Put single object into an array to be persisted.
    // Meant to prepare possibility in the future for multiple users
    if ($scope.complaint.user) {
      data.users = [
        $scope.complaint.user
      ];
    }

    // Server accepts reversed format only
    data.date = moment($scope.complaint.date, 'DD-MM-YYYY').format('YYYY-MM-DD');

    return data;
  };

  $scope.rebuildData = function(response) {
    if (response.data.date) {
      response.data.date = moment(response.data.date).format('DD-MM-YYYY');
    }
    $scope.complaint = response.data;

    if (response.data.users && response.data.users.length > 0) {
      $scope.complaint.user = response.data.users[0];
    }

    if (response.data.stakeholders && response.data.stakeholders.code) {
      $scope.complaint.complainant_link = '/stakeholders/' + response.data.stakeholders.code;
    } else if (response.data.residents_id) {
      $scope.complaint.complainant_link = '/omwonenden/' + response.data.residents_id;
    }
  };

  //API - Save complaint
  $scope.submitComplaint = function (isValid) {
    //save data
    $scope.submittedComplaint = true;
    if (isValid) {
      //EDIT
      if ($scope.formData.id) {
        $scope.updateComplaint();
      }
      //NEW
      else {
        $scope.createComplaint();
      }
    }
  };

  $scope.getUsers = function () {
    $http.get("/api/users").then(function (response) {
      if (response.data) {
        $scope.users = response.data.users;
      }
    }).catch(function (response) {
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
    });
  };

  $scope.markHandled = function (id) {
    $scope.complaint.final_logs_id = id;
    $scope.submitComplaint($scope.editComplaintForm.$valid);
  };

  $scope.getComplaintThemes = function () {
    $http.get("/api/complaintthemes").then(function (response) {
      if (response.data) {
        $scope.complaintThemes = response.data;
      }
    }).catch(function (response) {
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
    });
  };

  angular.element(document).ready(function () {
    $scope.generateComplaineeSelector();
  });

  $scope.generateComplaineeSelector = function(data) {
    $($scope.complaintSelector).select2({
      language: "nl",
      containerCssClass: "search-input-row",
      minimumInputLength: 0,
      width: "100%",
      multiple: false,
      data: data
    });
  };

  $scope.initializeDatePicker = function() {
    $('input.daterangepicker').daterangepicker({
      locale: {
        format: 'DD-MM-YYYY'
      },
      singleDatePicker: true,
      showDropdowns: true,
      startDate: $scope.complaint.date,
      timePicker: false
    });
  };

  $scope.initializeComplaineeSelector = function () {
    $http.get("/api/stakeholders?count=500").then(function (stakeholdersResponse) {
      $http.get("/api/residents?count=500").then(function (residentsResponse) {
        //map json response into array for selection
        let stakeholders = $.map(stakeholdersResponse.data.stakeholders, function (obj) {
          return $scope.generateComplainantObject(obj.code, obj.name, 'stakeholder');
        });

        let residents = $.map(residentsResponse.data.data, function (obj) {
          return $scope.generateComplainantObject(obj.id, obj.name, 'resident');
        });

        $scope.complainees = $.merge(stakeholders, residents);
        $scope.generateComplaineeSelector($scope.complainees);
        // Set the melder dropdown selected value
        $scope.updateSelectedComplainant();

        // Attach event listener
        $($scope.complaintSelector).on("select2:select", function (e) {
          var data = e.params.data;
          if (data.type === 'stakeholder') {
            $scope.complaint.stakeholders_code = data.id;
          } else if (data.type === 'resident') {
            $scope.complaint.residents_id = data.id;
          }

          // Auto update if this is not on create mode
          if (!$rootScope.create) {
            $scope.submitComplaint($scope.editComplaintForm.$valid);
          }
        });
      })
    });
  };

  $scope.generateComplainantObject = function(id, text, type) {
    return {
      id: id,
      text: text,
      type: type
    };
  };

  $scope.updateSelectedComplainant = function() {
    if ($scope.complainees.length > 0) {
      if ($scope.complaint.residents && $scope.complaint.residents.id) {
        $($scope.complaintSelector).val($scope.complaint.residents.id).trigger('change.select2');
      } else if ($scope.complaint.stakeholders && $scope.complaint.stakeholders.code) {
        $($scope.complaintSelector).val($scope.complaint.stakeholders.code).trigger('change.select2');
      }
    }
  };

  // For validation ux
  $scope.showRequired = function(form, field) {
      return ($scope[form][field].$dirty || $scope.submittedComplaint) && $scope[form][field].$error.required;
  };

});
