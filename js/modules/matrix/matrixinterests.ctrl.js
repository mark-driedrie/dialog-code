app.controller('MatrixInterestsCtrl', function($scope, $rootScope, $http, $timeout, DTOptionsBuilder, DTColumnDefBuilder) {

  //Declare vars
  var vm = this;
  vm.items = [];
  vm.dtInstance = null;
  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(10)
    .withOption('sort', false)
    .withOption('lengthChange', false)
    .withOption('sort', false)
    .withOption('filter', false)
    .withOption('info', false)
    .withBootstrap()
    //.withOption('scrollY', '100px')
    .withOption('scrollX', '100%')
    .withOption('scrollCollapse', true)
    .withOption('order', [
      [0, 'asc']
    ])
    .withFixedColumns({
      leftColumns: 1
    });

  function dtInstanceCallback(instance) {
    vm.dtInstance = instance;
  }

  $scope.setColor = function(index, event) {
    $scope.matrix = {};
    $scope.matrix.issues_code = 'FG-312';
    $scope.matrix.stakeholders_code = 'shell';
    $scope.matrix.matrix_value = 'low';

    //insert
    $http.post("/api/issuesstakeholdersmatrices", $scope.matrix)
      .then(function(response) {
        alert('inserted')
      });
  }

  $scope.saveColor = function() {
    //POST or PUT
  }

  $scope.getTableData = function() {
    $http.get("/json/GetStakeholdersInterestsMatrix.json", {
        cache: false
      })
      .then(function(response) {
        vm.items = response.data.issues;
        vm.dtInstance = dtInstanceCallback;
      }, function errorCallback(response) {});
  }

  $scope.initMatrix = function() {}
});
