//initiate angular
var app = angular.module("Dialog", ['ui.bootstrap', 'ui.select', 'datatables', 'datatables.fixedcolumns', 'datatables.bootstrap', 'openlayers-directive', 'ui-rangeSlider']);

//change prefix so angular and laravel brackets dont conflict
app.config(function($locationProvider, $interpolateProvider, $filterProvider, $sceProvider) {
  $sceProvider.enabled(false);
  $interpolateProvider.startSymbol('###');
  $interpolateProvider.endSymbol('###');
  $locationProvider.hashPrefix('');
});

//initiate angular functions
app.run(function($rootScope, $http, $timeout, $window, $location) {
  // vars
  $rootScope.docDraft = {};
  $rootScope.pageTitle = '';

  $rootScope.$watch(function() {
    return $location.path();
  }, function(a){
    if (a === '/nieuwe-middel') {
      $('#new-middel-btn').click();
    }

    if (a === '/nieuwe-activiteit') {
      $('#new-activity-btn').click();
    }
  });

  //disable spinner for loader on top of page
  NProgress.configure({
    showSpinner: false
  });
  //common feedback validation message

  $rootScope.showFeedback = function(message, type) {
    var type = (type) ? type : '';
    if (type === 'error') {
      $('.d-form-alert.alert-error>p').html(message);
      $('.d-form-alert.alert-error').fadeIn(200).delay(1500).fadeOut(200);
    } else {
      $('.d-form-alert.alert-success>p').html(message);
      $('.d-form-alert.alert-success').fadeIn(200).delay(600).fadeOut(200);
    }
  };
  //common feedback validation message //TODO should be sync to wait for repsponse
  $rootScope.showConfirm = function(message) {
    $('.d-form-confirm>p').html(message);
    $('.d-form-confirm').fadeIn(200);
    $(document.body).on('click', '#confirm-yes', function(event) {
      $('.d-form-confirm').fadeOut(200);
      return true;
    });
    $(document.body).on('click', '#confirm-no', function(event) {
      $('.d-form-confirm').fadeOut(200);
      return false;
    });
  };

  $rootScope.heartBeat = function(timeout) {
    $timeout(function() {
      $http({
        method: 'GET',
        url: '/api/heartbeat'
      }).then(function successCallback() {
        $rootScope.heartBeat(5000);
      }, function errorCallback(response) {
        if (response.status === 401) {
          // Session expired, redirect to login page by refreshing the page
          // in order to be returned to the same page when you're logged in again
          $window.location.reload();
        } else {
          // Other error occurred, slow down the heartbeat a bit until it's back to normal
          $rootScope.heartBeat(10000);
        }
      });
    }, timeout);
  };

  //save menu collapse state across pages
  $rootScope.saveMenuState = function() {
    //browser supports local storage
    if (typeof(Storage) !== "undefined") {
      //onload
      if (localStorage.getItem("menuState")) {
        $('body').attr('class', 'ng-scope ' + localStorage.getItem("menuState"));
        if (localStorage.getItem("menuState") == "nav-sm") {
          $timeout(function() {
            $('#sidebar-menu .nav.child_menu').attr('style', '');
            $('#sidebar-menu .nav.side-menu li').removeClass('active');
          }, 100);
        }
      }
      //on click
      $('a#menu_toggle').on('click', function() {
        var navClass = $('body').attr('class').match(/nav[\w-]*\b/);
        if (navClass == 'nav-md') {
          localStorage.setItem('menuState', 'nav-sm');
        } else {
          localStorage.setItem('menuState', 'nav-md');
        }
      })
    } else {
      // no local storage no menu state saving
    }
  };

  $rootScope.initSwitchTabs = function() {
    $(window).on("popstate", function() {
      var anchor = location.hash || $("a[data-toggle='tab']").first().attr("href");
      $("a[href='" + anchor + "']").tab("show");
    });

    if (location.hash) {
      //hack to remove slash
      // location.hash = location.hash.replace('/', '');
      $("a[href='" + location.hash + "']").tab("show");
    }

    $(document.body).on("click", "a[data-toggle]", function(event) {
      location.hash = this.getAttribute("href");
    });
  };

  $rootScope.setPageTitle = function(title) {
    vm.pageTitle = title;
  };

  $rootScope.goto = function(url) {
    window.location.href = url;
  };

  $rootScope.heartBeat(1500);
  $rootScope.initSwitchTabs();
  $rootScope.saveMenuState();
});

//format for dates in application
app.filter('DialogDateFormat', function myDateFormat($filter) {
  return function(text) {
    if (text) {
      var tempdate = new Date(text.replace(/-/g, "/"));
      return $filter('date')(tempdate, "yyyy-MM-dd");
    } else {
      return text;
    }
  }
});


/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs an AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform an OR.
 */
app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

//format for times in application
app.filter('DialogDateTimeFormat', function myTimeFormat($filter) {
  return function(timestamp) {
    if (timestamp) {
      var temptime = new Date(timestamp * 1000);
      return $filter('date')(temptime, "dd-MM-yyyy HH:mm");
    } else {
      return timestamp;
    }
  }
});

//format for times in application
app.filter('DialogLocalDateTimeFormat', function myTimeFormat($filter) {
  return function(timestampString) { //'2017-01-02 00:00:00'
    if (timestampString) {
      var datetime = moment(timestampString);
      var datetimeLocal = datetime.utc();
      var datetimeLocalFormatted = datetimeLocal.local().format("DD-MM-YYYY");
      return datetimeLocalFormatted;
    } else {
      return timestampString;
    }
  }
});

/**
 * Filesize Filter
 * @Param length, default is 0
 * @return string
 */
app.filter('Filesize', function() {
  return function(size) {
    if (isNaN(size))
      size = 0;

    if (size < 1024)
      return size + ' bytes';

    size /= 1024;

    if (size < 1024)
      return size.toFixed(2) + ' Kb';

    size /= 1024;

    if (size < 1024)
      return size.toFixed(2) + ' Mb';

    size /= 1024;

    if (size < 1024)
      return size.toFixed(2) + ' Gb';

    size /= 1024;

    return size.toFixed(2) + ' Tb';
  };
});



var timestamp = 1301090400,
  date = new Date(timestamp * 1000),
  datevalues = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];


//test controller
app.controller('dialogCtrl', function($scope, $http) {
  $scope.OpenOverlay = function() {
    $('.overlay').css('width', 'auto');
  };
  $scope.CloseOverlay = function() {
    $('.overlay').css('width', '0px');
  };

});

//get all users in current project
app.service('UserService', function($http) {
  return {
    getUsers: function() {
      return $http.get('/api/users/').then(function(result) {
        return result.data.users;
      });
    },
    getStakeholderUsers: function(stakeholdersCode) {
      return $http.get('/api/stakeholders/' + stakeholdersCode + '/users').then(function(result) {
        return result.data.users;
      });
    },
    getStakeholderUserHolder: function(stakeholdersCode) {
      return $http.get('/api/stakeholders/' + stakeholdersCode + '/users/holder').then(function(result) {
        return result.data;
      });
    }
  }
});

//get all matrix details
app.service('MatrixService', function($http) {
  return {
    getLabels: function() {
      return $http.get('/json/matrixlabels.json').then(function(result) {
        return result.data;
      });
    },
    getLabel: function(ranges, currValue) {
      var currValue = (currValue) ? currValue : 0;
      for (var item in ranges) {
        var range = ranges[item];
        if (currValue >= range.min && currValue < range.max) {
          return range;
        }
      }
    },
    getTypeLabel: function(ranges, currValue1, currValue2) {
      var currValue1 = (currValue1) ? currValue1 : 0;
      var currValue2 = (currValue2) ? currValue2 : 0;
      for (var item in ranges) {
        var range = ranges[item];
        if (currValue1 >= range.min_x && currValue1 < range.max_x &&
          currValue2 >= range.min_y && currValue2 < range.max_y) {
          return range;
        }
      }
      return ranges[0];
    }
  }
});

//get all matrix details
app.service('LogService', function($http) {
  return {
    getLog: function(id) {
      return $http.get("/api/logs/" + id)
        .then(function(result) {
          return result.data;
        });
    },
    getLogsFromStakeholder: function(stakeholderCode) {
      return $http.get("/api/stakeholders/" + stakeholderCode + "/logs")
        .then(function(result) {
          return result.data;
        });
    },
    getLogFromStakeholder: function(stakeholderCode, id) {
      return $http.get("/api/stakeholders/" + stakeholderCode + "/logs/" + id)
        .then(function(result) {
          return result.data;
        });
    },
    getLogsFromResident: function(residentId) {
      return $http.get("/api/residents/" + residentId + "/logs")
        .then(function(result) {
          return result.data;
        });
    },
    getLogFromResident: function(residentId, id) {
      return $http.get("/api/residents/" + residentId + "/logs/" + id)
        .then(function(result) {
          return result.data;
        });
    },
    getLogsFromComplaint: function(complaintId) {
      return $http.get("/api/complaints/" + complaintId + "/logs")
        .then(function(result) {
          return result.data;
        });
    },
    getLogFromComplaint: function(complaintId, id) {
      return $http.get("/api/complaints/" + complaintId + "/logs/" + id)
        .then(function(result) {
          return result.data;
        });
    }
  }
});

app.service('UtilService', function($http) {
  return {
    download: function (url, options, callback, errorCallback) {
      var call;
      if (!options.method || (options.method && options.method === 'GET')) {
        call = $http({
          url: url,
          method: 'GET',
          params: options,
          responseType: 'blob'
        });
      } else {
        call = $http({
          url: url,
          method: 'POST',
          data: options,
          responseType: 'blob'
        });
      }

      call.then(function (response){
        var contentDisposition = response.headers('content-disposition');
        var filename = 'download.xlsx'; // Default filename

        // Extracting filename
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }

        var contentType = response.headers('content-type');

        window.saveAs(new Blob([response.data], {type: contentType}), filename); // This is from FileSaver.js

        // Check if callback exist and a function
        var getType = {};
        if (callback && getType.toString.call(callback) === '[object Function]') {
          callback();
        }
      }, function (error) {
        // Check if errorCallback exist and a function
        var getType = {};
        if (errorCallback && getType.toString.call(errorCallback) === '[object Function]') {
          errorCallback();
        }
      });
    }
  };
});
