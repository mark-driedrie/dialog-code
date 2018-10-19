app.controller('stakeholdersCtrl', function ($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, MatrixService, UtilService) {

  //declare vars
  $scope.isLoaded = false;
  var vm = this;
  vm.stakeholders = [];
  $scope.allStakeholders = [];
  $scope.disableExportButton = true;
  $scope.disableExportLogbookButton = false;
  $scope.exportOptions = {
    'algemeen' : true,
    'logenacties' : true,
    'documents_logs' : false,
    'issues' : true,
    'klantwens' : true,
    'exportSelectedStakeholders': []
  };

  $scope.exportStatus = 'init';

  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(15)
    .withOption('order', [])
    .withOption('sort', true)
    .withOption('lengthChange', false)
    .withOption('filter', true)
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption("autoWidth", false)
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": '<span class="left">Geen stakeholders<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    });

  //API Get alls
  $scope.getStakeholders = function () {
    //API get all matrix labels
    MatrixService.getLabels().then(function (data) {
      $scope.matrixlabels = data;
      return $http.get("/api/stakeholders?count=-1", {cache: false});
    }).then(function (response) {
      //add matrix labels
      if (response.data.stakeholders) {
        $.each(response.data.stakeholders, function (index, value) {
          //belang
          if (value.power_interest) {
            var labelObj = MatrixService.getLabel($scope.matrixlabels.power_interest, value.power_interest);
            value.power_interest = labelObj;
          }
          //Macht
          if (value.power) {
            var labelObj = MatrixService.getLabel($scope.matrixlabels.power, value.power);
            value.power = labelObj;
          }
          //Vertrouwen
          if (value.trust) {
            var labelObj = MatrixService.getLabel($scope.matrixlabels.trust, value.trust);
            value.trust = labelObj;
          }
        });
      }
      //populate grid
      vm.stakeholders = response.data.stakeholders;
      $scope.allStakeholders = response.data.stakeholders;
      $scope.isLoaded = true;
    }).catch(function (response) {
    })
  };

  $scope.export = function() {
    if ($scope.disableExportButton) {
      return;
    }

    $scope.exportStatus = 'downloading';

    var options = [];
    if ($scope.exportOptions.algemeen) {
      options.push('algemeen');
    }
    if ($scope.exportOptions.logenacties) {
      options.push('logenacties');
    }
    if ($scope.exportOptions.documents_logs) {
      options.push('documents_logs');
    }
    if ($scope.exportOptions.issues) {
      options.push('issues');
    }
    if ($scope.exportOptions.klantwens) {
      options.push('klantwens');
    }

    var optionsObj = $.extend({}, convertArrayToObjectParams(options, 'options'), prepareStakeholderParams());

    UtilService.download('/file/export/stakeholder', optionsObj, function() {
      $scope.exportStatus = 'init';
    });
  };

  $scope.exportLogbook = function() {
    if ($scope.disableExportLogbookButton) {
      return;
    }

    $scope.disableExportLogbookButton = true;
    UtilService.download('/file/export/stakeholder/logbook', {}, function() {
      $scope.disableExportLogbookButton = false;
    });
  };

  $scope.$watchCollection('exportOptions', function(options) {
    if (!options.algemeen && !options.logenacties && !options.documents_logs && !options.issues && !options.klantwens) {
      $scope.disableExportButton = true;
      return;
    }

    if (options.exportSelectedStakeholders.length === 0) {
      $scope.disableExportButton = true;
      return;
    }

    $scope.disableExportButton = false;
  });

  $scope.deleteStakeholder = function(index, name, code) {
    bootbox.confirm({
      message: "Weet u het zeker dat u " + name + " wilt verwijderen?",
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
      callback: function(result) {
        if (result) {
          $http.delete('/api/stakeholders/' + code).then(function() {
            vm.stakeholders.splice(index, 1);
          }).catch(function(response) {
            var errormessage = response.data;
            if (response.status = 405) {
              errormessage = 'Dit item kan niet worden verwijderd, omdat er nog koppelingen mee zijn. Zie detail pagina.';
            }
            $rootScope.showFeedback(errormessage, 'error');
          });
        }
      }
    });
  };

  function convertArrayToObjectParams(arr, paramName) {
    var arrObj = {};
    for(let i = 0; i < arr.length; i++ ) {
      arrObj[paramName + '[' + i + ']'] = arr[i];
    }

    return arrObj;
  }

  function prepareStakeholderParams() {
    var stakeholders = [];
    $scope.exportOptions.exportSelectedStakeholders.forEach(function(stakeholder) {
      stakeholders.push(stakeholder.code);
    });

    return convertArrayToObjectParams(stakeholders, 'ids')
  }

});
