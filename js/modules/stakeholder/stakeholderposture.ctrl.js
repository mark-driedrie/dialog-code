app.controller('stakeholderPostureCtrl', function($scope, $timeout,$rootScope,MatrixService,$http,DTOptionsBuilder, DTColumnDefBuilder, UserService) {

	//flags
	$scope.loaded = false;
	$scope.isTableLoaded = false;
	$scope.showForceMatrixSliders = false;
	$scope.showInterestsMatrixSliders = false;

	//vars
	$scope.form = {};
	$scope.selected = {};
	$scope.form.interests = {};
	$scope.form.matrices = {};
	$scope.interestColor = {};
	$scope.interest2Add = {};
	$scope.matrixlabels = null;

	//set options interests table
    var vm = this;
    vm.items = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(5)
    .withOption('sort', false)
    .withOption('lengthChange', false)
    .withOption('sort', false)
    .withOption('filter', false)
    .withOption('info', false)
    .withBootstrap()
    .withLanguage({
        "sEmptyTable": '<span class="left">Geen belangen<span>',
        "sLoadingRecords": "Laden...",
        "sProcessing": "Laden...",
	});

    //on tab show
	$('a[href="#houding"][data-toggle="tab"]').on('shown.bs.tab', function (e) {
		if(!$scope.loaded){
		  var $invoker = $(e.target);
		  $scope.isReadonly = ($invoker.data('readonly')) ? $invoker.data('readonly') : false;
		  //$scope.init($scope.formData.code);
		  $scope.loaded = true;
		  $scope.init();
		}
	});



	$scope.init = function(){
		//get interest
		$scope.getInterestOfStakeholder($scope.formData.code)
		//get labels first to draw matrices
		$scope.getMatrixLabels().then(function(result){
			//set matrix labels
			$scope.matrixlabels = result;
			//get matrices
			$scope.getMatricesOfStakeholder();
		}).catch(function(){
			//no labels
		});
	}

	$scope.getMatricesOfStakeholder = function(id){
		//get all data
		$http.get("/api/stakeholders/"+$scope.formData.code+"/matrices")
          .then(function(response) {

      		//set data
          	$scope.form.matrices = (response.data) ? response.data : {};
          	//draw trust
          	$scope.trustX = (response.data.trust_interest)? response.data.trust_interest : 50;
          	$scope.trustY = (response.data.trust)? response.data.trust : 50;
          	$scope.powerX = (response.data.power_interest)? response.data.power_interest : 50;
          	$scope.powerY = (response.data.power)? response.data.power : 50;

	        $scope.drawChartTrust()
	        $scope.updateChartTrust();
	        //draw power
	        $scope.form.matrices.trust_type_label = MatrixService.getTypeLabel($scope.matrixlabels.trust_type,$scope.trustX,$scope.trustY)
		    $scope.powerColor = $scope.form.matrices.trust_type_label.color;
	        $scope.drawChartPower()
	        $scope.updateChartPower();

      	});
	}

	$scope.drawChartTrust = function(){

		var bubbleSize = 20;
		//set trust chart label
		$scope.form.matrices.trust_type_label = MatrixService.getTypeLabel($scope.matrixlabels.trust_type,$scope.trustX,$scope.trustY)
		// set trust chart
		$scope.trustData = [{
			type: 'trust',
	        name: 'Vertrouwen',
	        color: '#28ABE3',
	        y: $scope.trustY ,
	        x: $scope.trustX ,
	        size: bubbleSize
		}];
	};
	$scope.updateChartTrust = function(){
	    //trust chart changed - update label
		$scope.$watchGroup(['trustX','trustY'], function() {
	        $scope.form.matrices.trust_type_label = MatrixService.getTypeLabel($scope.matrixlabels.trust_type,$scope.trustX,$scope.trustY)
	    	$scope.powerColor = $scope.form.matrices.trust_type_label.color;
	    	$scope.drawChartPower();
	    });
	};

	$scope.drawChartPower = function(){
		//set power charts
		var bubbleSize = 20;
		//set power chart label
		$scope.form.matrices.power_type_label = MatrixService.getTypeLabel($scope.matrixlabels.power_type,$scope.powerX,$scope.powerY)
		$scope.powerData = [{
			type: 'power',
	        name: 'Belang/Macht',
	        color: $scope.powerColor,
	        y: $scope.powerY ,
	        x: $scope.powerX ,
	        size: bubbleSize
		}];
	};
	$scope.updateChartPower = function(){

		//power chart changed - update label
		$scope.$watchGroup(['powerX','powerY'], function() {
	        $scope.form.matrices.power_type_label = MatrixService.getTypeLabel($scope.matrixlabels.power_type,$scope.powerX,$scope.powerY)
	    	$scope.powerColor = 'yellow';
	    	//$scope.drawChartPower();
	    });
	};


	$scope.getMatrixLabels = function () {
		//get all matrix labels
	 	return new Promise(function (resolve, reject) {
			MatrixService.getLabels().then(function(data){
				if(data){
					resolve(data); //$scope.matrixlabels =
				}
				else{
					reject(null);
				}
	     	})
		})
	}

// INTERESTS

	$scope.getInterestOfStakeholder = function(id){
		//check new or edit
		//get all data
		//get emplyees of stakeholder
		$http.get("/api/stakeholders/"+id+"/interests?count=-1",{ cache: false})
          .then(function(response) {
          	vm.items = response.data.interests;
          	$scope.isTableLoaded = true;
  	      }).catch(function(response){
				$rootScope.showFeedback('Er is een error opgetreden','error');
				$scope.isTableLoaded = true;
		  });

	}
	//inline edit
	$scope.getTemplate = function (item) {
    if ($scope.selected.id && item.id === $scope.selected.id) return 'edit';
   		return 'display';
    };
    $scope.editField = function (item) {
        $scope.selected = angular.copy(item);
    };
    $scope.updateField = function (idx,$itemid) {
        //save field
        $scope.submittedInterest = false;
        $http.put("/api/stakeholders/"+$scope.formData.code+"/interests/"+$itemid,{
        	description: $scope.selected.description})
          .then(function(response) {
          		$rootScope.showFeedback('Opgeslagen');
          		//clear form
          		$scope.formInterests.$setPristine(true);

  	      }).catch(function(response){
				$rootScope.showFeedback('Er is een error opgetreden','error');
		});
  	    //display in table
  	    vm.items[idx] = angular.copy($scope.selected);
        $scope.selected = {};
    };
    $scope.updateOnEnterClick = function($index,$event,$itemid){
    	$event.preventDefault();
    	$event.keyCode == 13 ? $scope.updateField($index,$itemid) : false;
    }
    //end inline edit

	$scope.addInterest = function(isValid){
		//check new or edit
		$scope.submittedInterest = true;
		if(isValid){
			if($scope.formData.code){
				$http.post("/api/stakeholders/"+$scope.formData.code+"/interests",
					{
						description: $scope.interest2Add.description
					})
				  .then(function(response) {
				  	//employee added
				  	vm.items.push(angular.copy(response.data));
				  	$rootScope.showFeedback('Belang toegevoegd');
				  	//clear employee
				  	$scope.interest2Add = {};
				  	$scope.formInterests.$setPristine();
     				$scope.formInterests.$setUntouched();
			  		$scope.submittedInterest = false;
				}).catch(function(response){
					$rootScope.showFeedback('Er is een error opgetreden','error');
				});
			}
		}
	}
	$scope.deleteInterest = function(index,id) {

        if($scope.formData.code){
			bootbox.confirm({
		        message: "Weet u het zeker, hiermee verwijdert u ook e.v.t. belangen uit het issuedialoog?",
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
		        callback: function (result) {
		            //delete
		            if(result){
		                $http.delete("/api/stakeholders/"+$scope.formData.code+"/interests/"+id)
						  .then(function(response) {
						  	//interest removed
						  	vm.items.splice(index, 1);
						  	$rootScope.showFeedback('Belang verwijderd');
						}).catch(function(response){
							$rootScope.showFeedback('Er is een error opgetreden','error');
						});
		            }
		        }
		    });
		}
    }
});
