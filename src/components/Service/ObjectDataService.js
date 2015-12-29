/**
 * Created by antons on 5/25/15.
 */
CSVapp.factory('objectDataService', ['$http', '$q', '$log', 'configService', 'localizationService',
    'schemaService',
    function ($http, $q, $log, configService, localizationService, schemaService) {

        var gConfig = configService.getGlobalConfig();

        var ObjectDataService = {

        };

        /// <summary>
        /// Method which will split the comma separated objects returned from api (i.e object settings).
        /// </summary>
        ObjectDataService.getRelatedObjects = function (data) {
            var tabs = data.split(";");
            var arrtabs = [];
            var rettabs = [];
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] != "") {
                    arrtabs = tabs[i].split(":");
                    if (arrtabs.length > 0) {
                        var objName = arrtabs[arrtabs.length - 1];
                        // prevent duplicates
                        if ($.inArray(objName, rettabs) == -1) {
                            rettabs.push(arrtabs[arrtabs.length - 1]);
                        }
                    }
                }
            }
            return rettabs;
        };

        /// <summary>
        /// Method which will return the sub objects for tabStrip (IN PROMISE)
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="selectedRelatedObjects">string with related objects, selected for template</param>
        /// <return>promise</return>
        ObjectDataService.getSubObjects = function (odn, selectedRelatedObjects, allowReturnEmpty) {
            return _fetchSubObjects(odn).then(function (subObjectsArray) {
                var tabs = [];
                if ($.isArray(subObjectsArray) && subObjectsArray.length) {
                    if (selectedRelatedObjects) {
                        var tabsArr = ObjectDataService.getRelatedObjects(selectedRelatedObjects);
                        // As per settings returned from api, pushing subObjects in a variable
                        // to show objects in tab
                        for (var i = 0; i < tabsArr.length; i++) {
                            $.each(subObjectsArray, function () {
                                if (tabsArr[i] == this.ObjectDefinitionName) {
                                    tabs.push(this);
                                }
                            });
                        }
                    }
                    else if(!allowReturnEmpty) {
                        tabs = subObjectsArray;
                    }
                }

                return tabs;
            });
        };

        /// <summary>
        /// Method which will return the sub object object (IN PROMISE)
        /// </summary>
        /// <param name="objectDefinitionName">definition name</param>
        /// <return>promise</return>
        function _fetchSubObjects(objectDefinitionName) {
            var deferred = $q.defer();

            var subObjects = schemaService.getSubObjectByObjectDefinitionName(objectDefinitionName);
            if (subObjects) {
                deferred.resolve(subObjects.SubObjectsObject);
            } else {
                var url = configService.getUrlBase('getSubObjects') + "/" + objectDefinitionName + "/" + gConfig.token;
                $http.get(url).success(function (subObjects) {
                    // check, fix subObjects
                    _addPropertyInSubObjectList(subObjects).then(function (subObjectsRevised) {
                        var obj = {
                            ObjectDefinitionName: objectDefinitionName,
                            SubObjectsObject: subObjectsRevised
                        };
                        // cache subObjects data
                        schemaService.preserveSubObject(obj);

                        deferred.resolve(subObjects);
                    });

                }).error(function (data, status, headers) {
                        // TODO: check here
                        var respoonseCodeValue = headers;
                        if (respoonseCodeValue == "UnAuthorized")
                            deferred.reject("UnAuthorized");
                        else {
                            var obj = {
                                ObjectDefinitionName: objectDefinitionName,
                                SubObjectsObject: null
                            };
                            schemaService.preserveSubObject(obj);

                            deferred.resolve(null);
                        }
                    });
            }

            return deferred.promise;
        };

        /// <summary>
        /// Method to get MULTIPLE objects data, and if the recordId is passe -
        /// then SINGLE object data will be returned
        /// </summary>
        /// <param name="id">object entry id</param>
        /// <param name="odn">object definition name</param>
        /// <return> promise </return>
        ObjectDataService.fetchObjects = function (odn, pageSize, pageIndex, filterExpression, recordId) {
            var deferred = $q.defer();
            filterExpression = filterExpression || "";

            var postData = {
                ObjectDefinitionName: odn,
                Token: gConfig.token,
                RequestType: "Detail",
                FilterExpression: filterExpression
            };

            if (recordId) {
                postData.RecordID = recordId;
            } else {
                postData.PageSize = pageSize;
                postData.PageNumber = pageIndex;
            }

            var url = configService.getUrlBase('objectRecordList') + "/" + gConfig.token;
            $http.post(url, JSON.stringify(postData)).success(function (response) {
                var json = JSON.parse(response);
                if (!$.isArray(json)) {
                    deferred.reject('Unable to get records list. Wrong JSON.');
                } else {
                    if (recordId) {
                        deferred.resolve(json[0]);
                    } else {
                        deferred.resolve(json);
                    }
                }
            }).error(function () {
                    deferred.reject('Unable to get records list.')
                });

            return deferred.promise;
        };

        /// <summary>
        /// Method to get SINGLE object data from API by id
        /// </summary>
        /// <param name="id">object entry id</param>
        /// <param name="odn">object definition name</param>
        // <return> promise </return>
        ObjectDataService.fetchSingleObjectData = function (id, odn) {
            return ObjectDataService.fetchObjects(odn, 0, 0, '', id);
        };

        /// <summary>
        /// Method which will add the property in object
        /// <param name="subObjectList">list of sub objects</param>
        /// </summary>
        function _addPropertyInSubObjectList(subObjectList) {
            var deferred = $q.defer();
            if (!subObjectList) {
                deferred.resolve([]);
            } else {
                // Async get object definitions for subobjects
                var promises = subObjectList.map(function (subObj) {
                    return schemaService.getObjectDefinition(subObj.ObjectDefinitionName);
                });
                // after all async calls resolve subojects list
                $q.all(promises).then(function (subObjects) {
                    subObjectList.forEach(function (subObject, index) {
                        subObject.ObjectLabel = subObjects[index].ObjectLabel;
                    });

                    deferred.resolve(subObjectList);
                });
            }

            return deferred.promise;
        }

        return ObjectDataService;
    }]);