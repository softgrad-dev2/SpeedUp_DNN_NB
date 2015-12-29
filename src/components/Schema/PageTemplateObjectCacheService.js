/**
 * Created by C4off on 18.09.15.
 */
CSVapp.factory('pageTemplateObjectCacheService', [
    function () {
        var _pageTemplateList = {};

        var PageTemplateObjectCacheService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to get template object from cache
        /// </summary>
        /// <param name="ObjectDefinitionName">Object Definition Name</param>
        /// <param name="templateName">optional. template name</param>
        PageTemplateObjectCacheService.getCachedPageTemplateObject = function (ObjectDefinitionName, templateName) {
            var tplObjects = _pageTemplateList[ObjectDefinitionName];
            if (!tplObjects) {
                return null;
            }
            var tplObj;
            if (templateName) {
                tplObj = tplObjects[templateName];
            } else {
                var props = Object.getOwnPropertyNames(tplObjects);
                tplObj = tplObjects[props[0]];
            }

            return tplObj || null;
        };


        /// <summary>
        /// Method to preserve template object in cache
        /// </summary>
        /// <param name="ObjectDefinitionName">Object Definition Name</param>
        /// <param name="templateName">optional. template name</param>
        PageTemplateObjectCacheService.preservePageTemplate = function (pageTemplateObject) {
            var odn = pageTemplateObject.ObjectDefinitionName;
            var pageTemplates = pageTemplateObject.PageTemplate;
            if (angular.isArray(pageTemplates) && angular.isObject(pageTemplates[0])) {
                var pageTemplateName = pageTemplateObject.PageTemplate[0].Name;
                var tplObjects = _pageTemplateList[odn];

                var tplObj;
                if (!tplObjects) {
                    tplObj = {};
                    tplObj[pageTemplateName] = pageTemplateObject;
                    _pageTemplateList[odn] = tplObj
                } else {
                    tplObj = tplObjects[pageTemplateName];
                    if (!tplObj) {
                        tplObjects[pageTemplateName] = pageTemplateObject;
                    }
                    // if we have object with same odn and
                    // template name - we just ignore new one
                }
            }
        };

        return PageTemplateObjectCacheService;
    }]);