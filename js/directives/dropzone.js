//dropzone file upload
app.directive('dropzone', function($rootScope) {
  return {
    restrict: 'C',
    scope: {
      droptype: '@', //set custom directive param
      dropcode: '@', //set custom directive param
      droporder: '@' //set custom directive param
    },
    link: function(scope, element, attrs) {

      var config = {
        url: '/file/upload',
        maxFilesize: 10,
        maxFiles: 100,
        uploadMultiple: true,
        paramName: "document",
        maxThumbnailFilesize: 10,
        parallelUploads: 100000,
        autoProcessQueue: true,
        addRemoveLinks: true,
        dictFileTooBig: "Bestand is te groot ({{filesize}}MB). Max : {{maxFilesize}}MB.",
        dictInvalidFileType: "Dit bestand type kan niet geupload worden.",
        dictResponseError: "Server geeft een {{statusCode}} code.",
        dictCancelUpload: "Annuleren",
        dictRemoveFile: "Verwijderen",
        dictMaxFilesExceeded: "U kunt niet nog meer bestanden tegelijk uploaden",
        dictFileSizeUnits: {
          tb: "TB",
          gb: "GB",
          mb: "MB",
          kb: "KB",
          b: "b"
        }

      };

      var eventHandlers = {
        'addedfile': function(file) {
          //multiple file upload

          // scope.file = file;
          // //this.files.push(file);
          // if (this.files[1]!=null) {
          //     this.removeFile(this.files[0]);
          // }
          // scope.$apply(function() {
          //     scope.fileAdded = true;
          // });
        },
        'error': function(file, response) {
          //clear preview after succesfull upload
          var errorMessage = 'Error: tijdens upload bestand';
          $(file.previewElement).find('.dz-error-message').text(errorMessage);
        },
        'success': function(file, response) {
          $rootScope.showFeedback('Bestand is geupload');
          //clear preview after succesfull upload
          scope.resetDropzone();

          scope.$parent.docs = {};
          //refresh docs
          $rootScope.upload = {
            id: scope.dropcode,
            order: scope.droporder,
            type: scope.droptype
          };

          $rootScope.$emit('FILE_UPDATED', {
            id: scope.dropcode,
            order: scope.droporder,
            type: scope.droptype
          });
        }

      };

      dropzone = new Dropzone(element[0], config);
      //append custom fields
      dropzone.on('sending', function(file, xhr, formData) {

        formData.append('type', scope.droptype);
        if (scope.droptype == "issues") {
          formData.append('issues_code', scope.dropcode);
        } else if (scope.droptype == "issuedialogs") {
          formData.append('issuedialogs_id', scope.dropcode);
        } else if (scope.droptype == "stakeholders") {
          //formData.append('stakheholders_code', scope.dropcode);
        } else if (scope.droptype == "decisions") {
          formData.append('decisions_id', scope.dropcode);
        } else if (scope.droptype == "logs") {
          formData.append('logs_id', scope.dropcode);
        }  else if (scope.droptype == "middel") {
          formData.append('middel_id', scope.dropcode);
        }
      });
      //message completed download
      dropzone.on("totaluploadprogress", function(progress) {
        // Update progress bar with the value in the variable "progress", which
        // is the % total upload progress from 0 to 100
        console.log('uploaded!')
      });
      // dropzone.on('removedfile', function(file) {
      //   // your logic here
      // });

      Dropzone.autoDiscover = false;

      angular.forEach(eventHandlers, function(handler, event) {
        dropzone.on(event, handler);
      });

      scope.processDropzone = function() {
        dropzone.processQueue();
      };

      scope.resetDropzone = function() {
        dropzone.removeAllFiles();
      };

      scope.dropzone = dropzone;
    }
  }
});
