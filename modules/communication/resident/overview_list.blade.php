<div id="overzichtslijst" class="tab-pane fade" ng-controller="residentsCtrl as Residents">
  <div class="panel z-depth-2 col-xs-12 text-left box-shadow"  >
    <br>
    <div class="table-responsive">
      <div ng-if="!Residents.isLoaded">
        <div class="loader"></div><span> Laden ...</span>
      </div>
      <table
          datatable="ng"
          ng-show="Residents.isLoaded"
          class="table table-hover"
          ng-init="getResidents()" id="residentstable"
          dt-options="Residents.dtOptions"
          dt-column-defs="Residents.dtColumnDefs"
          dt-instance="Residents.dtInstance"
          style="width:100%">
        <thead>
        <tr>
          <th class="col-xs-4">Naam</th>
          <th class="col-xs-4">Adres</th>
          <th class="col-xs-3">Laaste log datum</th>
          <th class="col-xs-2">Open klachten</th>
          <th> </th>
        </tr>
        </thead>
        <tbody>
        <tr ng-repeat="item in Residents.items">
          <td>
            <a href="{{ url( $project->code.'/omwonenden' ) }}/### item.id ###" ng-bind="item.name" ></a></td>
          <td class="d-cursor">
            <span ng-bind="item.address"></span>
          </td>
          <td class="d-cursor">
            <span ng-bind="item.last_log.log_timestamp_pretty"></span>
          </td>
          <td class="d-cursor">
            <span ng-bind="item.open_complaints_count"></span>
          </td>

          <td>
            <a class="btn btn-xs pull-right"
               title="Verwijder" data-toggle="tooltip" data-placement="top" tooltip
               ng-click="deleteResident($index, item.name, item.id)">
              <i class="material-icons">delete</i>
            </a>
          </td>

        </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
