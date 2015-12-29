/**
 * Created by me on 19.11.15.
 */
speedupSchedulerModule.directive('speedupScheduler', ["$rootScope", '$compile', "schemaService",
    "configService", "notificationService", "schedulerHelper", 'eventManager',
    'schedulerDataSourceService', 'schedulerParametersService',
    'schedulerRefreshService',
    function ($rootScope, $compile, schemaService, configService, notificationService, schedulerHelper, eventManager, schedulerDataSourceService, schedulerParametersService, schedulerRefreshService) {

        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('Sheduler/SchedulerDirectiveTemplate.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            link: function ($scope, $element) {
                var schedulerConfig = configService.getSchedulerConfig();
                var gConfig = configService.getGlobalConfig();

                var odn = schedulerConfig.objectDefinitionName;
                var mainOdn = gConfig.objectDefinitionName;
                // options for advanced search component
                $scope.asOptions = {
                    type: "local",
                    odn: odn,
                    pageTemplateName: schedulerConfig.pageTemplateName,
                    propertyViewType: "jsonSelected"
                };

                var objectParameters = schedulerParametersService.getObjectParameters($scope, odn);
                /*EVENTS SECTION*/
                // update event single property locally (without calling API)
                eventManager.addListener(ObjectPropertySavedEvent, function (data) {
                    if (data.odn == odn) {
                        var fieldName = data.fieldName;
                        var fieldValue = data.fieldValue;
                        var recordId = data.recordId;
                        var widget = angular.element(schedulerConfig.schedulerHolder).data('kendoScheduler');
                        if (fieldName && fieldValue && recordId && widget) {
                            schedulerDataSourceService.updateSingleProperty(fieldName, fieldValue, recordId, widget);
                        }
                    }
                });
                // events to refresh scheduler after object copy
                eventManager.addListener(ObjectCopiedEvent, function (data) {
                    // force refresh scheduler
                    schedulerHelper.refreshObjectDS(data, odn,
                        schedulerConfig.schedulerHolder, true);
                });
                // catch 'object created' event to refresh data source
                eventManager.addListener(ObjectSavedEvent, function (data) {
                    schedulerHelper.refreshObjectDS(data, odn,
                        schedulerConfig.schedulerHolder);
                });
                // catch 'object deleted' event to refresh data source
                eventManager.addListener(ObjectDeletedEvent, function (data) {
                    schedulerHelper.removeObjectFromDS(data, odn, mainOdn,
                        schedulerConfig.schedulerHolder);
                });

                // event, fired when filters is selected from filter component
                $scope.$on(FilterSetEvent, function (event, filterObj) {
                    if (!filterObj) {
                        // stop waiting for Filter initialization
                        $scope.waitForFilter = false;
                        schedulerRefreshService.refreshWithFilter(objectParameters, objectParameters.OwnFilter, objectParameters.ForeignFilter);
                        $scope.advancedSearchRefreshPending = true;
                        // if filter is the same - don't refresh
                        // but refresh only for the first time (waitForFilter == true)
                    } else if (filterObj.FitlerExpression != objectParameters.ForeignFilter || $scope.waitForFilter) {
                        // stop waiting for Filter initialization
                        $scope.waitForFilter = false;
                        objectParameters.ForeignFilter = filterObj.FitlerExpression;
                        schedulerRefreshService.refreshWithFilter(objectParameters, objectParameters.OwnFilter, objectParameters.ForeignFilter);
                        $scope.advancedSearchRefreshPending = true;
                    }

                });
                // catch advanced search filter applied
                $scope.$on(AdvancedSearchFilterSetEvent, function (event, asFilters) {
                    objectParameters.LocalASFilters = asFilters.filters;
                    objectParameters.CustomASFilters = asFilters.customASFilters;
                    var resourceFieldName = schedulerConfig.resourceField;
                    schedulerRefreshService.refreshWithAdvancedSearch(objectParameters, true, odn,
                        resourceFieldName);
                });
                // catch resource panel filter set
                $scope.$on(ResourcePanelFilterChangedEvent, function (evt, filterData) {
                    debugger;
                    var resourceFieldName = schedulerConfig.resourceField;
                    objectParameters.ResourcePanelFilters = filterData;
                    schedulerRefreshService.refreshWithAdvancedSearch(objectParameters, false,
                        odn, resourceFieldName);

                });
                // Start scheduler binding
                schedulerParametersService.getWidgetParameters($scope, objectParameters).then(function (widgetParameters) {
                    $scope.schedulerOptions = widgetParameters;
                    var holder = schedulerConfig.schedulerHolder;
                    if (holder) {
                        $(holder).kendoScheduler(widgetParameters);
                        var scheduler = $(holder).data('kendoScheduler');
                        // attach filter dropdown
                        var filterDropDownTpl =
                            angular.element('<filter-dropdown-scheduler filter-options="filterOptions">' +
                                '</filter-dropdown-scheduler>');
                        $compile(filterDropDownTpl)($scope);
                        angular.element('.k-scheduler-views').append(filterDropDownTpl);

                        // attach resource panel
                        if (schedulerConfig.showResourcePanel) {
                            // if there are resources - set scope value to be passed
                            // to resource panel directive
                            if ($.isArray(widgetParameters.resources) && widgetParameters.resources.length) {
                                $scope.resourcePanelData = widgetParameters.resources[1].dataSource;
                            }
                            var buttonTpl = angular.element('<scheduler-resource-button></scheduler-resource-button>');
                            var buttonScope = $scope.$new();
                            $compile(buttonTpl)(buttonScope);
                            // show resource panel button
                            $('.k-scheduler-toolbar').prepend(buttonTpl);
                            $scope.$on(SchedulerResourceButtonClickedEvent, function (event, state) {
                                $scope.$broadcast(SchedulerResourcePanelToggleEvent, state);
                            });
                            $scope.$on(SchedulerChangeWidthEvent, function (event, evtWidth) {
                                var width = $(holder).width() + evtWidth;
                                $(holder).width(width);
                                scheduler.refresh();
                            });

                        }
                    }
                });
            }
        };
    }]
);