// Directive for ui-select

// Add required support on ui select
app.directive('uiSelectRequired', function () {
    return {
        require: 'ngModel', link: function (scope, element, attr, ctrl) {
            ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {
                if (attr.uiSelectRequired) {
                    var isRequired = scope.$eval(attr.uiSelectRequired)
                    if (isRequired == false)
                        return true;
                }
                var determineVal;
                if (angular.isArray(modelValue)) {
                    determineVal = modelValue;
                } else if (angular.isArray(viewValue)) {
                    determineVal = viewValue;
                } else if (angular.isObject(modelValue)) {
                    determineVal = angular.equals(modelValue, {}) ? [] : ['true'];
                } else if (angular.isObject(viewValue)) {
                    determineVal = angular.equals(viewValue, {}) ? [] : ['true'];
                } else {
                    return false;
                }

                return determineVal.length > 0;
            };
        }
    };
});
