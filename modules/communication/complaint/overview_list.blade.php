<div id="overzichtslijst" class="tab-pane fade" ng-controller="complaintsCtrl as Complaints">
  <div class="panel z-depth-2 col-xs-12 text-left box-shadow">
    <br>
    <div class="table-responsive">
      <div ng-if="!Complaints.isLoaded">
        <div class="loader"></div>
        <span> Laden ...</span>
      </div>

      <table
          datatable="ng"
          ng-show="Complaints.isLoaded"
          class="table table-hover"
          ng-init="GetComplaints()" id="complaintstable"
          dt-options="Complaints.dtOptions"
          dt-column-defs="Complaints.dtColumnDefs"
          dt-instance="Complaints.dtInstance"
          style="width:100%">
        <thead>
        <tr>
          <th class="col-xs-1">#</th>
          <th class="col-xs-2">Date</th>
          <th class="col-xs-2">Melder</th>
          <th class="col-xs-3">Melding</th>
          <th class="col-xs-2">Thema</th>
          <th class="col-xs-2">Maatregel</th>
          <th class="col-xs-1">Dagen Open</th>
          <th class="col-xs-2">Verantwoordelijke</th>
          <th class="col-xs-1">Status</th>
          <th> </th>
        </tr>
        </thead>

        <tbody>
        <tr ng-repeat="item in Complaints.items" class='clickable-row'
            data-href="{{ url( $project->code.'/klachten' ) }}/### item.id ###/"
            ng-click="$root.goto('{{ url( $project->code.'/klachten' ) }}/' + item.id)">
          <td class="d-cursor"><span ng-bind="item.id"></span></td>
          <td class="d-cursor"><span ng-bind="item.formatted_date"></span></td>
          <td class="d-cursor"><span ng-bind="item.complainant_name"></span></td>
          <td class="d-cursor"><span ng-bind="item.text"></span></td>
          <td class="d-cursor"><span ng-bind="item.complaintthemes.name"></span></td>
          <td class="d-cursor"><span ng-bind="item.final_logs.description"></span></td>
          <td class="d-cursor"><span ng-bind="item.days_open"></span></td>
          <td class="d-cursor"><span ng-bind="item.users[0].name"></span></td>
          <td class="d-cursor"><span ng-bind="item.final_logs?'Afgehandeld':'Open'"></span></td>
          <td>
            <a class="btn btn-xs pull-right"
               title="Verwijder" data-toggle="tooltip" data-placement="top" tooltip
               ng-click="deleteComplaint($index, item.id); $event.stopPropagation();">
              <i class="material-icons">delete</i>
            </a>
          </td>
        </tr>

        </tbody>

      </table>
    </div>
  </div>

</div>
