app.controller('connectLogToStakeholdersCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnBuilder) {

  //declare vars
  var vm = this;
  vm.StakeholdersAreLoaded = false;
  vm.stakeholders = [];
  vm.connectedStakeholders = [];
  vm.dtOptions = {
    paginationType: 'numbers',
    displayLength: 20,
    lengthChange: false,
    pagingType: "numbers",
    bInfo: false,
    bFilter: true,
    oLanguage: {
      "sEmptyTable": '<span class="left">Geen exemplaren<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    }
  };

  //Populate Popup
  $scope.initPopup = function(popupId, includeDemands) {

    $(popupId).on('show.bs.modal', function(e) {
      //initiate
      var $invoker = $(e.relatedTarget);
      vm.id = ($invoker.data('id')) ? $invoker.data('id') : null;
      vm.order = ($invoker.data('order')) ? $invoker.data('order') : 0;
      vm.connectedStakeholders = ($invoker.data('stakeholders')) ? $invoker.data('stakeholders') : null;
      //populate lists
      $scope.getStakeholders();

    });
  };
  //API Get all decisions
  $scope.getStakeholders = function() {
    $http.get("/api/stakeholders?count=-1", {
        cache: false
      })
      .then(function(response) {
        vm.stakeholders = response.data.stakeholders;
        vm.StakeholdersAreLoaded = true;
      }, function errorCallback(response) {});
  };

  //API Get all decisions
  $scope.connectStakeholder = function(isOpen) {
    if (!isOpen) {
      //filter ids from object array
      var stakeholderCodes = (vm.connectedStakeholders && vm.connectedStakeholders.length > 0) ? _.map(vm.connectedStakeholders, 'code') : [];
      $http.put("/api/stakeholders/" + $scope.formData.code + "/logs/" + vm.id, {
        stakeholders_codes: stakeholderCodes
      }).then(function(response) {
        //refresh log icons
        $rootScope.upload = {
          id: vm.id,
          order: vm.order,
          type: 'stakeholders'
        };
        $rootScope.$emit('REFRESH_LOGS');
      }).catch(function(response) {
        $rootScope.showFeedback('Er is een error opgetreden', 'error');
      });
    }
  }

});
