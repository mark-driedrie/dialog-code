@extends('layouts.blank')

@section('main_container')
<div ng-controller="issuesCtrl as Issues">

<!-- user can only add new if has edit rights -->
<?php $canAdd = FALSE; ?>
@if(Helper::hasPermission('acl_issue_edit'))
 <?php $canAdd = TRUE; ?>
@endif
<!-- page title -->
@include( "title" , array('title' => 'Issues','subtitle' => 'Overzicht', 'addenabled' => $canAdd, 'historyenabled' => TRUE))
    <div class="panel z-depth-2 col-xs-12 text-left box-shadow" >
      <br>
      <div class="table-responsive">
      <div ng-if="!isLoaded">
        <div class="loader"></div><span> Laden ...</span>
      </div>
      <table  datatable="ng"
      ng-show="isLoaded"
      class="table table-hover"
      ng-init="getAll('open','urgency')" id="issuetable"
      dt-options="Issues.dtOptions"
      dt-column-defs="Issues.dtColumnDefs"
      dt-instance="Issues.dtInstance"
      style="width:100%">
              <thead>
                <tr>
                  <th class="col-xs-1">#</th>
                  <th class="col-xs-4">Issue</th>
                  <th class="col-xs-6">Omschrijving</th>
                  <th class="col-xs-1">Urgentie</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr ng-repeat="item in Issues.items">
                  <td ng-bind="item.code"></td>
                  <td><a href="{{ url( $project->code.'/issues' ) }}/### item.code ###"
                  ng-bind="item.name"></a></td>
                  <td ng-bind="item.description"></td>
                  <td ng-bind="item.urgency"></td>
                  <td>
                    <a class="btn btn-xs pull-right"
                    title="Verwijder" data-toggle="tooltip" data-placement="top" tooltip
                    ng-click="deleteIssue($index,item.code)">
                      <i class="material-icons">delete</i>
                    </a>
                  </td>
                </tr>
          </tbody>
      </table>

    </div>
  </div>
@endsection
