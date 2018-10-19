app.controller('complaintMapCtrl', function ($window, $scope, $rootScope, $http, olData) {
  const DATE_FORMAT = 'YYYY-MM-DD';
  $scope.center =  {
    lat: 0,
    lon: 0,
    zoom: 0
  };

  var vm = this;
  vm.filteredComplaints = [];
  $scope.complaints = [];
  $scope.startDate = '';
  $scope.endDate = '';
  $scope.startDateUnix = 0;
  $scope.endDateUnix = 0;
  $scope.gsonSource = null;
  $scope.defaultCoordinate = [];

  // This is to define initial slider location
  $scope.slider = {
    min: 0,
    max: 0
  };

  $scope.initDefaultMap = function (defaultCoordinate) {
    let coordinates = defaultCoordinate.split(',');
    $scope.defaultCoordinate = $.map(coordinates, function (coord) {
      return parseFloat(coord);
    });
  };

  $rootScope.$on('COMPLAINTS_LOADED', function(event, response) {
    $scope.init(response);
  });

  $scope.init = function(response) {
    if (response.data && response.data.data) {
      if (response.data.data.length > 0) {
        $scope.complaints = $.map(response.data.data, function (complaint) {
          if (!complaint.complainant_latitude || !complaint.complainant_longitude) {
            return;
          }

          const splits = window.location.href.split('/');
          return $scope.transformComplaint(complaint,
            window.location.protocol + '//' +
            window.location.host + '/' +
            splits[3]);
        });

        vm.filteredComplaints = $scope.complaints;
        $scope.gsonSource = $scope.transformComplaintsToGeojson(vm.filteredComplaints);
        $scope.initSlider();
      }
    }

    $scope.fitMap();
  };

  $scope.initSlider = function() {
    if (!$scope.complaints || $scope.complaints.length === 0) {
      return;
    }

    var momentStart = moment($scope.complaints[$scope.complaints.length - 1].date);
    var momentEnd = moment($scope.complaints[0].date);

    $scope.startDate = momentStart.format(DATE_FORMAT);
    $scope.endDate = momentEnd.format(DATE_FORMAT);
    $scope.startDateUnix = momentStart.valueOf();
    $scope.endDateUnix = momentEnd.valueOf();
    $scope.slider.min = $scope.startDateUnix;
    $scope.slider.max = $scope.endDateUnix;
  };

  $scope.fitMap = function() {
    if (!$scope.gsonSource) {
      olData.getMap().then(function(map) {
        map.getView().fitExtent($scope.defaultCoordinate, map.getSize());
      });

      return;
    }

    olData.getMap().then(function(map) {
      var source = new ol.source.GeoJSON({
        projection: 'EPSG:3857',
        object: $scope.gsonSource
      });

      var feature = source.getFeatures()[0];
      var polygon = feature.getGeometry();
      var size = map.getSize();
      var view = map.getView();
      view.fitGeometry(
        polygon,
        size,
        {
          padding: [100, 50, 30, 100],
          constrainResolution: false
        }
      );
    });
  };

  $scope.transformComplaint = function(complaint, baseUrl) {
    return {
      lat: complaint.complainant_latitude,
      lon: complaint.complainant_longitude,
      label: {
        message: complaint.complainant_name,
        show: false,
        showOnMouseOver: true
      },
      onClick: function() {
        // Trigger redirect when clicking a marker
        if (complaint.id) {
          window.location.href = baseUrl + '/klachten/' + complaint.id
        }
      },
      date: complaint.date  // Extra attribute for filtering
    };
  };

  $scope.bumpCoordinate = function(value) {
    return parseFloat(Number(value + 0.01).toFixed(6));
  };

  $scope.transformComplaintsToGeojson = function(complaints) {
    var geoJson = [];
    var tempExtraCoordinate = [];
    complaints.forEach(function(complaint) {
      geoJson.push([complaint.lon, complaint.lat]);

      // Extra coordinate in case if complaint produce 1 coordinate only.
      // This extra coordinate is used to fit the map (min. 2 coordinates needed)
      tempExtraCoordinate = [$scope.bumpCoordinate(complaint.lon), $scope.bumpCoordinate(complaint.lat)];
    });

    if (geoJson.length === 0) {
      return null;
    }

    // Only 1 coordinate found, let's add temp coordinate
    if (geoJson.length === 1) {
      geoJson.push(tempExtraCoordinate);
    }

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "CMP",
          properties: {
            name: "Complaints"
          },
          geometry: {
            type: "Polygon",
            coordinates: [geoJson]
          }
        }
      ]
    };
  };

  $scope.$watchCollection('slider', function(slider) {
    if (slider.min !== 0 && slider.max !== 0) {
      var min = moment(slider.min);
      var max = moment(slider.max);

      // Show the date indicator on the slider
      $scope.startDate = min.format(DATE_FORMAT);
      $scope.endDate = max.format(DATE_FORMAT);

      // Filter and update the pins on the map
      vm.filteredComplaints = $scope.complaints.filter(function(complaint) {
        return moment(complaint.date).isBetween(min, max, null, '[]');
      });
    }
  });

});
