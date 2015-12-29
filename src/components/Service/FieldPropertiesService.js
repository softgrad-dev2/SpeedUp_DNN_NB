/**
 * Created by antons on 5/26/15.
 */
CSVapp.factory('fieldPropertiesService', ['schemaService',
    function (schemaService) {
        var FieldPropertiesService = {

        };

        //  <summary>
        /// Method will return properties of array of fields
        /// IS ASYNC
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        /// <return> promise </return>
        FieldPropertiesService.getAllPropertiesOfFieldsArrayPromise = function (fieldNamesArray, odn) {
            return schemaService.getSchema(odn).then(function(schema){
                var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

                var fields = _getAllPropertiesOfFieldsArray(fieldNamesArray, columnsList, odn);
                fields.odn = odn;

                return fields;
            });
        };

        //  <summary>
        /// Method will return properties of array of fields
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        FieldPropertiesService.getAllPropertiesOfFieldsArray = function (fieldNamesArray, odn) {
            var schema = null;
            if (odn) {
                schema = schemaService.GetSchemaByObjectDefinitionName(odn);
            }
            var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

            return _getAllPropertiesOfFieldsArray(fieldNamesArray, columnsList, odn);
        };

        //  <summary>
        /// Method will return properties of single field
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        FieldPropertiesService.getAllPropertiesOfSingleFieldPromise = function (fieldName, odn) {
            return schemaService.getSchema(odn).then(function(schema){
                var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

                var fields = _getAllPropertiesOfSingleField(fieldName, odn, columnsList);
                fields.odn = odn;

                return fields;
            });

        };

        //  <summary>
        /// Method will return properties of single field
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        FieldPropertiesService.getAllPropertiesOfSingleField = function (fieldName, odn) {
            var schema = null;
            if (odn) {
                schema = schemaService.GetSchemaByObjectDefinitionName(odn);
            }
            var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

            return _getAllPropertiesOfSingleField(fieldName, odn, columnsList);
        };

        /*Private Methods*/

        //  <summary>
        /// Method will return properties of single field
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        function _getAllPropertiesOfSingleField(fieldName, odn, columnsList) {
            var objField = {};
            // trace all settings fields to find 'fieldName'
            columnsList.some(function (column) {
                var propertyName = column.PropertyName;
                // found it and it's visible
                if (column.Visible && propertyName == fieldName) {
                    objField = _createFieldObjectStub(column);
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 1 : 1;
                    objField.PropertyName = column.PropertyName;
                    _splitOutputSettings(column, odn);

                    return true;
                } else if ((propertyName == "CreatedBy" && propertyName == fieldName) || (propertyName == "ChangedBy" && propertyName == fieldName)) {
                    objField = _createFieldObjectStub(column);
                    objField.PropertyName = column.field;
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 501 : 501;

                    return true;
                } else if (propertyName == fieldName && !column.Visible) {
                    // also, don't trace trailing elements if
                    // we found 'fieldName' and it's invisible
                    return true;
                }

            });

            return objField;
        };

        //  <summary>
        /// Method will return properties of array of fields
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        function _getAllPropertiesOfFieldsArray(fieldNamesArray, columnsList, odn) {
             var objField = {};
            // var for result
            var fieldsWithSettings = [];
            // turn columnsList into hash-table with property name as keys
            var columns = _convertColumnsListToHash(columnsList);

            fieldNamesArray.forEach(function (fieldName) {
                var column = columns[fieldName];
                if (!column) {
                    return;
                }
                var propertyName = column.PropertyName;
                // found it and it's visible
                if (column.Visible && propertyName == fieldName) {
                    objField = _createFieldObjectStub(column);
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 1 : 1;
                    objField.PropertyName = column.PropertyName;
                    _splitOutputSettings(column, odn);

                    fieldsWithSettings.push(objField);
                } else if ((propertyName == "CreatedBy" && propertyName == fieldName) || (propertyName == "ChangedBy" && propertyName == fieldName)) {
                    objField = _createFieldObjectStub(column);
                    objField.PropertyName = column.PropertyName;
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 501 : 501;

                    fieldsWithSettings.push(objField);
                }
            });

            return fieldsWithSettings;
        }

        //  <summary>
        /// Method will turn columnsList array to hash with 'PropertyName' as key
        /// </summary>
        /// <param name="columnsListArray">array of column settings objects</param>
        function _convertColumnsListToHash(columnsListArray) {
            var columnsHash = {};
            var propertyName;
            columnsListArray.forEach(function (element) {
                propertyName = element.PropertyName;
                columnsHash[propertyName] = element;
            });

            return columnsHash;
        }

        //  <summary>
        /// Method will return stub of field Object with common parameters
        /// </summary>
        /// <param name="column">field settings object</param>
        function _createFieldObjectStub(column) {
            return {
                DataType: column.DataType,
                PropertyLabel: column.PropertyLabel,
                InputSettings: column.InputSettings,
                OutputSettings: column.OutputSettings,
                ObjectEntry_fk: column.ObjectEntry_fk,
                PropertyDefinition_ID: column.PropertyDefinition_ID,
                DefaultValue: column.DefaultValue,
                Required: column.Required,
                SystemProperty: column.SystemProperty
            };
        }

        //  <summary>
        /// Method will split output settings of column and preserve
        //  them in schema-cache if needed
        /// </summary>
        /// <param name="column">field settings object</param>
        /// <param name="odn">object definition name</param>
        function _splitOutputSettings(column, odn) {
            var str = column.OutputSettings;
            var data = str.split("[#][@]");
            if (data.length > 2) {
                var data1 = data[data.length - 1].split("[#]");
                var objMain = {
                    DefinitionName: odn,
                    PropertyId: column.PropertyDefinition_ID,
                    PropertyName: column.PropertyName,
                    InputSettings: column.InputSettings,
                    DataType: column.DataType
                }
                var arr = [];
                for (var i = 0; i < data1.length; i++) {
                    if (i > 0) {
                        var subdata = data1[i].split("[&]");
                        for (var j = 0; j < subdata.length; j++) {
                            var subdata1 = subdata[j].split("[$]");
                            if (subdata1.length > 1) {
                                var subdata2 = $.trim(subdata1[0]).split("}");

                                for (var i = 0; i < subdata2.length; i++) {
                                    var data11 = subdata2[i].split("{");
                                    if (data11.length > 1) {
                                        var property_def_id = $.trim(data11[data11.length - 1]);

                                        var objNew = {
                                            PropertyId: "{" + property_def_id + "}",
                                            Value: "",
                                            Expression: $.trim(subdata1[0]),
                                            List: $.trim(subdata1[1])
                                        };
                                        arr.push(objNew);
                                        schemaService.PreserveConditionalFields(objNew, odn);
                                    }
                                }
                            }
                        }
                    }
                }
                objMain.Data = arr;
                schemaService.PreserveConditionalFields(objMain, odn);
            }
        }

        return FieldPropertiesService;
    }]);