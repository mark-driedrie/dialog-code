app.controller('issuesCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder) {

  //decalre vars
  $scope.isLoaded = false;
  $scope.isListCurrent = false;
  var vm = this;
  vm.items = [];
  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(15)
    .withOption('order', [])
    .withOption('sort', true)
    .withOption('lengthChange', false)
    .withOption('filter', true)
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption("autoWidth", false)
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": '<span class="left">Geen issues<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })

  //API - Get all issues
  $scope.getAll = function(status, orderBy) {
    NProgress.start()
    $http.get("/api/issues?count=-1", {
        cache: false,
        params: {
          issues_status: status,
          order_by: orderBy,
          descending: true
        }
      })
      .then(function(response) {
        vm.items = response.data.issues;
        $scope.isListCurrent = !$scope.isListCurrent;
        $scope.isLoaded = true;
        NProgress.done()
      }).catch(function() {});
  }

  //API - Delete issue
  $scope.deleteIssue = function(index, id) {
    //Confirm box
    bootbox.confirm({
      message: "Weet u het zeker dit u deze issue wilt verwijderen?",
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
            url: '/api/issues/' + id,
            data: $scope.editedItem,
          }).then(function(data) {
            vm.items.splice(index, 1);
            $rootScope.showFeedback('Issue verwijderd');
          }).catch(function(response) {
            var errormessage = response.data;
            if (response.status = 405) {
              errormessage = 'Het is niet mogelijk om dit issue te verwijderen, zolang er dialogen zijn gekoppeld';
            }
            $rootScope.showFeedback(errormessage, 'error');
          });
        }
      }
    });
  };
})
