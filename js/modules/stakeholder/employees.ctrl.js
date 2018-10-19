app.controller('EmployeesCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, UserService) {


  var vm = this;
  vm.employees = [];
  vm.employee2Add = {};
  vm.selected = {}

  $scope.initEmployees = function(id) {
    $scope.getEmployeesOfStakeholder(id);
  };

  //API - Get all employees
  $scope.getEmployeesOfStakeholder = function(id) {
    if (id) {
      //get emplyees of stakeholder
      $http.get("/api/stakeholders/" + id + "/employees?count=-1", {
          cache: false
        })
        .then(function(response) {
          vm.employees = response.data.employees;
        }).catch(function() {});
    }
  }

  //START - inline edit
  //Employees - show template
  $scope.getTemplate = function(item) {
    if (vm.selected.id && item.id === vm.selected.id) return 'editEmployee';
    return 'displayEmployee';
  };

  //Employees - click to edit
  $scope.editField = function(item) {
    vm.selected = angular.copy(item);
  };

  //Employees - save changes
  $scope.updateField = function(idx, $itemid) {
    //save field
    //validation
    vm.submittedEmployee = false;
    //Name field required
    if (!vm.selected.name) {
      vm.errorUpdateName = true;
      vm.formEmployess.$setPristine(true);
      return;
    }
    if (vm.selected.email) {
      var emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var patt = new RegExp(emailFormat);
      var isValidEmail = patt.test(vm.selected.email);
      if (!isValidEmail) {
        vm.errorUpdateEmail = true;
        vm.formEmployess.$setPristine(true);
        return;
      }
    }
    //Valid Email
    vm.errorUpdateName = false;
    vm.errorUpdateEmail = false;

    $http.put("/api/stakeholders/" + $scope.formData.code + "/employees/" + $itemid, {
        name: vm.selected.name,
        function: vm.selected.function,
        email: vm.selected.email,
        phone: vm.selected.phone
      })
      .then(function(response) {
        $rootScope.showFeedback('Opgeslagen');
        //clear form
        vm.formEmployess.$setPristine(true);

      }).catch(function(response) {
        $rootScope.showFeedback('Er is een error opgetreden', 'error');
      });
    //display in table
    vm.employees[idx] = angular.copy(vm.selected);
    vm.selected = {};
  };

  //Employees - save changes on enter
  $scope.updateOnEnterClick = function($index, $event, $itemid) {
    $event.preventDefault();
    $event.keyCode == 13 ? $scope.updateField($index, $itemid) : false;
  }
  //END inline edit

  //API Add employee to stakeholder
  $scope.addEmployee = function(isValid) {
    vm.submittedEmployee = true;
    if (isValid) {
      NProgress.start()
      $http.post("/api/stakeholders/" + $scope.formData.code + "/employees", {
          cache: false,
          name: vm.employee2Add.name,
          function: vm.employee2Add.function,
          email: vm.employee2Add.email,
          phone: vm.employee2Add.phone
        })
        .then(function(response) {
          //employee added
          var insertedEmployee = response.data;
          vm.employees.unshift(angular.copy(insertedEmployee));
          NProgress.done()
          $rootScope.showFeedback('Medewerker toegevoegd');
          //clear employee
          vm.employee2Add = {};
          vm.formEmployess.$setPristine();
          vm.formEmployess.$setUntouched();
          vm.submittedEmployee = false;
        }).catch(function(response) {
          NProgress.done();
          $rootScope.showFeedback('Er is een error opgetreden', 'error');
        });
    }

  }
  //API Delete employee from stakeholder
  $scope.deleteEmployee = function(index, id) {
    bootbox.confirm({
      message: "Weet u het zeker, dat u deze medewerker wilt verwijderen?",
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
          $http.delete("/api/stakeholders/" + $scope.formData.code + "/employees/" + id)
            .then(function(response) {
              //employee removed
              vm.employees.splice(index, 1);
              $rootScope.showFeedback('Medewerker verwijderd');
              //clear employee
              vm.employee2Add = {};
            }).catch(function(response) {
              $rootScope.showFeedback('Er is een error opgetreden', 'error');
            });
        }
        NProgress.done()
      }
    });
  }


});
