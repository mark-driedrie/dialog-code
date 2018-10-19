@extends('layouts.blank')

@section('main_container')

  <?php $canAdd = Helper::hasPermission('acl_resident_edit') ?>
  <!-- add page title -->
  @include( "title" , ['title' => 'Omwonenden en bedrijven','subtitle' => 'Overzicht','addenabled'=> $canAdd])

  <div class="row" ng-controller="complaintOverviewMasterCtrl as ComplaintOverview">
    <div class="overlay-content">
      <ul class="nav nav-tabs">
        <li><a data-toggle="tab" href="#overzichtslijst" id="complaint-list">Overzichtslijst</a></li>
        <li class="active"><a data-toggle="tab" href="#overzichtskaart" ng-click="renderMap()">Overzichtskaart</a></li>
      </ul>

      <div class="tab-content row col-xs-12">
        <!-- tab list -->
      @include('modules/communication/resident/overview_list')
      <!--tab map -->
      @include('modules/communication/resident/overview_map')
      </div>
      <!-- tabs navigation -->
    </div>
  </div>

@endsection
