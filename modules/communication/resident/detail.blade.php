@extends('layouts.blank')

@section('main_container')

  @include('includes/topnavbar',array('url_back' => '../omwonenden'))

  <!-- The overlay -->
  <div id="residentoverlay" class="" ng-controller="residentMasterCtrl" ng-init="init('{{ $residentId or ''}}')">


    <!-- Overlay content -->
    <div class="overlay-content">
      <div class="row">
        <div class="col-xs-12">
          <!-- edit issue -->
          <div>
            <div class="col-xs-12 text-left">
              <h3 id="resident-name">
                <div class="loader"></div>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- tabs navigation -->
      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#algemeen">Algemeen</a></li>
        @if(isset($residentId))
          <li><a data-toggle="tab" href="#communicatie">Communicatie</a></li>
        @endif
      </ul>

      <div class="tab-content row col-xs-12">
        <!-- tab common -->
      @include('modules/communication/resident/tab_common')
      <!-- tab communication -->
        @if(isset($residentId))
          @include('modules/communication/resident/tab_communication')
        @endif
      </div>
    </div>


  </div>
  <!-- include modals -->
  @include('includes/modal_documents')

@endsection
