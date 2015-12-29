/**
 * Created by Мама on 13.06.15.
 */
speedupGridModule.factory('gridRefreshService', ['fieldPropertiesService', 'configService',
    function (fieldPropertiesService, configService) {
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        var GridRefreshService = function () {
        };
        // Not chekced
        GridRefreshService.removeObjectFromDS = function (data, odn, gridWidget) {
            // TODO: implement local refresh
            var eventOdn = data.odn;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }
            // DEBUG - remove (it's temp)
            gridWidget.dataSource.read();
//            gridWidget.refresh();
        };

        GridRefreshService.refreshObjectDS = function (data, odn, gridWidget) {
            // TODO: implement local refresh
            var eventOdn = data.ObjectDefinitionName;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }
            // DEBUG - remove (it's temp)
            gridWidget.dataSource.read();
//            gridWidget.refresh();

        };

        /// <summary>
        /// Method will update single field in grid data source
        /// </summary>
        /// <param name="data">params object</param>
        /// <param name="odn">grid odn</param>
        /// <param name="gridWidget">grid widget object</param>
        GridRefreshService.refreshSinglePropertyDS = function (data, odn, gridWidget) {
            var eventOdn = data.odn;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }

            // find refreshed property and change it in ds
            gridWidget.dataSource.data().some(function (element) {
                if (element.ObjectEntry_ID === data.recordId) {
                    element[data.fieldName] = data.fieldValue;

                    return true;
                } else {
                    return false;
                }
            });
            // Mark grid refreshed without API call
            // (do there's no need to refresh detail page, for example)
            gridWidget.refreshedWithoutAPICall = true;
            // refresh grid without reloading
            gridWidget.refresh();
        };
        /// <summary>
        /// Method will update multiple fields for multiple objects in grid data source
        /// </summary>
        /// <param name="data">params object</param>
        /// <param name="odn">grid odn</param>
        /// <param name="gridWidget">grid widget object</param>
        GridRefreshService.refreshMultiple = function (response, odn, gridWidget) {
            var eventOdn = response.odn;
            var data = response.data;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }

            // find refreshed property and change it in ds
            gridWidget.dataSource.data().forEach(function (element) {
                var elementIdx = $.inArray(element.ObjectEntry_ID, data.entries);
                // element is found in list of edited
                if (elementIdx != -1) {
                    // update values
                    data.data.forEach(function(property){
                        // get data type for property
                        var fieldProperties =
                            fieldPropertiesService.getAllPropertiesOfSingleField(property.name,odn);
                        var fieldType = fieldProperties.DataType;
                        if(fieldType == dataTypes.MultiObjectRelationshipField){
                            var fieldValues = property.value.split(":");
                            var valueForGrid;
                            // if we have 'full' value, trim it
                            if(fieldValues.length == 4){
                                valueForGrid = fieldValues[0] + ":" + fieldValues[1];
                            } else{
                                valueForGrid = property.value;
                            }
                            element[property.name] = valueForGrid;
                        } else{
                            element[property.name] = property.value;
                        }
                    });
                }
            });
            // Mark grid refreshed without API call
            // (do there's no need to refresh detail page, for example)
            gridWidget.refreshedWithoutAPICall = true;
            // refresh grid without reloading
            gridWidget.refresh();
        };

        GridRefreshService.refreshByGenericSearch = function (gridWidget, gridParameters, searchStr) {
            gridParameters.genericSearch = searchStr;

            gridWidget.dataSource.read();
//            gridWidget.refresh();
        };

        GridRefreshService.refreshByFilterExpression = function (gridWidget, gridParameters,
                                                                 searchStr, customASFilters) {
            gridParameters.filterExpression = searchStr;
            gridParameters.customASFilters = customASFilters;

            gridWidget.dataSource.read();
//            gridWidget.refresh();
        };

        return GridRefreshService;
    }]);