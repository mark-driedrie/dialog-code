app.controller('MonitorComplaintCtrl', function($scope, $http) {

  //declare vars
  $scope.openComplaints = 0;
  $scope.newComplaints = 0;

  //populate chart(s)
  $scope.init = function() {
    $http.get("/api/summary/complaints", {
        cache: false
      })
      .then(function(response) {
        $scope.newComplaints = response.data.new_complaints_this_week;
        $scope.openComplaints = response.data.open_complaints;

        var data = [];
        response.data.complaints_per_month.forEach(function(complaint) {
          var dateLabel = moment(complaint.monthyear, 'YYYY-MM').format('MMM YYYY');
          data.push([
            dateLabel, complaint.count
          ]);
        });

        Highcharts.chart('container', {
          chart: {
            type: 'column'
          },
          title: {
            text: '' // Empty title to prevent library's placeholder
          },
          xAxis: {
            type: 'category',
            labels: {
              rotation: -45,
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Meldingen'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: 'Nieuwe Meldingen: <b>{point.y}</b>'
          },
          series: [{
            name: 'Meldingen',
            data: data,
            dataLabels: {
              enabled: true,
              color: '#FFFFFF',
              y: 30, // 10 pixels down from the top
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          }]
        });
      }).catch(function(error) {
        console.log(error);
    });
  };
});
