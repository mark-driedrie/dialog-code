app.controller('MatrixPowerInterestCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder) {

  //populate matrix
  $scope.init = function() {
    NProgress.start()
    $scope.matrices = {};
    $scope.image = '';
    $scope.getAllStakeholders();
  }

  //API - Get all stakeholders
  $scope.getAllStakeholders = function() {
    $http.get("/api/matrices", {
        cache: false
      })
      .then(function(response) {
        $scope.matrices = response.data.matrices;
        //start drawing chart
        $scope.initMatrix();

      }, function errorCallback(response) {
        NProgress.done()
      });
  }

  //Draw matrix with dynamic data
  $scope.initMatrix = function() {

    google.charts.load('current', {
      'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawSeriesChart);

    function drawSeriesChart() {

      $scope.matrices = prepData($scope.matrices);

      var data = google.visualization.arrayToDataTable($scope.matrices);
      var options = {
        title: "Stakeholders: Belang / Macht Matrix",
        tooltip: {
          isHtml: true
        },
        legend: 'none',
        sizeAxis: {
          minValue: 0,
          maxValue: 100
        },
        bubble: {
          textStyle: {
            fontSize: 13,
            color: 'black'
          }
        },
        colorAxis: {
          colors: ['orange']
        },
        hAxis: {
          title: 'Belang',
          scaleType: 'linear',
          format: 'none',
          ticks: [{
            v: 0,
            f: 'Laag'
          }, {
            v: 50,
            f: 'Midden'
          }, {
            v: 100,
            f: 'Hoog'
          }]
        },
        vAxis: {
          title: 'Macht',
          format: 'none',
          ticks: [{
            v: 0,
            f: 'Weinig'
          }, {
            v: 50,
            f: 'Gemiddeld'
          }, {
            v: 100,
            f: 'Veel'
          }]
        }
      };
      var chart = new google.visualization.BubbleChart(document.getElementById('matrix-power-interest'));
      // Wait for the chart to finish drawing before calling the getImageURI() method.
      google.visualization.events.addListener(chart, 'ready', function() {
        $('#print').attr('href', 'javascript:PrintElem(\'matrix-power-interest\')');
      });
      chart.draw(data, options);
      NProgress.done()
    }
  }
  // Prepare data for matrix population
  var prepData = function(matrices) {
    var stakeholders = [];
    var heading = ['Stakeholder', 'Belang', 'Macht', '', '', 'Stakeholder'];

    //add heading to data
    stakeholders.push(heading);
    //add stakeholders to data
    angular.forEach(matrices, function(value, index) {
      var stakeholder = [];
      value.power_interest;
      value.power;
      value.color = 60; //need color
      value.size = 50;
      value.name = value.stakeholders.name; //need name
      stakeholder = [value.name, value.power_interest, value.power, value.color, value.size, value.name];
      stakeholders.push(stakeholder);
    })
    return stakeholders;
  }
});

// Print Matrix
var PrintElem = function(elem) {
  var mywindow = window.open('', 'PRINT', 'height=400,width=600');
  mywindow.document.write('<html><head><title>' + document.title + '</title>');
  mywindow.document.write('</head><body >');
  mywindow.document.write('<h1>' + document.title + '</h1>');
  mywindow.document.write(document.getElementById(elem).innerHTML);
  mywindow.document.write('</body></html>');
  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/
  mywindow.print();
  mywindow.close();
  return true;
}
