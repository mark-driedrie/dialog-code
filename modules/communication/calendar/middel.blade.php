@extends('layouts.blank')

@section('main_container')
  @include('includes/topnavbar',array('url_back' => '../communicatiekalender'))
  <div id="middelOverlay" ng-controller="middelCtrl" ng-init="init({{ $middelId }})">
    <div class="row">
      <div class="col-xs-12">
        <div>
          <div class="col-xs-12 text-left">
            <h3>Middel {{ $middelId }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- left col -->
    <div class="col-md-6 col-xs-12" >
      <form name="middelForm" ng-submit="updateMiddel()" novalidate>
        <div class="panel z-depth-2 col-xs-12 text-left box-shadow">
          <div class="form-group">
            <label for="activities" class="control-label">Koppel aan activiteit</label>
            <select name="activities" data-placeholder="Koppel aan activiteit" required="">
              <option></option> <!-- Added empty option for select2's placeholder -->
              <option ng-repeat="activity in activities" value="### activity.id ###" ng-selected="activity.id === middel.activities_id">
                ### activity.name ### (### activity.formatted_date ###)
              </option>
            </select>
            <p ng-show="checkForm('activities')" class="d-error help-block">Activiteit is verplicht</p>
          </div>
          <div class="form-group">
            <label for="type" class="control-label">Type middel</label>
            <input type="text" class="form-control" name="type"
              ng-change="updateMiddel()"
              ng-model="middel.type"
              ng-model-options="{updateOn: 'blur'}"
              required="">
            <p ng-show="checkForm('type')" class="d-error help-block">Type is verplicht</p>
          </div>
          <div class="form-group">
            <label for="group" class="control-label">Doelgroep(en)</label>
            <input type="text" class="form-control" name="group"
              ng-change="updateMiddel()"
              ng-model="middel.group"
              ng-model-options="{updateOn: 'blur'}"
              required="" />
            <p ng-show="checkForm('group')" class="d-error help-block">Doelgroep is verplicht</p>
          </div>
          <div class="form-group">
            <label for="sent_date" class="control-label">Datum te verzenden</label>

            <div>
              <input type="text" name="sent_date" class="daterangepicker form-control middel-datepicker" ng-change="updateMiddel()" ng-model="middel.formatted_sent_date" ng-disabled="middel.is_sent && middel.is_sent == 1" />
              <label class="switch">
                <input type="checkbox" name="is_sent" ng-model="middel.is_sent" ng-checked="middel.is_sent == 1" ng-true-value="1" ng-false-value="0" ng-change="updateMiddel()">
                <span class="slider">
                  <div class="sent-txt">Verzonden</div>
                  <div class="to-be-sent-txt">Te verzenden</div>
                </span>
              </label>
            </div>

          </div>

          <div class="form-group">
            <label for="user" class="control-label">Verantwoordelijke(n)</label>
            <ui-select ng-model="middel.user" theme="bootstrap" sortable="true" search-enabled="true"
              on-select="updateMiddel()" on-remove="updateMiddel()">
              <ui-select-match placeholder="Selecteer verantwoordelijke(n)">### $select.selected.name ###</ui-select-match>
              <ui-select-choices repeat="user in users | propsFilter: {name: $select.search}">
                <div ng-bind-html="user.name | highlight: $select.search"></div>
              </ui-select-choices>
            </ui-select>
          </div>


          <div class="form-group">
            <label for="file" class="control-label">Documenten</label>
            <div>
              <div class="list-group">
                <a data-toggle="modal" data-id="{{ $middelId }}" data-type="middel"
                  data-target="#sidebar-documents" class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised">
                  {{ trans('dialog.upload_documents') }}
                </a>
              </div>
            </div>
          </div>
          <!-- DOCS OVERVIEW -->
          <div class="form-group">
            <div ng-if="!isLoaded">
              <ul class="list-group">
                <li class="list-group-item">
                  <span><div class="loader"></div> Laden...</span>
                </li>
              </ul>
            </div>
            <div ng-if="isLoaded">
              <ul class="list-group" ng-show="!!!middel.middel_documents.length">
                <li class="list-group-item">
                  <span>Geen Documenten</span>
                </li>
              </ul>
              <ul class="list-group" ng-show="!!middel.middel_documents.length">
                <li class="list-group-item" ng-repeat="doc in middel.middel_documents">
                  <span>
                    <a href="### doc.link ###" target="_blank" ng-bind="doc.display_name | limitTo: 25"></a>
                    <span ng-if="doc.display_name.length > 25">...</span>
                  </span>
                  <i ng-click="removeDocument($index, doc.id)" class="material-icons pull-right d-cursor-hand">delete</i>
                </li>
              </ul>
            </div>
          </div>


        </div>
      </form>
    </div>

    <!-- right col -->
    <div class="col-md-6 col-xs-12" ng-controller="middelMapCtrl as MiddelMap" ng-init="initMap('{{ Helper::getConfig('default_map') }}')">
      ### polygon.name ###
      <openlayers width="100%"></openlayers>

      <div class="button-container">
        <input class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised" type="button" ng-click="saveCoordinates()" value="Opslaan" />
        <input class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised" type="button" ng-click="clearCoordinates()" value="Verwijder" />
        <input class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised" type="button" ng-click="exportAddresses()" ng-disabled="selectedAddressCount == 0 || exportDisabled" ng-value="exportDisabled ? 'Laden...' : 'Export adressen'" />
      </div>
      <label>Aantal adressen geselecteerd: ### selectedAddressCount ###</label>
    </div>
  </div>

  @include('includes/modal_documents')
@endsection
