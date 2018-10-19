app.controller('wishesCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, UserService) {

  //Declare vars
  $scope.isLoaded = false;
  var vm = this;
  vm.items = [];
  vm.wishToAdd = {};
  vm.statusFilter = '';
  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(10)
    .withOption('order', [])
    .withOption('sort', true)
    .withOption('lengthChange', false)
    .withOption('filter', true)
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption("autoWidth", false)
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": '<span class="left">Geen klantwensen<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })

  //Populate grid
  $scope.init = function() {
    $scope.getWishes()
  }

  $scope.getFilteredWishes = function(status, statusName) {
    if (!statusName) {
      statusName = '';
    }
    vm.statusFilter = statusName;
    $scope.getWishes(status);
  }

  //API - Get all decisions
  $scope.getWishes = function(status) {
    //set status default
    if (!status) {
      status = '';
    }
    $http.get("/api/decisions?count=-1&status=" + status, {
        cache: false
      })
      .then(function(response) {
        vm.items = response.data.decisions;
        $scope.isLoaded = true;
      }).catch(function() {});
  }

  //API - Create new decision
  $scope.addWish = function(isValid) {
    $scope.submittedWish = true;
    if (isValid) {
      //vm.dtInstance.reloadData();
      $http.post("/api/decisions", {
          description: vm.wishToAdd.description
        })
        .then(function(response) {
          //employee added
          var insertedDecision = response.data;
          //insertedDecision.decisions_documents =
          vm.items.push(angular.copy(insertedDecision));
          $rootScope.showFeedback('Klantwens toegevoegd');
          //clear employee
          vm.wishToAdd = {};
          $scope.wishesForm.$setPristine();
          $scope.wishesForm.$setUntouched();
          $scope.submittedWish = false;

        }).catch(function(response) {
          $rootScope.showFeedback('Er is een error opgetreden', 'error');
        });
    }
  }

  //API - Remove decision
  $scope.deleteWish = function(index, id) {

    bootbox.confirm({
      message: "Weet u het zeker, dat u deze klantwens wilt verwijderen?",
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
          $http.delete("/api/decisions/" + id)
            .then(function(response) {
              //employee removed
              vm.items.splice(index, 1);
              $rootScope.showFeedback('Klantwens verwijderd');
              //clear employee
              vm.wishToAdd = {};
            }).catch(function(response) {
              var errormessage = response.data;
              if (response.status = 405) {
                errormessage = 'Het is niet mogelijk een klantwens te verwijderen, zolang het gekoppeld is aan een dialoog';
              }
              $rootScope.showFeedback(errormessage, 'error');
            });
        }
      }
    });
  }

});
