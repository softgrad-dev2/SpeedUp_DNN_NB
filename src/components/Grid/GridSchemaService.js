/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.factory('gridSchemaService', ['$q', 'configService', 'schemaService',
    'gridColumnsService', 'gridDataService',
    function ($q, configService, schemaService, gridColumnsService, gridDataService) {
        var GridSchemaService = function () {
        };

        /// <summary>
        /// Method calls API to get object schema for grid
        /// </summary>
        /// <param name="gridParameters">grid parameters object</param>
        GridSchemaService.getGridSchema = function (gridParameters) {
            return schemaService.getSchema(gridParameters.odn).then(function (schemaObj) {
                    if (!schemaObj) {
                        return null;
                    }
                    var selectedFields = [], columnsList = [];
                    var gConfig = configService.getGlobalConfig();
                    // for 'main' grid object also add fields from pageConfig.selectedFields
                    if (gridParameters.odn == gConfig.objectDefinitionName) {
                        selectedFields = _getVisibleFieldsByConfig(gConfig.selectedColumns, schemaObj.AllColumnsList);
                    } else {
                        selectedFields = schemaObj.SelectedColumnsList;
                    }
                    // if selected fields string contains fields -
                    // show all of them in order they appear
                    if (selectedFields.length) {
                        columnsList = gridColumnsService.getSelectedGridColumns(selectedFields, gridParameters, false);
                    } else {
                        columnsList = gridColumnsService.getSelectedGridColumns(schemaObj.AllColumnsList, gridParameters, true);
                    }

                    return {
                        GridSelectedColumnsList: columnsList,
                        TotalRecords: gridDataService.getTotalRecords(gridParameters),
                        Model: schemaObj.Model,
                        GridColumnsList: schemaObj.AllColumnsList
                    };
                }
            );
        };
        /// <summary>
        /// Method will get selected fields data by list of field names
        /// </summary>
        /// <param name="fieldsListStr">field names string</param>
        /// <param name="allFieldsArr">array of fields objects</param>
        function _getVisibleFieldsByConfig(fieldsListStr, allFieldsArr) {
            var cfgFields = fieldsListStr.split(',');
            var selectedFields = [];

            // index array of fields to get field by name
            var fieldsIndeces = {};
            allFieldsArr.forEach(function (field, idx) {
                fieldsIndeces[field.PropertyName] = idx;
            });

            var fieldIdx;
            cfgFields.forEach(function (fieldName) {
                fieldIdx = fieldsIndeces[fieldName];
                if (fieldIdx && allFieldsArr[fieldIdx]) {
                    selectedFields.push(allFieldsArr[fieldIdx]);
                }
            });

            return selectedFields;
        }

        // NOT USED NOW
        /// <summary>
        /// Method will get selected fields by merging array of selected
        // fields with array of fields passsed by names
        /// </summary>
        /// <param name="fieldsListStr">Selected fields string(from config)</param>
        /// <param name="selectedFields">Selected fields array to merge with</param>
        /// <param name="allFields">all fields array</param>
        function _mergeVisibleFieldsFromConfig(fieldsListStr, selectedFields, allFields) {
            // get field names from config str
            var cfgFields = fieldsListStr.split(',');
            // get field names from selected fields
            var selectedFieldsNames = selectedFields.map(function (field) {
                return field.PropertyName;
            });
            // get index:FieldName array from allFields
            var allFieldsIndeces = {};
            allFields.forEach(function (field, index) {
                allFieldsIndeces[field.PropertyName] = index;
            });
            // find all fields from cfgFields that are not listed in selectedFieldsName
            cfgFields.forEach(function (fieldName) {
                if (fieldName != "" && $.inArray(fieldName, selectedFieldsNames) == -1) {
                    var idx = allFieldsIndeces[fieldName];
                    // merge fields to result array
                    if (idx && allFields[idx]) {
                        var mergedField = allFields[idx];
                        mergedField.Visible = true;
                        selectedFields.push(mergedField);
                    }
                }
            });

            return selectedFields;
        }

        return GridSchemaService;
    }])
;
