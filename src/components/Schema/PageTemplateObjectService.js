/**
 * Created by C4off on 18.09.15.
 */
CSVapp.factory('pageTemplateObjectService', ['$q', '$http', 'configService',
    'pageTemplateObjectCacheService',
    function ($q, $http, configService, pageTemplateObjectCacheService) {

        var gConfig = configService.getGlobalConfig();

        var PageTemplateObjectService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to get template object either from cache or from API
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        /// <return>promise</return>
        PageTemplateObjectService.getObjectTemplateSettings = function (odn) {
            var deferred = $q.defer();
            var jsonSettings = [];

            var tplName;
            // First - check perspective;
            if (gConfig.perspectivePageTemplate && gConfig.perspectivePageTemplate[odn]) {
                tplName = gConfig.perspectivePageTemplate[odn];
            } else if (gConfig.objectDefinitionName == odn && gConfig.pageTemplateName) { // then if main object and we have a template name set in config
                tplName = gConfig.pageTemplateName;
            } else { // try to find default template
                tplName = "Default";
            }
            var objPage = pageTemplateObjectCacheService.getCachedPageTemplateObject(odn, tplName);
            if (!objPage || !$.isArray(objPage.PageTemplate) || !objPage.PageTemplate.length) {
                var url = configService.getUrlBase('objectPageLayout') + "/" + odn + "/" + tplName + "/" + gConfig.token;
                $http.get(url).success(function (response) {
                    jsonSettings = jQuery.parseJSON(response);
                    if(!jsonSettings || ($.isArray(jsonSettings) && !jsonSettings.length)){
                        deferred.resolve("");
                    } else {
                        pageTemplateObjectCacheService.preservePageTemplate({
                            ObjectDefinitionName: odn,
                            PageTemplate: jsonSettings
                        });
                        deferred.resolve(jsonSettings || "");
                    }
                }).
                    error(function () {
                        deferred.resolve("");
                    });
            }
            else {
                jsonSettings = objPage.PageTemplate;
                deferred.resolve((jsonSettings == null || jsonSettings == "") ? "" : jsonSettings)
            }

            return deferred.promise;
        };

        return PageTemplateObjectService;
    }
]);