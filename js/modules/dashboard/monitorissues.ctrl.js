app.controller('monitorIssuesCtrl', function($scope, $rootScope, $http) {

  $scope.init = function() {
    //API - Get issue summary
    $http.get("/api/summary/issues", {
        cache: false,
        params: {
          issues_status: 'open',
          order_by: 'urgency'
        }
      })
      .then(function(response) {
        //set values
        $(".count-animated.open").text(response.data.count_open);
        $(".count-animated.closed").text(response.data.count_closed);
        $(".count-animated.urgent").text(response.data.count_urgent);
        //animate
        $('.count-animated').each(function() {
          $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
          }, {
            duration: 500,
            easing: 'swing',
            step: function(now) {
              $(this).text(Math.ceil(now));
            }
          });
        });

      }, function errorCallback(response) {});
  }
})
