<div class="panel z-depth-2 col-xs-12" ng-controller="MonitorComplaintCtrl" ng-init="init()">
  <div class="panel-heading d-p-0">
    <h4>Meldingen</h4>
    <hr>
  </div>
  <div class="panel-body d-p-0">
    <div class="graph-complaint-title-container">
      <div class="graph-new-complaints-thisweek"><h5 style="float: left;">Nieuwe Meldingen van deze week:</h5> <h2>###newComplaints###</h2></div>
      <div class="graph-open-complaints"><h5 style="float: left;" >Openstaande Meldingen:</h5> <h2> ###openComplaints### </h2></div>
    </div>
    <div id="container" style="min-width: 300px; min-height: 400px; max-height:800px; margin: 0 auto;"></div>
  </div>
</div>
