app.controller('wishMasterCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, $window) {

  //Declare vars
  $scope.isLoaded = false;
  $scope.isWishDocsLoaded = false;
  $scope.isNew = false;
  $scope.isDisabled = false;
  $scope.formData = {};
  var vm = this;
  vm.stakeholderConnections = [];
  vm.items = [];
  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(5)
    .withOption('order', [])
    .withOption('sort', true)
    .withOption('lengthChange', false)
    .withOption('filter', false)
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption("autoWidth", false)
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": "Geen exemplaren",
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    })

  //Set decision with data used new and edit
  $scope.init = function(id) {
    //EDIT
    if (id) {
      $scope.formData.id = id;
      $scope.getWish(id);
      $scope.getWishStakeholders(id);
    }
    // NEW
    else {
      $scope.isNew = true;
      $scope.formData.title = 'Nieuwe klantwens aanmaken';
    }
  };

  //API Refresh DOCS - watch if file is uploaded or removed
  $rootScope.$on('FILE_UPDATED', function(event, response) {
    $rootScope.upload = {};
    //refresh logs of stakeholder
    $scope.getDocsByElement($scope.formData.id, 'decisions')
  });


  //API - Create new or edit existing decision
  $scope.submitWish = function(isValid) {

    $scope.submittedWish = true;
    if (isValid) {
      //NEW
      if (!$scope.formData.id) {
        $scope.isDisabled = true; // disable input to prevent doubles
        $http.post("/api/decisions", {
            description: $scope.formData.description,
            status: 'open'
          })
          .then(function(response) {
            $rootScope.showFeedback('Klantwens toegevoegd');
            //go to edit page
            $window.location.href = '../klantwensen/' + response.data.id;

          }).catch(function(response) {
            $rootScope.showFeedback('Er is een error opgetreden', 'error');
          });
      }
      //EDIT
      else {
        $http.put("/api/decisions/" + $scope.formData.id, {
            description: $scope.formData.description,
            status: $scope.formData.status
          })
          .then(function(response) {
            $rootScope.showFeedback('Opgeslagen');
          }).catch(function(response) {
            $rootScope.showFeedback('Er is een error opgetreden', 'error');
          });
      }
    }
  };

  //API - Get decision
  $scope.getWish = function(id) {

    $http.get("/api/decisions/" + id, {
        cache: false
      })
      .then(function(response) {
        $scope.formData = response.data;
        $scope.formData.title = 'Klantwens: ' + $scope.formData.description;
        $scope.isLoaded = true;

        //add stakeholders from logs
        if ($scope.formData.logs) {
          for (var logIndex in $scope.formData.logs) {
            var log = $scope.formData.logs[logIndex]
            if (log.stakeholders) {
              for (var stakeholderIndex in log.stakeholders) {
                  var stakeholder = log.stakeholders[stakeholderIndex];
                  vm.stakeholderConnections.push(stakeholder);
              }
            }
          }
        }
        //add all stakeholder from issuedialogs
        if ($scope.formData.stakeholders) {
          vm.stakeholderConnections.concat($scope.formData.stakeholders);
        }
        //remove duplicates (underscorejs)
        vm.stakeholderConnections = _.uniq(vm.stakeholderConnections, function(stakeholder) {
          return stakeholder.code;
        });

        //get all docs
        $scope.wishDocs = [];
        if (response.data.decisions_documents) {
          $scope.wishDocs = response.data.decisions_documents;
        }
        $scope.isWishDocsLoaded = true;
      }).catch(function() {

      });
  };

  //API - Get all decisions
  $scope.getWishStakeholders = function(id) {
    $http.get("/api/stakeholders?count=-1", {
      cache: false
    }).then(function(response) {
      if (response.data.stakeholders) {
        vm.items = response.data.stakeholders;
      }
    });
  };

  //API - Get all docs
  $scope.getDocsByElement = function(id, type) {
    $scope.isWishDocsLoaded = false;
    if (id && type) {
      $http.get("/api/" + type + "/" + id + "/documents", {
          cache: false
        })
        .then(function(response) {
          $scope.wishDocs = response.data;
          $scope.isWishDocsLoaded = true;
        });
    } else {
      $scope.isWishDocsLoaded = true;
    }
  };

  //APi - Delete doc
  $scope.removeWishDoc = function(scopeId, id, docId) {

    bootbox.confirm({
      message: "Weet u het zeker dat u het document wilt verwijderen?",
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
          $http.delete('/api/decisions/' + id + '/documents/' + docId).then(function(data) {
            $scope.wishDocs.splice(scopeId, 1);
          });
        }
      }
    });
  }

});
