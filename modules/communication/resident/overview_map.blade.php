<div id="overzichtskaart" class="tab-pane fade in active" ng-controller="residentMapCtrl as ResidentMap" ng-style="showMapStyle" ng-init="initDefaultMap('{{ Helper::getConfig('default_map') }}')">

  <div class="row">
    <div class="col-xs-12">
      <div class="col-md-12 col-xs-12 map">
        <openlayers ol-center="center" height="700px" width="100%">
          <ol-marker ng-repeat="resident in ResidentMap.residents"
                     ol-marker-properties="resident"></ol-marker>
        </openlayers>
      </div>
    </div>

  </div>

</div>
