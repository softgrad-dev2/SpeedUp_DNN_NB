/**
 * Created by antons on 7/2/15.
 */
speedupObjectDetailModule.factory('tsHeaderSubObjectService', ['$rootScope', '$compile',
    'configService',
    function ($rootScope, $compile, configService) {
        var gConfig = configService.getGlobalConfig();
        var _defaultGridParameters = {
            selectedPage: 0,
            filterExpression: "",
            genericSearch: "",
            refreshButton: true,
            recordCountFilterExpression: '',
            gridHeight: 400,
            pageSize: gConfig.gridPageSize,
            columnWidth: 100,
            columnMinWidth: 150,
            columnMaxWidth: "auto",
            showEditButton: false,
            showSelectButton: false,
            showDeleteButton: false,
            showFirstRecord: true,
            showCheckboxForRowSelection: false
        };

        var TsHeaderSubObjectService = function () {};

        /// <summary>
        /// Method to create a subobject page in tabstrip tab
        /// </summary>
        /// <param name="container">tabstrip container for new tab</param>
        /// <param name="odn">object definition name</param>
        /// <param name="pageTemplateName">name of the page template</param>
        /// <param name="mainRecordId">id of main record</param>
        /// <param name="propertyName">name of the sub-object</param>
        TsHeaderSubObjectService.createSubObjectPage = function (container, odn, pageTemplateName, mainRecordId, propertyName) {
            // do not re-create the grid if we have already opened this tab once
            if(container.find('.tabStripHeaderRelatedObjectContainer').length){
                return;
            }
            var tpl = angular.element('<ts-header-sub-object></ts-header-sub-object>');

            container.prepend(tpl);
            var scope = $rootScope.$new();
            // get grid options
            scope.gridParameters = _defaultGridParameters;
            // add filter expression
            scope.gridParameters.filterExpression = " [" + propertyName + "] Like '" + mainRecordId + ":%' ";
            scope.gridParameters.odn = odn;
            scope.gridParameters.displayMode = {
                type: 'element',
                element: container.find('.tabStripRelatedPropertyDetailContainer')
            };
            $compile(tpl)(scope);
        };

        return TsHeaderSubObjectService;
    }
]);