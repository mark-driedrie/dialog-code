app.controller('connectLogToWishCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnBuilder) {

  //declare vars
  var vm = this;
  vm.wishesAreLoaded = false;
  vm.wishes = [];
  vm.connectedWishes = [];
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
      vm.connectedWishes = ($invoker.data('wishes')) ? $invoker.data('wishes') : null;
      //populate lists
      $scope.getWishes();

    });
  };
  //API Get all decisions
  $scope.getWishes = function() {
    $http.get("/api/decisions?count=-1", {
        cache: false
      })
      .then(function(response) {
        vm.wishes = response.data.decisions;
        vm.wishesAreLoaded = true;
      }).catch(function(response) {
        $rootScope.showFeedback('Er is een error opgetreden', 'error');
      });
  };

  //API Get all decisions
  $scope.connectWish = function(isOpen) {

    if (!isOpen) {
      //filter ids from object array
      var wishIds = (vm.connectedWishes && vm.connectedWishes.length > 0) ? _.map(vm.connectedWishes, 'id') : [];

      $http.put("/api/stakeholders/" + $scope.formData.code + "/logs/" + vm.id, {
        decisions_ids: wishIds
      }).then(function(response) {
        $rootScope.upload = {
          id: vm.id,
          order: vm.order,
          type: 'decisions'
        };

        $rootScope.$emit('REFRESH_LOGS');
      }).catch(function(response) {
        $rootScope.showFeedback('Er is een error opgetreden', 'error');
      });
    }
  }

});
