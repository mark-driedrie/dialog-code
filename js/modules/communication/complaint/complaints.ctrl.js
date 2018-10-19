app.controller('complaintsCtrl', function($scope, $rootScope, $http, DTOptionsBuilder) {

  //declare vars
  var vm = this;
  vm.items = [];
  vm.isLoaded = false;
  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('numbers')
    .withDisplayLength(10)
    .withOption('order', [])
    .withOption('sort', true)
    .withOption('lengthChange', false)
    .withOption('filter', true)
    .withOption('info', false)
    .withOption("autoWidth", false)
    .withOption('initComplete', function() {
      // TODO: Use server side search function
      /*let searchInput = $('.dataTables_filter input');
      searchInput.unbind();
      searchInput.bind("keyup", function() {
          let search = searchInput.val();
          if (search.length >= 3) {
            $scope.GetResidents(search);
          }
      });*/
    })
    .withBootstrap()
    .withLanguage({
      "sEmptyTable": '<span class="left">Geen klachten<span>',
      "sLoadingRecords": "Laden...",
      "sProcessing": "Laden...",
      "sSearch": '<i class="material-icons d-text-middle">search</i>'
    });

  //API Get alls
  $scope.GetComplaints = function(search) {

    NProgress.start();
    $http.get("/api/complaints", {
        cache: false,
        params: {
          search: search
        }
      })
    .then(function(response) {
      $rootScope.$emit('COMPLAINTS_LOADED', response);
      vm.isLoaded = true;
      NProgress.done();
      if (response.data && response.data.data) {
        vm.items = response.data.data;
        vm.items.forEach(function (item) {
          item.formatted_date = moment(item.date).format('YYYY-MM-DD');
        });
      }
    }).catch(function() {
      vm.isLoaded = true;
      NProgress.done();
      $rootScope.showFeedback('Error: tijdens ophalen van klachten', 'error');
    });

  };

  $scope.deleteComplaint = function(index, id) {
    bootbox.confirm({
      message: "Weet u het zeker dat u melding #" + id + " wilt verwijderen?",
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
          $http.delete('/api/complaints/' + id).then(function() {
            vm.items.splice(index, 1);
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
});
