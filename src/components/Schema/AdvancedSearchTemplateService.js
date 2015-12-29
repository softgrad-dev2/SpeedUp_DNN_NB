/**
 * Created by C4off on 16.10.15.
 */
CSVapp.factory('advancedSearchTemplateService', ['$q', '$http', 'configService', 'schemaService',
    function ($q, $http, configService, schemaService) {

        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;
        var cache = null;
        var _dataTypesAllowed = [
            dataTypes.Date,
            dataTypes.DateTime,
            dataTypes.Text,
            dataTypes.AutoText,
            dataTypes.TextBox,
            dataTypes.DropDownList,
            dataTypes.SearchableDropDownList,
            dataTypes.ParentRelationship,
            dataTypes.ObjectRelationship,
            dataTypes.CheckBox
        ];

        var AdvancedSearchTemplateService = function () {
        };

        /*PUBLIC METHODS*/

        AdvancedSearchTemplateService.getFieldParentalType = function(fieldName, fieldOdn, tplObjects){
            return tplObjects[fieldOdn].type;
        };

        /// <summary>
        /// Method to get advanced search template object (creates Fake template, containing all
        //  visible fields for 'main' object, if nothing can be retrieved)
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        AdvancedSearchTemplateService.getAdvancedSearchTemplate = function (odn, propertyViewType) {
            return _getTemplateSettings(odn).then(function (tplFieldsArr) {
                if (!tplFieldsArr) {
                    return _createFakePageTemplateObject(odn, propertyViewType).then(function (tplFieldsArr) {
                        return tplFieldsArr;
                    });
                }

                return tplFieldsArr;
            })
        };

        /*PRIVATE METHODS*/
        function _getTemplateSettings(odn) {
            var deferred = $q.defer();
            // search in _cache
            if (cache) {
                deferred.resolve(cache);
            } else if (gConfig.advancedSearchTpl) { // search in config
                var tplStr = gConfig.advancedSearchTpl;
                cache = _getTemplateFromString(tplStr);
                deferred.resolve(cache);
            } else { // call API
                _fetchTemplateSettings(odn).then(function (tplArr) {
                    cache = tplArr;
                    deferred.resolve(cache);
                }, deferred.resolve(null));
            }

            return deferred.promise;
        }

        function _getTemplateFromString(tplStr) {
            if (!tplStr) {
                return null;
            }
            var fieldsStrArray = tplStr.split(',');
            if (!fieldsStrArray.length) {
                return null;
            }
            var fieldsObj = [];
            fieldsStrArray.forEach(function (fieldStr) {
                if(typeof fieldStr != 'string'){
                    return false;
                }
                var fieldsParts = fieldStr.trim().split('.');
                if (fieldsParts.length < 3) {
                    return;
                }
                fieldsObj = _pushValues(fieldsObj, fieldsParts, fieldStr);
            });

            return fieldsObj;
        }

        function _pushValues(fieldsObj, fieldsParts, fieldStr){
            var lastIdx = fieldsParts.length - 1;
            if (typeof fieldsParts[0] == 'string' ||
                typeof fieldsParts[lastIdx] == 'string' ||
                typeof fieldsParts[lastIdx - 1] == 'string') {
                var odn = fieldsParts[lastIdx - 1].trim();
                // save string without trailing property name
                var type = fieldsParts[0].trim();
                var propertyName = fieldsParts[lastIdx].trim();
                fieldsParts.pop();
                var string = fieldsParts.join('.');
                var propertyObj = {
                    propertyName: propertyName,
                    string: string
                };
                if(!fieldsObj.hasOwnProperty(odn)){
                    fieldsObj[odn] = {
                        type: type,
                        properties : [propertyObj]
                    }
                } else{
                    fieldsObj[odn].properties.push(propertyObj);
                }
            }

            return fieldsObj;
        }

        function _fetchTemplateSettings(odn) {
            var deferred = $q.defer();

            // todo: remove
            deferred.resolve(null);

            return deferred.promise;

            var url = configService.getUrlBase('getAdvancedSearchTemplate') + "/" +
                odn + "/" + gConfig.token;
            $http.get(url)
                .success(function (response) {
                    deferred.resolve(_getTemplateFromString(response))
                })
                .error(function () {
                    deferred.resolve(null);
                });

            return deferred.promise;
        }

        /// <summary>
        /// Creates fake template, containing all visible fields
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        function _createFakePageTemplateObject(odn, propertyViewType) {
            // get "visible" properties
            return schemaService.GetVisibleFieldsDetails(odn, propertyViewType).then(function (fieldDetails) {
                var propertyList = _getFilteredFieldsList(fieldDetails);
                var searchFieldsArray = [];
                searchFieldsArray[odn] = {
                    type: "Main",
                    properties: []
                };
                propertyList.forEach(function (property) {
                    searchFieldsArray[odn].properties.push({
                        propertyName: property.PropertyName,
                        string: "Main." + odn + "." + property.PropertyName
                    })
                });

                return searchFieldsArray;
            });
            // get all fields
            // create `fields` array for them
//            var promises = [
//                schemaService.getSchema(odn),
//                objectDataService.getSubObjects(odn)
//            ];
//
//            return $q.all(promises).then(function (results) {
//                return [
//                    {
//                        Name: "FakeTemplate",
//                        PageTemplateLabel: "User Template",
//                        RecordFirstImagePath: "",
//                        RelatedObjectDisplayType: "Grid",
//                        RelatedObjectUnderMainRecord: _getSubObjectNamesString(results[1]),
//                        SelectedColumnsForTemplate: _getFieldsNamesString(results[0].SelectedColumnsList),
//                        SelectedRelatedObjectsForTemplate: _getSubObjectNamesString(results[1])
//                    }
//                ]
//            });

        }

        /// <summary>
        /// Method returns array of possible search fields for this object
        /// And also initializes some metadata
        /// </summary>
        /// <param name="fieldDetails">elements array</param>
        function _getFilteredFieldsList(fieldDetails) {
            return fieldDetails.filter(function (elem) {
                return $.inArray(elem.DataType, _dataTypesAllowed) != -1;
            });
        }


        return AdvancedSearchTemplateService;
    }]);