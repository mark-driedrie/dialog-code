<div id="algemeen" class="tab-pane fade in active" ng-controller="complaintCtrl as Complaint"
     ng-init="init({{$complaintId}})">
  <div class="row">

    <!-- left column -->
    <div class="col-md-4 col-xs-12">

      <!-- New Complaint -->
      <form name="complaintForm" ng-submit="submitComplaint(complaintForm.$valid)" novalidate ng-show="!formData.id">
        <div class="panel z-depth-2 col-xs-12 text-left box-shadow">

          <h4 class="">Melder</h4>
          <!-- NAME -->
          <div class="form-group">
            <label for="name" class="control-label">Naam</label>
            <select for="complainant-select" name="name" data-placeholder="Koppel melder" required="">
              <option value=""></option>
            </select>
            <p ng-show="errors.name && errors.name == 'required'" class="d-error help-block">Naam is verplicht</p>
            <span class="d-error help-block" style="min-height: 50px; max-height: 100px;"> <i class="material-icons" style="padding-right: 10px; padding-top: 2px; min-height: 100%; float: left;"> info</i> <p style="display: block; margin-left: 35px;"> Bestaat de melder nog niet? Maak dan eerst een <a href="{{ url( $project->code.'/stakeholders' ) }}/create"> stakeholder</a> of <a href="{{ url( $project->code.'/omwonenden' ) }}/create"> omwonende/bedrijf</a> aan.</p></span>
          </div>

          <hr>

          <h4 class="">Melding</h4>

          <div class="form-group">
            <label for="date" class="control-label">Datum Melding</label>
            <input type="text" name="date" class="daterangepicker form-control" ng-model="complaint.date" required="" />
            <p ng-show="showRequired('complaintForm', 'date')" class="d-error help-block">Datum is verplicht</p>
          </div>

          <div class="form-group">
            <label for="text" class="control-label">Omschrijving Melding</label>
            <textarea type="text" class="form-control" name="text" placeholder="" rows="5"
                   ng-model="complaint.text"
                   ng-model-options="{updateOn: 'blur'}"
                   required="">
            </textarea>
            <p ng-show="showRequired('complaintForm', 'text')" class="d-error help-block">Omschrijving is verplicht</p>
          </div>

          <div class="form-group">
            <label for="theme" class="control-label">Thema Melding</label>
            <ui-select ng-model="complaint.complaintthemes_id" theme="bootstrap" sortable="true" close-on-select="true" search-enabled="true">
              <ui-select-match placeholder="Selecteer thema">### $select.selected.name ###</ui-select-match>
              <ui-select-choices repeat="theme.id as theme in complaintThemes | propsFilter: {name: $select.search}">
                <div ng-bind-html="theme.name | highlight: $select.search"></div>
              </ui-select-choices>
            </ui-select>
          </div>

          <hr>
          <div class="form-group">
            <label for="user" class="control-label">Verantwoordelijke(n)</label>
            <ui-select ng-model="complaint.user" theme="bootstrap" sortable="true" search-enabled="true">
              <ui-select-match placeholder="Selecteer verantwoordelijke(n)">### $select.selected.name ###</ui-select-match>
              <ui-select-choices repeat="user in users | propsFilter: {name: $select.search}">
                <div ng-bind-html="user.name | highlight: $select.search"></div>
              </ui-select-choices>
            </ui-select>
          </div>


          <!-- create buttons -->
          <div class="text-right btns-create">
            <a class="btn mdl-button mdl-js-button mdl-button--raised"
               ng-disabled="isDisabled"
               href="{{ url( $project->code.'/klachten' ) }}">
              <i class="material-icons">cancel</i>
              Annuleren
            </a>
            <button type="submit" class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised"
                    ng-disabled="isDisabled">
              <i class="material-icons">done</i>
              Opslaan
            </button>
          </div>
        </div>
      </form>

      <!-- EDIT Melder -->
      <form name="editComplaintForm" ng-submit="submitComplaint(editComplaintForm.$valid)" novalidate ng-show="formData.id">
        <div class="panel z-depth-2 col-xs-12 text-left box-shadow">
          <h4 class="">Melding</h4>

          <div class="form-group">
            <label for="date" class="control-label">Datum Melding</label>
            <input type="text" name="date" class="daterangepicker form-control" ng-model="complaint.date" ng-change="submitComplaint(editComplaintForm.$valid)" required="">
            <p ng-show="showRequired('editComplaintForm', 'date')" class="d-error help-block">Datum is verplicht</p>
          </div>

          <div class="form-group">
            <label for="text" class="control-label">Omschrijving Melding</label>
            <textarea type="text" class="form-control" name="text" placeholder=""
                   ng-model="complaint.text"
                   ng-change="submitComplaint(editComplaintForm.$valid)"
                   ng-model-options="{updateOn: 'blur'}"
                   required="">
            </textarea>
            <p ng-show="showRequired('editComplaintForm', 'text')" class="d-error help-block">Omschrijving is verplicht</p>
          </div>


          <div class="form-group">
            <label for="theme" class="control-label">Thema Melding</label>
            <ui-select ng-model="complaint.complaintthemes_id" theme="bootstrap" ng-disabled="" sortable="true" close-on-select="true" search-enabled="true"
              on-select="submitComplaint(editComplaintForm.$valid)" on-remove="submitComplaint(editComplaintForm.$valid)">
              <ui-select-match placeholder="Selecteer thema">### $select.selected.name ###</ui-select-match>
              <ui-select-choices repeat="theme.id as theme in complaintThemes | propsFilter: {name: $select.search}">
                <div ng-bind-html="theme.name | highlight: $select.search"></div>
              </ui-select-choices>
            </ui-select>
          </div>

          <hr>
          <h4 class="">Melder</h4>
          <!-- NAME -->
          <div class="form-group">
            <label for="name" class="control-label">Naam</label>
            <select for="complainant-select" name="name" required="">
              <option></option>
            </select>
            <p ng-show="errors.name && errors.name == 'required'" class="d-error help-block">Naam is verplicht</p>
          </div>

          <!-- ADRES -->
          <div class="form-group">
            <label for="address" class="control-label">Adres</label>
            <input disabled="" type="text" class="form-control" name="address" placeholder="" ng-model="complaint.complainant_address">
          </div>
          <!-- CITY -->
          <div class="form-group">
            <label for="city" class="control-label">Plaats</label>
            <input disabled="" type="text" class="form-control" name="city" placeholder="" ng-model="complaint.complainant_city">
          </div>
          <!-- ZIPCODE -->
          <div class="form-group">
            <label for="postcode" class="control-label">Postcode</label>
            <input disabled="" type="text" class="form-control" name="postcode" placeholder="" ng-model="complaint.complainant_postcode">
          </div>

          <!-- PHONE -->
          <div class="form-group">
            <label for="phone" class="control-label">Telefoonnummer</label>
            <input disabled="" type="text" class="form-control" name="phone" placeholder="" ng-model="complaint.complainant_phone">
          </div>

          <!-- EMAIL -->
          <div class="form-group">
            <label for="email" class="control-label">Email adres</label>
            <input disabled="" type="text" class="form-control" name="email" placeholder="" ng-model="complaint.complainant_email">
          </div>

          <a style="float:right;" ng-href="{{ url( $project->code ) }}### complaint.complainant_link ###"> ga naar melder </a> <br />

          <hr>
          <div class="form-group">
            <label for="user" class="control-label">Verantwoordelijke(n)</label>
            <ui-select ng-model="complaint.user" theme="bootstrap" sortable="true" search-enabled="true"
                       on-select="submitComplaint(editComplaintForm.$valid)" on-remove="submitComplaint(editComplaintForm.$valid)">
              <ui-select-match placeholder="Selecteer verantwoordelijke(n)">### $select.selected.name ###</ui-select-match>
              <ui-select-choices repeat="user in users | propsFilter: {name: $select.search}">
                <div ng-bind-html="user.name | highlight: $select.search"></div>
              </ui-select-choices>
            </ui-select>
          </div>
        </div>
      </form>

    </div>

    <!-- right column -->
    <div class="col-md-8 col-xs-12" ng-show="formData.id">
      <!--Log-->
      @include('modules/communication/complaint/_logs')
    </div>
  </div>
</div>
