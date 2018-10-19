<tr class="d-row-add">
  <form name="formDialogAdd" novalidate>
  <td colspan="3" class="d-row-input">
    <select id="dialog-stakeholder" name="dialog-stakeholder" data-placeholder="Koppel stakeholder" tabindex="1" class="input-search-row">
    <option></option>
    </select>
    <input id="dialogStakeholderVal" tabindex="1" type="hidden" required>
  </td>
  <td colspan="3">
    <input class="form-control col-xs-12 d-form-control-dashed d-add-row-input" type="text" ng-model="formDialogRowData.standpoint" placeholder="en voeg een standpunt toe..." required tabindex="2">
  </td>
  <td colspan="1" class="text-right" >
    <button class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised col-xs-12"
     ng-click="addDialogRow()" tabindex="3">
      <i class="material-icons">done</i>
      Toevoegen
    </button>
  </td>
  </form>
</tr>
