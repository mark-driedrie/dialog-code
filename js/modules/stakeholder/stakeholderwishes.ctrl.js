app.controller('stakeholderDecisionsCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, LogService) {

  //set options
  $scope.isLoaded = false;
  $scope.formStakeholderDecisionData = {};
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
      "sEmptyTable": '<span class="left">Geen gekoppelde klantwensen<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })

  //on tab show
  $('a[href="#klantwensen"][data-toggle="tab"]').on('shown.bs.tab', function(e) {
    if (!$scope.loaded) {
      $scope.init($scope.formData.code);
    }
  });

  //Populate grid
  $scope.init = function(id) {
    $scope.getDecisionsOfStakeholder(id)

  }

  //API Get all issues of stakeholder
  $scope.getDecisionsOfStakeholder = function(id) {

    $http.get("/api/stakeholders/" + id + "/decisions?count=-1", {
        cache: false
      })
      .then(function(response) {

        //get wishes from issuedialogs
        if (response.data && response.data.decisions) {
          vm.items = response.data.decisions;
        }
        //get wishes from logs
        LogService.getLogsFromStakeholder(id).then(function(data) {
          if (data.logs) {
            for (var logIndex in data.logs) {
              var log = data.logs[logIndex]
              if (log.decisions) {
                for (var decisionIndex in log.decisions) {
                  var decision = log.decisions[decisionIndex];
                  _.omit(decision, 'pivot');
                  vm.items.push(decision);
                }
              }
            }
          }

          //remove duplicates (underscorejs)
          vm.items = _.uniq(vm.items, function(wish) {
            return wish.id;
          });
          $scope.isLoaded = true;
        }).catch(function(data) {
          $rootScope.showFeedback('Error: tijdens ophalen klantwensen', 'error');
        })
      })
  }
});
