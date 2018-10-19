@if (isset($issueCode))
  <div id="issue-dialog" class="tab-pane fade" ng-controller="issueDialogCtrl" ng-init="init('{{$issueCode}}')">
@else 
  <div id="issue-dialog" class="tab-pane fade" ng-controller="issueDialogCtrl" ng-init="init('')">
@endif 
  <div class="row">
    <div class="col-xs-12"> 
        <div class="col-xs-12 panel z-depth-2">
         <h4>Dialoog</h4>
         @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
          <div class="table-responsive">
        @else
         <div class="table-responsive" @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
        @endif
            <table class="table text-left table-condensed table-hover" data-pagelength="20" style="width: 100%">
                          <thead>
                            <tr>
                            
                              <th class="col-xs-1">Datum</th>  
                              <th class="col-xs-2">Stakeholder</th>
                              <th class="col-xs-2">Belang</th> 
                              <th class="col-xs-4">Standpunt</th> 
                              <th class="col-xs-1">Documenten</th>
                              <th class="col-xs-2">Status</th>
                              <th >Geschiedenis</th>
                            </tr>
                          </thead>
                          <tbody>
                            @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                              @include('modules.issue.detail_dialog_row') 
                            @else
                              @include('modules.issue.detail_dialog_row',array('isreadonly' => TRUE)) 
                            @endif                      
                          </tbody>
                           @if(!isset($isreadonly) && Helper::hasPermission('acl_issue_edit'))
                          <tfoot>
                              <!-- Add row -->
                              @include('modules.issue.detail_dialog_row_add')
                          </tfoot>
                          @endif
                  </table> 
                </div> 
              </div>     
          </div>
       </div>
     </div>