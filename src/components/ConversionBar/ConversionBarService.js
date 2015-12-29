/**
 * Created by antons on 7/3/15.
 */
speedupConversionBar.factory('conversionBarService', ['$q', '$http', 'configService',
    'conversionCacheService',
    function ($q, $http, configService, conversionCacheService) {
        var gConfig = configService.getGlobalConfig();
//        var dataTypes = gConfig.dataTypes;
        // Cached properties
//        var _conversionListData = [];

        var ConversionBarService = function () {
        };

        ConversionBarService.bindConversionBar = function (container, odn) {
            ConversionBarService.getObjectConversionList(odn).then(function (list) {
                ConversionBarService.bindConversionList(container, list);
            });
        };
        // TODO: edit comments
        /// <summary>
        /// Method which will bind the conversion list in dropdown
        /// <param name="list">list of items</param>
        /// </summary>
        ConversionBarService.bindConversionList = function (container, list) {
            container.find("input._selectConversionType").kendoDropDownList({
                dataTextField: "RecordName",
                dataValueField: "RecordID",
                filter: "contains",
                ignoreCase: true,
                dataSource: list
            });
        };
        // TODO: edit comments
        /// <summary>
        /// Method which will get the object conversion list
        /// <param name="objectDefinitionName">definition name</param>
        /// <param name="callbackFnk">function to be executed</param>
        /// </summary>
        ConversionBarService.getObjectConversionList = function (odn) {
            var deferred = $q.defer();

            var objConversion = conversionCacheService.getConversionObject(odn);
            if (objConversion) {
                deferred.resolve(objConversion.ConversionList);
            } else {
                var url = configService.getUrlBase('objectConversionList') + '/' + odn + '/' + gConfig.token;
                $http.get(url).success(function (response) {
                    conversionCacheService.preserveConversionObject({
                        ObjectDefinitionName: odn,
                        ConversionList: response
                    });

                    deferred.resolve(response);
                }).error(function () {
                        // previously it was here, I don't like it
//                        conversionCacheService.preserveConversionObject({
//                        ObjectDefinitionName: odn,
//                        ConversionList: null
//                    });

                        deferred.reject('Error loading conversion list for object \'' + odn + '\'');
                    });

            }

            return deferred.promise;
        };
//        // TODO: do me
//        /// <summary>
//        /// method will show detail of conversion object.
//        /// <param name="recordId">record id of object</param>
//        /// <param name="objectDefinitionName">definition name of object</param>
//        /// <param name="currentObject">dom element</param>
//        /// </summary>
//        ConversionBarService.viewConversionRecordDetail = function (recordId, objectDefinitionName, currentObject) {
//
//            //  $.config.IsPopUp = true;
//            if ($(document).find("#objectConversionRecordWnd").length == 0) {
//                $(currentObject).parent().append('<div id="objectConversionRecordWnd"/>');
//            }
//            var contianer = $(document).find("#objectConversionRecordWnd");
//            var displayType = $.config.DetailDisplayType.ShowInPopup;
//            var conversionTool = false,
//                InlineEditing = false, dataItem = null, showDefaultPrintToolbar = false;
//            currentObject.PageTitle = $.config.CreatePageTitle(currentObject.settings.ObjectDefinitionName, recordId);
//
//            $.config.ViewSingleRecordDetail(contianer, recordId, objectDefinitionName, displayType, conversionTool, showDefaultPrintToolbar, InlineEditing, dataItem, currentObject);
//        }
        // todo: edit doc
        /// <summary>
        /// Method which will get print template html
        /// <param name="printTemplateID">Print template Id for which html we get</param>
        /// <param name="callBack">function to be executed</param>
        /// </summary>
        ConversionBarService.runObjectConversion = function (conversionId, odn, recordsIds) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('runObjectConversion') + '/' + odn +
                "/" + conversionId + "/" + gConfig.token;

            var dataToSend = [];
            recordsIds.forEach(function (recordId) {
                dataToSend.push({
                    "ObjectRecordID": recordId,
                    "RequestType": "roc"
                });
            });

            if (dataToSend.length > 0)
                $http.post(url, JSON.stringify(dataToSend))
                    .success(function (response) {
                        // if we have id in response - resolve it
                        if (response && response.NewRecordID) {
                            deferred.resolve(response);
                        }
                        else if (response && response.ConversionMessage) {
                            // if we have error message - reject
                            if (response.ConversionMessage.indexOf("ERROR") > -1 || response.ConversionMessage.indexOf("EXCEPTION") > -1) {
                                deferred.reject(response.ConversionMessage);
                            }
                            else {
                                // if we have no id and no error message - resolve,
                                // maybe everything is ok (put in queue or smth.)
                                deferred.resolve(response);
                            }
                        }
                        else {
                            deferred.reject();
                        }
                    }).error(function () {
                        deferred.reject();
                    });

            return deferred.promise;
        };


        return ConversionBarService;
    } ]);