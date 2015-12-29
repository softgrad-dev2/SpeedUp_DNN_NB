/**
 * Created by antons on 4/9/15.
 */
CSVapp.factory('listDataService', ['$resource', 'configService',
    function ($resource, configService) {
        var gConfig = configService.getGlobalConfig();
        var token = gConfig.token;

        var urlBase = configService.getUrlBase('fetchListData');
        var url = urlBase + "/:list/" + token + "?RequestType=ListValues";

        return $resource(url);
    }]);
CSVapp.factory('listDataLoaderService', ['$q', '$http', 'configService', 'schemaService',
    function ($q, $http, configService, schemaService) {
        var gConfig = configService.getGlobalConfig();
        // cached data
        var _listsData = [];

        var ListDataLoaderService = function () {

        };

        ListDataLoaderService.addEmptyListValue = function (listValues) {
            return listValues;
            if ($.isArray(listValues) && listValues.length) {
                var hasEmpty = false;
                var lastSortOrder = 1, listName;
                listValues.some(function (listValue) {
                    listName = listName || listValue["ListName"];
                    lastSortOrder = lastSortOrder < listValue["SortOrder"] ? listValue["SortOrder"] : lastSortOrder;
                    if (listValue["Value"] == "") {
                        hasEmpty = true;
                    }
                });
                if (!hasEmpty) {
                    listValues.push({
                        ListName: listName,
                        SortOrder: lastSortOrder + 1,
                        Text: "",
                        Value: "",
                        Description: ""
                    });
                }

            }

            return listValues;
        }

        /// <summary>
        /// Method to fetch all lists data for particular object
        /// </summary>
        /// <param name="objectDefinitionName">Object definition name</param>
        /// <return>promise</return>
        ListDataLoaderService.fetchMultipleListsData = function (objectDefinitionName) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('fetchMultipleObjectListData') + "/" + gConfig.token + "?RequestType=mlv";
            var dataType = gConfig.dataTypes;
            var listNames = [];
            schemaService.getSchema(objectDefinitionName).then(function (schemaObj) {
                if (!schemaObj) {
                    deferred.reject('Failed to fetch multiple lists data.' +
                        'No schema for object: ' + objectDefinitionName)
                } else {
                    $.each(schemaObj.AllColumnsList, function (key, val) {
                        if (dataType.DropDownList == val.DataType ||
                            dataType.SearchableDropDownList == val.DataType ||
                            dataType.MultiSelectList == val.DataType) {
                            var listName = new Object();
                            listName.ListName = val.InputSettings;
                            listNames.push(listName);
                        }
                    });
                    if (!listNames || !listNames.length) {
                        deferred.resolve([]);
                    } else {
                        $http.post(url, JSON.stringify(listNames)).
                            success(function (response) {
                                var lists = {};
                                // Filter values by list name
                                response.forEach(function (listObj) {
                                    if (!lists[listObj["ListName"]]) {
                                        lists[listObj["ListName"]] = {
                                            ListName: listObj.ListName,
                                            ListValues: []
                                        };
                                    }
                                    lists[listObj["ListName"]]["ListValues"].push(listObj);
                                });
                                // Save actual list data
                                for (listKey in lists) {
                                    if (!lists.hasOwnProperty(listKey)) {
                                        continue;
                                    }
                                    _preserveLists(lists[listKey]);
                                }

                                deferred.resolve(lists);
                            }).
                            error(function () {
                                // TODO:  better error handling
                                deferred.reject('Failed to fetch multiple lists data');
                            });
                    }
                }
            });

            return deferred.promise;
        };

        // CHECKED
        ListDataLoaderService.GetListObject = function (listName, addEmptyValues) {
            return ListDataLoaderService.GetListsData(listName).then(function (listObjects) {
                if (addEmptyValues) {
                    listObjects = ListDataLoaderService.addEmptyListValue(listObjects);
                }

                return listObjects;
            });
        };
        /// <summary>
        /// Method to get existing config().ListsData object (if exists).
        /// </summary>
        /// <param name="listName">listName to check if exists</param>
        /// <param name="ListsData">has all the existing objects of lists</param>
        ListDataLoaderService.GetListsDataByListName = function (listName) {
            return _listsData.filter(function (obj) {
                if (obj.ListName == listName) {
                    return obj
                }
            })[0];
        };
        // CHECKED
        // warning, now async
        /// <summary>
        /// Method will request to API to get lists data
        /// </summary>
        /// <param name="listName">name of the requested list</param>
        /// <param name="url">url to hit API</param>
        ListDataLoaderService.GetListsData = function (listName) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('fetchListData') + "/" + listName + "/" + gConfig.token + "?RequestType=ListValues";
            var data = null;
            var listObj = ListDataLoaderService.GetListsDataByListName(listName);
            if (listObj != null) {
                data = listObj.ListValues;

                deferred.resolve(data);
            }
            else {
                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "json",
                    success: function (response) {
                        if (response != null) {
                            response.unshift({ Text: "", Value: "" });
                        }

                        listObj = new Object();
                        listObj.ListName = listName;
                        listObj.ListValues = response;
                        _preserveLists(listObj);
                        data = response;

                        deferred.resolve(data);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    }
                });
            }

            return deferred.promise;
        }
        // CHECKED
        /// <summary>
        /// method will return presaved list .
        /// this model object contains lists values for select boxes.
        /// </summary>
        /// <param name="listsObject">has array of list</param>
        function _preserveLists(listsObject) {
            var list = _listsData.filter(function (obj) {
                if (listsObject.ListName == obj.ListName) {
                    return obj
                }
            })[0];
            if (list == null || list == undefined) {
                _listsData.push(listsObject);
            }
        }


// TODO: For Later use
//    ListDataLoaderService.Get = function (listName) {
//        var delay = $q.defer();
//        listDataService.get({list: listName}, function (listObj) {
//            delay.resolve(listObj);
//        }, function () {
//            delay.reject('Unable to fetch list values for ' + listName);
//        });
//
//        return delay.promise;
//    };

        return ListDataLoaderService;
    }]);