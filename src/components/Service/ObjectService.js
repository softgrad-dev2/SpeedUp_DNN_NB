/**
 * Created by antons on 3/30/15.
 */
CSVapp.factory('objectService', ['$q', "$http", '$rootScope', 'configService',
    'eventManager', 'localizationService', 'fieldPropertiesService',
    'objectPropertySaverFactory',
    function ($q, $http, $rootScope, configService, eventManager, localizationService, fieldPropertiesService, objectPropertySaverFactory) {
        var gConfig = configService.getGlobalConfig();

        var ObjectService = {};

        /*PUBLIC METHODS*/

        /// <summary>
        /// method will post data on API to batch edit array of records.
        /// </summary>
        /// <param name="postData">holds params for request</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.batchEdit = function (postData, odn, fireEvent) {
            var deferred = $q.defer();
            if(!postData ||
                !(postData.entries && postData.entries.length)||
                !(postData.data && postData.data.length)){
                deferred.reject('Empty input params');

                return deferred.promise;
            }

            var propertyData = [], tmpStr = "";
            postData.data.forEach(function(dataObject){
                if(dataObject.fk && dataObject.value){
                    tmpStr = dataObject.fk + ":" + dataObject.value;
                    propertyData.push(tmpStr);
                }
            });

            var apiData = {
                "ObjectEntryIds": postData.entries.join(','),
                "PropertyIDPropertyValue": propertyData
            };

            var url = configService.getUrlBase('batchEdit') + '/' + gConfig.token;

            $http.post(url, apiData).then(function (result) {
                if(!result || !result.data || !result.data["BatchEditMessage"]){
                    deferred.reject(result);
                } else if (result.data["BatchEditMessage"].indexOf('Success') != -1) {
                    if (fireEvent) {
                        eventManager.fireEvent(ObjectsBatchUpdatedEvent, {
                            data: postData,
                            odn: odn
                        });
                    }
                    var countIdx = result.data["BatchEditMessage"].indexOf('Count');
                    var recordsCount = countIdx ?
                        parseInt(result.data["BatchEditMessage"].substr(countIdx + 6)) : 0;

                    deferred.resolve(recordsCount);
                } else{
                    deferred.reject(result);
                }
            }, deferred.reject);

            return deferred.promise;
        };
        /// <summary>
        /// method will post data on API to repeat object with all subObjects.
        /// </summary>
        /// <param name="postData">holds params for request</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.repeatObject = function (postData, fireEvent) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('repeatedRecordWithChildren') + "/" + gConfig.token;
            $http.post(url, JSON.stringify(postData))
                .success(function (response) {
                    if (angular.isObject(response) && response.Message.indexOf("Que")) {
                        deferred.resolve();
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectRepeatedEvent)
                        }
                    } else {
                        deferred.reject();
                    }
                })
                .error(function () {
                    deferred.reject();
                });

            return deferred.promise;
        };
        /// <summary>
        /// method will post data on API to copy object with all subObjects.
        /// </summary>
        /// <param name="objectID">object id</param>
        /// <param name="odn">object definition name</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.copyObject = function (objectID, odn, fireEvent) {
            var deferred = $q.defer();
            var url = configService.getUrlBase('copyRecordWithChildren') + "/" + objectID + "/" + gConfig.token;
            $http.get(url)
                .success(function (parsedResponse) {
                    if (angular.isObject(parsedResponse) &&
                        parsedResponse.Message &&
                        parsedResponse.Message.indexOf('Successfully')) {
                        var recordData = {
                            ObjectEntry_ID: parsedResponse.NewObjectEntry_ID,
                            Name: parsedResponse.NewObjectEntry_Name,
                            ObjectDefinitionName: odn
                        };
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectCopiedEvent, recordData);
                        }
                        deferred.resolve(recordData);
                    } else {
                        var msg = localizationService.translate('Messages.UnableToCopyObject') +
                            localizationService.translate('Messages.InvalidJson');
                        deferred.reject(msg)
                    }
                })
                .error(function () {
                    var msg = localizationService.translate('Messages.UnableToCopyObject');
                    deferred.reject(msg);
                });

            return deferred.promise;
        };

        /// <summary>
        /// method will post data on API to remove record.
        /// </summary>
        /// <param name="recordId">object id</param>
        /// <param name="odn">object definition name</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.deleteObject = function (recordId, odn, fireEvent) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('deleteObjectRecord') + "/" + odn + "/" + recordId + "/" +
                gConfig.token + "?RequestType=do";
            $http.get(url)
                .success(function (response) {
                    debugger;
                    deferred.resolve(response);
                    if (fireEvent) {
                        eventManager.fireEvent(ObjectDeletedEvent, {
                            odn: odn,
                            recordId: recordId
                        })
                    }
                })
                .error(function () {
                    deferred.reject('Unable to delete object "' + odn + '" with id: ' + recordId);
                });

            return deferred.promise;
        };
        /// <summary>
        /// method will post data on API to save record.
        /// </summary>
        ObjectService.saveObject = function (objSchema, odn, fireEvent) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('saveObjectWithResponse') + "/" + odn + '/' + gConfig.token;
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(objSchema),
                dataType: "json",
                success: function (response) {
                    var txt = "Exception";
                    if (response.ResponseMessage.indexOf(txt) > -1) {
                        deferred.reject(response);
                    }
                    else {
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectSavedEvent, response);
                        }
                        deferred.resolve(response);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (respoonseCodeValue == "UnAuthorized") {
                        deferred.reject(respoonseCodeValue);
                    }
                    else {
                        var msg = localizationService.translate('Messages.UnableToSaveRecord');
                        deferred.reject(msg);
                    }
                }
            });

            return deferred.promise;
        };

        /// <summary>
        /// Method to extract data item from save object API response
        /// </summary>
        /// <param name="response">API response</param>
        ObjectService.extractItemFromSaveAPIResponse = function (response) {
            if (angular.isObject(response)) {
                var dataItems = JSON.parse(response.SavedData);
                if ($.isArray(dataItems)) {
                    return dataItems[0];
                }
            }

            return {};
        };

        /// <summary>
        /// Method to save object field value
        /// </summary>
        /// <param name="fieldName">object field name</param>
        /// <param name="fieldName">object field value</param>
        /// <param name="oid">object entry id</param>
        /// <param name="odn">object definition name</param>
        /// <return>promise</return>
        ObjectService.getSettingsAndSaveObjectField = function (fieldName, fieldValue, oid, odn, fireEvent) {
            var fieldDefinition = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, odn);
            return ObjectService.saveObjectField(odn, fieldName, fieldDefinition.PropertyDefinition_ID,
                fieldValue, oid, fireEvent);
        };
        /// <summary>
        /// Performs actual object field save API call
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propertyFk">object property id</param>
        /// <param name="fieldValue">value of the field</param>
        /// <param name="objectEntryFK">object entry id</param>
        /// <param name="fireEvent">need to fire an event</param>
        /// <return>promise</return>
        ObjectService.saveObjectField = function (odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent) {
            var saver = objectPropertySaverFactory.getSaver(gConfig.inlineSaveMethod);
            return saver.saveObjectField(odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent);
        };

        return ObjectService;
    }]);