<div class="panel z-depth-2 col-xs-12" ng-controller="monitorIssuesCtrl" ng-init="init()"> 
	<div class="panel-heading">
	  <h4>Issuemonitor</h4>  
	  <hr>
	</div>
	<div class="">
      <div class="animated flipInY col-xs-4">
        <div class="d-stats text-center">
          <a href="{{ url( $project->code.'/issues' ) }}">
            <h9 class="count-animated closed"></h9>
          </a>
          <p>afgehandelde issues</p>
        </div>
      </div>
      <div class="animated flipInY col-xs-4">
        <div class="d-stats text-center">
          <a href="{{ url( $project->code.'/issues' ) }}">
            <h9 class="count-animated open" ng-bind="countOpen"></h9>
          </a>
          <p>openstaande issues</p>
        </div>
      </div>
      <div class="animated flipInY col-xs-14">
        <div class="d-stats text-center">
          <a href="{{ url( $project->code.'/issues' ) }}">
            <h9 class="count-animated urgent" ng-bind="countUrgent"></h9>
          </a>
          <p>urgente issues</p>
        </div>
      </div>
    </div>
</div>  

