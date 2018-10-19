<div id="overzichtskaart" class="tab-pane fade in active" ng-controller="complaintMapCtrl as ComplaintMap" ng-style="showMapStyle" ng-init="initDefaultMap('{{ Helper::getConfig('default_map') }}')">

  <div class="row">
    <div class="col-xs-12">

      <div class="slider-container panel z-depth-2 col-xs-4 text-left box-shadow">

        <div id="time-range">

          <h4>Filter </h4>
          <div class="date-select-row">
            <h5 class="date-select-title"> Filter meldingen op datum</h5>
            <div style="display: inline-block;">
              <span class="slider-time" ng-bind="startDate"></span> - <span class="slider-time2" ng-bind="endDate"></span>
            </div>
          </div>

          <div class="col-xs-12" range-slider orientation="horizontal" min="startDateUnix" max="endDateUnix"
               model-min="slider.min" model-max="slider.max"></div>

          <div class="sliders_step1">
            <div id="slider-range" style="float:left;"></div>
          </div>

        </div>
      </div>

      <div class="col-md-8 col-xs-8 map">
        <openlayers ol-center="center" height="700px" width="100%">
          <ol-marker ng-repeat="complaint in ComplaintMap.filteredComplaints" ol-marker-properties="complaint"></ol-marker>
        </openlayers>
      </div>

    </div>

  </div>

</div>
