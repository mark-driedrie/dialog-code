<div id="algemeen" class="tab-pane fade in active" ng-controller="residentCtrl as Resident" ng-init="init(formData.id)">
  <div class="row">

    <!-- left column -->
    <div class="col-md-4 col-xs-12">

      <!-- NEW Algemeen -->
      <form name="residentForm" ng-submit="submitResident(residentForm.$valid)" novalidate ng-show="!formData.id">
        <div class="panel z-depth-2 col-xs-12 text-left box-shadow">
          <h4 class="">Algemeen</h4>
          <!-- NAME -->
          <div class="form-group" ng-class="{ 'has-error' : residentForm.name.$invalid && !residentForm.name.$pristine }">
            <label for="name" class="control-label">Naam</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="name" placeholder=""
                     ng-model="formData.name"
                     ng-model-options="{updateOn: 'blur'}"
                     required="">
              <p ng-show="(residentForm.name.$dirty || submittedResident) && residentForm.name.$error.required" class="d-error help-block">Naam is verplicht</p>
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                <input type="text" class="form-control" name="name" placeholder="" ng-model="formData.name" disabled="">
              </span>
            @endif
          </div>

          <!-- PHONE -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.phone.$invalid && !residentForm.phone.$pristine }">
            <label for="phone" class="control-label">Telefoonnummer</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="phone" placeholder=""
                     ng-model="formData.phone"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                <input type="text" class="form-control" name="phone" placeholder="" ng-model="formData.phone" disabled="">
              </span>
            @endif
          </div>

          <!-- EMAIL -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.email.$invalid && !residentForm.email.$pristine }">
            <label for="email" class="control-label">Email adres</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="email" placeholder=""
                     ng-model="formData.email"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
                <input type="text" class="form-control" name="email" placeholder="" ng-model="formData.email" disabled="">
              </span>
            @endif
          </div>

          <!-- TYPE -->
          <div class="form-group">
            <label for="type" class="control-label">Type</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <ui-select name="type" ng-model="formData.type" theme="bootstrap" ng-disabled="" sortable="true"
                         close-on-select="true" search-enabled="true" ui-select-required>
                <ui-select-match placeholder="Selecteer type">### $select.selected.name ###</ui-select-match>
                <ui-select-choices repeat="type in formData.allTypes | propsFilter: {name: $select.search}">
                  <div ng-bind-html="type.name | highlight: $select.search"></div>
                </ui-select-choices>
              </ui-select>
              <p ng-show="submittedResident && residentForm.$error.uiSelectRequired"
                 class="d-error help-block">Type is verplicht</p>
            @else
              <ui-select ng-model="formData.type" theme="bootstrap" ng-disabled="true" sortable="true"
                         close-on-select="true">
                <ui-select-match placeholder="Selecteer type">### $item.name ###</ui-select-match>
                <ui-select-choices repeat="type in formData.allTypes">
                  <div ng-bind-html="type.name | highlight: $select.search"></div>
                </ui-select-choices>
              </ui-select>
            @endif
          </div>

          <hr>
          <h4>Contactgegevens</h4>
          <!-- GOOGLE MAPS HINT -->
          @if(Helper::hasPermission('acl_resident_edit'))
            <div class="form-group">
              <div class="input-group">
                <label for="address" class="control-label">Zoek adres via Google Maps</label>
                <input class="form-control" autocomplete="off" ng-model="formData.looupAddress" googleplace/>
                <span class="input-group-btn">
                  <button class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised" type="button" style="margin-top: 22px;">
                    <i class="material-icons">done</i>
                  </button>
                </span>
              </div>
              <p ng-show="errors.address && errors.address == 'validation.unique_resident_address'" class="d-error help-block">Adres bestaat al</p>
            </div>
          @endif

          <!-- ADRES -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.address.$invalid && !residentForm.address.$pristine }">
            <label for="address" class="control-label">Adres</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="address" placeholder=""
                     ng-model="formData.address"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <input type="text" class="form-control" name="address" placeholder="" ng-model="formData.address"
                     disabled="">
            @endif
          </div>
          <!-- CITY -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.city.$invalid && !residentForm.city.$pristine }">
            <label for="city" class="control-label">Plaats</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="city" placeholder=""
                     ng-model="formData.city"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <input type="text" class="form-control" name="city" placeholder="" ng-model="formData.city" disabled="">
            @endif
          </div>
          <!-- ZIPCODE -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.postcode.$invalid && !residentForm.postcode.$pristine }">
            <label for="postcode" class="control-label">Postcode</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="postcode" placeholder=""
                     ng-model="formData.postcode"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <input type="text" class="form-control" name="postcode" placeholder="" ng-model="formData.postcode"
                     disabled="">
            @endif
          </div>
          <!-- Longitude and latitude -->
          <div class="row form-group hidden">
            <div class="col-xs-6">
              <label for="latitude " class="control-label">Latitude</label>
              @if(Helper::hasPermission('acl_resident_edit'))
                <input type="text" class="form-control" name="latitude" placeholder=""
                       ng-model="formData.latitude"
                       ng-model-options="{updateOn: 'blur'}">
              @else
                <input type="text" class="form-control" name="latitude" placeholder="" ng-model="formData.latitude"
                       disabled="">
              @endif
            </div>
            <div class="col-xs-6">
              <label for="postcode" class="control-label">Longitude</label>
              @if(Helper::hasPermission('acl_resident_edit'))
                <input type="text" class="form-control" name="longitude" placeholder=""
                       ng-model="formData.longitude"
                       ng-model-options="{updateOn: 'blur'}">
              @else
                <input type="text" class="form-control" name="longitude" placeholder="" ng-model="formData.longitude"
                       disabled="">
              @endif
            </div>
          </div>

          <!-- create buttons -->
          <div class="text-right btns-create">
            <a class="btn mdl-button mdl-js-button mdl-button--raised"
               ng-disabled="isDisabled"
               href="{{ url( $project->code.'/omwonenden' ) }}">
              <i class="material-icons">cancel</i>
              Annuleren
            </a>
            @if(Helper::hasPermission('acl_resident_edit'))
              <button type="submit" class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised"
                      ng-disabled="isDisabled">
                <i class="material-icons">done</i>
                Opslaan
              </button>
            @endif
          </div>
        </div>
      </form>

      <!-- EDIT Algemeen -->
      <form name="residentForm" ng-submit="submitResident(residentForm.$valid)" novalidate ng-show="formData.id">
        <div class="panel z-depth-2 col-xs-12 text-left box-shadow">
          <h4 class="">Algemeen</h4>
          <!-- NAME -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.name.$invalid && !residentForm.name.$pristine }">
            <label for="name" class="control-label">Naam</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="name" placeholder=""
                     ng-model="formData.name"
                     ng-change="submitResident(residentForm.$valid)"
                     ng-model-options="{updateOn: 'blur'}"
                     required="">
              <p ng-show="(residentForm.name.$dirty || submittedResident) && residentForm.name.$error.required"
                 class="d-error help-block">Naam is verplicht</p>
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
            <input type="text" class="form-control" name="name" placeholder="" ng-model="formData.name" disabled="">
          </span>
            @endif
          </div>

          <!-- PHONE -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.phone.$invalid && !residentForm.phone.$pristine }">
            <label for="phone" class="control-label">Telefoonnummer</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="phone" placeholder=""
                     ng-model="formData.phone"
                     ng-change="submitResident(residentForm.$valid)"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
            <input type="text" class="form-control" name="phone" placeholder="" ng-model="formData.phone" disabled="">
          </span>
            @endif
          </div>

          <!-- EMAIL -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.email.$invalid && !residentForm.email.$pristine }">
            <label for="email" class="control-label">Email adres</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="email" placeholder=""
                     ng-model="formData.email"
                     ng-change="submitResident(residentForm.$valid)"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
            <input type="text" class="form-control" name="email" placeholder="" ng-model="formData.email" disabled="">
          </span>
            @endif
          </div>

          <!-- TYPE -->
          <div class="form-group">
            <label for="type" class="control-label">Type</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <ui-select ng-model="formData.type" theme="bootstrap" ng-disabled="" sortable="true"
                         close-on-select="true" search-enabled="true"
                         on-select="submitResident(residentForm.$valid)" on-remove="submitResident(residentForm.$valid)"
                         ui-select-required="true">
                <ui-select-match placeholder="Selecteer type">### $select.selected.name ###</ui-select-match>
                <ui-select-choices repeat="type in formData.allTypes | propsFilter: {name: $select.search}">
                  <div ng-bind-html="type.name | highlight: $select.search"></div>
                </ui-select-choices>
              </ui-select>
              <p ng-show="submittedResident && residentForm.$error.uiSelectRequired"
                 class="d-error help-block">Type is verplicht</p>
            @else
              <ui-select ng-model="formData.type" theme="bootstrap" ng-disabled="true" sortable="true"
                         close-on-select="true">
                <ui-select-match placeholder="Selecteer type">### $item.name ###</ui-select-match>
                <ui-select-choices repeat="type in formData.allTypes">
                  <div ng-bind-html="type.name | highlight: $select.search"></div>
                </ui-select-choices>
              </ui-select>
            @endif
          </div>

          <hr>
          <h4>Contactgegevens</h4>
          <!-- GOOGLE MAPS HINT -->
          @if(Helper::hasPermission('acl_resident_edit'))
            <div class="form-group">
              <div class="input-group">
                <label for="address" class="control-label">Zoek adres via Google Maps</label>
                <input class="form-control" autocomplete="off" ng-model="formData.looupAddress" googleplace/>
                <span class="input-group-btn">
                <button class="btn d-btn-dialog mdl-button mdl-js-button mdl-button--raised" type="button" style="margin-top: 22px;" ng-click="submitResident(residentForm.$valid)">
                  <i class="material-icons">done</i>
                </button>
                </span>
              </div>
              <p ng-show="errors.address && errors.address == 'validation.unique_resident_address'" class="d-error help-block">Adres bestaat al</p>
            </div>
        @endif
        <!-- ADRES -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.address.$invalid && !residentForm.address.$pristine }">
            <label for="address" class="control-label">Adres</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="address" placeholder=""
                     ng-model="formData.address"
                     ng-change="submitResident(residentForm.$valid)"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
          <input type="text" class="form-control" name="address" placeholder="" ng-model="formData.address" disabled="">
          </span>
            @endif
          </div>
          <!-- CITY -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.city.$invalid && !residentForm.city.$pristine }">
            <label for="city" class="control-label">Plaats</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="city" placeholder=""
                     ng-model="formData.city"
                     ng-change="submitResident(residentForm.$valid)"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
            <input type="text" class="form-control" name="city" placeholder="" ng-model="formData.city" disabled="">
          </span>
            @endif
          </div>
          <!-- ZIPCODE -->
          <div class="form-group"
               ng-class="{ 'has-error' : residentForm.postcode.$invalid && !residentForm.postcode.$pristine }">
            <label for="postcode" class="control-label">Postcode</label>
            @if(Helper::hasPermission('acl_resident_edit'))
              <input type="text" class="form-control" name="postcode" placeholder=""
                     ng-model="formData.postcode"
                     ng-change="submitResident(residentForm.$valid)"
                     ng-model-options="{updateOn: 'blur'}">
            @else
              <span @include("includes/tooltip", array( 'field' => 'roles.noedit'))>
            <input type="text" class="form-control" name="postcode" placeholder="" ng-model="formData.postcode"
                   disabled="">
          </span>
            @endif
          </div>

          <!-- Longitude and latitude -->
          <div class="row form-group hidden">
            <div class="col-xs-6">
              <label for="latitude " class="control-label">Latitude</label>
              @if(Helper::hasPermission('acl_resident_edit'))
                <input type="text" class="form-control" name="latitude" placeholder=""
                       ng-model="formData.latitude"
                       ng-model-options="{updateOn: 'blur'}">
              @else
                <input type="text" class="form-control" name="latitude" placeholder="" ng-model="formData.latitude"
                       disabled="">
              @endif
            </div>
            <div class="col-xs-6">
              <label for="postcode" class="control-label">Longitude</label>
              @if(Helper::hasPermission('acl_resident_edit'))
                <input type="text" class="form-control" name="longitude" placeholder=""
                       ng-model="formData.longitude"
                       ng-model-options="{updateOn: 'blur'}">
              @else
                <input type="text" class="form-control" name="longitude" placeholder="" ng-model="formData.longitude"
                       disabled="">
              @endif
            </div>
          </div>

        </div>
      </form>

    </div>

    <!-- right column -->
    <div class="col-md-8 col-xs-12" ng-show="formData.id">
      <!--Log-->
      @include('modules/communication/resident/_logs')
    </div>
  </div>
</div>
