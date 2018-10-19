app.controller('calendarHeaderCtrl', function($scope, $rootScope, $http) {
  $scope.activitiesSelector = 'select[name="activities"]';
  $scope.activities = [];
  $scope.middel = {
    activities_id: null,
    type: null,
    group: null,
    sent_date: null
  };
  $scope.activity = {
    name: null,
    date: null
  };
  $scope.editedActivity = {
    id: null,
    name: null,
    date: null
  };
  $scope.filter = {
    id: null,
    name: null
  };
  $scope.errors = {};

  $rootScope.$on('ACTIVITIES_LOADED', function(event, response) {
    $scope.activities = response;
  });

  $rootScope.$on('CALENDAR_FILTERED', function(event, filter) {
    $scope.filter = filter;
  });

  $rootScope.$on('SHOW_EDIT_ACTIVITY', function(event, activity) {
    $scope.editedActivity = activity;
  });

  angular.element(document).ready(function () {
    $scope.generateActivitiesSelector();
    $scope.initializeDatePicker();
  });

  $scope.generateActivitiesSelector = function() {
    $($scope.activitiesSelector).select2({
      language: "nl",
      containerCssClass: "search-input-row",
      minimumInputLength: 0,
      width: "100%",
      multiple: false
    });

    // Attach change listener
    $($scope.activitiesSelector).on('select2:select', function (e) {
      var data = e.params.data;
      if (data && data.id) {
        $scope.middel.activities_id = data.id;
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
      timePicker: false
    });
  };

  $scope.isValidNewMiddel = function() {
    return $scope.newMiddelForm.$valid;
  };

  $scope.submitMiddel = function() {
    if (!$scope.isValidNewMiddel()) {
      return;
    }

    $http.post("/api/middel", $scope.prepareMiddelData($scope.middel)).then(function () {
      $scope.errors = {};
      $scope.middel = {};
      $($scope.activitiesSelector).val(null).trigger('change.select2');

      $scope.closeModals();
      $rootScope.$emit('LOAD_MIDDELS');
      $rootScope.showFeedback("Opgeslagen");
    }).catch(function (error) {
      NProgress.done();
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
      $scope.errors = error.data;
    });
  };

  $scope.isValidNewActivity = function() {
    return $scope.newActivityForm.$valid;
  };

  $scope.submitActivity = function() {
    if (!$scope.isValidNewActivity()) {
      return;
    }

    $http.post("/api/activities", $scope.prepareActivityData($scope.activity)).then(function () {
      $scope.errors = {};
      $scope.activity = {};

      $scope.closeModals();
      $rootScope.$emit('LOAD_ACTIVITIES');
      $rootScope.showFeedback("Opgeslagen");
    }).catch(function (error) {
      NProgress.done();
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
      $scope.errors = error.data;
    });
  };

  $scope.isValidEditActivity = function() {
    if (!$scope.editedActivity.date || !$scope.editedActivity.name || !$scope.editedActivity.id) {
      return false;
    }

    return $scope.editActivityForm.$valid;
  };

  $scope.updateActivity = function() {
    if (!$scope.isValidEditActivity()) {
      return;
    }

    $http.put("/api/activities/" + $scope.editedActivity.id, $scope.prepareActivityData($scope.editedActivity)).then(function () {
      $scope.errors = {};
      $scope.activity = {};

      $scope.closeModals();
      $rootScope.$emit('LOAD_ACTIVITIES');
      $rootScope.showFeedback("Opgeslagen");

      // Reset the value
      $scope.editedActivity = {
        id: null,
        name: null,
        date: null
      };
    }).catch(function (error) {
      NProgress.done();
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
      $scope.errors = error.data;
    });
  };

  $scope.prepareActivityData = function(activity) {
    const data = $.extend(true, {}, activity);
    data.date = moment(activity.date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    return data;
  };

  $scope.prepareMiddelData = function(middel) {
    const data = $.extend(true, {}, middel);
    data.sent_date = moment(middel.sent_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    return data;
  };

  $scope.closeModals = function() {
    var closeButtons = $('button[data-dismiss="modal"]');
    for (var i = 0; i < closeButtons.length; i++) {
      $(closeButtons[i]).click();
    }
  };

  $scope.resetFilter = function() {
    $rootScope.$emit('RESET_FILTER');
    $scope.filter = {
      id: null,
      name: null
    };
  };

  $scope.openNewActivity = function() {
    $scope.closeModals();
    $('#new-activity-btn').click();
  };
});
