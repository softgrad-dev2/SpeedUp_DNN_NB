/**
 * Created by C4off on 20.10.15.
 */
CSVapp.factory('advancedSearchFilterExpressionService', ['configService',
    function (configService) {
        // private fields
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        var AdvancedSearchFilterExpressionService = function () {
        };

        /*PUBLIC METHODS*/

        AdvancedSearchFilterExpressionService.filterIsEmpty = function(filterObj, type){
            var handler = _getFilterObjectHandler(type);

            return handler.filterIsEmpty(filterObj);
        };

        AdvancedSearchFilterExpressionService.processFilters = function (filters, type, parentalType) {
            var handler = _getFilterObjectHandler(type, parentalType);

            return handler.processFilters(filters);
        };

        /// <summary>
        /// method to get filter object
        /// </summary>
        /// <param name="elem">field object</param>
        /// <param name="value">object with values of selected fields</param>
        /// <param name="parentialType">is current, parent or child filter</param>
        /// <param name="propertyName">property name</param>
        /// <param name="currentProperty">current field meta value</param>
        AdvancedSearchFilterExpressionService.getFilterObject = function (elem, value, parentialType,
                                                                          propertyName, currentProperty, type) {
            var handler = _getFilterObjectHandler(type, parentialType);
            return {
                filterObject: handler.getFilterObject(elem, value, propertyName, currentProperty),
                type: parentialType,
                propertyName: propertyName
            }
        };

        AdvancedSearchFilterExpressionService.appendFilterObject = function (filterObject, elem, filters,
                                                                             customFilters, propertyName,
                                                                             tplObjects, type, parentalType) {
            var handler = _getFilterObjectHandler(type, parentalType);

            return handler.appendFilterObject(filterObject, elem, filters, customFilters, propertyName,
                tplObjects);
        };

        /*PRIVATE METHODS*/

        function _getFilterObjectHandler(type, parentalType) {
            // if we want API filters or 'custom' filters in local,
            // that should be also treated as API ones
            return type == 'api' ||
                (parentalType && parentalType.toLowerCase() != 'main')
                ? new FilterObjectHandlerAPI(type)
                : new FilterObjectHandlerLocal(type);
        }

        var FilterObjectHandlerAPI = function (type) {
            this.type = type;
        };
        FilterObjectHandlerAPI.prototype.filterIsEmpty = function(filterObj){
            // here filterObj is object
            return (!filterObj.filters &&
                (!filterObj.customASFilters || !filterObj.customASFilters.length));
        };
        FilterObjectHandlerAPI.prototype.processFilters = function (filters) {
            var filtersCombined = "";

            filters.forEach(function (filter) {
                if(filtersCombined != ""){
                    filtersCombined += " AND ";
                }
                filtersCombined += filter.filterObject;
            });

            return filtersCombined;
        };
        FilterObjectHandlerAPI.prototype.appendFilterObject = function (filterObject, elem, filters, customFilters, propertyName, tplObjects) {
            // here filterObject.filterObject is string (filter expression)
            if (filterObject.filterObject.trim()) {
                if (filterObject.type.toLowerCase() == 'main') {
                    filters.push(filterObject);
                } else {
                    var customFilterWrapped = _wrapCustomFilterObject(filterObject,
                        tplObjects[elem.odn], propertyName);
                    if (customFilterWrapped) {
                        customFilters.push(customFilterWrapped);
                    }
                }
            }
        };

        FilterObjectHandlerAPI.prototype.getFilterObject = function (elem, value, propertyName, currentProperty) {
            var filterExpression = "";
            // Collect filter info
            switch (elem.DataType) {
                case dataTypes.Date:
                case dataTypes.DateTime:
                    if (currentProperty.type == "before") {
                        filterExpression = "CONVERT(DATETIME2, [" + propertyName + "]) <= CONVERT(DATETIME2, '" + value + "')";
                    } else {
                        filterExpression = "CONVERT(DATETIME2, [" + propertyName + "]) >= CONVERT(DATETIME2, '" + value + "')"
                    }
                    break;
                case dataTypes.Text:
                case dataTypes.AutoText:
                case dataTypes.TextBox:
                case dataTypes.ParentRelationship:
                case dataTypes.ObjectRelationship:
                    filterExpression = "[" + propertyName + "] like '%" + value + "%'";
                    break;
                case dataTypes.DropDownList:
                case dataTypes.SearchableDropDownList:
                    filterExpression = "[" + propertyName + "] = '" + value + "'";
                    break;
                case dataTypes.CheckBox:
                    filterExpression = "[" + propertyName + "] = '1'";
                    break;
            }

            return filterExpression;
        };

        var FilterObjectHandlerLocal = function (type) {
            this.type = type;
        };
        // todo: do me
        FilterObjectHandlerLocal.prototype.filterIsEmpty = function(filterObj){
            // here filterObj is string
//            return !filterObj.filterObject;
        };
        FilterObjectHandlerLocal.prototype.processFilters = function (filters) {
            return filters;
        };
        FilterObjectHandlerLocal.prototype.appendFilterObject = function (filterObject, elem, filters, customFilters, propertyName, tplObjects) {
            // here filterObject.filterObject is object
            if (filterObject.filterObject) {
                if (filterObject.type.toLowerCase() == 'main') {
                    filters.push(filterObject);
                } else {
                    var customFilterWrapped = _wrapCustomFilterObject(filterObject,
                        tplObjects[elem.odn], propertyName);
                    if (customFilterWrapped) {
                        customFilters.push(customFilterWrapped);
                    }
                }
            }
        };

        FilterObjectHandlerLocal.prototype.getFilterObject = function (elem, value, propertyName, currentProperty) {
            var filter = {
                'type': elem.DataType,
                'name': propertyName,
                'value': value
            };

            switch (elem.DataType) {
                case dataTypes.Date:
                case dataTypes.DateTime:
                    if (currentProperty.type == "before") {
                        filter.operator = '<=';
                    } else {
                        filter.operator = '>=';
                    }
                    break;
                case dataTypes.Text:
                case dataTypes.AutoText:
                case dataTypes.TextBox:
                case dataTypes.ParentRelationship:
                case dataTypes.ObjectRelationship:
                    filter.operator = 'like';
                    break;
                case dataTypes.DropDownList:
                case dataTypes.SearchableDropDownList:
                    filter.operator = '==';
                    break;
                case dataTypes.CheckBox:
                    filter.operator = '==';
                    filter.value = '1';
                    break;
                default:
                    filter = null;
            }

            return filter;
        };

        /// <summary>
        /// Method will create custom as filter object, that'll be passed to API
        /// </summary>
        /// <param name="elements">elements info array</param>
        function _wrapCustomFilterObject(filterObject, tplObjectArr, propertyName) {
            var wrappedFilter = null;
            tplObjectArr.properties.some(function (tplObj) {
                if (tplObj.propertyName == propertyName) {
                    wrappedFilter = {
                        key: tplObj.string,
                        value: filterObject.filterObject
                    };
                    return true;
                } else {
                    return false;
                }
            });

            return wrappedFilter;
        }


        return AdvancedSearchFilterExpressionService;
    }
]);