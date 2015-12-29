/**
 * Created by C4off on 17.06.15.
 */
speedupObjectDetailModule.factory('repeatActionService', ['$q', '$rootScope', '$compile', '$modal',
    'localizationService', 'objectService', 'notificationService', 'popupService',
    function ($q, $rootScope, $compile, $modal, localizationService, objectService, notificationService,
              popupService) {
        var RepeatActionService = function () {
        };

        RepeatActionService.repeatObject = function (objectID, startDate, top) {
            var tpl = "<event-recurrence></event-recurrence>";
            var endDate = new Date(startDate);
            endDate.addMonths(1);
            var repeatTypes = localizationService.translate("RepeatTypes");
            // get days of week
            var daysOfWeek = [];
            if (kendo.culture().calendar.firstDay == 1) {
                for (var i = 1; i <= 6; i++) {
                    // TODO: move to localizationService
                    daysOfWeek.push($.objectLanguage.DaysOfWeekCap[i].one);
                }
                daysOfWeek.push($.objectLanguage.DaysOfWeekCap[0].one);
            } else {
                for (var i = 0; i <= 6; i++) {
                    // TODO: move to localizationService
                    daysOfWeek.push($.objectLanguage.DaysOfWeekCap[i].one);
                }
            }
            // prepare data for template
            var scope = $rootScope.$new();
            scope.defaultRepeatType = "weekly";
            scope.day = startDate.getDay();
            scope.startDate = startDate;
            scope.endDate = endDate;
            scope.repeatTypes = repeatTypes;
            scope.daysOfWeek = daysOfWeek;
            // compile tpl and bind scope
            var cnt = $compile(tpl)(scope);
                popupService.confirmWithContent(localizationService.translate("Titles.RepeatObject"), cnt, {
                    top: top
                }).then(function(){
                    _processRepeat(cnt, objectID, startDate).then(function(){
                        var msg = localizationService.translate('Messages.RepeatAddedToQueue');
                        notificationService.showNotification(msg);
                    }, function(){
                        var msg = localizationService.translate('Messages.EventRepeatFailed');
                        notificationService.showNotification(msg, true);
                    });
                });


            // hide menu after copying
//                e.stopPropagation();
//                var container = $(".actionsNav");
//                if (container.has(e.target).length === 0) {
//                    $(".actionsNav").find("ul").css("left", "-9999px");
//                }
        };

        RepeatActionService.initFields = function (element, repeatTypes, startFrom, endDate, defaultRepeatType) {
            // header
            element.find("#repeatType").kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: localizationService.translate("RepeatTypes"),
                index: 0,
                change: function (e) {
                    if (e.sender.value() != e.sender.old) {
                        element.find('.repetableSettingsBlock').hide();
                        element.find('#' + e.sender.value() + 'Block').show();
                    }
                }
            });
            repeatTypes.forEach(function (value) {
                // repeat every part
                element.find("#" + value.value + "RepeatEveryNumeric").kendoNumericTextBox({
                    format: "n0",
                    value: 1,
                    min: 1,
                    max: 30,
                    step: 1
                });
                // starts on part
                element.find("#" + value.value + "StartOnDatePicker").kendoDatePicker({
                    value: startFrom,
                    min: startFrom,
                    parseFormats: ["MM-dd-yyyy"],
                    change: function () {
                        var _self = this;
                        var date = _self.value();
                        var elem;
                        // sync other start-date datepickers
                        element.find("input[id$='StartOnDatePicker']").each(function (key, value) {
                            elem = element.find(value).data("kendoDatePicker");
                            if (elem != _self) {
                                elem.value(date);
                            };
                        });
                    }
                });
                // ends on part
                element.find("#" + value.value + "EndOnDatePicker").kendoDatePicker({
                    value: endDate,
                    min: startFrom,
                    parseFormats: ["MM-dd-yyyy"],
                    change: function () {
                        var _self = this;
                        var date = _self.value();
                        var elem;
                        // sync other end-date datepickers
                        element.find("input[id$='EndOnDatePicker']").each(function (key, value) {
                            elem = element.find(value).data("kendoDatePicker");
                            if (elem != _self) {
                                elem.value(date);
                            };
                        });
                    }
                });
                // Ends after part
                element.find("#" + value.value + "RepeatEndAfterNumeric").kendoNumericTextBox({
                    format: "n0",
                    value: 1,
                    min: 1,
                    max: 30,
                    step: 1
                });
            });
            //open a default "view"
            element.find('#' + defaultRepeatType + 'Block').show();
        };



        function _processRepeat(element, objectId, startFrom) {
            var postData = {};
            postData.ObjectEntry_ID = objectId;
            var repType = element.find('#repeatType').val();
            // repeat type
            postData.RepeatType = repType;
            // repeat frequency
            postData.RepeatFrequency = element.find('#' + repType + 'RepeatEveryNumeric').val();
            // add repeat on for "weekly" and repeatBy for "monthly"
            if (repType == "weekly") {
                var repeatDays = new Array();
                element.find("input[name='weeklyRepeatOn[]']:checked").each(function (index, value) {
                    repeatDays.push($.objectLanguage.DaysOfWeekCap[$(value).val()]["key"]);
                });
                if (repeatDays.length) {
                    postData.RepeatOn = repeatDays.join(",");
                }
                ;
            } else if (repType == "monthly") {
                var repeatEndBy = element.find("input:radio[name ='monthlyRepeatBy']:checked").val();
                // TODO: ask Mojeeb for API values
                if (repeatEndBy == "dayOfWeek") {
                    postData.RepeatBy = "dayOfWeek";
                } else if (repeatEndBy == "dayOfMonth") {
                    postData.RepeatBy = "dayOfMonth";
                }
            }
            // starts on
            postData.StartsOn = element.find('#weeklyStartOnDatePicker').val();
            // user changed start date
            if (postData.StartsOn != kendo.toString(startFrom, "yyyy-MM-dd")) {
                postData.UseStartDateInWeekly = "true";
            } else {
                postData.UseStartDateInWeekly = "false";
            }
            // ends
            var repeatEndInput = element.find("input:radio[name ='" + repType + "RepeatEnd']:checked").val();
            if (repeatEndInput == "After") {
                postData.RepeatCount = element.find('#' + repType + 'RepeatEndAfterNumeric').val();
            } else if (repeatEndInput == "On") {
                postData.RepeatEndDate = element.find('#' + repType + 'EndOnDatePicker').val();
            }
            // TODO: remove hard-code
            postData.FieldsToUpdate = "Start_Date";
            postData["FieldsToCalculate"] = [
                "End_Date:Start_Date"
            ];
            // Turn on event firing by passing true as second param
            return objectService.repeatObject(postData);
        }

//        var successClbkParams = { "ObjectEntry_ID": objectId };
////        var buttons = {yes: $.objectLanguage.Buttons.Done, no: $.objectLanguage.Buttons.Cancel}
//        $config.showModalPopup($.objectLanguage.Titles.RepeatObject, tplWData, buttons, initCallback, successCallback, successClbkParams);




        return RepeatActionService;
    }]);