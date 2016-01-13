/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.factory('gridDataService', ['$http', '$q', 'configService',
    'notificationService', 'objectService',
    function ($http, $q, configService, notificationService, objectService) {
        var GridDataService = function () {

        };

        var gConfig = configService.getGlobalConfig();

        var PostData = {
            ObjectDefinitionName: "",
            RecordID: "",
            PageNumber: "",
            PageSize: "",
            OrderByExpression: "",
            Token: "",
            RequestType: "",
            Clear: function () {
                this.ObjectDefinitionName = "";
                this.RecordID = "";
                this.PageNumber = "";
                this.PageSize = "";
                this.OrderByExpression = "";
                this.Token = "";
                this.RequestType = "";
            }
        };
//
//        // NOT CHECKED
//        /// <summary>
//        /// method will save the value of inline edited element.
//        /// <param name="element">has edited element</param>
//        /// </summary>
//        GridDataService.saveInlineRecord = function (odn, fieldName, fieldPropertyFk, recordId ,container) {
//            alert('Saving inline grid field...');
//            if(! fieldName || ! dataItem || !container){
//                return;
//            }
//            var propertyFk = dataItem.PropertyDefinition_ID;
//            var entryId = dataItem.ObjectEntry_ID;
//            var  value = container.val();
//            // TODO: maybe, get value from model.ObjectEntry_ID
////            odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent
//            debugger;
//            objectService.saveObjectField(odn, fieldName, propertyFk, value, entryId, false);
////            objInlineEditData["ObjectEntry_fk"] = model.ObjectEntry_ID;
////                objInlineEditData["PropertyDefinition_fk"] = objField.PropertyDefinition_ID;
////                objInlineEditData["PropertyValue"] = value;
//            // get value
//            // TODO: do me
////            objectService.getSettingsAndSaveObjectField(fieldName, value,
////                dataItem.ObjectEntry_ID, odn, true).then(function(response){
////                    // TODO: deal with it
//////                    if ($thisGrid.SelectedRecordId == model.ObjectEntry_ID) {
//////                        $thisGrid.bindRecordDetail(model);
//////                    }
//////                    $config.ShowNotification($.objectLanguage.Messages.RecordUpdatedSuccessfully, false);
////
////                });
//
//            // TODO: remove
//            // OLD
////            var input = $(element);
////            if ($($thisGrid).find("td").hasClass("_grideditBlock")) {
////
////                var $td = $($thisGrid).find("._grideditBlock");
////                var grid = $($thisGrid).data("kendoGrid"),
////                    model = grid.dataItem($($td).closest("tr"));
////                var row = $($td).closest("tr");
////                var rowIdx = $("tr", grid.tbody).index(row);
////                var colIdx = $("td", row).index($($td));
////                var colName = $($thisGrid).find('th').eq(colIdx).text();
////                var fieldName = $($thisGrid).find('th').eq(colIdx).data('field');
////                var objField = $config.GetAllPropertiesOfField(fieldName, $thisGrid.settings.ObjectDefinitionName);
////
////                var value = dropdownvalue == undefined ? model[fieldName] : dropdownvalue;
////                var objInlineEditData = new Object();
////                objInlineEditData["ObjectEntry_fk"] = model.ObjectEntry_ID;
////                objInlineEditData["PropertyDefinition_fk"] = objField.PropertyDefinition_ID;
////                objInlineEditData["PropertyValue"] = value;
////
////
////                $($thisGrid).find("._grideditBlock").removeClass("_grideditBlock");
////                if (PostData.RequestType != undefined)
////                    objInlineEditData.RequestType = "sio";
////                var url = $config.URLs.SaveInlineObjectURL + "/" + $config.Token;
////
////                if (objInlineEditData.PropertyValue != undefined) {
////                    //If Record Exist in Temporary Array then Update Temporary Array
////                    var responseData = $.fn.objectSave({}).CheckRecordExistsinTempRecordById(model.ObjectEntry_ID, $thisGrid.settings.ObjectDefinitionName);
////                    if (responseData != null && responseData.length > 0) {
////                        var json = jQuery.parseJSON(responseData[0].JsonData);
////                        json[fieldName] = value;
////                        var jsonData = [];
////                        jsonData.push(json);
////                        $.fn.objectSave({}).CreateTempSaveObject(JSON.stringify(jsonData), $thisGrid.settings.ObjectDefinitionName, "Edit", null, true);
////                    }
////                    else {
////                        $.ajax({
////                            type: "POST",
////                            url: url,
////                            data: JSON.stringify(objInlineEditData),
////                            dataType: "json",
////                            async: true,
////                            success: function (response) {
//                                // $.RebindDetail($thisGrid, dataType, "SAVE");
////                                if ($thisGrid.SelectedRecordId == model.ObjectEntry_ID) {
////                                    $thisGrid.bindRecordDetail(model);
////                                }
////                                $config.ShowNotification($.objectLanguage.Messages.RecordUpdatedSuccessfully, false);
////                            },
////                            error: function (xhr, ajaxOptions, thrownError) {
////                                var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
////                                if (respoonseCodeValue == "UnAuthorized")
////                                    $config.ShowNotification(xhr.getResponseHeader('ResponseCode'), true);
////                                else
////                                    $config.ShowNotification($config.URLs.SaveInlineObjectURL + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError, true);
////                            }
////                        });
////                    }
////                }
////            }
//        };

        // checked
        /// <summary>
        /// Function calls API to get total number of records.
        /// Returns totalRecords for passed ObjectDefinitionName as per filter Expression.
        /// </summary>
        /// <param name="objsettings">has ObjectDefinationName, token</param>
        /// <param name="filterExpression">has filterExpression applied by user</param>
        GridDataService.getTotalRecords = function (gridParameters) {
            // TODO: remove
            return 10;
            var filterExpression = gridParameters.filterExpression;
            var totalRecords = 0;
            PostData.Clear();
            PostData.ObjectDefinitionName = gridParameters.odn;
            PostData.FilterExpression = filterExpression ? filterExpression : '';
            PostData.GenericSearch = gridParameters.genericSearch;
            PostData.RequestType = "CountRecord";
            var url = configService.getUrlBase('objectRecordsCount') + '/' + gConfig.token;

            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(PostData),
                dataType: "json",
                async: false,
                cache: false,
                success: function (response) {
                    totalRecords = response;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (respoonseCodeValue == "UnAuthorized") {
                        notificationService.showNotification(respoonseCodeValue, true);
                    }
                    else {
                        var msg = "Unable to get total records for object" + gridParameters.odn;
                        notificationService.showNotification(msg, true);
                    }
                }
            });

            return totalRecords;
        };

        return GridDataService;
    }]);
