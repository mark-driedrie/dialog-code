<!--  example if you want to trigger this popup from a link
  <a 
  class="d-overlay-open d-cursor-hand" 
  data-toggle="modal"  
  data-target="#sidebar-issues" 
  data-id="### item.code ###"
  data-isreadonly="true">### item.name ###<a> -->

<!-- The overlay -->
<div class="modal right fade d-pageoverlay" id="sidebar-issues" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2"  >
  <!-- Overlay content -->
  <div class="overlay-content modal-dialog" ng-controller="issueMasterCtrl" ng-init="init()" role="document"> 
    <div class="modal-content">
    <div class="modal-header">
          <div class="col-xs-8 text-left">
           <h3 id="issue-name">
              <div class="loader"></div>
           </h3>
         </div> 
      <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
    <div class="modal-body"> 
  <!-- tabs navigation -->
  <ul class="nav nav-tabs">
    <li class="active"><a data-toggle="tab" href="#issue-algemeen">Algemeen</a></li>
    <li><a data-toggle="tab" href="#issue-dialog">Issue Dialoog</a></li>
  </ul>

  <div class="tab-content row col-xs-12">
      <!-- tab common -->
      @include('modules/issue/tab_common', array('isreadonly' => TRUE))
      <!-- tab dialog -->
      @include('modules/issue/tab_dialog', array('isreadonly' => TRUE))
  </div>
</div>
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
