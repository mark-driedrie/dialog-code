//get specific issue
app.controller('issueCtrl', function($window, $scope, $filter, $rootScope, $http, UserService) {

  //opened by popup
  $("#sidebar-issues").on('shown.bs.modal', function(e) {
    $scope.init($scope.issueMaster.id)
  });


  //Populate page
  $scope.init = function(issueCode) {
    NProgress.start();
    //set default values
    $scope.isIssueDocsLoaded = false;
    $scope.isNew = false;
    $scope.isDisabled = false;
    $scope.formData = {};
    $scope.formData.code = issueCode ? issueCode : null;
    $scope.formData.issues_date = new Date();
    $scope.formData.urgency = 'laag';
    $scope.formData.issues_status = 'open';
    $scope.formData.allUsers = [];
    $scope.formData.users = [];
    $scope.formData.issues_date = null;
    $scope.formData.title = 'Nieuw Issue';

    UserService.getUsers().then(function(data) {
      $scope.formData.allUsers = data;

      //if create new
      if (!issueCode) {
        $scope.isNew = true;
        $("#issue-name").html($scope.formData.title);
        $scope.initDatePicker();
        return;
      }

      //get all common info
      $http.get("/api/issues/" + issueCode + '/edit', {
        cache: false
      }).then(function(response) {

      //algemeen
      var issueData = response.data.issue;
      $scope.formData.issues_date = moment(issueData.issues_date).format('DD-MM-YYYY');
      $scope.formData.name = issueData.name;
      $scope.formData.description = issueData.description;
      $scope.formData.rationale = issueData.rationale;
      $scope.formData.urgency = issueData.urgency;
      $scope.formData.issues_status = issueData.issues_status;
      $scope.formData.users = response.data.users;

      $("#issue-name").html(issueData.name);

      //get all docs
      $scope.issueDocs = [];
      if (issueData.issues_documents) {
        $scope.issueDocs = issueData.issues_documents;
      }
      $scope.isIssueDocsLoaded = true;

      $scope.initDatePicker();
    }, function errorCallback(response) {});

    });
    NProgress.done();
  };

  $scope.initDatePicker = function() {
    //data range picker
    $('input.daterangepicker').daterangepicker({
      locale: {
        format: 'DD-MM-YYYY'
      },
      singleDatePicker: true,
      showDropdowns: true,
      startDate: $scope.formData.issues_date ? $scope.formData.issues_date : moment().format('DD-MM-YYYY'),
      timePicker: false
    });
  };

  //API Refresh DOCS - watch if file is uploaded
  $rootScope.$on('FILE_UPDATED', function(event, response) {
    $scope.upload = response;
    $scope.getDocsByElement($scope.formData.code, 'issues')
  });

  //API - Update users of issue
  $scope.issueUsersSubmit = function(issueId, message) {
    $http({
      method: 'POST',
      url: '/api/issues/' + issueId + '/users',
      data: {
        'users': $scope.formData.users
      }
    }).then(function(data) {
      $rootScope.showFeedback(message);
    }).catch(function(data) {
      $rootScope.showFeedback('Error: tijdens opslaan verantwoordelijke(n)', 'error');
    });
  };

  $scope.prepareData = function() {
    const data = $.extend(true, {}, $scope.formData);
    data.issues_date = moment($scope.formData.issues_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    return data;
  };

  //API - Update issue
  $scope.issueEdit = function() {
    $http.put('/api/issues/' + $scope.formData.code, $scope.prepareData()).then(function (response) {
      $("#issue-name").html(response.data.name); // set title
      $scope.issueUsersSubmit(response.data.code, 'Opgeslagen') //save users of issues
    }).catch(function (error) {
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
    });
  };

  //API - Create new issue
  $scope.issueCreate = function() {
    $scope.isDisabled = true;
    NProgress.start();

    $http.post('/api/issues', $scope.prepareData()).then(function (response) {
      NProgress.done();
      $scope.formData.code = response.data.code; //set ID
      $window.location.href = '../issues/' + response.data.code; //temp refresh
    }).catch(function (error) {
      NProgress.done();
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
    });
  };

  // Submit issue
  $scope.issueSubmit = function(isValid) {
    //check if valid
    $scope.submitted = true;
    if (!isValid) {
      return;
    }
    //get updated value from datepicker
    //edit
    if ($scope.formData.code) {
      $scope.issueEdit();
    }
    //create
    else {
      $scope.issueCreate();
    }
  };

  //API - Get all docs
  $scope.getDocsByElement = function(id, type) {
    //type: issues, issuedialogs, stakeholders, decisions, logs
    $scope.isIssueDocsLoaded = false;
    if (id && type) {
      $http.get("/api/" + type + "/" + id + "/documents", {
          cache: false
        })
        .then(function(response) {
          $scope.issueDocs = response.data;
          $scope.isIssueDocsLoaded = true;
        });
    } else {
      $scope.isIssueDocsLoaded = true;
    }
  };

  //APi - Delete doc
  $scope.removeIssueDoc = function(scopeId, id, docId) {

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
          $http.delete('/api/issues/' + id + '/documents/' + docId).then(function(data) {
            $scope.issueDocs.splice(scopeId, 1);
          });
        }
      }
    });
  }


});
