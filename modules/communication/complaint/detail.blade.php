@extends('layouts.blank')

@section('main_container')

@include('includes/topnavbar',array('url_back' => '../klachten'))

<!-- The overlay -->
<div id="complaintoverlay" class="" ng-controller="complaintMasterCtrl as ComplaintMaster" ng-init="init('{{$complaintId or ''}}')">
  <!-- Overlay content -->
  <div class="overlay-content">
    <div class="row">
      <div class="col-xs-12">
        <!-- edit issue -->
        <div>
          <div class="col-xs-12 text-left">
            <h3 id="complaint-name">
              <div ng-show="!$root.complaint.id && !$root.create" class="loader"></div>
              <span ng-show="$root.complaint.id" ng-class="page-title">###$root.complaint.final_logs_id?'(Afgehandeld) ':''#### ###$root.complaint.id### Gemeld door ###$root.complaint.complainant_name###</span>
              <span ng-show="$root.create">Nieuwe Melding</span>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- tabs navigation -->
    <ul class="nav nav-tabs">
      <li class="active"><a data-toggle="tab" href="#klacht" >Melding details</a></li>
    </ul>

    <div class="tab-content row col-xs-12">
      <!-- tab common -->
      @include('modules/communication/complaint/tab_common')
    </div>
  </div>

  <!-- include modals -->
  @include('includes/modal_documents')

@endsection
