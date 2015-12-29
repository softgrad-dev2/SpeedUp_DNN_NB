/**
 * Created by antons on 3/23/15.
 */
CSVapp.factory('filterService', [
    '$rootScope', '$q', 'schemaService', 'configService', 'notificationService',
    function ($rootScope, $q, schemaService, configService, notificationService) {
        var filterListData = [];
        var userSettingKeyPrefix = "SavedFilter_";
        var savedFilterSettings = [];

        var gConfig = configService.getGlobalConfig();

        var FilterService = function () {
        };

        FilterService.CheckOptions = function (options) {
            if (!options.odn) {
                return false;
            }
            return true;
        };
        /// <summary>
        /// Method to save selected filter
        /// </summary>
        /// <param name="filterObj">filter object</param>
        /// <param name="objectDefinitionName">object definition name</param>
        FilterService.AddFilterSetting = function (filterObj, objectDefinitionName) {
            var settings = [];
            var settingKey = userSettingKeyPrefix + objectDefinitionName;
            var setting = {
                SettingKey: settingKey,
                SettingValue: filterObj.FilterID,
                SettingGroup: objectDefinitionName,
                UserName: gConfig.userName
            };
            settings.push(setting);
            _removeByAttr(savedFilterSettings, 'SettingKey', settingKey);
            savedFilterSettings.push(setting);
            _updateObjectModuleUserSettings(settings);
        };
        /// <summary>
        /// Method to get filters list
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="scope">controller scope</param>
        FilterService.getFiltersList = function (odn, scope) {
            var filterList = _getFilterList(odn);

            if (filterList == undefined || filterList == null) {
                return _fetchFilterList(odn, scope, FilterService.SetSelectedFilter)
            }
            else {
                scope.filterList = filterList.FilterList;
            }
        };
        /// <summary>
        /// Method to set previously selected filter
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="scope">controller scope</param>
        /// <param name="filter list">array of filter objects</param>
        /// <param name="fireEvent">if there's need in firing an event</param>
        FilterService.SetSelectedFilter = function (odn, scope, filterList, fireEvent) {
            // if call to GetObjectModuleUserSettings API is successful
            // find selected filter and apply it
            var successCallback = function (settingsList) {
                var filterSelected = null;
                if (settingsList != undefined)
                    var objsetting = _getSettingValue(settingsList, odn);
                if (objsetting != undefined && objsetting != null) {
                    var settingKey = userSettingKeyPrefix + odn;
                    _removeByAttr(savedFilterSettings, 'SettingKey', settingKey);
                    savedFilterSettings.push(objsetting);
                    filterList.some(function (filterObj) {
                        var filterId = filterObj["FilterID"];
                        if (objsetting.SettingValue == filterId) {
                            filterSelected = filterObj;
                            filterObj["Checked"] = true;

                            return true;
                        }

                        return false;
                    });
                    // set default filter if none selected
                    if (filterList.length && !filterSelected) {
                        filterList[0].Checked = true;
                    }
                }

                if (fireEvent) {
                    // send empty string instead of undefined
                    // to show grid/scheduler to start reading content
                    filterSelected = filterSelected || "";
                    $rootScope["appliedFilter"] = filterSelected;
                    $rootScope.$broadcast(FilterSetEvent, filterSelected);
                }
                scope.filterList = filterList;
            };
            // if api request to GetObjectModuleUserSettings failed
            // Simply set filter list to scope and select first filter as default
            var errorCallback = function (message) {
                // set default filter if none selected
                if (filterList.length) {
                    filterList[0].Checked = true;
                }
                if (message == "UnAuthorized") {
                    notificationService.showNotification(message);
                }
                if (fireEvent) {
                    $rootScope["appliedFilter"] = null;
                    $rootScope.$broadcast(FilterSetEvent, "");
                }
                scope.filterList = filterList;
            };
            _getObjectModuleUserSettings(odn).then(successCallback, errorCallback);
        };

        /// <summary>
        ///function to remove the attribute
        /// </summary>
        function _removeByAttr(arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }

        /// <summary>
        /// Method will get the setting value
        /// </summary>
        /// <param name="settingsList">settings</param>
        /// <param name="odn">object definition name</param>
        function _getSettingValue(settingsList, odn) {
            var settingKey = userSettingKeyPrefix + odn;
            return settingsList.filter(function (obj) {
                if (obj.SettingKey == settingKey) {
                    return obj
                }
            })[0];
        }

        /// <summary>
        /// Method will get the object module user settings
        /// </summary>
        /// <param name="objectDefinitionName">Object Definition Name</param>
        /// <return>promise object</>
        function _getObjectModuleUserSettings(objectDefinitionName) {
            var deferred = $q.defer();

            var presavedFilterSettings = _getPreserveSavedFilter(objectDefinitionName);
            var urlBase = configService.getUrlBase('getObjectModuleUserSettings');
            if (presavedFilterSettings == null && urlBase) {
                var url = urlBase + "/" + gConfig.token + "?RequestType=us";
                var userSetting = new Object();
                userSetting.SettingKey = "SavedFilter_" + objectDefinitionName;
                userSetting.SettingGroup = objectDefinitionName;
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(userSetting),
                    dataType: "json",
                    success: function (response) {
                        deferred.resolve(response);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    }
                });
            }
            else {
                deferred.resolve([presavedFilterSettings]);
            }

            return deferred.promise;
        }

        /// <summary>
        /// Method will update the object module user settings
        /// </summary>
        /// <param name="dataToPost">data</param>
        function _updateObjectModuleUserSettings(dataToPost) {
            var urlBase = configService.getUrlBase('updateObjectModuleUserSettings');
            if (urlBase) {
                var url = urlBase + "/" + gConfig.token + "?RequestType=uus"; // to get user settings
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(dataToPost),
                    dataType: "json",
                    success: function (response) {
                        //
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (respoonseCodeValue == "UnAuthorized")
                            alert(xhr.getResponseHeader('ResponseCode'));
                        else
                            alert($config.URLs.UpdateObjectModuleUserSettingsURL + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                    }
                });
            }

        };
        /// <summary>
        ///function to get the preserved filter
        /// </summary>
        ///  param name="objectDefinitionName">Object Definition Name</param>
        function _getPreserveSavedFilter(ObjectDefinitionName) {
            return savedFilterSettings.filter(function (obj) {
                if (obj.SettingGroup == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        }

        /// <summary>
        ///function to get the preserved filter list
        /// </summary>
        ///  param name="objectDefinitionName">Object Definition Name</param>
        function _getFilterList(ObjectDefinitionName) {
            return filterListData.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        }

        /// <summary>
        ///function to cache filter list
        /// </summary>
        ///  param name="filterObject">filter object</param>
        function _preserveFilterList(filterObject) {
            var objFilter = _getFilterList(filterObject.ObjectDefinitionName);
            if (objFilter == null || objFilter == undefined) {
                filterListData.push(filterObject);
            }
        }

        /// <summary>
        ///function to fetch filter list from API
        /// </summary>
        ///  param name="objectDefinitionName">Object Definition Name</param>
        function _fetchFilterList(objectDefinitionName, scope, callback) {
            var PostData = gConfig.postData;
            var postdata = new Object();
            if (PostData.RequestType != undefined)
                postdata.RequestType = "ofl";
            var urlBase = configService.getUrlBase('getFilters');
            if (urlBase) {
                var url = urlBase + "/" + objectDefinitionName + "/" + gConfig.token;
                $.ajax({
                    type: "GET",
                    url: url,
                    data: postdata,
                    dataType: "json",
                    cache: false,
                    async: false,
                    success: function (filters) {
                        console.log('get filters success');
                        var obj = new Object();
                        obj.ObjectDefinitionName = objectDefinitionName;
                        if (filters != null) {
                            var objNoneFilter = new Object();
                            objNoneFilter.FilterID = 'nonefilter';
                            objNoneFilter.FitlerLabel = $.objectLanguage.Filters.NoFilter;
                            objNoneFilter.FitlerName = $.objectLanguage.Filters.NoFilter;
                            objNoneFilter.FitlerExpression = '';
                            objNoneFilter.SettingGroup = objectDefinitionName;
                            filters.unshift(objNoneFilter);
                        }
                        obj.FilterList = filters;
                        $.each(obj.FilterList, function (key, val) {
                            if (val.FitlerLabel == "" || val.FitlerLabel == null) {
                                val.FitlerLabel = val.FitlerName;
                            }
                        });
                        _preserveFilterList(obj);
                        if (typeof(callback) == "function") {
                            callback(objectDefinitionName, scope, filters, true);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log('get filters error');
                        var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (respoonseCodeValue == "UnAuthorized") {
                            notificationService.showNotification(xhr.getResponseHeader('ResponseCode'), true);
                        }
                        else {
                            callback(objectDefinitionName, scope, [], true);
                        }
                    }
                });
            }
        }

        return FilterService;
    }]);