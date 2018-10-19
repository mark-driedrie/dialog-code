app.controller('myIssuesCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder) {

  //set options
  $scope.searchQuery = '';
  var vm = this;
  vm.items = [];
  vm.dtInstance = {};
  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(5)
    .withOption('sort', false)
    .withOption('lengthChange', false)
    .withOption('filter', true)
    .withOption('dom', 'lrtip')
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption("autoWidth", false)
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": "Geen exemplaren",
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })

  // Custom search
  $scope.searchTable = function() {
    var query = $scope.searchQuery;
    vm.dtInstance.DataTable.search(query).draw();
  }

  //API - Get all my issues
  $scope.getMyIssues = function() {

    $http.get("/api/my/issues?count=-1", {
        cache: false,
        params: {
          issues_status: 'open'
        }
      })
      .then(function(response) {
        vm.items = response.data.issues;
      });
  };
})
