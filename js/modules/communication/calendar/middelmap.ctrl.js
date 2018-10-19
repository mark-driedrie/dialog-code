app.controller('middelMapCtrl', function($scope, $rootScope, $http, olData, UtilService) {

  const MAX_SELECTED_AREA = 25;
  $scope.polygonFeature = {};
  $scope.preloadedPolygonFeature = {};
  $scope.vectorLayer = null;
  $scope.preloadedCoordinates = [];
  $scope.style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(66, 173, 244, 0.4)'
    }),
    stroke: new ol.style.Stroke({
      color: 'rgb(66, 173, 244)',
      width: 2
    })
  });
  $scope.selectedCoordinates = null;
  $scope.selectedAddressCount = 0;
  $scope.exportDisabled = false;


  $scope.initMap = function(defaultCoordinate) {
    olData.getMap().then(function(map) {
      let coordinates = defaultCoordinate.split(',');
      coordinates = $.map(coordinates, function (coord) {
        return parseFloat(coord);
      });
      map.getView().fitExtent(coordinates, map.getSize());
      $scope.enablePolygon();
    });
  };

  $scope.enablePolygon = function() {
    olData.getMap().then(function(map) {
      $scope.polygonFeature = new ol.FeatureOverlay({
        style: $scope.style
      });

      $scope.polygonFeature.setMap(map);

      var lns = new ol.interaction.Draw({
        features: $scope.polygonFeature.getFeatures(),
        type: 'Polygon'
      });
      lns.setActive(true);
      map.addInteraction(lns);

      lns.on('drawend', function() {
        var tempSelectedCoordinates = $scope.selectedCoordinates;
        $scope.updateSelectedCoordinates();
        if ($scope.calculateArea()) {
          $scope.updateSelectedCoordinatesOverview();
        } else {
          // Revert the selected coordinates and show error message
          $scope.selectedCoordinates = tempSelectedCoordinates;
          $rootScope.showFeedback('Geselecteerde oppervlak te groot', 'error');
        }
      });
    });
  };

  $scope.updateSelectedCoordinates = function() {
    // Get the array of features
    var features = $scope.polygonFeature.getFeatures();

    // Go through this array and get coordinates of their geometry.
    var multiPolygon = [];
    features.forEach(function(feature) {
      multiPolygon.push(feature.getGeometry().getCoordinates());
    });

    if ($scope.preloadedCoordinates.length > 0) {
      multiPolygon = multiPolygon.concat($scope.preloadedCoordinates);
    }

    // We convert it to EPSG:4326 so it compatibles with google map point coordinate
    // (for GIS query)
    let geom = new ol.geom.MultiPolygon(multiPolygon);
    $scope.selectedCoordinates = {
      coordinates : geom.transform('EPSG:3857', 'EPSG:4326').getCoordinates()
    };
  };

  $scope.updateSelectedCoordinatesOverview = function() {
    $scope.selectedAddressCount = $scope.countAddresses();
  };

  $scope.calculateArea = function() {
    var sphere = new ol.Sphere(6378137);
    var area_km_total = 0;
    $scope.selectedCoordinates.coordinates.forEach(function (coord) {
      var polygon = coord[0];
      var area_m = sphere.geodesicArea(polygon);
      var area_km = area_m / 1000 / 1000;
      area_km_total += area_km;
    });

    if (area_km_total > MAX_SELECTED_AREA) {
      return false;
    }

    return true;
  };

  $scope.saveCoordinates = function() {
    if ($scope.calculateArea()) {
      $scope.middel.area = $scope.selectedCoordinates;
      $scope.$parent.updateMiddel();
    } else {
      $rootScope.showFeedback('Geselecteerde oppervlak te groot', 'error');
    }
  };

  $scope.clearCoordinates = function() {
    var features = $scope.polygonFeature.getFeatures().getArray();

    if (features && features.length > 0) {
      $scope.polygonFeature.removeFeature(features[features.length - 1]);

      $scope.updateSelectedCoordinates();
      $scope.updateSelectedCoordinatesOverview();
      return;
    }

    olData.getMap().then(function(map) {
      if ($scope.vectorLayer) {
        map.removeLayer($scope.vectorLayer);
      }
    });

    $scope.preloadedCoordinates = [];

    $scope.updateSelectedCoordinates();
    $scope.updateSelectedCoordinatesOverview();
  };

  $scope.fitMap = function() {
    if (!$scope.preloadedPolygonFeature) {
      return;
    }

    olData.getMap().then(function(map) {
      var polygon = $scope.preloadedPolygonFeature.getGeometry();
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

  $scope.countAddresses = function() {
    $http.post("/api/addresscount", {
      polygon: $scope.selectedCoordinates.coordinates
    }).then(function (response) {
      $scope.selectedAddressCount = response.data;
    });
  };

  $scope.exportAddresses = function() {
    $scope.exportDisabled = true;
    UtilService.download('/api/getaddresses', {
      method: 'POST',
      polygon: $scope.selectedCoordinates.coordinates,
      middelId: $scope.middel.id
    }, function() {
      $scope.exportDisabled = false;
    }, function() {
      $scope.exportDisabled = false;
      $rootScope.showFeedback('Er is een error opgetreden', 'error');
    });
  };

  $rootScope.$on('MIDDEL_LOADED', function(event, response) {
    if (response.data && response.data.area && response.data.area.coordinates) {
      // We transform it to EPSG:3857 because it's stored as EPSG:4326 in DB
      let geom = new ol.geom.MultiPolygon(response.data.area.coordinates);
      $scope.preloadedCoordinates = geom.transform('EPSG:4326', 'EPSG:3857').getCoordinates();
      $scope.preloadedPolygonFeature = new ol.Feature({
        geometry: new ol.geom.MultiPolygon(
          $scope.preloadedCoordinates
        )
      });

      olData.getMap().then(function(map) {
        var vectorSource = new ol.source.Vector({
          //create empty vector
        });
        vectorSource.addFeature($scope.preloadedPolygonFeature);
        $scope.vectorLayer = new ol.layer.Vector({
          source: vectorSource,
          style: $scope.style
        });
        map.addLayer($scope.vectorLayer);
      });

      $scope.fitMap();

      $scope.updateSelectedCoordinates();
      $scope.updateSelectedCoordinatesOverview();
    }
  });
});
