app.controller('demandsCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, UserService) {

  //Declare vars
  $scope.isLoaded = false;
  var vm = this;
  vm.items = [];
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
      "sEmptyTable": '<span class="left">Geen klanteisen<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    });

  //Populate grid
  $scope.init = function() {
    $scope.getDemands()
  };

  //API - Get all demands
  $scope.getDemands = function() {

    $http.get("/api/demands?count=-1", {
        cache: false
      })
      .then(function(response) {
        vm.items = response.data.demands;
        vm.items.forEach(function(demand) {
          demand.issues_codes = [];
          demand.issues.forEach(function(issue) {
            demand.issues_codes.push(issue.code);
          });
          // Make the issues codes unique (non repeating)
          demand.issues_codes = Array.from(new Set(demand.issues_codes));
          // Make it comma separated
          demand.issues_codes = demand.issues_codes.join(', ');
        });
        $scope.isLoaded = true;
      });
  }
});
