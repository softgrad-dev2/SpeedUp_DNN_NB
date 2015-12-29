/**
 * Created by C4off on 05.07.15.
 */
CSVapp.factory('printTemplateCacheService', [
    function () {

        var _objectPrintTemplateData = [];

        var PrintTemplateCacheService = function(){}

        PrintTemplateCacheService.getPrintTemplate = function(odn) {
            return _objectPrintTemplateData.filter(function (obj) {
                if (obj.ObjectDefinitionName == odn) {
                    return obj
                }
            })[0];
        };

        //CHECKED
        PrintTemplateCacheService.preservePrintTemplateObject = function(printTemplateObject) {
            var objPrintTmpl = _objectPrintTemplateData.filter(function (obj) {
                if (printTemplateObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (objPrintTmpl == null || objPrintTmpl == undefined) {
                _objectPrintTemplateData.push(printTemplateObject);
            }
        };

        return PrintTemplateCacheService;
    }
]);