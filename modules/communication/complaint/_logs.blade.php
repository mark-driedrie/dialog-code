<div ng-controller="complaintLogCtrl as ComplaintLog" ng-init="init(formData.id)">
 <div class="panel z-depth-2" >
    <form name="ComplaintLogForm" ng-submit="addLog(ComplaintLogForm.$valid)"  novalidate>
      <div>
          <input type="hidden" id="accountName" value="{{ Auth::user()->name }}" />
      </div>
       <div class="panel-heading">
        <div class="row">
           <h2 class="col-md-6 col-xs-12">Log</h2>
            <div class="col-md-6 col-xs-12" >
                  <date-picker type="text" class="datepicker" ng-model="log2Add.log_timestamp"></date-picker>
            </div>
        </div>
        </div>
        <div class="panel-body">
        <div class="row">
            <div class="col-xs-12" ng-class="{ 'has-error' : ComplaintLogForm.description.$invalid && !ComplaintLogForm.description.$pristine }">
                <textarea class="form-control"
                type="text" name="description"
                ng-model="log2Add.description"
                placeholder="Vul een omschrijving in..." required=""
                rows="5"
                ></textarea>
                <p ng-show="(ComplaintLogForm.description.$dirty || submittedLog) && ComplaintLogForm.description.$error.required"
                class="d-error help-block">Omschrijving is verplicht</p>
            </div>
        </div>
        <div class="row">
           <div class="col-md-4">
                <select  class="form-control d-mt10 d-ml-0" name="log_type"
                ng-model="log2Add.log_type"
                ng-options="option.name for option in log2Add.log_options track by option.id"
                required>
                </select>
                <p ng-show="(submittedLog && !logTypeValid)"
                class="d-error help-block">Type is verplicht</p>
            </div>
            <div class="col-md-2">
             <a id="log-docs-btn" data-type="logs" class="btn  mdl-button mdl-js-button mdl-button--raised d-mr-0 d-m10"
             ng-click="addLogDraft($event)">
                  <i class="material-icons">attach_file</i>
                </a>
            </div>
            <div class="col-md-6">
                <button class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised d-mr-0 pull-right d-m10" ng-disabled="log2Add.isSubmitDisabled"
                    type="submit">
                      <i class="material-icons">done</i>
                      Toevoegen
               </button>
           </div>
        </div>
        </div>
    </form>
</div>

<h2>Logs</h2>

 <div class="col-md-12 col-xs-12">

      <!-- Log History-->
      <div class="table-responsive">
          <div ng-if="!isLoaded">
            <div class="loader"></div><span> Laden ...</span>
          </div>
          <table
          datatable="ng"
          ng-show="isLoaded"
          class="table table-condensed table-log"
          id="complaintLogTable"
          dt-options="ComplaintLog.dtOptionsLogs"
          dt-column-defs="ComplaintLog.dtColumnDefs"
          dt-instance="ComplaintLog.dtInstanceCallback"
          style="width: 100%">
            <thead class="hidden">
              <tr>
                <th class="col-xs-12"></th>
              </tr>
            </thead>
            <tbody>
              <tr ng-repeat="item in ComplaintLog.dtLogs.data" class="row">
                <td>
                  <!--Log-->
                  @include('modules/communication/complaint/_log')
                </td>
              </tr>
            </tbody>
        </table>
    </div>
    <div class="col-xs-12">
      <ul ng-show="isLoaded" class="pagination d-pagination pull-right">
        <li ng-class="{ 'active': ComplaintLog.dtLogs.current_page == $index+1 }" ng-repeat="i in getNumber(ComplaintLog.dtLogs.last_page) track by $index" class="d-cursor-hand"><a ng-click="paginateTo($index+1)">### $index+1 ###</a></li>
      </ul>
    </div>
  </div>
</div>

<script type="text/ng-template" id="displayLog">
 <div class="log_type-description" ng-bind="item.description"></div>
</script>
<script type="text/ng-template" id="editLog">
<div class="log_type-description">
<textarea type="text" class="form-control" style="width:100%" ng-model="selectedLog.description" rows="5" ng-keyup="updateLogEnterClick($index, $event, item.id)">
</textarea>
<div class="row">
<button class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised pull-right d-m10"  type="button"
    ng-click="updateLog($index, item.id)">
      <i class="material-icons">done</i>
      Opslaan
    </button>
</div>
</div>
</script>
