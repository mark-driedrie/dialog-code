// Directive for google maps

//autocomplete addresses
app.directive('googleplace', function() {
  return {
    replace: true,
    scope: {
      ngModel: '=',
      formData: "="
    },
    template: '<input class="form-control" type="text">',
    link: function(scope, element, attrs, model) {

      var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      };

      var options = {
        types: [],
        componentRestrictions: {
          country: 'nl'
        }
      };

      //if google maps api javascript is loaded
      if (typeof google === 'object' && typeof google.maps === 'object') {

        var autocomplete = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {

          scope.$apply(function() {

            //clear fields
            scope.$parent.formData.city = '';
            scope.$parent.formData.country = '';
            scope.$parent.formData.address = '';
            scope.$parent.formData.postcode = '';
            var streetnumber = '';
            var place = autocomplete.getPlace();
            var components = place.address_components; // from Google API place object

            //add latitude and longitude
            if (place && place.geometry && place.geometry.location) {
              scope.$parent.formData.latitude = place.geometry.location.lat();
              scope.$parent.formData.longitude = place.geometry.location.lng();
            }

            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            if (place && place.address_components) {
              for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                console.log(addressType)
                if (componentForm[addressType]) {
                  var val = place.address_components[i][componentForm[addressType]];
                  if (addressType == 'street_number')
                    streetnumber = val;
                  if (addressType == 'locality')
                    scope.$parent.formData.city = val;
                  if (addressType == 'country')
                    scope.$parent.formData.country = val;
                  if (addressType == 'route')
                    scope.$parent.formData.address = val;
                  if (addressType == 'postal_code')
                    scope.$parent.formData.postcode = val;
                }
              }
            }
            //add streetnumber to street
            scope.$parent.formData.address += ' ' + streetnumber;
          });
        });
      }
    }
  }
})
