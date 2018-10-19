<div id="issue-algemeen" class="tab-pane fade in active" ng-controller="issueCtrl" ng-init="init('{{$issueCode or ''}}')">
  <div class="row">
    <form name="issueForm" @if(!isset($isreadonly)) ng-submit="issueSubmit(issueForm.$valid)" @endif novalidate>
      <!-- left column -->
      <div class="col-md-7 col-xs-12">
        <!-- NEW Algemeen -->
        <div class="panel z-depth-2 col-xs-12 text-left box-shadow" ng-show="isNew">
          <h4 class="marginbottom15">Issue details</h4>
          <div class="">
            <div class="form-group"
                 ng-class="{ 'has-error' : issueForm.issues_date.$invalid && !issueForm.issues_date.$pristine }">
              <label for="issues_date" class=" control-label">Datum</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <input type="text" class="daterangepicker form-control" id="issues_date" name="issues_date"
                         ng-model="formData.issues_date"
                         required>
                  <p ng-show="(issueForm.issues_date.$dirty || submitted) && issueForm.issues_date.$error.required"
                     class="help-block">Datum is verplicht</p>
                @else
                  <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                  <input type="text" class="daterangepicker form-control" id="issues_date" name="issues_date"
                         ng-model="formData.issues_date" disabled="">
              </span>
                @endif
              </div>
            </div>
            <div class="form-group"
                 ng-class="{ 'has-error' : issueForm.name.$invalid && !issueForm.name.$pristine }">
              <label for="name" class="control-label">Issue</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <input type="text" class="form-control" id="name" name="name"
                         ng-model="formData.name"
                         ng-model-options="{updateOn: 'blur'}" required>
                  <p ng-show="(issueForm.name.$dirty || submitted) && issueForm.name.$error.required"
                     class="help-block">Issue is verplicht</p>
                @else
                  <input type="text" class="form-control" id="name" name="name" ng-model="formData.name" disabled="">
                @endif
              </div>
            </div>
            <div class="form-group">
              <label for="description" class="control-label">Omschrijving</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <textarea name="description" class="form-control d-textarea-sm" id="description" cols="30" rows="8"
                            ng-model="formData.description"
                            ng-model-options="{updateOn: 'blur'}"></textarea>
                @else
                  <textarea name="description" class="form-control d-textarea-sm" id="description" cols="30" rows="8"
                            ng-model="formData.description"
                            disabled=""></textarea>
                @endif
              </div>
            </div>
            <div class="form-group">
              <label for="rationale" class="control-label">Redeneerlijn</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <textarea name="rationale" class="form-control d-textarea-sm" id="rationale" cols="30" rows="8"
                            ng-model="formData.rationale"
                            ng-model-options="{updateOn: 'blur'}"></textarea>
                @else
                  <textarea name="rationale" class="form-control d-textarea-sm" id="rationale" cols="30" rows="8"
                            ng-model="formData.rationale"
                            disabled=""></textarea>
                @endif
              </div>
            </div>
          </div>
          <!-- create buttons -->
          <div class="text-right btns-create">
            <a class="btn mdl-button mdl-js-button mdl-button--raised"
               ng-disabled="isDisabled"
               href="{{ url( $project->code.'/issues' ) }}">
              <i class="material-icons">cancel</i>
              Annuleren
            </a>
            <button type="submit" class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised"
                    ng-disabled="isDisabled">
              <i class="material-icons">done</i>
              Opslaan
            </button>
          </div>

        </div>
        <!-- EDIT Algemeen  -->
        <div class="panel z-depth-2 col-xs-12 text-left box-shadow" ng-show="!isNew">
          <h4 class="marginbottom15">Issue details</h4>
          <div class="">
            <div class="form-group">
              <label for="id" class="control-label">ID</label>
              <div class="">
                <input disabled="" type="text" class="form-control" id="id" placeholder="" ng-model="formData.code">
              </div>
            </div>
            <div class="form-group"
                 ng-class="{ 'has-error' : issueForm.issues_date.$invalid && !issueForm.issues_date.$pristine }">
              <label for="issues_date" class=" control-label">Datum</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <input type="text" class="daterangepicker form-control" id="issues_date" name="issues_date"
                         ng-model="formData.issues_date"
                         ng-change="issueSubmit(issueForm.$valid)" required>
                  <p ng-show="(issueForm.issues_date.$dirty || submitted) && issueForm.issues_date.$error.required"
                     class="help-block">Datum is verplicht</p>
                @else
                  <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
              <input type="text" class="daterangepicker form-control" id="issues_date" name="issues_date"
                     ng-model="formData.issues_date" disabled="">
              </span>
                @endif
              </div>
            </div>
            <div class="form-group"
                 ng-class="{ 'has-error' : issueForm.name.$invalid && !issueForm.name.$pristine }">
              <label for="name" class="control-label">Issue</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <input type="text" class="form-control" id="name" name="name"
                         ng-model="formData.name"
                         ng-change="issueSubmit(issueForm.$valid)"
                         ng-model-options="{updateOn: 'blur'}" required>
                  <p ng-show="(issueForm.name.$dirty || submitted) && issueForm.name.$error.required"
                     class="help-block">Issue is verplicht</p>
                @else
                  <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                    <input type="text" class="form-control" id="name" name="name" ng-model="formData.name" disabled="">
                  </span>
                @endif
              </div>
            </div>
            <div class="form-group">
              <label for="description" class="control-label">Omschrijving</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <textarea name="description" class="form-control d-textarea-sm" id="description" cols="30" rows="8"
                            ng-model="formData.description"
                            ng-change="issueSubmit(issueForm.$valid)"
                            ng-model-options="{updateOn: 'blur'}"></textarea>
                @else
                  <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
              <textarea name="description" class="form-control d-textarea-sm" id="description" cols="30" rows="8"
                        ng-model="formData.description"
                        disabled=""></textarea>
              </span>
                @endif
              </div>
            </div>
            <div class="form-group">
              <label for="rationale" class="control-label">Redeneerlijn</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <textarea name="rationale" class="form-control d-textarea-sm" id="rationale" cols="30" rows="8"
                            ng-model="formData.rationale"
                            ng-change="issueSubmit(issueForm.$valid)"
                            ng-model-options="{updateOn: 'blur'}"></textarea>
                @else
                  <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                    <textarea name="rationale" class="form-control d-textarea-sm" id="rationale" cols="30" rows="8"
                              ng-model="formData.rationale"
                              disabled="">

                    </textarea>
                  </span>
                @endif
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- right column -->
      <div class="col-md-5 col-xs-12" ng-show="!isNew">

        <div class="panel z-depth-2 col-xs-12 text-left box-shadow">
          <h4 class="marginbottom15">Issue status</h4>
          <div>
            <div class="form-group">
              <label for="file" class="control-label">Documenten</label>
              <div>
                <div class="list-group">
                  <a data-toggle="modal" data-id="### formData.code ###" data-type="issues"
                    data-target="#sidebar-documents"
                    @if(isset($isreadonly) || !Helper::hasPermission('acl_issue_edit')) data-isreadonly="true" @endif
                    class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised">
                    {{ trans('dialog.upload_documents') }}
                  </a>
                </div>
              </div>
            </div>
            <!-- DOCS OVERVIEW -->
            <div class="form-group">
              <div ng-if="!isIssueDocsLoaded">
                <ul class="list-group">
                  <li class="list-group-item">
                    <span><div class="loader"></div> Laden...</span>
                  </li>
                </ul>
              </div>
              <div ng-if="isIssueDocsLoaded">
                <ul class="list-group" ng-show="!!!issueDocs.length">
                  <li class="list-group-item">
                    <span>Geen Documenten</span>
                  </li>
                </ul>
                <ul class="list-group" ng-show="!!issueDocs.length">
                  <li class="list-group-item" ng-repeat="doc in issueDocs">
                    <span>
                      <a href="### doc.link ###" target="_blank" ng-bind="doc.display_name | limitTo: 25"></a>
                      <span ng-if="doc.display_name.length > 25">...</span>
                    </span>
                    <i ng-click="removeIssueDoc($index,formData.code,doc.id)"
                      class="material-icons pull-right d-cursor-hand">delete</i>
                  </li>
                </ul>
              </div>
            </div>


            <div class="form-group">
              <label for="date" class="control-label">Urgentie</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <div class="btn-group">
                    <label class="btn btn-default" ng-model="formData.urgency"
                           ng-class="{'active':formData.urgency=='laag'}" uib-btn-radio="'laag'"
                           ng-click="issueSubmit(issueForm.$valid)">Laag</label>
                    <label class="btn btn-default" ng-model="formData.urgency"
                           ng-class="{'active':formData.urgency=='midden'}" uib-btn-radio="'midden'"
                           ng-click="issueSubmit(issueForm.$valid)">Midden</label>
                    <label class="btn btn-default" ng-model="formData.urgency"
                           ng-class="{'active':formData.urgency=='urgent'}" uib-btn-radio="'urgent'"
                           ng-click="issueSubmit(issueForm.$valid)">Urgent</label>
                  </div>
                @else
                  <div class="btn-group" @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                    <label class="btn btn-default" ng-model="formData.urgency"
                           ng-class="{'active':formData.urgency=='laag'}" uib-btn-radio="'laag'"
                           disabled>Laag</label>
                    <label class="btn btn-default" ng-model="formData.urgency"
                           ng-class="{'active':formData.urgency=='midden'}" uib-btn-radio="'midden'"
                           disabled>Midden</label>
                    <label class="btn btn-default" ng-model="formData.urgency"
                           ng-class="{'active':formData.urgency=='urgent'}" uib-btn-radio="'urgent'"
                           disabled>Urgent</label>
                  </div>
                @endif
              </div>
            </div>
            <div class="form-group">
              <label for="name" class="control-label">Status</label>
              <div class="">
                @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                  <div class="btn-group">
                    <label class="btn btn-default" ng-model="formData.issues_status"
                           ng-class="{'active':formData.issues_status=='open'}" uib-btn-radio="'open'"
                           ng-click="issueSubmit(issueForm.$valid)">Open</label>
                    <label class="btn btn-default" ng-model="formData.issues_status"
                           ng-class="{'active':formData.issues_status=='gesloten'}" uib-btn-radio="'gesloten'"
                           ng-click="issueSubmit(issueForm.$valid)">Gesloten</label>
                  </div>
                @else
                  <div class="btn-group" @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                    <label class="btn btn-default" ng-model="formData.issues_status"
                           ng-class="{'active':formData.issues_status=='open'}" uib-btn-radio="'open'"
                           disabled>Open</label>
                    <label class="btn btn-default" ng-model="formData.issues_status"
                           ng-class="{'active':formData.issues_status=='gesloten'}" uib-btn-radio="'gesloten'"
                           disabled>Gesloten</label>
                  </div>
                @endif
              </div>
            </div>

            <div class="form-group">
              <label for="type" class="control-label">Verantwoordelijke(n)</label>
              @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                <ui-select uiselectplaceholderfix multiple ng-model="formData.users" theme="bootstrap" ng-disabled=""
                           sortable="true" close-on-select="false" search-enabled="true"
                           on-select="issueSubmit(issueForm.$valid)" on-remove="issueSubmit(issueForm.$valid)">
                  <ui-select-match placeholder="Selecteer verantwoordelijke(n)">### $item.name ###</ui-select-match>
                  <ui-select-choices repeat="user in formData.allUsers | propsFilter: {name: $select.search}">
                    <div ng-bind-html="user.name | highlight: $select.search"></div>
                  </ui-select-choices>
                </ui-select>
              @else
                <ui-select uiselectplaceholderfix multiple ng-model="formData.users" theme="bootstrap"
                           ng-disabled="true" sortable="true" close-on-select="false">
                  <ui-select-match placeholder="Selecteer verantwoordelijke(n)">### $item.name ###</ui-select-match>
                  <ui-select-choices repeat="user in formData.allUsers">
                    <div ng-bind-html="user.name | highlight: $select.search"></div>
                  </ui-select-choices>
                </ui-select>
              @endif
            </div>

          </div>
        </div>
      </div>
      <input type="submit" id="submit" value="Submit" class="hidden"/>
    </form>
  </div>


</div>
