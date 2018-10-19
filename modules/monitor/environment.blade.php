<!--omgevingsmonitor-->     
<div class="panel z-depth-2 col-xs-12" ng-controller="MonitorEnvironmentCtrl"> 
<div class="panel-heading">
	<h4>Omgevingsmonitor</h4>  
	<hr>
</div>
<div class="panel-body" ng-init="init()">
	<div class="col-md-2 xs-hidden"></div>
	<div class="col-md-8 col-xs-12">
		<div ng-show="!isLoaded" >
			<div class="loader"></div><span> Laden ...</span>
		</div> 
	  	<div id="trust-chart"></div>
	  	<div ng-show="isLoaded && total == 0" class="text-center">
	  		<p>Niet genoeg data voor de grafiek<br>Maakt eerst stakeholders aan</p>
	  	</div>
	</div>
	<div class="col-md-2 xs-hidden"></div>
</div>
</div>  
  