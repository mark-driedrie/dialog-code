app.controller('issueDialogCtrl', function($scope, $filter, $rootScope, $http, UserService) {

  //Declare vars
  $scope.formData = {};
  $scope.formData.code = '';
  $scope.formDialogRowData = {};
  $scope.formDialogRowData.created_at = moment().format('YYYY-MM-DD');
  $scope.formDialogRowData.documents = [];
  $scope.formDialogRowData.status = "open";
  $scope.allIds = [];
  $scope.rows = [];
  $scope.isHistoryMode = false;
  $scope.isSaving = false;

  //Popup open actions
  $("#sidebar-issues").on('shown.bs.modal', function(e) {
    $scope.init($scope.issueMaster.id)
  });

  //Populate popup
  $scope.init = function(issueCode) {
    $scope.formData.code = issueCode;
    $scope.getDialogRows();
    $scope.getStakeholders();
  };

  //Handles calls from other controllers
  $scope.$on('refreshDialog', function(event, profileObj) {
    $scope.getDialogRows();
  });

  //API - Get all current dialog rows by issue
  $scope.getDialogRows = function(page, count) {
    var page = (page) ? page : 1;
    var count = (count) ? count : -1;
    $scope.editMode = false;
    if ($scope.formData.code) {
      $http.get("/api/issues/" + $scope.formData.code + "/issuedialogs?count=-1", {
          cache: false,
          params: {
            count: count,
            page: page,
            //order_by: "created_at",
            descending: false
          }
        })
        .then(function(response) {
          $scope.all = response.data.issuedialogs;
          //push in isHistory and histories object
          $.each($scope.all, function(key, value) {
            $scope.all[key]['isHistory'] = false;
            $scope.all[key]['histories'] = [];
          })
        }).catch(function() {});
    }
  };

  //API - Get all history dialog rows by issue
  $scope.getDialogHistoryRows = function(dialogId, $index) {

    NProgress.start();
    //current issuedialog is in current display
    if (!$scope.all[$index].isHistory) {
      $http.get("/api/issuedialogs/" + dialogId + "/histories?count=-1", {
          cache: false
        })
        .then(function(response) {
          var allResponses = response.data.issuedialogs_histories;
          var rowHistories = [];

          //set all histories in array
          if (allResponses && allResponses.length > 0) {
            $.each(allResponses, function(key, value) {
              rowHistories.push(JSON.parse(value.log));
            })
          }

          ///set values to current row
          if ($scope.all[$index].id == dialogId) {
            //set histories to correct row
            $scope.all[$index].histories = rowHistories;
            //flip historyMode
            $scope.all[$index].isHistory = true;
          }
        }, function errorCallback(response) {});
    } else {
      //set histories to correct row
      $scope.all[$index].histories = [];
      //flip historyMode
      $scope.all[$index].isHistory = false;
    }
    NProgress.done()
  };

  //API - Delete issue dialog and all its history
  $scope.deleteIssueDialog = function(id) {

    bootbox.confirm({
      message: "Weet u het zeker, hiermee verwijdert u ook alle geschiedenis van dit issuedialoog?",
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
        //delete
        if (result) {
          $http({
            method: 'DELETE',
            url: '/api/issuedialogs/' + id,
            data: $scope.editedItem
          }).then(function(data) {
            $rootScope.showFeedback('Dialoog item verwijderd');
            $scope.getDialogRows();

          }).catch(function(response) {
            var errormessage = response.data;
            if (response.status = 405) {
              errormessage = 'Het is niet mogelijk om dit dialoog item te verwijderen';
            }
            $rootScope.showFeedback(errormessage, 'error');
          });
        }
      }
    });
  };

  //API - Update existing issue dialog row
  $scope.saveDialogRow = function() {
    //save interest param(issueDialogId, status, standpoint, stakeholders_code)
    // Prevent multiple saving by button click + blur
    if (!$scope.isSaving) {
      $scope.isSaving = true;
      $http({
        method: 'PUT',
        url: '/api/issuedialogs/' + $scope.editedItem.id,
        data: $scope.editedItem,
      }).then(function(data) {
        $scope.isSaving = false;
        //set current scope into all
        angular.copy($scope.editedItem, $scope.all[$scope.$index])
        //flip
        $scope.editMode = false;
        $('.d-editfield').hide();
        $('.d-showfield').show();
      });
    }
  };

  //API - Change edit display mode
  $scope.editDialogField = function($index, $event) {

    if (!$scope.editMode) {
      $scope.editedItem = {};
      $scope.$index = $index;
      angular.copy($scope.all[$index], $scope.editedItem);
      $($event.target).hide();
      $($event.target).next('.d-editfield').show();
      $($event.target).next('.d-editfield').find('.d-editfield-input').focus();
      $scope.editMode = true;
    }
  };

  //Clear dialog row form
  $scope.clearAddDialogFields = function() {

    $scope.formDialogRowData.stakeholders_code = null;
    $scope.formDialogRowData.standpoint = null;
    $("#dialogStakeholderVal").val('');
    $("#dialog-stakeholder").val('').trigger('change');
  };

  //API - Create new dialog row
  $scope.addDialogRow = function() {

    NProgress.start();
    var issueCode = $scope.formData.code;
    $scope.formDialogRowData.stakeholders_code = $("#dialogStakeholderVal").val();
    //validate fields are set
    if (!$scope.formDialogRowData.stakeholders_code) {
      NProgress.done();
      return true;
    }
    //post new row
    $http({
      method: 'POST',
      url: '/api/issues/' + issueCode + '/issuedialogs',
      data: $.param($scope.formDialogRowData),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
      //refresh table
      $scope.getDialogRows(1, 10);
      $scope.clearAddDialogFields();
    });
    NProgress.done()
  };

  //API - Get all stakeholders
  $scope.getStakeholders = function() {
    //should not always load
    $http.get("/api/stakeholders?count=100").then(
      function(response) {
        //map json response into array for selection
        var results = $.map(response.data.stakeholders, function(obj) {
          return {
            id: obj.code,
            text: obj.name
          };
        });

        $("#dialog-stakeholder").select2({
          language: "nl",
          containerCssClass: "search-input-row",
          minimumInputLength: 0,
          width: "100%",
          multiple: false,
          placeholder: "Select a customer",
          formatResult: function(item) {
            return item.text;
          },
          formatSelection: function(item) {
            return item.text;
          },
          data: results
        }).on("select2:select", function(e) {
          $("#dialogStakeholderVal").val(e.currentTarget.value);
        });
      });
  };

});
