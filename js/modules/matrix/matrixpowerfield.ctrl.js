app.controller('MatrixPowerFieldCtrl', function($scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder) {

  //Populate matrix
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

  //Draw matrix with dynamix data
  $scope.initMatrix = function() {
    google.charts.load('current', {
      'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawSeriesChart);

    function drawSeriesChart() {

      $scope.matrices = prepData($scope.matrices);

      var data = google.visualization.arrayToDataTable($scope.matrices);
      var options = {
        title: "Stakeholders: Krachtenveld Matrix",
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
          colors: ['#ffc800']
        },
        hAxis: {
          title: 'Type belang',
          scaleType: 'linear',
          format: 'none',
          ticks: [{
            v: 0,
            f: 'Tegengesteld'
          }, {
            v: 50,
            f: 'Neutraal'
          }, {
            v: 100,
            f: 'Gelijk'
          }]
        },
        vAxis: {
          title: 'Vertrouwen',
          format: 'none',
          ticks: [{
            v: 0,
            f: 'Laag'
          }, {
            v: 50,
            f: 'Gemiddeld'
          }, {
            v: 100,
            f: 'Veel'
          }]
        }
      };

      var chart = new google.visualization.BubbleChart(document.getElementById('matrix-power-field'));


      // Wait for the chart to finish drawing before calling the getImageURI() method.
      google.visualization.events.addListener(chart, 'ready', function() {
        $('#print').attr('href', 'javascript:PrintElem(\'matrix-power-field\')');
      });
      chart.draw(data, options);


      NProgress.done()
    }
  }

  //Prepate data for matrix population
  var prepData = function(matrices) {
    var stakeholders = [];
    var heading = ['Stakeholder', 'Belang', 'Macht', '', '', 'Stakeholder'];

    //add heading to data
    stakeholders.push(heading);
    //add stakeholders to data
    angular.forEach(matrices, function(value, index) {
      var stakeholder = [];
      value.trust_interest;
      value.trust;
      value.color = 60; //need color
      value.size = 50;
      value.name = value.stakeholders.name; //need name
      stakeholder = [value.name, value.trust_interest, value.trust, value.color, value.size, value.name];
      stakeholders.push(stakeholder);
    })
    return stakeholders;
  }
});

//Print matrix
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
