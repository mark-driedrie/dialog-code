<div id="communicatie" class="tab-pane fade in" ng-controller="residentCommunicationCtrl as Communication" ng-init="init(formData.id)">
  <div class="row">

    <!-- left column -->
    <div class="col-md-6 col-xs-12">
      <div class="panel z-depth-2 col-xs-12 text-left box-shadow">

        <div class="panel-heading">
          <div class="row">
            <h2 class="col-md-6 col-xs-12">Meldingen</h2>
          </div>
        </div>
        <div class="panel-body">

          <div class="table-responsive">

            <table class="table table-hover ng-isolate-scope no-footer dataTable">

              <thead>
                <tr role="row">
                  <th class="col-xs-4">Datum</th>
                  <th class="col-xs-4">Klachten</th>
                  <th class="col-xs-3">Oplossing</th>
                  <th class="col-xs-3">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr ng-repeat="item in Communication.complaints.items">
                  <td class="d-cursor">
                    <span ng-bind="item.formatted_date"></span>
                  </td>

                  <td class="d-cursor">
                    <a href="{{ url( $project->code.'/klachten' ) }}/### item.id ###" ng-bind="item.text"></a>
                  </td>

                  <td class="d-cursor">
                    <span ng-bind="item.final_logs.description"></span>
                  </td>

                  <td class="d-cursor">
                    <span ng-bind="item.final_logs?'Afgehandeld':'Open'"></span>
                  </td>

                </tr>
              </tbody>
            </table>

          </div>
        </div>

      </div>
    </div>


    <!-- right column -->
    <div class="col-md-6 col-xs-8">
      <div class="panel z-depth-2 col-xs-12 text-left box-shadow">

        <div class="panel-heading">
          <div class="row">
            <h2 class="col-md-6 col-xs-12">Middelen</h2>
          </div>
        </div>
        <div class="panel-body">

          <div class="table-responsive">

            <table class="table table-hover ng-isolate-scope no-footer dataTable">

              <thead>
                <tr>
                  <th class="col-xs-3">Datum</th>
                  <th class="col-xs-4">Middel</th>
                  <th class="col-xs-3">Activiteit</th>
                  <th class="col-xs-2">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr ng-repeat="item in Communication.middel.items">
                  <td class="d-cursor">
                    <span>### item.formatted_date ###</span>
                  </td>

                  <td>
                    <span>
                      <a href="{{ url( $project->code ) }}/middel/### item.id ###">### item.type ###</a>
                    </span>
                  </td>

                  <td class="d-cursor">
                    <span>### item.activities.name ###</span>
                  </td>

                  <td class="d-cursor">
                    <span>
                      <container ng-if="item.is_sent">
                        Verzonden
                      </container>
                      <container ng-if="!item.is_sent">
                        Te verzenden
                      </container>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div> <!--panel-body -->

      </div>
    </div>

  </div>
</div>
