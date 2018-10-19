app.controller('docsCtrl', function($scope, $rootScope, $http) {

  let SAVE_DOC_SUCCESS_MESSAGE = 'Een nieuwe document is toegevoed';

  //Populate popup
  $scope.initPopup = function(popupId) {

    $(popupId).on('show.bs.modal', function(e) {
      //initiate
      $scope.docs = {};
      $scope.master = {};
      //when modal is triggered by button
      if (e.relatedTarget) {
        var $invoker = $(e.relatedTarget);
        $scope.master.id = ($invoker.data('id')) ? $invoker.data('id') : null;
        $scope.master.order = ($invoker.data('order')) ? $invoker.data('order') : 0;
        $scope.master.type = ($invoker.data('type')) ? $invoker.data('type') : null;
        $scope.master.isreadonly = ($invoker.data('isreadonly')) ? $invoker.data('isreadonly') : false;
        $scope.master.showDocs = ($invoker.data('showdocs')) ? $invoker.data('showdocs') : false;
      }
      //when modal is triggered programmatically
      else {
        if ($rootScope.docDraft) {
          $scope.master.id = $rootScope.docDraft.id;
          $scope.master.order = null;
          $scope.master.type = $rootScope.docDraft.type;
          $scope.master.isreadonly = $rootScope.docDraft.isreadonly;
        }
      }
      //populate lists
      $scope.getDocs($scope.master.id, $scope.master.type);
    });

    $(popupId).on('hidden.bs.modal', function() {
      //reset scope
      $scope.docs = {};
      $scope.master = {};
    })
  };

  //API - Get all docs
  $scope.getDocs = function(id, type) {
    //type: issues, issuedialogs, stakeholders, decisions, logs
    $scope.isDocsLoaded = false;
    if (id && type) {
      $http.get("/api/" + type + "/" + id + "/documents", {
          cache: false
        })
        .then(function(response) {
          $scope.docs = response.data;
          $scope.isDocsLoaded = true;
        });
    } else {
      $scope.isDocsLoaded = true;
    }
  };

  //API - Create new doc by url
  $scope.saveDocByUrl = function(isValid) {
    $scope.submitted = true;
    $scope.error_url_format = false;
    //has no url
    if (!isValid) {
      return;
    }

    //save
    if ($scope.master.type && $scope.master.id) {
      $http.post("/api/" + $scope.master.type + "/" + $scope.master.id + "/documents", {
          cache: false,
          type: 'link',
          link: $scope.url
        })
        .then(function(response) {
          //clear field
          $scope.url = null;
          $scope.submitted = false;
          $scope.formDocUrl.$setPristine(true);

          postDocumentGeneration(response.data);
        }).catch(function() {
          $scope.error_url_format = true;
        });
    }
  };

  $scope.saveEDocsByReference = function(isValid) {
      $scope.edocSubmitted = true;
      //has no url
      if (!isValid) {
          return;
      }

      $http.post("/api/" + $scope.master.type + "/" + $scope.master.id + "/documents", {
        cache: false,
        type: 'reference',
        reference: $scope.reference
      }).then(function(response) {
          //clear field
          $scope.reference = null;
          $scope.edocSubmitted = false;
          $scope.formEDocs.$setPristine(true);

          postDocumentGeneration(response.data);
      }).catch(function(e) {
        console.log(e);
        $rootScope.showFeedback('Error tijdens genereren van EDoc', 'error');
      });
  };

  //APi - Delete doc
  $scope.removeDoc = function(scopeId, id, docId) {

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
        if (result && $scope.master.type) {
          //type: issues, issuedialogs, stakeholders, decisions
          $http.delete('/api/' + $scope.master.type + '/' + id + '/documents/' + docId).then(function(data) {
            $scope.docs.splice(scopeId, 1);
            $rootScope.$emit('FILE_UPDATED', {
              id: id,
              order: null,
              type: 'logs'
            });
          });
        }
      }
    });
  };

  function postDocumentGeneration(data) {
    $rootScope.showFeedback(SAVE_DOC_SUCCESS_MESSAGE);
    //refresh docs
    $scope.docs.push(data);
    $scope.getDocs($scope.master.id, $scope.master.type);

    $rootScope.upload = {
      id: $scope.master.id,
      order: $scope.master.order,
      type: $scope.master.type
    };

    $rootScope.$emit('FILE_UPDATED', {
      id: $scope.master.id,
      order: $scope.master.order,
      type: $scope.master.type
    });


  }

});
