app.controller('statusCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnBuilder) {

  //declare vars
  var vm = this;
  vm.decisions = [];
  vm.demands = [];
  vm.dtOptions = {
    paginationType: 'numbers',
    displayLength: 3,
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
  vm.dtColumns = [
    DTColumnBuilder.newColumn(0).notSortable()
  ];

  //Populate Popup
  $scope.initPopup = function(popupId, includeDemands) {

    $(popupId).on('show.bs.modal', function(e) {
      //initiate
      var $invoker = $(e.relatedTarget);
      $scope.currentIssueDialog = {};
      $scope.currentIssueDialog = ($invoker.data('info')) ? $invoker.data('info') : null;
      //populate lists
      $scope.getDecisions();
      if (includeDemands) {
        $scope.getDemands();
      }
    });
  };
  //API Get all decisions
  $scope.getDecisions = function() {
    $http.get("/api/decisions?count=-1", {
        cache: false
      })
      .then(function(response) {
        vm.decisions = response.data.decisions;
      }, function errorCallback(response) {});
  }
  //API Get all demands
  $scope.getDemands = function() {
    $http.get("/api/demands?count=-1", {
        cache: false
      })
      .then(function(response) {
        vm.demands = response.data.demands;
      }, function errorCallback(response) {});
  }
  // Open reason closure
  $scope.openReasonClosure = function(item, type) {
    //open reason
    $("#reason-closure").removeClass('hidden');
    $("#reason-closure textarea").focus();
    //default
    $scope.currentIssueDialog.status = 'gesloten';
    $scope.currentIssueDialog.decisions_id = null;
    $scope.currentIssueDialog.demands_guid = null;
    $scope.currentIssueDialog.reason_closure = '';
    //set decision id
    if (type == 'decision') {
      $scope.currentIssueDialog.decisions_id = item.id;
      $scope.currentIssueDialog.reason_closure = 'Gekoppeld aan klantwens:(' + item.description + ")";
    }
    if (type == 'demand') {
      $scope.currentIssueDialog.demands_guid = item.guid;
      $scope.currentIssueDialog.reason_closure = 'Gekoppeld aan KES:(' + item.id + " , " + item.name + ")";
    }
  }
  //API Save Reason Closure
  $scope.submitStatusReason = function(isSave) {
    //hide reason closure
    $("#reason-closure").addClass('hidden');
    if (isSave) {
      //save status - params(issueDialogId, interestId, status, standpoint, stakeholders_code)
      $http({
        method: 'PUT',
        url: '/api/issuedialogs/' + $scope.currentIssueDialog.id,
        data: $scope.currentIssueDialog,
      }).then(function(data) {
        $('#sidebar-status').modal('toggle');
        //reset currentObject
        $scope.currentIssueDialog = {};
        //say dialog to refresh
        $rootScope.$broadcast('refreshDialog', {
          page: 1,
          count: -1,
          current: true
        });
        //say dialog to refresh
      }).catch(function(response) {});
    }
    //cancel
    else {
      $scope.currentIssueDialog.status = 'open';
    }
  }
})
