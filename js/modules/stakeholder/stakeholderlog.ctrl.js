app.controller('stakeholderLogCtrl', function($scope, $timeout, $rootScope, $filter, $http, DTOptionsBuilder, DTColumnDefBuilder, UserService, LogService) {

  //declare vars
  $rootScope.docDraft = {};
  $scope.isLoaded = false;

  //logs
  $scope.selectedLog = {};
  $scope.logTypeValid = true;
  $scope.log2Add = {};
  $scope.log2Add.isSubmitDisabled = false;
  $scope.log2Add.users = {};
  $scope.logDocTemplateUrl = 'logDocPopover';
  var preselectedLogType = {
    name: 'Selecteer type',
    id: null
  };
  $scope.log2Add.log_type = preselectedLogType;
  $scope.log2Add.log_options = [preselectedLogType,
    {
      name: 'Telefoon',
      id: 'phone'
    },
    {
      name: 'Email',
      id: 'email'
    },
    {
      name: 'Meeting',
      id: 'meeting'
    }
  ];

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  //set Log options
  var vm = this;
  vm.dtInstances = [];
  vm.dtInstanceLogs = {};
  vm.pageCount = 10;
  vm.dtLogs = [];
  vm.dtOptionsLogs = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(5)
    .withOption('order', [])
    .withOption('sort', true)
    .withOption('lengthChange', false)
    .withOption('filter', false)
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption("autoWidth", false)
    .withOption('paging', false)
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": '<span class="left">Nog geen logs<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    });

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
    vm.stakholderCode = id;
    $scope.getLogsOfStakeholder(vm.stakholderCode, 1, vm.pageCount);
  };

  $rootScope.$on('FILE_UPDATED', function() {
    $scope.refreshLogs();
  });

  $rootScope.$on('REFRESH_LOGS', function() {
    $scope.refreshLogs();
  });

  //API Refresh logs
  $scope.refreshLogs = function() {
    //update log in logs for wish change
    LogService.getLogFromStakeholder(vm.stakholderCode, $rootScope.upload.id).then(function(data) {
      vm.dtLogs.logs[$rootScope.upload.order] = data;

      //reset upload
      $rootScope.upload = {};
    });
  };

  //LOGS
  $scope.paginateTo = function(page) {
    $scope.isLoaded = false;
    $scope.getLogsOfStakeholder(vm.stakholderCode, page, vm.pageCount)
  };

  //API - Get all logs of stakeholder
  $scope.getLogsOfStakeholder = function(id, page, count) {
    $http.get("/api/stakeholders/" + id + "/logs?page=" + page + "&count=" + count, {
      cache: false
    }).then(function(response) {
      vm.dtLogs = [];
      vm.dtLogs = response.data;
      $scope.isLoaded = true;
    });
  };

  //API - Create temporary draft log when documents are attached
  $scope.addLogDraft = function($event) {
    //check new or edit
    if ($scope.formData.code) {
      //first click
      if (!$rootScope.docDraft.id) {
        $http.post("/api/stakeholders/" + $scope.formData.code + "/logs", {
            description: '.',
            log_type: 'none'
          })
          .then(function(response) {
            //get temp id
            var log = response.data;
            //populate data attributes
            $rootScope.docDraft = {};
            $rootScope.docDraft.id = log.id;
            $rootScope.docDraft.type = $event.currentTarget.dataset.type;
            $rootScope.docDraft.isreadonly = ($event.currentTarget.dataset.isreadonly) ? $event.currentTarget.dataset.isreadonly : false;
            //open modal docs
            $('#sidebar-documents').modal('show');
          }).catch(function(response) {
            $rootScope.showFeedback('Er is een error opgetreden', 'error');
          });
      }
      //after first click
      else {
        //open modal docs
        $('#sidebar-documents').modal('show');
      }
    }
  };

  //API - Create or Update Log
  $scope.addLog = function(isValid) {
    //check new or edit
    $scope.submittedLog = true;
    $scope.logTypeValid = true;

    if ($scope.log2Add.log_type.id == null) {
      isValid = false;
      $scope.logTypeValid = false;
    }

    if (isValid) {
      if ($scope.formData.code) {
        $scope.logTypeValid = true;
        $scope.log2Add.isSubmitDisabled = true;
        //convert time for API submit
        var dateFormattedToPost = moment($scope.log2Add.log_timestamp, 'DD-MM-YYYY').format("YYYY-MM-DD HH:mm:ss");
        //NEW log (no documents added)
        if (!$rootScope.docDraft.id) {

          $http.post("/api/stakeholders/" + $scope.formData.code + "/logs", {
              description: $scope.log2Add.description,
              log_type: $scope.log2Add.log_type.id,
              log_timestamp: dateFormattedToPost,
              is_draft: false
            })
            .then(function(response) {
              //employee added
              var log = response.data;
              log.users = {};
              log.users.name = $("#accountName").val();

              vm.dtLogs.logs.unshift(log);
              $rootScope.showFeedback('Log toegevoegd');
              //clear log
              $rootScope.docDraft = {};
              $scope.log2Add.description = '';
              $scope.log2Add.log_type = preselectedLogType;
              $scope.StakeholderLogForm.$setPristine();
              $scope.StakeholderLogForm.$setUntouched();
              $scope.submittedLog = false;
              $scope.log2Add.isSubmitDisabled = false;
            }).catch(function(response) {
              $rootScope.showFeedback('Er is een error opgetreden', 'error');
              $scope.submittedLog = false;
              $scope.log2Add.isSubmitDisabled = false;
            });
        }
        //Existing log (already documents added)
        else {
          $http.put("/api/stakeholders/" + $scope.formData.code + "/logs/" + $rootScope.docDraft.id, {
              description: $scope.log2Add.description,
              log_type: $scope.log2Add.log_type.id,
              log_timestamp: dateFormattedToPost,
              is_draft: false
            })
            .then(function(response) {
              //employee added
              var log = response.data;
              log.users = {};
              log.users.name = $("#accountName").val();

              vm.dtLogs.logs.unshift(log);
              $rootScope.showFeedback('Log toegevoegd');

              //clear log
              $rootScope.docDraft = {};
              $scope.log2Add.description = '';
              $scope.StakeholderLogForm.$setPristine();
              $scope.StakeholderLogForm.$setUntouched();
              $scope.submittedLog = false;
              $scope.log2Add.isSubmitDisabled = false;

            }).catch(function(response) {
              $rootScope.showFeedback('Er is een error opgetreden', 'error');
              $scope.submittedLog = false;
              $scope.log2Add.isSubmitDisabled = false;
            });
        }
      }
    }
  };

  //API - Remove log
  $scope.deleteLog = function(index, id) {

    bootbox.confirm({
      message: "Weet u het zeker, dat u deze log wilt verwijderen?",
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
          $http.delete("/api/stakeholders/" + $scope.formData.code + "/logs/" + id)
            .then(function(response) {
              //employee removed
              vm.dtLogs.logs.splice(index, 1);
              $rootScope.showFeedback('Log verwijderd');
            }).catch(function(response) {
              var errormessage = response.data;
              if (response.status = 405) {
                errormessage = 'Het is niet mogelijk deze log te verwijderen';
              }
              $rootScope.showFeedback(errormessage, 'error');
            });
        }
      }
    });
  };

  //Inline edit log
  $scope.updateLog = function(idx, $itemid) {
    //save field
    //validation
    $scope.submittedLog = false;
    //Name field required
    if (!$scope.selectedLog.description) {
      $scope.selectedLog.isDescriptionValid = false;
      return;
    }

    $http.put("/api/stakeholders/" + $scope.formData.code + "/logs/" + $itemid, {
      description: $scope.selectedLog.description
    }).then(function(response) {
      $scope.refreshLogs();
      $rootScope.showFeedback('Opgeslagen');
    }).catch(function(response) {
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
    });

    //display in table
    vm.dtLogs.logs[idx] = angular.copy($scope.selectedLog);
    $scope.selectedLog = {};
  };

  //Inline edit on enter click
  $scope.updateLogEnterClick = function($index, $event, $itemid) {
    $event.preventDefault();
    $event.keyCode == 13 ? $scope.updateLog($index, $itemid) : false;
  };

  //Inline edit - Get log to edit
  $scope.editLog = function(item) {
    $scope.selectedLog = angular.copy(item);
  };

  //Inline edit - Get template log
  $scope.getTemplateLog = function(item) {
    if ($scope.selectedLog.id && item.id === $scope.selectedLog.id) return 'editLog';
    return 'displayLog';
  };

  $scope.deleteDocFromLog = function($event, logId, logOrder, docId) {
    $event.preventDefault();
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
          //type: issues, issuedialogs, stakeholders, decisions
          $http.delete('/api/logs/' + logId + '/documents/' + docId).then(function(data) {
            $rootScope.upload = {
              id: logId,
              order: logOrder,
              type: 'logs'
            };

            $scope.refreshLogs();
          });
        }
      }
    });
  }
});
