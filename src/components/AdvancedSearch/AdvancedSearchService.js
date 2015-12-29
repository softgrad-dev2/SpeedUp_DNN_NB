/**
 * Created by antons on 4/8/15.
 */
CSVapp.factory('advancedSearchService', [
    '$rootScope', '$q', 'schemaService', 'configService', 'autocompleteService',
    'listDataLoaderService', 'fieldPropertiesService', 'advancedSearchFilterExpressionService',
    function ($rootScope, $q, schemaService, configService, autocompleteService, listDataLoaderService, fieldPropertiesService, advancedSearchFilterExpressionService) {
        // private fields
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;
        var propertyID = SUConstants.PropertyDefinitionID;


        var AdvancedSearchService = function () {

        };

        /*PUBLIC METHODS SECTION*/

        AdvancedSearchService.filterIsEmpty = function(filterObj, type){
            return advancedSearchFilterExpressionService.filterIsEmpty(filterObj, type);
        };
        /// <summary>
        /// method to set default values to advanced search fields
        /// </summary>
        /// <param name="propertyList">array of all field objects</param>
        /// <param name="elementParams">object with values of selected fields</param>
        AdvancedSearchService.setDefaultValues = function (propertyList, elementParams) {
            propertyList.forEach(function (elem) {
                switch (elem.DataType) {
                    case dataTypes.Date:
                    case dataTypes.DateTime:
                        // default value for Date fields before/after is "before"
                        elementParams[elem[propertyID]] = {
                            'type': 'before',
                            'valid': true
                        };
                }
            });
        };
        /// <summary>
        /// method to get all fields objects
        /// </summary>
        /// <param name="templateObjectsArray">template object</param>
        AdvancedSearchService.getFieldsObjects = function (templateObjectsArray) {
            var deferred = $q.defer();

            // get properties by Object Name
            var fieldsArr = [];
            var objectFieldsPromises = [];
            for (var odn in templateObjectsArray) {
                if (!templateObjectsArray.hasOwnProperty(odn)) {
                    return;
                }
                var fieldNames = templateObjectsArray[odn].properties.map(function (field) {
                    return field.propertyName;
                });
                objectFieldsPromises.push(
                    fieldPropertiesService.getAllPropertiesOfFieldsArrayPromise(fieldNames, odn)
                );
            }
            var resolvedPromisesCount = 0;
            // we could use $q.all(), but if one promise fails -
            // we'll have no data at all
            objectFieldsPromises.forEach(function (promise) {
                promise.then(function (objectFields) {
                    resolvedPromisesCount++;
                    objectFields.forEach(function (field) {
                        field.odn = objectFields.odn;
                        fieldsArr.push(field);
                    });
                    if (resolvedPromisesCount == objectFieldsPromises.length) {
                        deferred.resolve(fieldsArr);
                    }
                }, function () {
                    resolvedPromisesCount++;
                    if (resolvedPromisesCount == objectFieldsPromises.length) {
                        deferred.resolve(fieldsArr);
                    }
                })
            });

            return deferred.promise;
        };
        /// <summary>
        /// method to check, whether components options are set in right way
        /// </summary>
        /// <param name="options">options object</param>
        AdvancedSearchService.CheckOptions = function (options) {
            if (!options.odn || !options.propertyID || !options.propertyViewType) {
                return false;
            }
            return true;
        };
        /// <summary>
        /// Method creates object, having "filter" and "error" properties
        /// "filters" will be passed to other components, "customASFilters" will hold filters for parent or
        /// child objects,"errors" will be handled by validator
        /// depending on type will be used to filter "clientside" dataSource
        /// filter via API call
        /// </summary>
        /// <param name="elementParams">array with elements metadata</param>
        /// <param name="elements">elements array</param>
        /// <param name="tplObjects">array of as templates (fields meta)</param>
        AdvancedSearchService.createFilterObject = function(elementParams, elements, tplObjects, type) {
            var value, currentProperty, propertyName, currentPropertyIndex,
                propertyParentalFilterType, filterObject;
            var filters = [];
            var errors = [];
            var customFilters = [];

            elements.forEach(function (elem) {

                currentPropertyIndex = elem[propertyID];
                currentProperty = elementParams[currentPropertyIndex];
                value = currentProperty ? currentProperty.value : null;
                // extract values from dropDowns
                if (elem.DataType == dataTypes.DropDownList ||
                    elem.DataType == dataTypes.SearchableDropDownList) {
                    var elementKey = elem[propertyID];
                    var elementContainer = angular.element('#ddl_' + elementKey);
                    if (!elementContainer.length) {
                        debugger;
                    }
                    // sometimes element just won't wrap... So not to have a exception
                    var wrappedElement = elementContainer.data("kendoDropDownList");
                    if (wrappedElement) {
                        value = wrappedElement.value();
                    }
                }
                // Don't include empty fields
                if (!value) {
                    return;
                }
                propertyName = elem.PropertyName;
                propertyParentalFilterType = tplObjects[elem.odn].type;
                // if some fields have invalid values search won't be performed
                // instead "errors" property of returned object would contain error elements
                if (!_validateField(value, elem.DataType)) {
                    errors.push({
                        'type': elem.DataType,
                        'name': propertyName,
                        'value': value,
                        'index': elem[propertyID]
                    });
                } else {
                    filterObject = advancedSearchFilterExpressionService.getFilterObject(
                        elem, value, propertyParentalFilterType, propertyName, currentProperty, type);
                    advancedSearchFilterExpressionService.appendFilterObject(filterObject, elem, filters,
                        customFilters, propertyName, tplObjects, type, propertyParentalFilterType)
                }
            });

            var filtersProcessed = advancedSearchFilterExpressionService.processFilters(filters, type);

            return {
                filters: filtersProcessed,
                errors: errors,
                customASFilters: customFilters
            };
        };
        /// <summary>
        /// Method to wrap DropDown's and autocompletable fields
        /// </summary>
        /// <param name="propertyList">elements array</param>
        AdvancedSearchService.WrapElements = function (propertyList, elementParams) {
            _getPropertyPossibleValues(propertyList).then(function (dataObj) {
                var elementKey, elementContainer;
                // wrap dropDowns
                var listValues = $.isArray(dataObj.listObjects) ? dataObj.listObjects : [];
                listValues.forEach(function (list) {
                    elementKey = list["propertyId"];
                    elementContainer = angular.element('#ddl_' + elementKey);
                    elementContainer.kendoDropDownList({
                        dataSource: new kendo.data.DataSource({
                            data: list
                        }),
                        dataTextField: "Text",
                        dataValueField: "Value",
                        optionLabel: " "
                    });
//                    elementContainer.data("kendoDropDownList").value("");
                });
                // wrap parentRelationship fields
                var acValues = $.isArray(dataObj.acValues) ? dataObj.acValues : [];
                acValues.forEach(function (acObj) {
                    elementKey = acObj["propertyId"];
                    elementContainer = angular.element('#rel_' + elementKey);
                    var key = elementKey;
                    autocompleteService.wrapElement(null, elementContainer, acObj.odn, acObj.oid, acObj.values, {
                        width: 200
                    }, function (e) {
                        var item = e.item;
                        if (item) {
                            var value = item.text();
                            if (!elementParams[key]) {
                                elementParams[key] = { 'value': value };
                            } else {
                                elementParams[key].value = value;
                            }
                        }
                    }, true);
                });

            });
        };
        /// <summary>
        /// Method to set invalid fields valid
        /// </summary>
        /// <param name="elements">elements info array</param>
        AdvancedSearchService.ClearInvalidFields = function (elements) {
            for (elem in elements) {
                if (!elements.hasOwnProperty(elem)) {
                    continue;
                }
                elements[elem].valid = true;
            }
        };
        /// <summary>
        /// Method to set invalid fields valid
        /// </summary>
        /// <param name="elements">elements info array</param>
        AdvancedSearchService.ClearParamsValues = function (elementParams, fieldValues) {
            var ddlIds = _getDDLFieldsIds(fieldValues);
            for (param in elementParams) {
                if (!elementParams.hasOwnProperty(param)) {
                    continue;
                }
                if ($.inArray(param, ddlIds) != -1) {
                    var elementContainer = angular.element('#ddl_' + param);
                    var ddl = elementContainer.data("kendoDropDownList");
                    if (ddl) {
                        ddl.value("");
                    }
                } else {
                    elementParams[param].value = '';
                }

            }
        };

        /*PRIVATE METHODS SECTION*/

        /// <summary>
        /// Method to get possible field values
        // (autocomplete data for relational objects, list data for dropdowns ...)
        /// </summary>
        /// <param name="elements">elements array</param>
        function _getPropertyPossibleValues(elements) {
            var deferred = $q.defer();
            // list objects can come asynchronously
            var listObjectPromises = [];
            var listObjects = [];
            var acObjects = [];

            var listName;
            var acObj;

            elements.forEach(function (element) {
                switch (element.DataType) {
                    case dataTypes.DropDownList:
                    case dataTypes.SearchableDropDownList:
                        listName = element.InputSettings;
                        listObjectPromises.push(listDataLoaderService.GetListObject(listName, true).then(function (listObject) {
                            listObject.propertyId = element[propertyID];

                            return listObject;
                        }));
                        break;
                    case dataTypes.ParentRelationship:
                    case dataTypes.ObjectRelationship:
                        acObj = {};
                        var settings = element.InputSettings.split(':');
                        var relatedOID = settings[0];
                        var relatedODN = settings[1];
                        if (relatedOID && relatedODN) {
                            acObj.values = autocompleteService.getValuesByODN(relatedODN);
                            acObj.propertyId = element[propertyID];
                            acObj.oid = relatedOID;
                            acObj.odn = relatedODN;
                            acObjects.push(acObj);
                        }
                        break;
                }
            });
            // walk all listObject promises and resolve caller with results
            if (listObjectPromises.length) {
                $q.all(listObjectPromises).then(function (listObjects) {
                    deferred.resolve({'listObjects': listObjects, 'acValues': acObjects});
                })
            } else {
                deferred.resolve({'listObjects': listObjects, 'acValues': acObjects});
            }

            return deferred.promise;
        }

        /// <summary>
        /// Method to get id's of DropDown fields
        /// </summary>
        /// <param name="fieldValues">elements array</param>
        function _getDDLFieldsIds(fieldValues) {
            var ddlIds = [];
            fieldValues.forEach(function (elem) {
                if (elem.DataType == dataTypes.DropDownList ||
                    elem.DataType == dataTypes.SearchableDropDownList) {
                    ddlIds.push('' + elem[propertyID]);
                }
            });

            return ddlIds;
        }

        /// <summary>
        /// Method to validate a value of a filter
        /// </summary>
        /// <param name="value">filter value</param>
        /// <param name="type">element type</param>
        var _validateField = function (value, type) {
            switch (type) {
                case dataTypes.DateTime:
                case dataTypes.Date:
                    if (value) {
                        var date = kendo.parseDate(value);
                        if (date && !isNaN(date.getDate())) {
                            return true;
                        }
                    }
                    return false;
            }

            return true;
        }

        return AdvancedSearchService;
    }
]);