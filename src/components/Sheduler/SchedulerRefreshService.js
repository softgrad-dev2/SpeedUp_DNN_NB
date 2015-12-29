/**
 * Created by C4off on 27.10.15.
 */
speedupSchedulerModule.factory('schedulerRefreshService', ['$q', 'schedulerAPIFilterService', 'fieldPropertiesService',
    'configService',
    function ($q, schedulerAPIFilterService, fieldPropertiesService, configService) {

        var schedulerConfig = configService.getSchedulerConfig();
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        var _cachedCustomFilters = [];

        var SchedulerRefreshService = function () {
        };

        /* PUBLIC METHODS */

        /// <summary>
        /// reloads scheduler when month changes
        /// </summary>
        /// <param name="$scope">scheduler directive scope</param>
        /// <param name="objectParameters">scheduler object parameters</param>
        /// <param name="e">reload event</param>
        SchedulerRefreshService.reload = function ($scope, objectParameters, e) {
            // stop waiting for Filter initialization
            $scope.waitForFilter = false;
            var newMonth = e.date.getMonth();
            var oldMonth = objectParameters.CurrentDate.getMonth();
            if (newMonth != oldMonth) {
                if ((e.action == "previous") || (e.action == "next") || (e.action == "changeDate")) {
                    objectParameters.CurrentDate = e.date;
                    objectParameters.OwnFilter = schedulerAPIFilterService.getFilterExpressionByDate(e.date);
                    objectParameters["FilterExpression"] = schedulerAPIFilterService.mergeFilterExpression(
                        objectParameters.OwnFilter, objectParameters.ForeignFilter);
                    //refresh scheduler data source
                    e.sender.dataSource.read();
                    e.sender.refresh();
                }
            }
        };

        /// <summary>
        /// Method to refresh content with advanced search filters
        /// </summary>
        /// <param name="parameters">scheduler object parameters</param>
        /// <param name="callApi">flag to call API filters</param>
        /// <param name="odn">scheduler object definition name</param>
        /// <param name="fieldName">resource panel field name</param>
        SchedulerRefreshService.refreshWithAdvancedSearch = function (parameters, callApi, odn,
                                                                      fieldName) {
            var promise;
            if (Array.isArray(parameters.ResourcePanelFilters) && parameters.ResourcePanelFilters.length && fieldName && odn) {
                promise = fieldPropertiesService.getAllPropertiesOfSingleFieldPromise(fieldName, odn);
            } else {
                promise = $q.when([]);
            }
            var scheduler = $(schedulerConfig.schedulerHolder).data("kendoScheduler");
            if (scheduler) {
                return promise.then(function (fieldProperties) {
                    // get advanced search local filters
                    var advSearchLocalFilters = parameters.LocalASFilters;
                    var advSearchLocalFiltersObject = _getASLocalFilterObject(advSearchLocalFilters);
                    if (angular.isObject(fieldProperties)) {
                        // may be needed, if there will be another type of field
                        var fieldType = fieldProperties.dataType;
                        // get resource panel filters
                        var resourcePanelFilters = parameters.ResourcePanelFilters;
                        var resourcePanelFiltersObject = _getResourcePanelFilterValues(resourcePanelFilters);
                        var filtersMerged = _mergeLocalFilters(advSearchLocalFiltersObject,
                            resourcePanelFiltersObject, fieldName);
                    } else if(Array.isArray(fieldProperties) && !fieldProperties.length){
                        var resourcePanelFiltersObject = _getResourcePanelFilterValues([]);
                        var filtersMerged = _mergeLocalFilters(advSearchLocalFiltersObject,
                            resourcePanelFiltersObject, fieldName);
                    } else{
                        filtersMerged = advSearchLocalFiltersObject;
                    }

                    // get 'server' advanced search filters
                    var customASfilters = parameters.customASFilters;
                    // TODO: check
                    if (customASfilters && callApi && !_checkApiFiltersEqual(customASfilters)) {
                        _cachedCustomFilters = customASfilters;
                        parameters.CustomASFilters = customASfilters;
                        // send API request
                        _doRefresh(true).then(function () {
                            // then perform 'local' search
                            scheduler.dataSource.filter(filtersMerged);
                            return _doRefresh(false);
                        });
                    } else {
                        scheduler.dataSource.filter(filtersMerged);
                        return _doRefresh(false);
                    }
                })
            } else {
                return promise;
            }
        };

        /// <summary>
        /// Method to refresh scheduler with applied filter.
        /// </summary>
        /// <param name="parameters">scheduler parameters object</param>
        /// <param name="ownFilter">scheduler filter with dates period</param>
        /// <param name="foreignFilter">filter passed from filter component</param>
        SchedulerRefreshService.refreshWithFilter = function (parameters, ownFilter, foreignFilter) {
            var filters = [];
            // join all "non-empty" filters
            if (ownFilter != "") {
                filters.push(ownFilter);
            }
            if (foreignFilter != "") {
                filters.push(foreignFilter);
            }

            // set merged filter as filterExpression for scheduler
            parameters['FilterExpression'] = filters.join(" AND ");

            _doRefresh(true);
        };


        /*PRIVATE METHODS*/

        /// <summary>
        /// does actual scheduler refresh
        /// </summary>
        /// <param name="doRead">flag to reload content from API</param>
        function _doRefresh(doRead) {
            var deferred = $q.defer();
            doRead = doRead || false;
            var schedulerConfig = configService.getSchedulerConfig();
            var scheduler = $(schedulerConfig.schedulerHolder).data("kendoScheduler");
            if (scheduler) {
                if (doRead) {
                    return scheduler.dataSource.read();
                }
                scheduler.refresh();
                deferred.resolve();

            }

            return deferred.promise;
        }

        /// <summary>
        /// merges local filters (advanced search + resource panel)
        /// </summary>
        /// <param name="advSearchLocalFiltersObject">advanced search filter object</param>
        /// <param name="resourcePanelFiltersValues">array of values selected in resource panel</param>
        /// <param name="fieldName">resource panel field name</param>
        function _mergeLocalFilters(advSearchLocalFiltersObject, resourcePanelFiltersValues,
                                    fieldName) {
            if (angular.isArray(resourcePanelFiltersValues) &&
                resourcePanelFiltersValues.length) {
                advSearchLocalFiltersObject.filters.push({
                    field: _getFieldBoundName(fieldName),
                    operator: function (item) {
                        return $.inArray(item, resourcePanelFiltersValues) != -1;
                    }
                });
            }

            return advSearchLocalFiltersObject;
        }

        /// <summary>
        /// method to get selected values from resource panel
        /// </summary>
        /// <param name="resourcePanelFilters">selected resource panel fields objects</param>
        function _getResourcePanelFilterValues(resourcePanelFilters) {
            if (!angular.isArray(resourcePanelFilters)) {
                return null;
            }
            if(!resourcePanelFilters.length){
                // 'impossible' value. Used to show no events
                return ["#*undefined*#"];
            }
            var filterValues = [];
            resourcePanelFilters.forEach(function (filter) {
                filterValues.push(filter.value);
            });

            return filterValues;
        }

        /// <summary>
        /// More complex date validity ckeck
        /// </summary>
        /// <param name="d">date object</param>
        function isValidDate(d) {
            if (Object.prototype.toString.call(d) !== "[object Date]")
                return false;
            return !isNaN(d.getTime());
        }

        /// <summary>
        /// Compares two operands
        /// </summary>
        /// <param name="p1">first operand</param>
        /// <param name="p2">second operand</param>
        /// <param name="operator">operator string</param>
        /// <param name="dataType">data type</param>
        function _compareProperties(p1, p2, operator, dataType) {
            var retValue = null;
            switch (dataType) {
                case dataTypes.Date:
                    p1 = kendo.parseDate(p1);
                    p2 = kendo.parseDate(p2);
                    if (!isValidDate(p1) || !isValidDate(p2)) {
                        console.log("date is invalid");
                        retValue = false;
                        return retValue;
                    }
                    p1.setHours(0);
                    p2.setHours(0);
                    p1.setMinutes(0);
                    p2.setMinutes(0);
                    p1.setSeconds(0);
                    p2.setSeconds(0);
                    p1.setMilliseconds(0);
                    p2.setMilliseconds(0);
                    break;
                case dataTypes.DateTime:
                    p1 = kendo.parseDate(p1);
                    p2 = kendo.parseDate(p2);
                    if (!isValidDate(p1) || !isValidDate(p2)) {
                        console.log("date is invalid");
                        retValue = false;
                        return retValue;
                    }
                    p1.setMilliseconds(0);
                    p2.setMilliseconds(0);
                    break;
                case dataTypes.Text:
                case dataTypes.TextBox:
                case dataTypes.DropDownList:
                case dataTypes.SearchableDropDownList:
                case dataTypes.ParentRelationship:
                case dataTypes.ObjectRelationship:
                case dataTypes.CheckBox:
                    p1 = p1.toLowerCase();
                    p2 = p2.toLowerCase();
                    break;
            }
            if (retValue || retValue === false) {
                return retValue;
            }
            switch (operator) {
                case "<":
                    return p1 < p2;
                    break;
                case ">":
                    return p1 > p2;
                    break;
                case "==":
                    return p1 == p2;
                    break;
                case "<=":
                    return p1 <= p2;
                    break;
                case ">=":
                    return p1 >= p2;
                    break;
                case "like":
                    return  p1.indexOf(p2) == -1 ? false : true;
                    break;
            }
        }

        /// <summary>
        // Method returns object to be used as a dataSource filter.
        /// </summary>
        /// <param name="filters">filters</param>
        function _getASLocalFilterObject(filters) {
            var filterObj = {
                logic: "and",
                filters: []
            };
            if (angular.isArray(filters)) {
                var oneFilterObj;
                filters.forEach(function (filterObject) {
                    var filter = filterObject.filterObject;
                    oneFilterObj = {
                        field: _getFieldBoundName(filter.name),
                        operator: function (item) {
                            return _compareProperties(item, filter.value, filter.operator, filter.type);
                        }
                    };

                    filterObj.filters.push(oneFilterObj);
                });
            }
            return filterObj;
        }

        /// <summary>
        /// Method returns field name bound by Kendo.
        /// Kendo scheduler changes bound field name (Start_Date => start)
        /// </summary>
        /// <param name="fieldName">field name</param>
        function _getFieldBoundName(fieldName) {
            var fieldBound = "";
            switch (fieldName) {
                case schedulerConfig.startField:
                    fieldBound = 'start';
                    break;
                case schedulerConfig.endField:
                    fieldBound = 'end';
                    break;
                default:
                    fieldBound = fieldName;
            }

            return fieldBound;
        }

        /// <summary>
        /// Checks whether two advanced search API filters are equal
        /// Not to send double API request with same data
        /// </summary>
        /// <param name="fieldName">field name</param>
        function _checkApiFiltersEqual(customASfilters) {
            // both should be arrays
            if (!$.isArray(customASfilters) || (!$.isArray(_cachedCustomFilters))) {
                return false;
            }
            // should have equal length
            if (customASfilters.length != _cachedCustomFilters.length) {
                return false;
            }
            // both are empty -> equal
            if (!customASfilters.length) {
                return true;
            }
            // should be equal
            return customASfilters.some(function (filterObj) {
                return _cachedCustomFilters.some(function (cachedfilterObj) {
                    return (filterObj.key == cachedfilterObj.key &&
                        filterObj.value == cachedfilterObj.value);
                });
            });
        }

        return SchedulerRefreshService;
    }]);