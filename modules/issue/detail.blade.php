@extends('layouts.blank')

@section('main_container')

  <!-- The overlay -->
  @include('includes/topnavbar',array('url_back' => '../issues'))
  <div id="issueoverlay" ng-controller="issueMasterCtrl" ng-init="init('{{ $issueCode or ''}}')">

    <!-- Overlay content -->
    <div class="overlay-content">
      <div class="row">
        <div class="col-xs-12">
          <!-- edit issue -->
          <div>
            <div class="col-xs-12 text-left">
              <h3 id="issue-name">
                <div class="loader"></div>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <!-- tabs navigation -->
      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#issue-algemeen">Algemeen</a></li>
        <li><a ng-show="formData.code" data-toggle="tab" href="#issue-dialog">Dialoog</a></li>
      </ul>

      <div class="tab-content row col-xs-12">
        <!-- tab common -->
      @include('modules/issue/tab_common')
      <!-- tab dialog -->
        @include('modules/issue/tab_dialog')
      </div>
    </div>
  </div>
  <!-- include modals -->
  @include('includes/modal_documents')
  @include('includes/modal_interests')
  @include('includes/modal_status')
  @if(Helper::hasModule('relatics'))
    @include('includes/modal_demand')
  @endif
  @include('includes/modal_wish')

@endsection
