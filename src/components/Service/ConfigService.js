/**
 * Created by antons on 2/13/15.
 */
CSVapp.factory('configService', ['filesystemService', function (filesystemService) {

    var _throwException = true;

    var ConfigService = function () {
    };

    ConfigService.Init = function () {
        _setEnvParams(globalConfig.environment);

        return ConfigService.getGlobalConfig();
    };

    /// <summary>
    /// Method to get relative address for template and add version to bust cache
    /// </summary>
    /// <param name="tplName">name of template</param>
    ConfigService.getTemplateUrl = function (tplName) {
        var version = globalConfig.version || "";

        return filesystemService.getTemplateUrl(tplName, version);
    };

    ConfigService.getUrlBase = function (string) {
        var url = globalConfig.urls[string];
        if (url) {
            url = globalConfig.baseUrl + '/' + url;
        }

        return url;
    };

    // TODO: OLD. Remove after CSVPageLogicController refatcor
    ConfigService.init = function () {
        legacyConfig.Settings(globalConfig.baseUrl, globalConfig.token, globalConfig.userName).Init();

        return legacyConfig;
    };
    // TODO: OLD. get rid of legacy config
    ConfigService.getConfig = function () {
        if (typeof $config != "undefined") {
            {
                return $config;
            }
        } else {
            return $.config;
        }
    };
    ConfigService.getSchedulerConfig = function () {
        // TODO: extend default params with incoming and check them
        return SchedulerConfig;
    };
    ConfigService.getPageConfig = function () {
        return pageConfig;
    };
    ConfigService.getGlobalConfig = function () {
        return globalConfig;
    };
    // Private methods
    // Method to set all environmental variables
    function _setEnvParams(env) {
        // do not throw exceptions for prod
        _throwException = env != 'prod';
        filesystemService.InitPathsByEnv(env);
    }

    var lPageConfig = ConfigService.getPageConfig();

    var globalConfig = {
        baseUrl: lPageConfig.baseUrl,
        token: lPageConfig.token,
        userName: lPageConfig.userName,
        objectDefinitionName: lPageConfig.objectDefinitionName,
        pageTemplateName: lPageConfig.pageTemplateName,
        perspectiveFilter: lPageConfig.hfPerspectiveFilter,
        perspectivePageTemplate: lPageConfig.perspectivePageTemplate,
//        perspectiveFilter: JSON.parse(lPageConfig.hfPerspectiveFilter),
        selectedColumns: lPageConfig.selectedColumns,
        urls: GCUrls,
        postData: GCPostData,
        cookies: GCCookies,
        dataTypes: GCFieldDataTypes,
        jsonStructure: lPageConfig.JSONStructure,
        modelId: lPageConfig.modelId || 'ObjectEntry_ID',
        environment: lPageConfig.environment,
        version: lPageConfig.templateVersion,
        objectDetailDisplayType: lPageConfig.objectDetailDisplayType,
        objectDetailPageSize: lPageConfig.objectDetailPageSize,
        inlineSaveMethod: lPageConfig.inlineSaveMethod || 'server',
        mobileView: lPageConfig.mobile,
        // Grid things
        gridEditable: lPageConfig.gridEditable || false,
        gridContainer: lPageConfig.gridContainer,
        defaultSortOrder: lPageConfig.defaultSortOrder,
        gridPageSize: lPageConfig.gridPageSize,
        waitForFilter: lPageConfig.waitForFilter,
        showFirstRecord: lPageConfig.showFirstRecord,
        mobile: lPageConfig.mobile,
        batchUpdate: lPageConfig.batchUpdate,
        // Detail Page
        enableKeyboard: lPageConfig.enableKeyboard,
        // DEBUG
        advancedSearchTpl: lPageConfig.advancedSearchTpl
    };

    return ConfigService;
}]);