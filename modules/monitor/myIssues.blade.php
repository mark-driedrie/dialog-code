<div class="panel z-depth-2 col-xs-12"  ng-controller="myIssuesCtrl as myIssues">  
  <div class="panel-heading d-pb0">  
    
    <div class="row">
    <div class="col-xs-6">
        <h4>Mijn issues</h4> 
    </div>
    <div class="col-xs-6">
      <div class="search-input-wrapper">
       <div class="input-group">
          <span id="sizing-addon1" class="input-group-addon" >
            <i class="material-icons d-text-middle">search</i>
          </span>
          <!-- <div class="col-xs-10"> -->
            <input type="text" aria-describedby="sizing-addon1" class="form-control pull-right"
          ng-model="searchQuery" ng-change="searchTable()" placeholder="Zoeken...">
          <!-- </div> -->
        </div>
      </div>
      <br>
    </div>  
  </div> 
    <hr class="d-mt0">
  </div>
  <div class="panel-body d-pt0">
   <div class="table-responsive">
      <table 
        datatable="ng"
        class="table  table-condensed table-hover text-left col-xs-12" 
        ng-init="getMyIssues()" id="issuetable"
        dt-options="myIssues.dtOptions" 
        dt-column-defs="myIssues.dtColumnDefs"
        dt-instance="myIssues.dtInstance"
        style="width:100%">
        <thead>
          <tr>
            <th class="col-xs-1">#</th>
            <th class="col-xs-4">Issue</th>
            <th class="col-xs-1">Urgentie</th>
          </tr>
        </thead>
        <tbody>
          <tr ng-repeat="item in myIssues.items">
            <td ng-bind="item.code"></td>
            <td>
              <a class="active d-overlay-open d-cursor-hand" href="{{ url( $project->code.'/issues' ) }}/### item.code ###" ng-bind="item.name" ></a>
            </td>
            <td ng-bind="item.urgency"></td>
          </tr>
        </tbody>
      </table> 
    </div>
  </div>                       
</div>  