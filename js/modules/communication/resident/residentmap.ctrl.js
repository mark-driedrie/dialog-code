app.controller('residentMapCtrl', function ($window, $scope, $rootScope, $http, olData) {
  $scope.center =  {
    lat: 0,
    lon: 0,
    zoom: 0
  };

  var vm = this;
  vm.residents = [];
  $scope.gsonSource = null;
  $scope.defaultCoordinate = [];

  $scope.initDefaultMap = function (defaultCoordinate) {
    let coordinates = defaultCoordinate.split(',');
    $scope.defaultCoordinate = $.map(coordinates, function (coord) {
      return parseFloat(coord);
    });
  };

  $rootScope.$on('RESIDENTS_LOADED', function(event, response) {
    $scope.init(response);
  });

  $scope.init = function(response) {
    if (response.data && response.data.data) {
      if (response.data.data.length > 0) {
        vm.residents = $.map(response.data.data, function (resident) {
          if (!resident.latitude || !resident.longitude) {
            return;
          }

          const splits = window.location.href.split('/');
          return $scope.transformResident(resident,
          window.location.protocol + '//' +
          window.location.host + '/' +
          splits[3]);
        });

        $scope.gsonSource = $scope.transformResidentsToGeojson(vm.residents);
      }
    }

    $scope.fitMap();
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

  $scope.transformResident = function(resident, baseUrl) {
    return {
      lat: resident.latitude,
      lon: resident.longitude,
      label: {
        message: resident.name,
        show: false,
        showOnMouseOver: true
      },
      onClick: function() {
        // Trigger redirect when clicking a marker
        if (resident.id) {
          window.location.href = baseUrl + '/omwonenden/' + resident.id
        }
      }
    };
  };

  $scope.bumpCoordinate = function(value) {
    return parseFloat(Number(value + 0.01).toFixed(6));
  };

  $scope.transformResidentsToGeojson = function(residents) {
    var geoJson = [];
    var tempExtraCoordinate = [];
    residents.forEach(function(resident) {
      geoJson.push([resident.lon, resident.lat]);

      // Extra coordinate in case if complaint produce 1 coordinate only.
      // This extra coordinate is used to fit the map (min. 2 coordinates needed)
      tempExtraCoordinate = [$scope.bumpCoordinate(resident.lon), $scope.bumpCoordinate(resident.lat)];
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
          id: "RES",
          properties: {
            name: "Residents"
          },
          geometry: {
            type: "Polygon",
            coordinates: [geoJson]
          }
        }
      ]
    };
  };

});
