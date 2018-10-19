
//chart interest/power
if (document.getElementById('belangen') !== null){ 
 google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawSeriesChart);

        
      
    function drawSeriesChart() {
     
      var data = google.visualization.arrayToDataTable([
         ['ID', 'X', 'Y', 'Codering', 'Size'],
          ['Gr',   -80,  67,   20, 7],
      ]);
    
    

        
      var options = {
        sizeAxis: { minValue: -100, maxValue: 100 },
        bubble: {textStyle: {fontSize: 13,color: '#28ABE3'}},  
        colorAxis: {colors: ['white', '#28ABE3']},  
          hAxis: {title: 'Belang',
               scaleType: 'linear',
                format: 'none',
                 ticks:[{ v: -100, f: 'Geen'}, {v: 0, f: 'Matig'}, {v: 100, f: 'Groot'}]  
               },
          vAxis: {title: 'Macht',
               format: 'none',
                ticks:[{ v: -100, f: 'Geen'}, {v: 0, f: 'Matig'}, {v: 100, f: 'Veel'}]
               }
        };

      var chart = new google.visualization.BubbleChart(document.getElementById('belangen'));
      chart.draw(data, options);        
        
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            alert('The user selected ' + topping);
          }
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
        
    }
}



//chart interest/trust
if (document.getElementById('krachtenveld') !== null){ 


     google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawSeriesChart2);

    function drawSeriesChart2() {
  
        
        
      var data = google.visualization.arrayToDataTable([
         ['ID', 'X', 'Y', 'Codering', 'Size'],
          ['Gr',   -80,  67,   20, 7],
      ]);
    
    

        
      var options = {
        sizeAxis: { minValue: -100, maxValue: 100 },
        bubble: {textStyle: {fontSize: 13,color: '#28ABE3'}},  
        colorAxis: {colors: ['white', '#28ABE3']},  
          hAxis: {title: 'Belang',
               scaleType: 'linear',
                format: 'none',
                 ticks:[{ v: -100, f: 'Tegengesteld'}, {v: 0, f: 'Neutraal'}, {v: 100, f: 'Gelijk'}]  
               },
          vAxis: {title: 'Vertrouwen',
               format: 'none',
                ticks:[{ v: -100, f: 'Geen'}, {v: 0, f: 'Neutraal'}, {v: 100, f: 'Veel'}]
               }
        };

      var chart = new google.visualization.BubbleChart(document.getElementById('krachtenveld'));
      chart.draw(data, options);        
        
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            alert('The user selected ' + topping);
          }
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
        
    }
  }
        
      