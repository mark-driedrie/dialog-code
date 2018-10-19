@extends('layouts.blank')

@section('main_container')

  <!-- add page title -->
  @include( "title" , ['title' => 'Meldingen','subtitle' => 'Overzicht','addenabled'=> true])

  <div class="row" ng-controller="complaintOverviewMasterCtrl as ComplaintOverview">
    <div class="overlay-content">
      <ul class="nav nav-tabs">
        <li><a data-toggle="tab" href="#overzichtslijst" id="complaint-list">Overzichtslijst</a></li>
        <li class="active"><a data-toggle="tab" href="#overzichtskaart" ng-click="renderMap()">Overzichtskaart</a></li>
      </ul>

      <div class="tab-content row col-xs-12">
        <!-- tab list -->
        @include('modules/communication/complaint/overview_list')
        <!--tab map -->
        @include('modules/communication/complaint/overview_map')
      </div>
      <!-- tabs navigation -->
    </div>
  </div>
  <!-- Overlay content -->
</div>




@endsection
