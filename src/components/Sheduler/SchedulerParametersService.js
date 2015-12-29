/**
 * Created by C4off on 27.10.15.
 */
speedupSchedulerModule.factory('schedulerParametersService', ['$rootScope', 'configService',
    'schedulerPopupService', 'schedulerHelper', 'schedulerRefreshService',
    'schedulerResourcesService', 'schedulerAPIFilterService',
    function ($rootScope, configService, schedulerPopupService, schedulerHelper,
              schedulerRefreshService, schedulerResourcesService,
              schedulerAPIFilterService) {

        var schedulerConfig = configService.getSchedulerConfig();
        var gConfig = configService.getGlobalConfig();

        var SchedulerParametersService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// check if event end_date has passed and make it 'grey'
        /// </summary>
        /// <param name="$scope">scope of scheduler directive</param>
        /// <param name="odn">object definition name</param>
        SchedulerParametersService.getObjectParameters = function ($scope, odn) {
            var currentDate = new Date();

            $scope.waitForFilter = schedulerConfig.waitForFilter;
            $scope.advancedSearchRefreshPending = false;

            var ownFilter = schedulerAPIFilterService.getFilterExpressionByDate(currentDate);
            var foreignFilter = "";
            var perspectiveFilter = angular.isObject(gConfig.perspectiveFilter) &&
                gConfig.perspectiveFilter[odn] ? gConfig.perspectiveFilter[odn] : "";
            // use perspective filter if any is present
            if (perspectiveFilter && ownFilter) {
                ownFilter = perspectiveFilter + ' AND ' + ownFilter;
            } else if (perspectiveFilter) {
                ownFilter = perspectiveFilter;
            }
            // hack to get filter from filter component if
            // filter loaded prior to scheduler and scheduler cannot receive
            // filterSet event
            if ($rootScope["appliedFilter"]) {
                $scope.waitForFilter = false;
                foreignFilter = $rootScope.appliedFilter;
            } else if ($rootScope["appliedFilter"] === null) {
                $scope.waitForFilter = false;
            }
            // filters will be passed from components
            var localASFilters = [];
            var resourcePanelFilters = null;
            // merged localASFilters + resourcePanelFilters
            var advancedSearchFilters = [];

            return {
                PageSize: -1,
                PageNumber: -1,
                Token: gConfig.token,
                RequestType: "Detail",
                ObjectDefinitionName: odn,
                OrderByExpression: "",
                FilterExpression: ownFilter,
                Perspective: perspectiveFilter,
                SelectedGridColumns: "*",
                GenericSearch: "",
                CustomASFilters: [],
                OwnFilter: ownFilter,
                ForeignFilter: foreignFilter,
                CurrentDate: currentDate,
                AdvancedSearchFilters: advancedSearchFilters,
                LocalASFilters: localASFilters,
                ResourcePanelFilters: resourcePanelFilters
            };
        };

        /// <summary>
        /// Method to get scheduler widget parameters
        /// </summary>
        /// <param name="$scope">scope of scheduler directive</param>
        /// <param name="objectParameters">scheduler object parameters</param>
        SchedulerParametersService.getWidgetParameters = function ($scope, objectParameters) {
            var parameters = {
                objectParameters: objectParameters,
                editable: {
                    mode: "inline"
                },
                height: schedulerConfig.height,
                views: _getViews(),
                edit: schedulerPopupService.openPopupHandler,
                resizeEnd: schedulerHelper.eventResizedSave, // event, fired when event resized
                moveEnd: schedulerHelper.eventMovedSave,     // event, fired when event dragged
                navigate: function (e) {
                    schedulerRefreshService.reload($scope, objectParameters, e)    // event, fired when user change date (switch weeks, months etc)
                },
                dataBinding: function () {
                    // Fires on first load to notify page
                    // logic controller that it's loaded and ready
                    if ($scope.waitForFilter) {
                        $scope.$emit(SchedulerReadyEvent);
                    }
                },
                // on data reload from API we need to wait until
                // dataSource is bound to perform "advanced search" filtering
                dataBound: function () {
                    if ($scope.advancedSearchRefreshPending) {
                        $scope.advancedSearchRefreshPending = false;
                        var resourceFieldName = schedulerConfig.resourceField;
                        schedulerRefreshService.refreshWithAdvancedSearch(objectParameters, false,
                        objectParameters.odn, resourceFieldName);
                    }
                },
                workDayStart: new Date(schedulerConfig.workDayStart),
                workDayEnd: new Date(schedulerConfig.workDayEnd),
                // todo: put to scheduler config
                showWorkHours: true,
                dataSource: _getDataSource($scope, objectParameters)

            };
            return schedulerResourcesService.getResources(objectParameters.ObjectDefinitionName).then(function(resources){
                parameters.resources = resources;

                return parameters;
            })
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Method to get scheduler widget dataSource
        /// </summary>
        /// <param name="$scope">scope of scheduler directive</param>
        /// <param name="objectParameters">scheduler object parameters</param>
        function _getDataSource($scope, objectParameters) {
            var parameters = {
                editable: {
                    mode: "inline"
                },
                batch: false,
                transport: {
                    read: function (options) {
                        schedulerHelper.read(options, $scope.waitForFilter, objectParameters);
                    },
                    destroy: schedulerHelper.destroy
                },
                schema: {
                    model: {
                        id: gConfig.modelId,
                        fields: {
                            start: { "from": schedulerConfig.startField, "type": "date" },
                            end: { "from": schedulerConfig.endField, "type": "date" },
                            title: {"from": "Header" }
                        }
                    }
                }
            };
            if (gConfig.mobileView) {
                parameters.mobile = gConfig.mobileView;
            }

            return parameters;
        }

        /// <summary>
        /// Method to get scheduler 'views' for widget parameters
        /// </summary>
        /// <param name="$scope">scope of scheduler directive</param>
        /// <param name="objectParameters">scheduler object parameters</param>
        function _getViews() {
            return [
                {
                    type: "day",
                    dateHeaderTemplate: "<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd dd/M')#</span>"
                },
                {
                    type: "week",
                    dateHeaderTemplate: "<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd dd/M')#</span>"
                },
                {
                    type: "workWeek",
                    selected: true,
                    dateHeaderTemplate: "<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd dd/M')#</span>"
                },
                "month"
            ]
        }

        return SchedulerParametersService;
    }]);
