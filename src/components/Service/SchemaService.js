/**
 * Created by antons on 2/10/2015.
 */
CSVapp.factory('schemaService', ['$q', '$http', 'configService', 'conversionCacheService',
    'printTemplateCacheService', 'pageTemplateObjectService', 'pageTemplateObjectCacheService',
    function ($q, $http, configService, conversionCacheService, printTemplateCacheService, pageTemplateObjectService, pageTemplateObjectCacheService) {

        var gConfig = configService.getGlobalConfig();
        var odn = gConfig.objectDefinitionName;
        // cached properties
        var _objectDefinitionProperties = [];
        var _schema = [];
        var _subObjectsData = [];
        var _visibleColumns = [];
        var _conditionalFields = [];
        var _dropDownListOutputSettings = [];
        var _uniqueId = 0;

        // TODO: перенести методы 'preserve' в SchemaPreserver

        var SchemaService = function () {
        }

        /// <summary>
        /// method will translate the page title
        /// <param name="objectDefinitionName">object definition name</param>
        /// <param name="parentrecordName">parent record name</param>
        /// </summary>
        SchemaService.createPageTitle = function (objectDefinitionName, parentRecordName) {
            var separator = " >> ";
            var name = "";
            if (!objectDefinitionName || !parentRecordName) {
                separator = ""
            }

            return SchemaService.getObjectDefinition(objectDefinitionName).then(function (translatedName) {
                if (translatedName) {
                    name = translatedName.ObjectLabel;
                }
                name = parentRecordName ? name + separator + parentRecordName : name;

                return name;
            });

        };

        SchemaService.getDropDownListOutputSettings = function () {
            return _dropDownListOutputSettings;
        };

        // CHECKED
        SchemaService.preserveSubObject = function (subObject) {
            var objsub = _subObjectsData.filter(function (obj) {
                if (subObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (objsub == null || objsub == undefined) {
                _subObjectsData.push(subObject);
            }
        }

        SchemaService.getSubObjectByObjectDefinitionName = function (ObjectDefinitionName) {
            return _subObjectsData.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        }
        // Saves field to conditional fields cache
        SchemaService.PreserveConditionalFields = function (objToPreserve, odn) {
            var isExistObject = _conditionalFields.filter(function (obj) {
                if (obj.DefinitionName == odn && obj.PropertyId == objToPreserve.PropertyId) {
                    return obj;
                }
            })[0];
            if (isExistObject == undefined) {
                objToPreserve.DefinitionName = odn;
                _conditionalFields.push(objToPreserve);
            }
        };

        // Saves _dropDownListOutputSettings  cache
        SchemaService.PreserveConditionalFields = function (objToPreserve, odn) {
            var isObjExist = _dropDownListOutputSettings.filter(function (obj) {

                if (obj.DefinitionName == odn && obj.PropertyName == objToPreserve.PropertyName) {
                    return obj;
                }
            })[0];

            if (isObjExist == undefined) {
                _dropDownListOutputSettings.push(objToPreserve);
            }
        };

        // Method to get cached 'visible columns'
        SchemaService.GetVisibleColumns = function () {
            return _visibleColumns;
        }

        // CHECKED
        // became async
        /// <summary>
        /// Method which will return the object definition properties
        /// <param name="objectDefinitionName">definition name</param>
        /// </summary>
        SchemaService.getObjectDefinition = function (objectDefinitionName) {
            var deferred = $q.defer();

            if (!objectDefinitionName) {
                deferred.reject('No object definition name');
            }

            var obj = _getObjectDefinitionProperties(objectDefinitionName);
            if (!obj) {
                var objectDef = null;
                var url = configService.getUrlBase('objectDefinition') +
                    "/" + objectDefinitionName + "/" + gConfig.token;
                $http.get(url).success(function (objectDefinition) {
                    objectDef = objectDefinition;
                    _objectDefinitionProperties.push({
                        ObjectDefinitionName: objectDefinitionName,
                        ObjectDefinitionProperties: objectDefinition
                    });

                    deferred.resolve(objectDefinition);
                }).error(function () {
                        deferred.reject('Error loading page template object for \'' + objectDefinitionName + '\'');
                    });
            }
            else {
                deferred.resolve(obj.ObjectDefinitionProperties);
            }

            return deferred.promise;
        }
        // Checked
        /// <summary>
        /// Method calls API to get Schema json
        /// </summary>
        /// <param name="objectDefinitionname">objectDefinitionname</param>
        SchemaService.getSchema = function (objectDefinitionname) {
            var deferred = $q.defer();
            var objSchema = SchemaService.GetSchemaByObjectDefinitionName(objectDefinitionname);
            if (objSchema == null || objSchema == undefined) {
                _fetchSchemaXML(objectDefinitionname).then(function (schemaObject) {
                    deferred.resolve(schemaObject);
                }, deferred.reject)
            }
            else {
                deferred.resolve(objSchema);
            }

            return deferred.promise;
        };

        SchemaService.UniqueId = function (prefix) {
            var id = '' + ++_uniqueId;
            return prefix ? prefix + id : id;
        }
        /// <summary>
        /// Method to check if schema is in cache, otherwise fetch it from API
        /// for "Main" object on page
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propViewType">type that selects what properties to be listed in result (all, visible, selected etc)</param>
        SchemaService.GetVisibleFieldsDetails = function (odn, propViewType) {
            var deferred = $q.defer();

            _getFieldProperties(odn, propViewType).then(function (selectedFields) {
                deferred.resolve(selectedFields);
            });

            return deferred.promise;
        }
        // CHECKED
        /// <summary>
        /// Method to check if schema is in cache, otherwise fetch it from API
        /// for "Main" object on page
        /// </summary>
        SchemaService.Init = function () {
            var jsonStructure = gConfig.jsonStructure;
            _preserveSchemaJsonStructure(jsonStructure);
            if (!SchemaService.GetSchemaByObjectDefinitionName(odn)) {
                _fetchSchemaXML(odn);
            }
        };

        // checked
        var _getObjectDefinitionProperties = function (objectDefinitionName) {
            return _objectDefinitionProperties.filter(function (obj) {
                if (obj.ObjectDefinitionName == objectDefinitionName) {
                    return obj
                }
            })[0];
        }
        // CHECKED
        SchemaService.EmptySchema = function (objectDefinitionName) {
            var deferred = $q.defer();
            var objSchema = SchemaService.GetSchemaByObjectDefinitionName(objectDefinitionName);
            var emptySchema = [];
            var emptyObject = {};
            if (objSchema == undefined || objSchema == null || objSchema.AllColumnsList.length == 0) {
                _fetchSchemaXML(objectDefinitionName).then(function (schemaObj) {
                    var columnsList = schemaObj.AllColumnsList;
                    for (var column in columnsList) {
                        if (columnsList[column].Visible != undefined || columnsList[column].Visible != null || columnsList[column].Visible == true || columnsList[column].Visible == undefined) {
                            emptyObject[columnsList[column].PropertyName] = null;
                        }
                    }
                    emptySchema.push(emptyObject);
                    deferred.resolve(emptySchema);
                }, function (error) { // in case of API call error
                    // log error and return empty schema
                    deferred.resolve(emptySchema);
                });
            } else {
                var columnsList = objSchema.AllColumnsList;
                for (var column in columnsList) {
                    if (columnsList[column].Visible != undefined || columnsList[column].Visible != null || columnsList[column].Visible == true || columnsList[column].Visible == undefined) {
                        emptyObject[columnsList[column].PropertyName] = null;
                    }
                }
                emptySchema.push(emptyObject);
                deferred.resolve(emptySchema);
            }

            return deferred.promise;
        };

        // CHECKED
        /// <summary>
        /// Method to get existing config().Schema object (if exists).
        /// </summary>
        /// <param name="ObjectDefinitionName">ObjectDefinitionName to check if exists</param>
        /// <param name="schemaArray">has all the existing objects of schemas</param>
        SchemaService.GetSchemaByObjectDefinitionName = function (ObjectDefinitionName) {
            return _schema.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        };
        // CHECKED
        /// <summary>
        /// method will return model object for grid's datasource .
        /// this model object contains configured columns.
        /// </summary>
        /// <param name="columnsList">has array of visible columns</param>
        SchemaService.CreateModelSchema = function (columnsList) {
            var model = new Object();
            var strfields = "{";
            for (var column in columnsList) {
                switch (columnsList[column].DataType) {
                    case gConfig.dataTypes.DateTime:
                        strfields += '"' + columnsList[column].PropertyName + '": {"type":"date"},';
                    case gConfig.dataTypes.Date:
                        strfields += '"' + columnsList[column].PropertyName + '": {"type":"date"},';
                        break;
                }
            }
            strfields = strfields.substring(0, strfields.length - 1) + "}";
            model.id = gConfig.modelId;
            model.fields = JSON.parse(strfields);
            return model;
        };

        SchemaService.FilterFieldsSelected4Template = function (fields, selectedColumns) {
            // in case of absent 'selectedColumns' string - use one from gConfig.
            // But be careful, because it's taken for 'main' objectDefinitionName
            selectedColumns = selectedColumns || gConfig.selectedColumns;
            var selectedFields = [];
            var indecesObj = _getFieldsValuesIndeces(fields);

            var index;
            var SelectedColumnsArrayList = selectedColumns.split(",");
            SelectedColumnsArrayList.forEach(function (column) {
                if (column != "") {
                    var trimmedColumn = column.replace(/[[\]]/g, '');
                    index = indecesObj[trimmedColumn];
                    if (index != null && index != undefined) {
                        // find a property in field list and push it
                        selectedFields.push(fields[index]);
                    }
                }
            });

            return selectedFields;
        };
        // CHECKED
        /// <summary>
        /// Method to get selected fields by an option (used for advanced search now)
        /// </summary>
        /// <param name="fields">array of object properties</param>
        /// <param name="jsonSettings">json settings for that object</param>
        /// <param name="propViewType">checks what properties to use (all|selected|visible|jsonSelected)</param>
        function _getVisibleFields(fields, jsonSettings, propViewType, selectedFieldsString) {
            var fieldsSelected4Template = [];
            if (!angular.isArray(fields)) {
                return [];
            }
            switch (propViewType) {
                case "all":
                    fieldsSelected4Template = fields;
                    break;
                case "selected":
                    fieldsSelected4Template = SchemaService.FilterFieldsSelected4Template(fields, selectedFieldsString);
                    break;
                case "jsonSelected":
                    if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedColumnsForTemplate) {
                        fieldsSelected4Template = SchemaService.FilterFieldsSelected4Template(fields, jsonSettings[0].SelectedColumnsForTemplate)
                    }
                    break;
                case "visible":
                    fieldsSelected4Template = fields.filter(function (elem) {
                        return elem.Visible;
                    });
                    break;
            }

            return fieldsSelected4Template;
        }

        // CHECKED
        function _getFieldsValuesIndeces(fields) {
            var fieldsIndecesObj = {};
            fields.forEach(function (elem, key) {
                fieldsIndecesObj[elem.PropertyName] = key;
            })

            return fieldsIndecesObj;
        }

        // CHECKED
        /// <summary>
        /// Method to get schema from cache or fetch it from API
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propViewType">checks what properties to use (all|visible|selected4template)</param>
        function _getFieldProperties(odn, propViewType) {
            var deferred = $q.defer();

            var schema = null;
            var columnsList = null;
            var fieldsSelected4Template = [];
            var jsonSettings;
            var pageTemplateName = gConfig.pageTemplateName;
            // try to get field info from schema cache
            if (odn != undefined && odn != null) {
                schema = _schema.filter(function (obj) {
                    if (odn == obj.ObjectDefinitionName) {
                        return obj
                    }
                })[0];
            }
            // if schema is in cache
            if (schema) {
                columnsList = schema.AllColumnsList;
                // get object settings from cache or make API call
                pageTemplateObjectService.getObjectTemplateSettings(odn).then(function (jsonSettings) {
                    // get fields selected for template
                    fieldsSelected4Template = _getVisibleFields(columnsList, jsonSettings, propViewType);

                    deferred.resolve(fieldsSelected4Template);
                });
            }
            else { // need to fetch schema from API
                pageTemplateObjectService.getObjectTemplateSettings(odn).then(function (jsonSettings) {
                    var errorClbk = function () {
                        fieldsSelected4Template = _getVisibleFields(gConfig.visibleColumns, jsonSettings, propViewType);
                        deferred.resolve(fieldsSelected4Template);
                    }
                    var successClbk = function (schemaObj) {
                        var fields = schemaObj.AllColumnsList;
                        fieldsSelected4Template = _getVisibleFields(fields, jsonSettings, propViewType);
                        deferred.resolve(fieldsSelected4Template);
                    }
                    _fetchSchemaXML(odn).then(successClbk, errorClbk);
                });
            }

            return deferred.promise;
        }

        function _fetchSchemaXML(odn){
                var deferred = $q.defer();

                var url = 'http://185.31.160.22/shop';
                    var PostData = '<Context   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'+
                        '<TypeName>'+ odn +'</TypeName>'+
                        '<OperationName>GetObjectMetaData</OperationName>'+
                        '</Context>';
            $.ajax({
                type: 'post',
                dataType: 'xml',
                data: PostData,
                url: url
            }).success(function (response) {
                    var columnslist = _parseXMLResponse(response);
                    _fillSchema(columnslist, odn);
                    var schemaObject = SchemaService.GetSchemaByObjectDefinitionName(odn);
                    deferred.resolve(schemaObject);
                }).error(function (xhr, ajaxOptions, thrownError) {
                    debugger;
                    var responseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (responseCodeValue == "UnAuthorized") {
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    }
                    else {
                        deferred.reject(url + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                    }
                });

            return deferred.promise;
        }
        var _mappedProperties = {
            "Name": "PropertyName",
            "Type": "DataType",
            "Mandatory": "IsRequired"
        };
        function _getMapppedPropertyName(propertyName){
            return _mappedProperties[propertyName] || propertyName;
        }
        var _mappedDataTypes = {
            "String": "Text",
            "Int32": "Numeric"
        }
        function _getMapppedDataType(dataType){
            return _mappedDataTypes[dataType] || dataType;
        }
        function _parseXMLResponse(response){
            var properties = [{
                PropertyName: "CreatedDate",
                DataType: gConfig.dataTypes.Date
            }];
            $(response).find('EntityItem').each(function(k, entry){
                $(entry).find('Attributes').children().each(function(i, attr){
                    var property = {};
                    for (i = 0; i <attr.attributes.length; i++) {
                        var propertyName = attr.attributes[i].name;
                        var mappedPropName = _getMapppedPropertyName(propertyName);
                        var propertyValue = attr.attributes[i].nodeValue;;
                        if(mappedPropName == "DataType"){
                            property[mappedPropName] = _getMapppedDataType(propertyValue);
                        } else{
                            property[mappedPropName] = propertyValue;
                        }
                    }
                    properties.push(property);
                });

            });

            return properties;
        }
        // CHECKED
        /// <summary>
        /// Method to fetch schema from API
        /// </summary>
        /// <param name="odn">object definition name</param>
        function _fetchSchema(odn) {
            var deferred = $q.defer();

            var urlBase = configService.getUrlBase('getObjectSchema');
            if (urlBase) {
                var url = urlBase + "/" + odn + "/" + gConfig.token;
                var PostData = gConfig.postData;
                PostData.Clear();
                PostData.RequestType = "Heads";

                $http.get(url).success(function (columnslist) {
                    _fillSchema(columnslist, odn);
                    var schemaObject = SchemaService.GetSchemaByObjectDefinitionName(odn);
                    deferred.resolve(schemaObject);
                }).error(function (xhr, ajaxOptions, thrownError) {
                        var responseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (responseCodeValue == "UnAuthorized") {
                            deferred.reject(xhr.getResponseHeader('ResponseCode'));
                        }
                        else {
                            deferred.reject(urlBase + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                        }
                    }
                );
            }
//                $.ajax({
//                    type: "GET",
//                    url: url,
//                    data: PostData,
//                    dataType: "json",
//                    success: ,
//                    error: );
//            }
            else {
                deferred.reject("Wrong url 'getObjectSchema' in _fetchSchema method");
            }

            return deferred.promise;
        }

        // CHECKED
        /// <summary>
        /// To get template of Kendo grid column based on datatype.
        /// </summary>
        /// <param name="dataType">dataType of property</param>
        /// <param name="propertyName">to replace @ with propertyname</param>
        function _fillSchema(columnsList, objectDefinitionName) {
            var schemaObject = new Object;
            schemaObject.ObjectDefinitionName = objectDefinitionName;
            schemaObject.AllColumnsList = columnsList;
            schemaObject.SelectedColumnsList = new Array();
            for (var columnNo in columnsList) {
                var column = new Object();
                if (columnsList[columnNo].Visible != undefined && columnsList[columnNo].Visible != null && columnsList[columnNo].Visible == true) {
                    column = columnsList[columnNo];
                    schemaObject.SelectedColumnsList.push(column);
                }
            }
            schemaObject.Model = SchemaService.CreateModelSchema(columnsList);
            _preserveSchema(schemaObject);

            return schemaObject
        }

        // CHECKED
        /// <summary>
        /// method will return presaved schema .
        /// this model object contains configured columns.
        /// </summary>
        /// <param name="schemaObject">has array of visible columns</param>
        function _preserveSchema(schemaObject) {
            var schema = _schema.filter(function (obj) {
                if (schemaObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (schema == null || schema == undefined) {
                _schema.push(schemaObject);
            }
        };
        // NOT CHECKED
        /// <summary>
        /// method will preserve all object from Json Structure
        /// </summary>
        function _preserveSchemaJsonStructure(jsonStructure) {
            if (jsonStructure != '') {
                jsonStructure = JSON.parse(jsonStructure);

                var objects = Object.keys(jsonStructure);
                if (objects != null && objects.length > 0) {

                    for (k = 0; k < objects.length; k++) {
                        var objectDefinitionName = objects[k];

                        //Preserve Object Definition
                        var objectDefinition = _getObjectDefinitionFromJsonStructure(objectDefinitionName, jsonStructure);
                        if (objectDefinition != null) {
                            var obj = new Object();
                            obj.ObjectDefinitionName = objectDefinitionName;
                            obj.ObjectDefinitionProperties = objectDefinition;
                            _objectDefinitionProperties.push(obj);
                        }

                        //Preserve Property Schema
                        var columnslist = _getPropertiesColumnFromJsonStructure(objectDefinitionName, jsonStructure);
                        if (columnslist != null)
                            _fillSchema(columnslist, objectDefinitionName);

                        ////Preserve SubObjects
                        var subObjects = _getSubObjectFromJsonStructure(objectDefinitionName, jsonStructure);

                        var obj = new Object();
                        obj.ObjectDefinitionName = objectDefinitionName;
                        obj.SubObjectsObject = subObjects != null ? subObjects : null;
                        SchemaService.preserveSubObject(obj);

                        ////Preserve PageTemplate
                        var pageTemplateSettings = _getPageTemplateFromJsonStructure(objectDefinitionName, jsonStructure);

                        var pageobj = new Object();
                        pageobj.ObjectDefinitionName = objectDefinitionName;
                        if (pageTemplateSettings != null && pageTemplateSettings.length != undefined) {
                            pageobj.PageTemplate = pageTemplateSettings;
                        }
                        else {
                            pageobj.PageTemplate = [];
                        }
                        pageTemplateObjectCacheService.preservePageTemplate(pageobj);

                        ////Preserve ConversionList
                        var response = _getConversionListFromJsonStructure(objectDefinitionName, jsonStructure);
                        if (response != null) {
                            var objConversion = new Object();
                            objConversion.ObjectDefinitionName = objectDefinitionName;
                            objConversion.ConversionList = response;
                            conversionCacheService.preserveConversionObject(objConversion);
                        }
                        ////Preserve Print Object
                        var responsePrint = _getPrintTemplateFromJsonStructure(objectDefinitionName, jsonStructure);

                        var objPrint = new Object();
                        objPrint.ObjectDefinitionName = objectDefinitionName;
                        objPrint.PrintTemplateList = responsePrint != null ? responsePrint : null;
                        printTemplateCacheService.preservePrintTemplateObject(objPrint);
                    }
                }
            }
        }

        // CHECKED
        /// <summary>
        /// method will get Print Template from JsonStructure With ObjectName
        /// </summary>
        function _getPrintTemplateFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].PrintTemplate;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get ConversionList from JsonStructure With ObjectName
        /// </summary>
        function _getConversionListFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].ConversionList;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get PageLayout from JsonStructure With ObjectName
        /// </summary>
        function _getPageTemplateFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].PageTemplate;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get Subobject from JsonStructure With ObjectName
        /// </summary>
        function _getSubObjectFromJsonStructure(objectDefinitionName, json) {
            var filterObject = $.grep(Object.keys(json), function (k) {
                if (json[k].ParentObjectName === objectDefinitionName) {
                    return Object.keys(json);
                }
            })

            var subObjectList = [];

            if (filterObject != null && filterObject.length > 0) {
                for (i = 0; i < filterObject.length; i++) {
                    var objectDefinition = _getObjectDefinitionFromJsonStructure(filterObject[i], json);
                    if (objectDefinition) {
                        var subObject = new Object();
                        subObject.ObjectDefinitionID = objectDefinition["ObjectDefinition_ID"];
                        subObject.ObjectDefinitionName = objectDefinition["ObjectName"];

                        subObject.PropertyDefinitionID = json[filterObject[i]].PropertyDefinitionID; //filterObject[i]; //PropertyId of Parent Object
                        subObject.PropertyName = json[filterObject[i]].ParentPropertyName;
                        subObject.ObjectLabel = objectDefinition.ObjectLabel;
                        subObjectList.push(subObject);
                    }
                }
                return subObjectList;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get ObjectDefinition from JsonStructure With ObjectName
        /// </summary>
        function _getObjectDefinitionFromJsonStructure(objectDefinitionName, json) {
            if (json[objectDefinitionName] != null) {
                return json[objectDefinitionName].ObjectDefinition;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get Properties from JsonStructure With ObjectName
        /// </summary>
        function _getPropertiesColumnFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].PropertyDefinition;
            }
            else {
                return null;
            }

        }

        return SchemaService;
    }
]);