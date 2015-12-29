/**
 * Created by C4off on 05.07.15.
 */
CSVapp.factory('conversionCacheService', [
    function () {

        var _conversionListData = [];

        var ConversionCacheService = function(){}

        ConversionCacheService.getConversionObject = function (ObjectDefinitionName) {
            return _conversionListData.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        };

        // CHECKED
        ConversionCacheService.preserveConversionObject = function(conversionObject) {
            var objconversion = _conversionListData.filter(function (obj) {
                if (conversionObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (objconversion == null || objconversion == undefined) {
                _conversionListData.push(conversionObject);
            }
        };

        return ConversionCacheService;
    }
]);