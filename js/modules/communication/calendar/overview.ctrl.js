app.controller('calendarOverviewCtrl', function($scope, $rootScope, $http) {

  //declare vars
  $scope.activities = [];
  $scope.middels = [];
  $scope.now = [
    {
      type: 'now',
      formatted_date: moment().format('DD MMM YYYY')
    }
  ];
  $scope.calendarEntries = [];
  $scope.calendarEntriesFiltered = [];

  $scope.filter = {
    id: null,
    name: null
  };

  $scope.init = function() {
    $scope.getActivities();
    $scope.getMiddels();
  };

  $rootScope.$on('LOAD_ACTIVITIES', function() {
    $scope.getActivities();
  });

  $rootScope.$on('LOAD_MIDDELS', function() {
    $scope.getMiddels();
  });

  $rootScope.$on('RESET_FILTER', function() {
    $scope.filter = {
      id: null,
      name: null
    };

    $scope.filterEntries();
  });

  //API Get alls
  $scope.getActivities = function(search) {

    NProgress.start();
    $http.get("/api/activities", {
        cache: false,
        params: {
          search: search,
          order_by: 'date',
          desc: true
        }
    }).then(function(response) {
      NProgress.done();
      if (response.data && response.data.data) {
        $scope.activities = response.data.data;
        $scope.activities.forEach(function (activity) {
          activity.formatted_date = moment(activity.date).format('DD MMM YYYY');
          activity.edit_formatted_date = moment(activity.date).format('DD-MM-YYYY');
          activity.past = moment().diff(moment(activity.date)) > 0;
        });

        $rootScope.$emit('ACTIVITIES_LOADED', $scope.activities);
        $scope.processCalendarEntries();
      }
    }).catch(function() {
      NProgress.done();
      $rootScope.showFeedback('Error: tijdens ophalen van activiteiten', 'error');
    });

  };

  $scope.getMiddels = function(search) {
    $http.get("/api/middel", {
      cache: false,
      params: {
        search: search,
        includeActivities: true,
        order_by: 'sent_date',
        desc: true
      }
    }).then(function(response) {
      NProgress.done();
      if (response.data && response.data.data) {
        $scope.middels = response.data.data;
        $scope.middels.forEach(function (middel) {
            middel.formatted_date = moment(middel.sent_date).format('DD MMM YYYY');
            middel.past = moment().diff(middel.sent_date) > 0;
        });

        $scope.processCalendarEntries();
      }
    }).catch(function() {
      NProgress.done();
      $rootScope.showFeedback('Error: tijdens ophalen van middelen', 'error');
    });
  };

  $scope.processCalendarEntries = function() {
    if ($scope.activities.length === 0 && $scope.middels.length === 0) {
      return;
    }

    var tempArray = $scope.activities.concat($scope.middels);
    tempArray = tempArray.concat($scope.now);
    tempArray.sort(function(a, b) {
      return moment(new Date(a.formatted_date)).diff(moment(new Date(b.formatted_date)), 'days');
    });

    var weekNumber = null;
    var weekObject = null;
    $scope.calendarEntries = [];
    tempArray.forEach(function(entry) {
      var currentWeekNumber = moment(new Date(entry.formatted_date)).week();
      if (currentWeekNumber !== weekNumber) {
        // Append to calendarEntries if week is changing and this is not the first loop
        if (weekObject) {
          $scope.calendarEntries.push(weekObject);
        }

        // Cannot save the moment into variable because the mutation would be duplicated on the next variable
        var startWeek = moment(new Date(entry.formatted_date)).startOf('isoWeek');
        var endWeek = moment(new Date(entry.formatted_date)).endOf('isoWeek');

        var start = $scope.generateWeekStartEndObject(startWeek);
        var end = $scope.generateWeekStartEndObject(endWeek);

        weekNumber = currentWeekNumber;
        weekObject = {
          weekNumber: weekNumber,
          start: start,
          end: end,
          entry: []
        };
      }

      weekObject.entry.push($scope.defineCalendarEntityType(entry));
    });

    // Append to calendarEntries for last loop and it is not null
    if (weekObject) {
      $scope.calendarEntries.push(weekObject);
    }

    $scope.filterEntries();
  };

  $scope.generateWeekStartEndObject = function(moment) {
    return {
      day: moment.format('ddd'),
      date: moment.format('D'),
      month: moment.format('MMM'),
      year: moment.format('YYYY'),
      year2: moment.format('YY')
    };
  };

  $scope.defineCalendarEntityType = function(entity) {
    if (entity.activities_id) {
      entity.type = 'middel';
    } else if (entity.type && entity.type === 'now') {
      // Leave it, it's set already
    } else {
      entity.type = 'activity';
    }

    return entity;
  };

  $scope.applyFilter = function(activityId, activityName) {
    $scope.filter = {
      id: activityId,
      name: activityName
    };

    $rootScope.$emit('CALENDAR_FILTERED', $scope.filter);
    $scope.filterEntries();
  };

  $scope.filterEntries = function() {
    if (!$scope.filter.id && !$scope.filter.name) {
      $scope.calendarEntriesFiltered = $scope.calendarEntries;
      return;
    }

    $scope.calendarEntriesFiltered = [];
    $scope.calendarEntries.forEach(function(week) {
      var weekObj = {
        weekNumber: week.weekNumber,
        entry: []
      };

      week.entry.forEach(function(entry) {
        if ((entry.type === 'middel' && entry.activities_id === $scope.filter.id) || (entry.type === 'activity' && entry.id === $scope.filter.id)) {
          // Cannot save the moment into variable because the mutation would be duplicated on the next variable
          var startWeek = moment(entry.formatted_date).startOf('isoWeek');
          var endWeek = moment(entry.formatted_date).endOf('isoWeek');

          var start = $scope.generateWeekStartEndObject(startWeek);
          var end = $scope.generateWeekStartEndObject(endWeek);
          weekObj.start = start;
          weekObj.end = end;

          weekObj.entry.push(entry);
        }
      });

      if (weekObj.entry.length > 0) {
        $scope.calendarEntriesFiltered.push(weekObj);
      }
    });
  };

  $scope.deleteActivity = function(id) {
    bootbox.confirm({
      message: "Weet u zeker dat u deze activiteit wilt verwijderen?",
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
          $http.delete('/api/activities/' + id).then(function(data) {
            $scope.getActivities();
          }).catch(function(error) {
            $rootScope.showFeedback('Dit item kan niet worden verwijderd, omdat er nog koppelingen mee zijn. Zie detail pagina.', 'error');
          });
        }
      }
    });
  };

  $scope.deleteMiddel = function(id) {
    bootbox.confirm({
      message: "Weet u zeker dat u dit middel wilt verwijderen?",
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
          $http.delete('/api/middel/' + id).then(function(data) {
            $scope.getMiddels();
          });
        }
      }
    });
  };

  $scope.loadActivityDetail = function(id, name, date) {
    $rootScope.$emit('SHOW_EDIT_ACTIVITY', {
      id: id,
      name: name,
      date: date
    });
  };

  $scope.scrollToCurrentDate = function() {
    var hook = document.getElementById('current-date');
    if (hook) {
      animateScrollTo(hook);
    }
  };
});
