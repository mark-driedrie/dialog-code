app.controller('meetingsCtrl', function($window, $scope, $rootScope, $filter, $http, DTOptionsBuilder, DTColumnDefBuilder, UserService) {

  //set Meetings options
  var vm = this;
  vm.pageCount = 5;
  vm.selectedMeeting = {};
  vm.selectedMeeting.employees = [];
  vm.meeting2Add = {};
  vm.PopoverInviteesSelectionTemplate = 'PopoverInviteesSelection';
  vm.submittedMeeting = false;
  vm.submittedAddMeeting = false;
  vm.isLoadedMeetings = false;
  vm.dtInstanceMeetings = {};
  vm.dtMeetings = [];
  vm.allEmployees = [];
  vm.dtInstanceCallback = dtInstanceCallback;
  vm.dtOptionsMeetings = DTOptionsBuilder.newOptions()
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
      "sEmptyTable": '<span class="left">Nog geen meetings<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })


  //Set callback for multple angular datatables on 1 page
  function dtInstanceCallback(dtInstance) {
    vm.dtInstanceMeetings = dtInstance;
  }

  $scope.initMeetings = function(stakholderCode) {
    vm.stakholderCode = stakholderCode;
    $scope.getEmployeesOfStakeholder(stakholderCode);
    $scope.getMeetings(stakholderCode, 1, vm.pageCount);
  }

  //MEETINGS

  //pagination
  $scope.getNumber = function(num) {
    return new Array(num);
  }
  $scope.paginateTo = function(page) {
    $scope.isLoadedMeetings = false;
    $scope.getMeetings(vm.stakholderCode, page, vm.pageCount)
  }

  // API Get all users of stakeholder
  $scope.getMeetings = function(id, page, count) {

    $http.get("/api/stakeholders/" + id + "/meetings?page=" + page + "&count=" + count)
      .then(function(response) {
        vm.isLoadedMeetings = true;
        vm.dtMeetings = response.data;

      }).catch(function(response) {
        $rootScope.showFeedback('Error: bij ophalen van de meetings');
      });
  }

  //API - Get all employees
  $scope.getEmployeesOfStakeholder = function(id) {
    if (id) {
      //get emplyees of stakeholder
      $http.get("/api/stakeholders/" + id + "/employees?count=-1", {
          cache: false
        })
        .then(function(response) {
          vm.allEmployees = response.data;
        }).catch(function() {});
    }
  }



  //START - inline edit
  //Employees - show template
  $scope.getMeetingTemplate = function(item) {
    if (vm.selectedMeeting.id && item.id === vm.selectedMeeting.id) return 'editMeeting';
    return 'displayMeeting';
  };

  //Employees - click to edit
  $scope.editMeeting = function(item) {
    vm.selectedMeeting = angular.copy(item);
  };

  //Employees - save changes
  $scope.updateMeeting = function(idx, $itemid) {

    var isValid = true;
    vm.submittedMeeting = true;
    vm.submittedAddMeeting = false;
    //Name field required
    if (!vm.selectedMeeting.name) {
      vm.errorUpdateName = true;
      vm.formMeetings.$setPristine(true);
      return;
    }

    //employeesAdded added?
    vm.selectedMeeting.isEmployeesValid = true;
    if (!vm.selectedMeeting.employees || vm.selectedMeeting.employees.length == 0) {
      isValid = false;
      vm.selectedMeeting.isEmployeesValid = false;
    }
    vm.errorUpdateName = false;

    if (isValid) {

      $EmployeeIds = (vm.selectedMeeting.employees && vm.selectedMeeting.employees.length > 0) ? _.map(vm.selectedMeeting.employees, 'id') : [];
      $http.put("/api/stakeholders/" + $scope.formData.code + "/meetings/" + $itemid, {
          name: vm.selectedMeeting.name,
          frequency: vm.selectedMeeting.frequency,
          employees: $EmployeeIds
        })
        .then(function(response) {
          $rootScope.showFeedback('Opgeslagen');
          //clear form
          vm.formMeetings.$setPristine(true);
          vm.submittedMeeting = false;

        }).catch(function(response) {
          $rootScope.showFeedback('Er is een error opgetreden', 'error');
          vm.submittedMeeting = false;
        });
      //display in table
      vm.dtMeetings.meetings[idx] = angular.copy(vm.selectedMeeting);
      vm.selectedMeeting = {};
    }
  };

  //Employees - save changes on enter
  $scope.updateMeetingOnEnterClick = function($index, $event, $itemid) {
    $event.preventDefault();
    $event.keyCode == 13 ? $scope.updateMeeting($index, $itemid) : false;
  }
  //END inline edit

  //API Add employee to stakeholder
  $scope.addMeeting = function(isValid) {
    vm.submittedAddMeeting = true;

    if (isValid) {
      NProgress.start()
      $http.post("/api/stakeholders/" + $scope.formData.code + "/meetings", {
          cache: false,
          name: vm.meeting2Add.name,
        })
        .then(function(response) {
          //employee added
          var insertedMeeting = response.data;
          vm.dtMeetings.meetings.unshift(angular.copy(insertedMeeting));
          NProgress.done()
          $rootScope.showFeedback('Meeting toegevoegd');
          //clear employee
          vm.meeting2Add = {};
          vm.formMeetings.$setPristine();
          vm.formMeetings.$setUntouched();
          vm.submittedAddMeeting = false;
        }).catch(function(response) {
          NProgress.done();
          vm.submittedAddMeeting = false;
          $rootScope.showFeedback('Error: tijdens toevoegen meeting', 'error');
        });
    }

  }
  //API Delete employee from stakeholder
  $scope.deleteMeeting = function(index, id) {
    bootbox.confirm({
      message: "Weet u het zeker, dat u deze meeting wilt verwijderen?",
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
        NProgress.start()
        if (result) {
          $http.delete("/api/stakeholders/" + $scope.formData.code + "/meetings/" + id)
            .then(function(response) {
              //employee removed
              vm.dtMeetings.meetings.splice(index, 1);
              $rootScope.showFeedback('Meeting verwijderd');
              //clear employee
              vm.meeting2Add = {};
            }).catch(function(response) {
              $rootScope.showFeedback('Error: tijdens het verwijderen van de meeting');
            });
        }
        NProgress.done()
      }
    });
  }


});
