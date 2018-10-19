<!-- History rows -->
<tr id="### item.id ###" ng-repeat-end ng-repeat="itemHistory in item.histories | filter:{ id : item.id }"
ng-class="($index == 0) ? 'first-row': ($index == item.histories.length-1) ? 'last-row' : ''"
 class="d-row-history-mode animate-show-hide" ng-show='item.isHistory'>
  <td class="disabled_input">
    <p class="d-cursor">### itemHistory.created_at| DialogDateFormat ###</p>
  </td>
  <td class="disabled_input">
    <p class="d-cursor">### itemHistory.stakeholders_name ###</p>
  </td>
  <td>
    <p class="d-cursor">### itemHistory.interests_description ###</p>
  </td>
  <td>
    <p class="d-cursor">### itemHistory.standpoint ###</p>
  </td>
   <td class="text-center">
    <a tabindex="0" data-toggle="modal" data-target="#sidebar-documents"
    data-id="### item.id ###" data-type="issuedialogs" data-isreadonly="true" data-showdocs="true" class="d-cursor-hand btn btn-xs" >
        <i class="material-icons">attach_file</i>
        <span class="badge bg-red d-icon-badge" ng-show="item.issuedialogs_documents.length > 0"  ng-bind="item.issuedialogs_documents.length">0</span>
      </a>
  </td>
  <td class="">
      <p ng-if="itemHistory.decisions_id == null && itemHistory.demands_guid == null" class="d-cursor">
        ### itemHistory.status ###
      </p>
      <a ng-if="itemHistory.decisions_id != null" tabindex="0" data-info="### itemHistory ###" data-toggle="modal" data-target="#sidebar-wish" class="d-cursor-hand">
          <p>Gekoppeld aan klantwens</p>
      </a>
      <a ng-if="itemHistory.demands_guid != null" tabindex="0" data-info="### itemHistory ###" data-toggle="modal" data-target="#sidebar-demand" class="d-cursor-hand">
          <p>Gekoppeld aan KES</p>
      </a>
  </td>
  <td>

  </td>
</tr>
