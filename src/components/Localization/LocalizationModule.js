angular.module('speedup.localization', [])
    .factory('localizationService', [
        function () {
            var LocalizationService = function () {
            };

            LocalizationService.translate = function(label){
                var parts = label.split('.');
                var object = $.objectLanguage;
                var returnValue = null;

                var hasAllProps = parts.every(function (property) {
                    if (!object.hasOwnProperty(property)) {
                        return false;
                    } else {
                        object = object[property];
                        return true;
                    }
                });

                if (hasAllProps) {
                    returnValue = object;
                } else {
                    returnValue = label;
                }

                return returnValue;
            };

            return LocalizationService;
        }])
    .filter('i18n', ['localizationService', function (localizationService) {
        return function (label) {
            return localizationService.translate(label);
        }
    }]);