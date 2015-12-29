/**
 * Created by antons on 4/10/15.
 */
CSVapp.factory('autocompleteService', ['configService', 'eventManager',
    function (configService, eventManager) {
        var gConfig = configService.getGlobalConfig();

        // cached ac data
        var _autocompleteData = [];
        // cached fields, wrapped with ac functionality
        var _autocompleteFields = {};
        var _uniqueId = 0;

        var AutocompleteService = function () {};
        /*PUBLIC METHODS*/

        AutocompleteService.getValuesWithIds =function(fieldId){
            var valuesObj = [];
            if (fieldId && _autocompleteData['Values'] && _autocompleteData['Values'][fieldId]){
                var acValues = _autocompleteData['Values'][fieldId]['Values'];
                for (var elementId in acValues){
                    if(!acValues.hasOwnProperty(elementId)){
                        return false;
                    }
                    valuesObj.push({
                        id: elementId,
                        text: acValues[elementId]
                    })
                }
            }

            return valuesObj;
        };

        /// <summary>
        /// Method to wrap input with autocomplete
        /// </summary>
        /// <param name="container">container of a form with fields (e.g. Detail Page container)</param>
        /// <param name="element">input to be wrapped</param>
        /// <param name="propertyName">name of the property (object definition name)</param>
        /// <param name="objectDefinitionID">property id</param>
        /// <param name="acData">array of values (optional)</param>
        /// <param name="options">array of widget options to override defaults</param>
        /// <param name="onChange">function to be called in widget 'onChange' handler</param>
        /// <param name="dontUpdateDeps">if true - dependencies won't be updated</param>
        /// <param name="relatedPropertyName">name of related object</param>
        AutocompleteService.wrapElement = function (container, element, propertyName, objectDefinitionID,
                                                    acData, options, onChange, dontUpdateDeps, relatedObjectName) {
            var fieldId = $.data(element[0], 'jqacuid');
            if (!fieldId) {
                $.data(element[0], 'jqacuid', _getUniqueAcId());
            }
            // if we have already wrapped the element and
            // only need to modify data source
            if (fieldId && _autocompleteFields[fieldId] &&
                _autocompleteFields[fieldId].element) {
                // if we pass data - set it as data source
                if ($.isArray(acData)) {
                    var acFieldWidget = _autocompleteFields[fieldId].element.data("kendoAutoComplete");
                    if (acFieldWidget) {
                        acFieldWidget.dataSource.data(acData);
                    }
                } else {
                    // do nothing. Maybe we just clicked 'inline edit' for property,
                    // that has been already updated by _updateDependencies
                }
            } else {
                // if no acData passed - find it in cache
                if (!$.isArray(acData)) {
                    if (_autocompleteData["Values"] && _autocompleteData["Values"][objectDefinitionID])
                        acData = _getDataSource(_autocompleteData["Values"], objectDefinitionID);
                    // Sometimes if id-bindings are wrong we may try
                    // to find acData by propertyName
                    if (!acData) {
                        acData = _getDataByODN(propertyName);
                        // try to find by related object name
                        if (!acData.length && relatedObjectName) {
                            acData = _getDataByODN(relatedObjectName);
                        }
                    }
                    acData = acData || [];
                }
                var newFieldId = $.data(element[0], 'jqacuid', _getUniqueAcId());
                var defaultSettings = {
                    dataSource: acData,
                    filter: "contains",
                    placeholder: "",
                    separator: "",
                    animation: false,
                    select: function (e) {
                        if (e.item && e.item.text()) {
                            var value = e.item.text();
                            //put object_ID into hidden field
                            var propertyID = _getPropertyIdByName(_autocompleteData["Values"], objectDefinitionID, value);
                            if(!propertyID && relatedObjectName){
                                propertyID = _getValueIDByObjectName(relatedObjectName ,value);
                            }
                            if (propertyID) {
                                container.find("#hdn" + propertyName).val(propertyID);
                                container.find("#txt" + propertyName).val(value);
                            }
                            // find all autocomplete fields in container
                            var currentContainerACFields = _findAutocompleteFieldsInContainer(container);
                            if (currentContainerACFields.length && !dontUpdateDeps) {
                                _updateDependencies(_autocompleteFields, _autocompleteData, container,
                                    currentContainerACFields, objectDefinitionID, value, relatedObjectName);
                            }
                            if ($.isFunction(onChange)) {
                                onChange(e);
                            }
                        }
                    }
                };
                // apply additional options
                var acObj = angular.isObject(options) ?
                    angular.extend({}, defaultSettings, options) :
                    defaultSettings;

                _autocompleteFields["" + newFieldId] = {
                    element: element.kendoAutoComplete(acObj),
                    propertyName: propertyName,
                    oid: objectDefinitionID
                };
            }
        };

        /// <summary>
        /// Method to get autocomplete data by object definition name
        /// </summary>
        /// <param name="odn">object definition name</param>
        AutocompleteService.getValuesByODN = function (odn) {
            var data = [];
            if (!_autocompleteData) {
                AutocompleteService.prepareACData(acData);
            }
            if (_autocompleteData) {
                data = _getDataByODN(odn);
            }

            return data;
        };
        /// <summary>
        /// brings the autocomplete data to a needed format
        /// </summary>
        /// <param name="acData">array of unformatted autocomplete data</param>
        AutocompleteService.prepareACData = function (acData) {
            var acDataMerged = _mergeACData(acData);
            var preparedData = {};
            if (!acDataMerged["Values"]) {
                return null;
            }
            preparedData["Values"] = acDataMerged["Values"];
            //adds reversed dependencies, so if "child" value changes "parent" also filters
            preparedData["Values"] = _addInvertedValues(preparedData["Values"]);
            if (acDataMerged["Dependencies"]) {
                preparedData["Dependencies"] = acDataMerged["Dependencies"];
                _fixDependencies(preparedData["Dependencies"]);
                // adds inversed relations for field "id"->"field_value" to increase search
                _addInversedRelations(preparedData["Dependencies"]);
            }

            _autocompleteData = preparedData;
        };

        /*PRIVATE  METHODS*/

        /// <summary>
        /// returns data for particular object by its name
        /// </summary>
        /// <param name="objectDefinitionName">object definition name</param>
        function _getDataByODN(objectDefinitionName) {
            if (_autocompleteData && _autocompleteData["Values"]) {
                var acData = _autocompleteData["Values"];
                for (var acKey in acData) {
                    if (acKey === 'length' || !acData.hasOwnProperty(acKey)) continue;
                    if (acData[acKey]["Name"] == objectDefinitionName || acData[acKey]["RelatedEntityName"] == objectDefinitionName) {
                        return _getDataSource(acData, acKey);
                    }
                }
            }

            return [];
        }
        /// <summary>
        /// returns data source for a particular field
        /// </summary>
        /// <param name="autocompleteData">autocomplete data</param>
        /// <param name="propertyDefinitionID">property id</param>
        function _getDataSource(autocompleteData, propertyDefinitionID) {
            try {
                var acData = autocompleteData[propertyDefinitionID]["Values"] || [];
                var dataSource = [];
                for (var acKey in acData) {
                    if (acKey === 'length' || !acData.hasOwnProperty(acKey)) continue;
                    dataSource.push(acData[acKey]);
                }

                return dataSource;
            } catch (e) {
                return [];
            }
        }
        // <summary>
        /// returns array of _acFields id-s of autocomplete fields in that container
        /// </summary>
        /// <param name="container">fields container</param>
        function _findAutocompleteFieldsInContainer(container) {
            var dataTypes = gConfig.dataTypes;
            var acFields = [];
            if (!container) {
                return acFields;
            }
            container.find('._keycontainer').each(function (key, element) {
                var dataType = angular.element(element).attr('dtype');
                if (dataType === dataTypes.ParentRelationship ||
                    dataType === dataTypes.ObjectRelationship) {
                    var key = angular.element(element).attr('key');
                    var acElement = $(element).find('#txt' + key);
                    if (acElement.length) {
                        var jqacFieldId = $.data(acElement[0], 'jqacuid');
                        if (jqacFieldId) {
                            acFields.push(jqacFieldId)
                        }
                    }
                }
            });

            return acFields;
        }
        // <summary>
        /// updates values of all dependant fields
        /// </summary>
        /// <param name="acFields">all fields wrapped with ac</param>
        /// <param name="acData">ac values</param>
        /// <param name="container">fields container</param>
        /// <param name="containerACFields">id-s of ac fields in particular container</param>
        /// <param name="objectId">property id</param>
        /// <param name="value">value</param>
        function _updateDependencies(acFields, acData, container, containerACFields, objectId, value, relatedObjectName) {
            if (!acData) {
                return
            }
            var acValues = acData["Values"];
            var acDeps = acData["Dependencies"];
            if (!acValues || !acDeps) {
                return
            }
            var updatedFields = [];
            var valueId = _getPropertyIdByName(acValues, objectId, value);
            if(!valueId && relatedObjectName){
                valueId = _getValueIDByObjectName(relatedObjectName ,value);
            }
            // main logic comes there. And available for recursion
            _doUpdateDependencies(acFields, acDeps, acValues, container,
                containerACFields, objectId, valueId, updatedFields, relatedObjectName);
        }

        // <summary>
        /// recursive function to do actual dependencies update
        /// </summary>
        /// <param name="acFields">all fields wrapped with ac</param>
        /// <param name="acDeps">fields dependencies</param>
        /// <param name="acValues">values for ac fields</param>
        /// <param name="container">fields container</param>
        /// <param name="containerACFields">id-s of ac fields in particular container</param>
        /// <param name="objectId">property id</param>
        /// <param name="valueId">id of a value</param>
        /// <param name="updatedFields">list of already updated fields</param>
        /// <param name="relatedObjectName">related object name</param>
        function _doUpdateDependencies(acFields, acDeps, acValues, container, containerACFields,
                                       objectId, valueId, updatedFields, relatedObjectName) {
            //if field has a related field
            objectId = "" + objectId;
            updatedFields.push(objectId);
            // find dependant fields in current container
            var allDependentFieldsInfo = acDeps[objectId];
            var acFieldsKey;
            for (key in allDependentFieldsInfo) {
                if (key === 'length' || !allDependentFieldsInfo.hasOwnProperty(key)) {continue;};
                // loop through all ac-fields in current container
                // to find ones to be updated
                for (key1 in containerACFields) {
                    if (key1 === 'length' || !containerACFields.hasOwnProperty(key1)) {continue;};
                    // get key for acFields array. It holds input,
                    // "wrapped"  with ac functionality
                    acFieldsKey = containerACFields[key1];
                    // if there's no acField by this key - skip
                    var acField = acFields[acFieldsKey];
                    if (!acField) {continue;};

                    if (acField.oid == key && $.inArray("" + acField.oid, updatedFields) == -1) {
                        if (!allDependentFieldsInfo[key]) {continue};
                        var deps = allDependentFieldsInfo[key][valueId];
                        // if something is wrong with dependencies or there are no values
                        // set empty data source for particular field
                        if (!deps || !deps.length) {
                            _updateDataSource(container, acField.element, acField.propertyName, [],
                                _autocompleteData["Values"], key, relatedObjectName);
                        } else {
                            var values = [];
                            //get field values by ids
                            deps.forEach(function (element) {
                                if (acValues[key]["Values"][element]) {
                                    values.push(acValues[key]["Values"][element]);
                                }
                            });
                            var valueSetId = _updateDataSource(container, acField.element, acField.propertyName, values,
                                _autocompleteData["Values"], key, relatedObjectName);
                        }
                        // if we set the only value to subfield -
                        // update dependant values
                        if(valueSetId){
                            // recursively update subfields
                            _doUpdateDependencies(acFields, acDeps, acValues, container, containerACFields,
                                key, valueSetId, updatedFields, relatedObjectName)
                        }
                    }
                }
            }
        }
        // <summary>
        /// updates autocomplete input with new data
        /// </summary>
        /// <param name="container">fields container</param>
        /// <param name="acInput">input with ac functionality</param>
        /// <param name="elementName">object definition name</param>
        /// <param name="dataSource">data source object for widget</param>
        /// <param name="acValues">values for ac fields</param>
        /// <param name="objectDefinitionID">object definition id</param>
        /// <param name="relatedObjectName">related object name</param>
        function _updateDataSource(container, acInput, elementName, dataSource, acValues, objectDefinitionID, relatedObjectName) {
            var acWidget = acInput.data('kendoAutoComplete');
            // create new DataSource
            var dataSourceObj = new kendo.data.DataSource({data: dataSource});
            acWidget.setDataSource(dataSourceObj);
            // if there's the only value - set it
            var value, propertyID;
            if (dataSource.length == 1) {
                value = dataSource[0];
                propertyID = _getPropertyIdByName(acValues, objectDefinitionID, value);
                if(!propertyID && relatedObjectName){
                    propertyID = _getValueIDByObjectName(relatedObjectName ,value);
                }

                _updateInlineProperty(value, propertyID, container, objectDefinitionID, elementName, acWidget);
            } else if (dataSource.length == 0) {
                value = "";
                propertyID = "";
                _updateInlineProperty(value, propertyID, container, objectDefinitionID, elementName, acWidget);
            }
            acWidget.value(value);
            // return property id that was set to related field
            return propertyID;
        }
        // <summary>
        /// method to update dependant property
        /// </summary>
        /// <param name="value">value</param>
        /// <param name="propertyID">property id</param>
        /// <param name="container">fields container</param>
        /// <param name="objectDefinitionID">object definition id</param>
        /// <param name="propertyName">object definition name</param>
        /// <param name="acWidget">ac widget</param>
        function _updateInlineProperty(value, propertyID, container, objectDefinitionID, propertyName, acWidget) {
            // update hidden value
            var field = container.find("#txt" + propertyName);
            if (field && field.val() != value) {
                container.find("#hdn" + propertyName).val(propertyID);
                // fire event to set value for dependant field and save it
                eventManager.fireEvent(ObjectDetailFieldUpdatedEvent, {
                    container: container,
                    value: value,
                    propertyId: propertyID,
                    propertyFk: objectDefinitionID,
                    propertyName: propertyName
                });
                // update value for related autocomplete widget
                acWidget.value(value);
            }
        }
        // <summary>
        /// method to get property id of a field by its name
        /// </summary>
        /// <param name="dataObject">ac data</param>
        /// <param name="objectDefinitionID">object definition id</param>
        /// <param name="objectName">object definition name</param>
        function _getPropertyIdByName(dataObject, objectDefinitionID, objectName) {
            try {
                var propertyId = dataObject[objectDefinitionID]["InvertedValues"][objectName];
            } catch (e) {
                propertyId = undefined;
            }

            return propertyId;
        }
        /// <summary>
        /// returns data for particular object by its name
        /// </summary>
        /// <param name="objectDefinitionName">object definition name</param>
        function _getValueIDByObjectName(objectName, value) {
            if (_autocompleteData && _autocompleteData["Values"]) {
                var acData = _autocompleteData["Values"];
                for (var acKey in acData) {
                    if (acKey === 'length' || !acData.hasOwnProperty(acKey)) continue;
                    if (acData[acKey]["Name"] == objectName || acData[acKey]["RelatedEntityName"] == objectName) {
                        return acData[acKey]["InvertedValues"][value];
                    }
                }
            }

            return null;
        }
        // <summary>
        /// Adds "backward" realations, so that updating dependant
        // fields cause update of parent
        /// </summary>
        /// <param name="asDepData">dependencies data</param>
        function _addInversedRelations(asDepData) {
            var parentObject, childObject;
            var newParentDependency, currentValues;
            for (var parentKey in asDepData) {
                if (parentKey === 'length' || !asDepData.hasOwnProperty(parentKey)) continue;
                parentObject = asDepData[parentKey];
                for (var childKey in parentObject) {
                    newParentDependency = asDepData[childKey] || {};
                    if (childKey === 'length' || !parentObject.hasOwnProperty(childKey)) continue;
                    childObject = parentObject[childKey];
                    for (var childProperty in childObject) {
                        if (childProperty === 'length' || !childObject.hasOwnProperty(childProperty)) continue;
                        // here we swap keys and values ti invert relations
                        currentValues = childObject[childProperty];
                        if (currentValues && currentValues.length) {
                            currentValues.forEach(function (elem) {
                                if (!newParentDependency[parentKey]) {
                                    newParentDependency[parentKey] = {};
                                }
                                if (!newParentDependency[parentKey][elem]) {
                                    newParentDependency[parentKey][elem] = [childProperty];
                                }
                                else {
                                    if ($.inArray(childProperty, newParentDependency[parentKey][elem]) === -1) {
                                        newParentDependency[parentKey][elem].push(childProperty);
                                    }
                                }
                            });
                        }
                    }
                    asDepData[childKey] = newParentDependency;
                }
            }
        }
        // <summary>
        /// Method to do some fixes on incoming ac data
        /// </summary>
        /// <param name="depValues">dependencies data</param>
        function _fixDependencies(depValues) {
            for (var depKey1 in depValues) {
                if (depKey1 === 'length' || !depValues.hasOwnProperty(depKey1)) continue;
                //dependant fieldsIDs
                for (var depKey2 in depValues[depKey1]) {
                    if (depKey2 === 'length' || !depValues[depKey1].hasOwnProperty(depKey2)) continue;
                    //dependent field values ids
                    if ($.isArray(depValues[depKey1][depKey2])) {
                        var newValues = {};
                        depValues[depKey1][depKey2].forEach(function (elem) {
                            for (var depKey3 in elem) {
                                if (depKey3 === 'length' || !elem.hasOwnProperty(depKey3)) continue;
                                newValues[depKey3] = elem[depKey3];
                            }
                        });
                        depValues[depKey1][depKey2] = newValues;
                    }
                }
            }
        }
        // <summary>
        /// adds inverted values speed up the search
        /// </summary>
        /// <param name="dataObject">ac data</param>
        function _addInvertedValues(dataObject) {
            var invertedValues;
            Object.keys(dataObject).forEach(function (key1) {
                invertedValues = {};
                var fieldObject = dataObject[key1]["Values"];
                Object.keys(fieldObject).forEach(function (key2) {
                    invertedValues[fieldObject[key2]] = key2;
                });
                dataObject[key1]["InvertedValues"] = invertedValues;
            });

            return dataObject;
        }
        // <summary>
        // merges data from several included js-files
        // containing autocomplete data
        /// </summary>
        /// <param name="acData">ac data</param>
        function _mergeACData(acData) {
            var merged = {};
            if ($.isArray(acData) && acData.length > 0) {
                merged = acData.reduce(function (a, b) {
                    _mergeACValues(a["Values"], b["Values"]);
                    _mergeACValues(a["Dependencies"], b["Dependencies"]);

                    return a;
                })
            }

            return merged;
        }
        // <summary>
        // helps merging values from different sources, because
        // data for subentities comes in different js-files
        /// </summary>
        /// <param name="oldData">old ac data</param>
        /// <param name="newData">new ac data</param>
        function _mergeACValues(oldData, newData) {
            if (!newData) return oldData;
            if (!oldData) return newData;

            for (var acKey in newData) {
                if (acKey === 'length' || !newData.hasOwnProperty(acKey)) continue;
                if (!oldData.hasOwnProperty(acKey)) {
                    oldData[acKey] = newData[acKey];
                }
            }

            return oldData;
        }
        /// <summary>
        /// Method to generate unique id for autocomplete fields
        /// </summary>
        function _getUniqueAcId() {
            return ++_uniqueId;
        }

        return AutocompleteService;
    }]);