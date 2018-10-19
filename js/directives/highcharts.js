// Directive for generic chart, pass in chart options
app.directive('hcChart', function() {
  return {
    restrict: 'E',
    template: '<div></div>',
    scope: {
      options: '='
    },
    link: function(scope, element) {
      Highcharts.chart(element[0], scope.options);
    }
  };
})
// Directive for pie charts, pass in title and data only    
app.directive('hcBubbleChart', function(bubbleChartDragFactory, $timeout) {

  return {
    restrict: 'E',
    require: 'ngModel',
    template: '<div></div>',
    scope: {
      title: '@',
      type: '@',
      values: '=values',
      xaxistitle: '@',
      xaxislabels: '=',
      yaxistitle: '@',
      yaxislabels: '='
    },
    link: function(scope, element, attrs, ngModel) {

      // make bubble chart draggable
      bubbleChartDragFactory.makeDraggable(scope);
      bubbleChartDragFactory.releaseDrag();


      ngModel.$render = function() {
        var chart = Highcharts.chart(element[0], {
          chart: {
            type: 'bubble',
            height: '250',
            width: '400',
            zoomType: ""
          },
          legend: {
            enabled: false
          },
          tooltip: {
            enabled: false
          },
          title: {
            text: scope.title
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          xAxis: {
            allowDecimals: false,
            min: 0,
            max: 100,
            tickInterval: 50,
            gridLineWidth: 1,
            //startOnTick: false,
            //endOnTick: false,
            title: {
              text: scope.xaxistitle
            },
            labels: {
              formatter: function() {
                if (scope.xaxislabels) {
                  var value = scope.xaxislabels[this.value];
                  return value !== 'undefined' ? value : this.value;
                }
              }
            }
          },
          yAxis: {
            allowDecimals: false,
            min: 0,
            max: 100,
            tickInterval: 50,
            gridLineWidth: 1,
            //startOnTick: false,
            //endOnTick: false,
            title: {
              text: scope.yaxistitle
            },
            labels: {
              formatter: function() {
                if (scope.yaxislabels) {
                  var value = scope.yaxislabels[this.value];
                  return value !== 'undefined' ? value : this.value;
                }
              }
            }
          },
          series: [{
            data: ngModel.$modelValue
          }],
          credits: {
            enabled: false
          }
        });
        //redraw
        //$timeout($(window).resize(), 500);

      }
    }
  };
})


app.factory('bubbleChartDragFactory', function($http) {
  //return {
  function makeDraggable(scope) {
    //return Highcharts.wrap(Highcharts.SVGElement.prototype, 'dragAndDrop', function () {
    return bubDrag = Highcharts.SVGElement.prototype.dragAndDrop = {
      //start
      start: function(e, po) {

        var p = po.graphic,
          ch = po.series.chart,
          epageX,
          epageY;

        $(document).bind({
          'mousemove.line': function(e2) {
            bubDrag.step(e2, p, po)
          },
          'mouseup.line': function(e2) {
            bubDrag.stop(e2, po)
          },
          'touchmove.line': function(e2) {
            bubDrag.step(e2, p, po)
          },
          'touchend.line': function(e2) {
            bubDrag.stop(e2, po)
          }
        });

        if (e.changedTouches) {
          epageX = e.changedTouches[0].pageX;
          epageY = e.changedTouches[0].pageY;
        } else {
          epageX = e.pageX;
          epageY = e.pageY;

        }

        p.clickX = epageX - p.translateX;
        p.clickY = epageY - p.translateY;

        p.offsetXdrag = epageX - (ch.container.offsetLeft + ch.plotLeft + po.plotX);
        p.offsetYdrag = epageY - (ch.container.offsetTop + ch.plotTop + po.plotY);


      },
      //step
      step: function(e, p, po) {
        // console.log(e)
        // console.log(p)
        // console.log(po)
        e.preventDefault();


        var ch = po.series.chart,
          pageX = e.pageX,
          pageY = e.pageY,
          offsetX, offsetY, x, y, tmpX, tmpY;


        if (e.originalEvent.changedTouches) {
          pageX = e.originalEvent.changedTouches[0].pageX;
          pageY = e.originalEvent.changedTouches[0].pageY;
        }


        offsetX = pageX - ch.container.offsetLeft;
        offsetY = pageY - ch.container.offsetTop;

        // move element
        p.translate(pageX - p.clickX, pageY - p.clickY);

        po.update({
          x: ch.xAxis[0].toValue(offsetX - p.offsetXdrag),
          y: ch.yAxis[0].toValue(offsetY - p.offsetYdrag)
        }, false, false);

        //if (ch.tooltip.options.enabled) ch.tooltip.refresh(po);

        if (offsetX < ch.plotLeft || offsetY < ch.plotTop || offsetY > (ch.plotHeight + ch.plotTop) || offsetX > (ch.plotWidth + ch.plotLeft)) this.stop(e, po);
      },
      //stop
      stop: function(el, po) {
        //fix dragging over limits
        po.x = (po.x > 100) ? 100 : po.x;
        po.x = (po.x < 0) ? 0 : po.x;
        po.y = (po.y > 100) ? 100 : po.y;
        po.y = (po.y < 0) ? 0 : po.y;
        //round to integer
        po.x = Math.round(po.x);
        po.y = Math.round(po.y);
        //get x and y and save
        saveChart(po, scope)

        po.series.chart.redraw(false);
        $(document).unbind('.line');
      }
    };
  };

  function releaseDrag() {
    return Highcharts.wrap(Highcharts.seriesTypes.bubble.prototype, 'drawPoints', function(proceed) {

      proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      var points = this.data;
      $.each(points, function(i, point) {
        point.graphic.translate(0, 0).css({
          'cursor': 'pointer'
        }).on('mousedown', function(e) {
          point.graphic.dragAndDrop.start(e, point);
        }).on('touchstart', function(e) {
          point.graphic.dragAndDrop.start(e, point);
        });
      });
    });
  };

  function saveChart(po, scope) {
    //scope.type if we want to only save specific chart
    if (po.type && po.type == "trust") {
      scope.$parent.trustX = po.x;
      scope.$parent.trustY = po.y;
    }
    if (po.type && po.type == "power") {
      scope.$parent.powerX = po.x;
      scope.$parent.powerY = po.y;
    }
    $http.post("/api/stakeholders/" + scope.$parent.formData.code + "/matrices", {
        trust_interest: scope.$parent.trustX,
        trust: scope.$parent.trustY,
        power_interest: scope.$parent.powerX,
        power: scope.$parent.powerY
      })
      .then(function(response) {
        //saved
      }).catch(function(response) {
        console.log('error' + response)
      });
  }

  return {
    makeDraggable: makeDraggable,
    releaseDrag: releaseDrag,
    saveChart: saveChart
  };
});
