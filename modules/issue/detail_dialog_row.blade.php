<tr id="### item.id ###" class="row-show-mode" ng-repeat-start="item in all"
ng-class="{'d-row-closed': item.status=='gesloten'}">
    <td class="disabled_input">
      <p class="d-cursor">### item.created_at  | DialogDateFormat ###</p>
    </td>
    <td class="disabled_input">
      <p class="d-cursor">
        <a href="{{ url( $project->code.'/stakeholders' ) }}/### item.stakeholders_code ###"
        ng-bind="item.stakeholders_name"></a>
      </p>
    </td>
    <!-- belang -->
    <td>
      @if(!isset($isreadonly))
      <a ng-if="item.status=='open'"
        data-toggle="modal"
        data-id="### item.id ###"
        data-stakeholdercode="### item.stakeholders_code ###"
        data-name="### item.stakeholders_name ###"
        data-status="### item.status ###"
        data-standpoint="### item.standpoint ###"
        data-target="#sidebar-interests"
        tabindex="0">
        <p ng-if="item.interests_description" ng-bind="item.interests_description"
        class="d-form-control d-cursor-hand"></p>
        <p ng-if="!item.interests_description"
        class="d-form-control d-cursor-hand d-placeholder">Koppel hier het belang</p>
      </a>
      <p ng-if="item.status!='open'" class="d-cursor" ng-bind="item.interests_description"></p>
      @else
      <p class="d-cursor" ng-bind="item.interests_description" ></p>
      @endif
    </td>
    <!-- standpunt  -->
    <td>
      @if(!isset($isreadonly))
      <p ng-if="item.status=='open'" class="d-showfield" ng-click="editDialogField($index, $event)"
      ng-bind="item.standpoint"></p>
      <p ng-if="item.status!='open'" class="d-showfield d-cursor" ng-bind="item.standpoint"></p>
      <div class="d-editfield input-group-vertical">
        <textarea class="d-form-control-dashed d-editfield-input" rows="10"
        ng-model="editedItem.standpoint"
        ng-blur="saveDialogRow()">
        </textarea>
         <button ng-click="saveDialogRow()"
        class="btn pull-right d-btn-dialog mdl-button mdl-js-button mdl-button--raised"
         ><i class="material-icons">done</i>Opslaan</button>
      </div>
      @else
      <p class="d-showfield d-cursor" ng-bind="item.standpoint"></p>
      @endif
    </td>
    <td class="text-center">
      <a tabindex="0" data-toggle="modal" data-target="#sidebar-documents"
      data-id="### item.id ###"
      data-type="issuedialogs"
      data-showdocs="true"
      @if(isset($isreadonly)) data-isreadonly="true" @endif
      class="d-cursor-hand btn btn-xs" >
        <i class="material-icons">attach_file</i>
        <span class="badge bg-red d-icon-badge" ng-show="item.issuedialogs_documents.length > 0"  ng-bind="item.issuedialogs_documents.length">0</span>
      </a>
    </td>
    <td class="" >
      <!-- open -->
      <a ng-if="item.decisions_id == null && item.demands_guid == null" tabindex="0" data-info="### item ###" @if(!isset($isreadonly)) data-toggle="modal" data-target="#sidebar-status" @endif class="d-cursor-hand">
          <p>### item.status ###</p>
      </a>
      <!-- connected to decision -->
      <a ng-if="item.decisions_id != null" tabindex="0" data-info="### item ###" data-toggle="modal" data-target="#sidebar-wish" class="d-cursor-hand" @if(!isset($isreadonly)) data-enableremove="true" @endif>
          <p>Gekoppeld aan klantwens</p>
      </a>
      <!-- connected to decision -->
      <a ng-if="item.demands_guid != null" tabindex="0" data-info="### item ###" data-toggle="modal" data-target="#sidebar-demand" class="d-cursor-hand" @if(!isset($isreadonly)) data-enableremove="true" @endif>
          <p>Gekoppeld aan KES</p>
      </a>
    </a>
    </td>
    <td>
      <div class="btn-group">
        <a class="btn btn-xs" ng-click="getDialogHistoryRows(item.id, $index)" ng-show='!item.isHistory'
         title="Geschiedenis" data-toggle="tooltip" data-placement="top" tooltip>
          <i class="material-icons">history</i>
        </a>
        <a class="btn btn-xs" ng-click="getDialogHistoryRows(item.id, $index)" ng-show='item.isHistory'
        title="Huidig" data-toggle="tooltip" data-placement="top" tooltip>
          <i class="material-icons">list</i>
        </a>
        @if(!isset($isreadonly))
        <a class="btn btn-xs pull-right"
        title="Verwijder" data-toggle="tooltip" data-placement="top" tooltip
        ng-click="deleteIssueDialog(item.id)">
          <i class="material-icons">delete</i>
        </a>
        @endif
      </div>
    </td>
  </tr>
 <!--  <tr >
    <td colspan="6">adasd</td>
  </tr> -->
  @include('modules.issue.detail_dialog_row_history')
