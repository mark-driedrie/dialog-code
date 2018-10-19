<!-- MANUAL LOG -->
<div  ng-if="item.log_type == 'phone' || item.log_type == 'email' || item.log_type == 'meeting' || !item.log_type">
<span class="log_type-icon col-md-1" >
   <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" disabled>
    <i ng-if="item.log_type == 'phone'" class="material-icons" title="Telefoon">phone</i>
    <i ng-if="item.log_type == 'email'" class="material-icons" title="Email">email</i>
    <i ng-if="item.log_type == 'meeting'" class="material-icons" title="Meeting">group</i>
  </button>
</span>
<div class="col-md-1"></div>
<div class="col-md-10">
<div class="panel  z-depth-2 d-well row">
    <div class="col-xs-12">
        <span class="" >
           <div class="col-xs-12 d-pl0 d-pr0" style="border-bottom: 1px solid lightgray;">
                <div class="btn-group pull-right log-top-links" role="group" aria-label="Basic example">
                    <!-- EDIT -->
                    <a id="log-docs-btn" class="d-cursor-hand" ng-click="editLog(item)" title="Wijzigen" tooltip>
                        <i class="material-icons log-top-icon">create</i>
                      </a>
                    <!-- ADD DOCS -->
                     <a title="Koppel document(en)" tooltip
                       data-toggle="modal"
                       data-id="### item.id ###"
                       data-order="### $index ###"
                       data-target="#sidebar-documents"
                       data-type="logs"
                       class="d-cursor-hand">
                        <i class="material-icons log-top-icon">attach_file</i>
                        <span class="badge bg-red d-icon-badge" ng-show="item.logs_documents.length > 0"  ng-bind="item.logs_documents.length">0</span>
                      </a>
                    <!-- REMOVE -->
                    <a class="d-cursor-hand" style="margin-left:20px;"
                      title="Verwijder" data-toggle="tooltip" data-placement="top" tooltip
                      ng-click="deleteLog($index,item.id)">
                        <i class="material-icons">clear</i>
                      </a>
                  </div>
            </div>
            <div class="col-xs-12 d-pl0 d-pr0" ng-include="getTemplateLog(item)">

            </div>
        </span>
        <span class="log_type-timestamp col-xs-12 d-pl0 d-pr0">
           {{ trans('dialog.log_had_contact_at') }}
            <span ng-bind="item.log_timestamp | DialogLocalDateTimeFormat"></span>
              {{ trans('dialog.log_had_contact_by') }}
            <span ng-bind="item.users.name"></span>
        </span>


        <!-- afgehandeld -->
        <button class="d-cursor-hand d-btn-dialog mdl-button mdl-js-button mdl-button--raised d-mr-0 pull-right d-m10" style="margin-left:20px; float: right;"
           title="Afgehandeld" data-toggle="tooltip" data-placement="top" tooltip
           ng-show="!complaint.final_logs_id"
           ng-click="markHandled(item.id)">
           <i class="material-icons">done</i> Melding afhandelen
        </button>

        <label style="padding: 5px; margin: 0; width:100%; border-bottom: 3px solid #36c719"
           title="Afgehandeld" data-toggle="tooltip" data-placement="top" tooltip
           ng-show="complaint.final_logs_id && item.id == complaint.final_logs_id">
                      <span style="float:right;">Melding afgehandeld<span>
        </label>

        <span class="log_type-docs col-xs-12 d-pl0 d-pr0">
          <!-- Log document button -->
          <a href="### doc.link ###" data-toggle="tooltip" data-placement="top" tooltip title="### doc.name ###" class="log-docs-thumb" target="_blank"
          ng-repeat="doc in item.logs_documents">
                <i class="log-docs-icon material-icons">attach_file</i>
                <span class="log-docs-name">
                  <span ng-bind="doc.display_name | limitTo: 28"></span>
                  <span ng-if="doc.display_name.length > 28">...</span>
                </span>
                <i class="log-delete-doc material-icons" ng-click="deleteDocFromLog($event,item.id,$parent.$index,doc.id)">clear</i>
          </a>
      </span>


    </div>
</div>
</div>
</div>
