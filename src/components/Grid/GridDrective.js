/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.directive('speedupGrid', ['$compile', 'configService', 'gridHelper',
    'gridSchemaService', 'eventManager', 'gridRefreshService', 'gridDataService',
    function ($compile, configService, gridHelper, gridSchemaService, eventManager, gridRefreshService,
              gridDataService) {

        return {
            template: '<div class="dynamicObjectGridContainer"></div>',
            restrict: "EA",
            replace: true,
            scope: {
                parameters: "=parameters",
                overridingOptions: "=overridingOptions"
            },
            controller: ['$scope', function ($scope) {
                // hook for default parameters
                if(!$scope.parameters.displayMode){
                    $scope.parameters.displayMode = {type: "popup"};
                }
                if(!$scope.parameters.pageTemplateName){
                    $scope.parameters.pageTemplateName = "Default";
                }
                if($scope.overridingOptions){
                    $scope.gridOptions = angular.merge(gridHelper.getGridOptions($scope.parameters),
                        $scope.overridingOptions);
                } else {
                    $scope.gridOptions = gridHelper.getGridOptions($scope.parameters);
                }
                gridSchemaService.getGridSchema($scope.parameters).then(function (gridSchema) {
                    $scope.gridOptions.dataSource.schema = {
                        model: gridSchema,
                        parse: gridHelper.parse,
                        total: function () {
                            return gridDataService.getTotalRecords($scope.parameters);
                        }
                    };
                    $scope.gridOptions.columns = gridSchema.GridSelectedColumnsList;
                    // hack to have columns in parameters object as well
                    $scope.parameters.columns = gridSchema.GridSelectedColumnsList;
                });
            }],
            link: function ($scope, $element, $attrs, controller, $transclude) {
                $scope.$watch('gridOptions.dataSource.schema', function (schema) {
                    if (schema) {
                        var gridOptions = $scope.gridOptions;
                        var parameters = gridOptions.objectParameters;

                        // process grid wrap
                        var gridWidget = $element.kendoGrid(gridOptions).data('kendoGrid');
                        gridWidget.table.on("click", "._check_row" , function(e){
                            gridHelper.selectRowByCheckbox(e, gridWidget, parameters, this);
                        });
                        if($scope.gridOptions.objectParameters.toolbar){
                            var tpl = angular.element('<grid-toolbar></grid-toolbar>');

                            var scope = $scope.$new();
                            scope = angular.extend(scope, $scope.gridOptions.objectParameters.toolbar);

                            $compile(tpl)(scope);

                            $element.find('.gridToolbar').append(tpl);
                        }
                        $element.find('#checkAll').on('change', function(e){
                            var selected = this.checked;
                            if(selected) {
                                gridWidget.element.find('tr').addClass("k-state-selected");
                                gridWidget.element.find('._check_row').prop('checked', true);
                            } else{
                                gridWidget.element.find('tr').removeClass("k-state-selected");
                                gridWidget.element.find('td').removeClass("k-state-selected");
                                gridWidget.element.find('._check_row').prop('checked', false);
                            }
                        });
                        // filter by generic search
                        eventManager.addListener(FilterGridByGenericSearchEvent,
                            function (data) {
                                var gridWidget = $element.data('kendoGrid');
                                var gridParameters = gridOptions.objectParameters;
                                var sourceOdn = gridParameters.odn;
                                var targetOdn = data.odn;
                                var searchStr = data.genericSearchStr
                                if (sourceOdn == targetOdn){
                                    gridRefreshService.refreshByGenericSearch(gridWidget, gridParameters, searchStr);
                                }
                            }, parameters);
                        // filter by generic search
                        eventManager.addListener(FilterGridByFilterExpressionEvent,
                            function (data) {
                                var gridWidget = $element.data('kendoGrid');
                                var gridParameters = gridOptions.objectParameters;
                                var sourceOdn = gridParameters.odn;
                                var targetOdn = data.odn;
                                var searchStr = data.filterExpression;
                                var customASFilters = data.customASFilters;
                                if (sourceOdn == targetOdn){
                                    gridRefreshService.refreshByFilterExpression(gridWidget, gridParameters,
                                        searchStr, customASFilters);
                                }
                            }, parameters);
                        // catch 'propertySaved' event to refresh data source
                        eventManager.addListener(ObjectPropertySavedEvent, function (data) {
                            gridRefreshService.refreshSinglePropertyDS(data, parameters.odn,
                                $element.data('kendoGrid'));
                            // trying to find particular entry in data source
                        });
                        // catch 'object created' event to refresh data source
                        eventManager.addListener(ObjectSavedEvent, function (data) {
                            gridRefreshService.refreshObjectDS(data, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                        // catch 'object copied' event to refresh data source
                        eventManager.addListener(ObjectCopiedEvent, function (data) {
                            gridRefreshService.refreshObjectDS(data, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                        // catch 'batch edit' event to refresh data source
                        eventManager.addListener(ObjectsBatchUpdatedEvent, function (data) {
                            gridRefreshService.refreshMultiple(data, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                        // catch 'object deleted' event to refresh data source
                        eventManager.addListener(ObjectDeletedEvent, function(data){
                            gridRefreshService.refreshObjectDS({
                                    ObjectDefinitionName: data.odn
                                }, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                    }
                });
            }
        }
    }
]);