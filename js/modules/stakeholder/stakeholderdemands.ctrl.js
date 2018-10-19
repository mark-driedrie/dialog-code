app.controller('stakeholderDemandsCtrl', function($scope,$rootScope, $http,DTOptionsBuilder, DTColumnDefBuilder, UserService) {

		//set options
		$scope.isLoaded = false;
		$scope.formStakeholderDemandData = {};
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
      "sEmptyTable": '<span class="left">Geen gekoppelde klanteisen<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing":     "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })

    //on tab show
	$('a[href="#kes"][data-toggle="tab"]').on('shown.bs.tab', function (e) {
		if(!$scope.loaded){
		  $scope.init($scope.formData.code);
		  $scope.loaded = true;
		}
	});

  //Populate grid
	$scope.init = function(id){
		$scope.getDemandsOfStakeholder(id)
	};

	//API Get all demands of stakeholder
	$scope.getDemandsOfStakeholder = function(id){
    $http.get("/api/stakeholders/"+ id +"/demands?count=-1", {cache: false})
        .then(function (response) {
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
