app.controller('stakeholderIssuesCtrl', function($scope,$rootScope, $http,DTOptionsBuilder, DTColumnDefBuilder, UserService) {
 	//set options
	$scope.isLoaded = false;
	$scope.formStakeholderIssuesData = {};
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
    "sEmptyTable": '<span class="left">Geen gekoppelde issues<span>',
    "sLoadingRecords": "Laden...",
    "sProcessing":     "Laden...",
    "sSearch": '<i class="material-icons d-text-middle">search</i>'
  })

    //on tab show
	$('a[href="#issues"][data-toggle="tab"]').on('shown.bs.tab', function (e) {
		if(!$scope.loaded){
		  $scope.init($scope.formData.code);
		  $scope.loaded = true;
		}
	});

	//Populate grid
	$scope.init = function(id){
		$scope.getIssuesOfStakeholder(id);
	}

	//API Get all issues of stakeholder
	$scope.getIssuesOfStakeholder = function(id){

		$http.get("/api/stakeholders/"+id+"/issues?count=-1",{ cache: false})
	      .then(function(response) {
	      	vm.items = response.data.issues;
          $scope.isLoaded = true;
	  	});
	}
});
