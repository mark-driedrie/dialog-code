@extends('layouts.blank')

@section('main_container')

  <!-- add page title -->
  @include( "title" , ['title' => 'Communicatiekalender','subtitle' => 'Overzicht', 'calendarView'=> true])

  <div class="row" ng-controller="calendarOverviewCtrl" ng-init="init()">
    <div class="overlay-content">
    <div class=" row float-none col-xs-12 panel box-shadow z-depth-2 ">
              <div class="calender-header blue" style="background-color: #2E75B6;">Activiteiten</div> <div class="calender-header">Middelen </div>

      <div class="row col-xs-12 calender-wrapper">


        <section id="timeline">

          <div ng-if="calendarEntriesFiltered.length == 0" style="text-align: center">
            Nog geen middelen of activiteiten aangemaakt
          </div>
          <div ng-repeat="week in calendarEntriesFiltered">

            <div class="weeknr-wrapper">
              <div class="weeknr blue">
                <p>WK ### week.weekNumber ###</p>
                <span class="weeknr-date">
                  ### week.start.date ### - ### week.end.date ### ### week.end.month ### ### week.start.year###
                  <span ng-if="week.start.year2 != week.end.year2">/ ### week.end.year2 ###</span>
                </span>
              </div>
            </div>

            <div class="activity-card-wrapper">

              <div ng-repeat="entry in week.entry">

                <div ng-if="entry.type === 'activity'" class="activity-card" ng-class="entry.past ? 'past-card' : ''">
                  <div class="head" ng-if="entry.type === 'activity'">
                    <a ng-click="applyFilter(entry.id, entry.name)">
                      <i class="material-icons">filter_list</i>
                    </a>
                    <a ng-click="deleteActivity(entry.id)"><i class="material-icons">delete</i></a>
                    <h2>
                      <a data-toggle="modal" data-target="#modal-activity-detail" ng-click="loadActivityDetail(entry.id, entry.name, entry.edit_formatted_date)">
                        <span>### entry.name ###</span>
                      </a>
                    </h2>
                    <span class="activity-date">### entry.formatted_date ###</span>
                  </div>
                </div>
                <div ng-if="entry.type === 'middel'" class="activity-card resource-card" ng-class="entry.is_sent == 1 ? 'past-card' : ''">
                  <div class="head">
                    <span class="activity-date">### entry.formatted_date ###</span>
                    <h2>
                      <a href="{{ url( $project->code.'/middel' ) }}/### entry.id ###">
                        <span> ### entry.type ###</span>
                      </a>
                    </h2>
                    <span style="float: right;">
                      <i class="material-icons" ng-show="entry.is_sent && entry.is_sent == 1">check</i>
                      <a ng-click="deleteMiddel(entry.id)"><i class="material-icons">delete</i></a>
                    </span>
                  </div>
                  <div class="resource-content">
                    <div class="resource-item">Aan:</div>### entry.group ###<br />
                    <div class="resource-item">Bij activiteit </div>### entry.activities.name ###
                  </div>
                </div>

                <div ng-if="entry.type === 'now'" class="current-card">
                  <div id="current-date" after-render="scrollToCurrentDate"></div>
                  <div>Vandaag<br /> ### entry.formatted_date ### </div>
                </div>
              </div>

            </div> <!--activity-card-wrapper-->
          </div>

        </section>
      </div>
      </div>

      <!-- tabs navigation -->
    </div>
  </div>

@endsection
