app.controller('StakeholderActionsCtrl', function($scope, $timeout, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, UserService) {

  //declare vars
  $scope.isLoadedActions = false;

  //actions
  $scope.action2Add = {};
  $scope.action2Add.isSubmitDisabled = false;
  $scope.action2Add.popoverTemplateUrl = 'PopoverActionUserSelection.html';
  $scope.action2Add.allUsers = [];
  $scope.action2Add.users = [];
  $scope.action2Add.popoverActionDescriptionTemplateUrl = "PopoverActionDescription.html";
  $scope.selectedAction = {};
  $scope.actionUpdateUsersUrl = "PopoverActionUpdateUserSelection.html";
  $scope.action2Add.popoverActionDescriptionTitle = 'Actie';
  $scope.actionAlertTime = "09:00:00";

  //set Actions options
  var vm = this;
  vm.dtInstanceActions = {};
  vm.dtActions = [];
  vm.dtOptionsActions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(8)
    .withOption('order', [])
    .withOption('sort', true)
    .withOption('lengthChange', false)
    .withOption('filter', false)
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption("autoWidth", false)
    .withOption('paging', true)
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": '<span class="left">Nog geen acties<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })
  vm.dtInstanceCallback = dtInstanceCallback;

  //Set callback for multple angular datatables on 1 page
  function dtInstanceCallback(dtInstance) {
    vm.dtInstanceActions = dtInstance;
  }

  //on tab show
  $('a[href="#log"][data-toggle="tab"]').on('shown.bs.tab', function(e) {
    if (!$scope.loaded) {
      $scope.init($scope.formData.code);
      $scope.loaded = true;
    }
  });

  //Populate Page
  $scope.init = function(id) {
    $scope.getUsers();
    $scope.getActionsOfStakeholder(id);
  };

  //ACTIONS

  //API - Get all actions of stakeholder
  $scope.getActionsOfStakeholder = function(id) {

    $http.get("/api/stakeholders/" + id + "/actions?count=-1&order_by=timestamp&descending=true", {
        cache: false
      })
      .then(function(response) {
        vm.dtActions = response.data;
        $scope.isLoadedActions = true;
      });
  };

  //API - Get all users
  $scope.getUsers = function() {

    $http.get("/api/users", {
        cache: false
      })
      .then(function(response) {
        $scope.action2Add.allUsers = response.data.users;
      });
  };

  //API - Create new action
  $scope.addAction = function(isValid) {
    //check new or edit
    $scope.submittedAction = true;

    //description added?
    $scope.action2Add.isTextValid = true;
    if (!$scope.action2Add.text) {
      isValid = false;
      $scope.action2Add.isTextValid = false;
    }
    //users added?
    $scope.action2Add.isUsersValid = true;
    if ($scope.action2Add.users.length == 0) {
      isValid = false;
      $scope.action2Add.isUsersValid = false;
    }

    if (isValid) {

      if ($scope.formData.code) {
        $scope.action2Add.isSubmitDisabled = true;

        //convert time for API submit
        var dateFormattedToPost = moment($scope.action2Add.timestamp + " " + $scope.actionAlertTime, 'DD-MM-YYYY HH:mm:ss').format("YYYY-MM-DD HH:mm:ss");

        $http.post("/api/stakeholders/" + $scope.formData.code + "/actions", {
            users: $scope.action2Add.users, //[ {'email': 'chrisnu@outlook.com'}, {'email': 'jowanwondergem@gmail.com'} ],
            text: $scope.action2Add.text,
            timestamp: dateFormattedToPost

          })
          .then(function(response) {
            //employee added
            response.data.users = $scope.action2Add.users;
            var action = response.data;

            vm.dtActions.actions.unshift(action);
            $rootScope.showFeedback('Actie toegevoegd');
            //clear action
            $scope.action2Add.text = '';
            $scope.action2Add.users = [];
            $scope.StakeholderActionsForm.$setPristine();
            $scope.StakeholderActionsForm.$setUntouched();
            $scope.submittedAction = false;
            $scope.action2Add.isSubmitDisabled = false;
            $scope.action2Add.isTextValid = true;
            $scope.action2Add.isUsersValid = true;
          }).catch(function(response) {
            $rootScope.showFeedback('Er is een error opgetreden', 'error');
            $scope.submittedAction = false;
            $scope.action2Add.isSubmitDisabled = false;
            $scope.action2Add.isTextValid = true;
            $scope.action2Add.isUsersValid = true;
          });
      }
    }
  };

  //API - Update exsiting action
  $scope.updateAction = function(idx, $itemid) {

    var isValid = true;
    $scope.submittedAction = true;
    //description added?
    $scope.selectedAction.isTextValid = true;
    if (!$scope.selectedAction.text) {
      isValid = false;
      $scope.selectedAction.isTextValid = false;
    }
    //users added?
    $scope.selectedAction.isUsersValid = true;
    if ($scope.selectedAction.users.length == 0) {
      isValid = false;
      $scope.selectedAction.isUsersValid = false;
    }
    if (isValid) {
      var dateFormattedToPost = moment($scope.selectedAction.timestamp + " " + $scope.actionAlertTime, 'DD-MM-YYYY HH:mm:ss').format("YYYY-MM-DD HH:mm:ss");
      $http.put("/api/stakeholders/" + $scope.formData.code + "/actions/" + $itemid, {
          text: $scope.selectedAction.text,
          users: $scope.selectedAction.users,
          timestamp: dateFormattedToPost
        })
        .then(function(response) {
          $rootScope.showFeedback('Opgeslagen');
          //display in table
          response.data.users = $scope.selectedAction.users;
          vm.dtActions.actions[idx] = angular.copy(response.data);
          $scope.selectedAction = {};
          $scope.selectedAction.users = [];
          $scope.submittedAction = false;
        }).catch(function(response) {
          $rootScope.showFeedback('Er is een error opgetreden', 'error');
          $scope.submittedAction = false;
        });
    }

  }

  //API - Delete action
  $scope.deleteAction = function(index, id) {

    bootbox.confirm({
      message: "Weet u het zeker, dat u deze actie wilt verwijderen?",
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
          $http.delete("/api/stakeholders/" + $scope.formData.code + "/actions/" + id)
            .then(function(response) {
              //employee removed
              vm.dtActions.actions.splice(index, 1);
              $rootScope.showFeedback('Actie verwijderd');
            }).catch(function(response) {
              var errormessage = response.data;
              if (response.status = 405) {
                errormessage = 'Het is niet mogelijk deze actie te verwijderen';
              }
              $rootScope.showFeedback(errormessage, 'error');
            });
        }
      }
    });
  }

  //Inline edit - get template
  $scope.getTemplateActions = function(item) {
    if ($scope.selectedAction.id && item.id === $scope.selectedAction.id) return 'editAction';
    return 'displayAction';
  };

  //Inline edit - get element to edit
  $scope.editAction = function(item) {
    $scope.selectedAction = angular.copy(item);
    //strip the "pivot" attribute so it preset the selected items
    $scope.selectedAction.users.forEach(function(v) {
      delete v.pivot
    });
  };

});
