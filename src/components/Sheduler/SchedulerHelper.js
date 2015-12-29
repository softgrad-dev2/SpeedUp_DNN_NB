/**
 * Created by antons on 2/26/15.
 */
speedupSchedulerModule.factory('schedulerHelper', ['$rootScope', '$compile', '$q', 'configService',
    'notificationService', 'objectService',
    'schedulerDataSourceService', 'localizationService',
    function ($rootScope, $compile, $q, configService, notificationService, objectService, schedulerDataSourceService, localizationService) {

        var schedulerConfig = configService.getSchedulerConfig();
        var objectDefinitionName = schedulerConfig.objectDefinitionName;
        var gConfig = configService.getGlobalConfig();

        var SchedulerHelper = {};

        /// <summary>
        /// Method to read data from API
        /// </summary>
        /// <param name="options">options passed from scheduler widget</param>
        /// <param name="waitForFilter">need to wait until filter loads</param>
        /// <param name="parameters">scheduler parameters</param>
        SchedulerHelper.read = function (options, waitForFilter, parameters) {
            // prevents scheduler to load data before filter init, if filter is present
            if (waitForFilter) {
                options.success([]);
            } else {
                var readUrl = configService.getUrlBase('objectRecordList') + "/" + gConfig.token;
                $.ajax({
                    type: "POST",
                    url: readUrl,
                    data: kendo.stringify(parameters),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        options.success(SchedulerHelper.parseResponse(response));
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var msg = localizationService.translate('Messages.InvalidJson');
                        notificationService.showNotification(msg, true);
                    }
                });
            }
        };

        /// <summary>
        /// Method to remove entry from data source
        /// </summary>
        /// <param name="data">event data</param>
        /// <param name="odn">object definition name</param>
        /// <param name="schedulerHolderStr">scheduler selector</param>
        SchedulerHelper.removeObjectFromDS = function (data, odn, mainOdn, schedulerHolderStr) {
            // TODO: implement local refresh
            var eventOdn = data.odn;
            // if we caught 'wrong' object
            if (!(odn == eventOdn || mainOdn == eventOdn)) {
                return;
            }
            // getting scheduler widget
            var schedulerElement = angular.element(schedulerHolderStr);
            if (!schedulerElement.length) {
                return;
            }
            var schedulerWidget = schedulerElement.data('kendoScheduler');
            if (!schedulerWidget) {
                return;
            }
            // DEBUG - remove (it's temp)
            schedulerWidget.dataSource.read();
            schedulerWidget.refresh();
        };
        /// <summary>
        /// Method to add entry to data source
        /// </summary>
        /// <param name="data">event data</param>
        /// <param name="odn">object definition name</param>
        /// <param name="schedulerHolderStr">scheduler selector</param>
        SchedulerHelper.refreshObjectDS = function (data, odn, schedulerHolderStr, forceRefresh) {
            // TODO: implement local refresh
            var eventOdn = data.ObjectDefinitionName;
            // if we caught 'wrong' object
            if (odn != eventOdn && !forceRefresh) {
                return;
            }
            // getting scheduler widget
            var schedulerElement = angular.element(schedulerHolderStr);
            if (!schedulerElement.length) {
                return;
            }
            var schedulerWidget = schedulerElement.data('kendoScheduler');
            if (!schedulerWidget) {
                return;
            }
            // DEBUG - remove (it's temp)
            schedulerWidget.dataSource.read();
            schedulerWidget.refresh();

        };

        /// <summary>
        /// Method to delete entry
        /// </summary>
        /// <param name="options">scheduler inner options object</param>
        SchedulerHelper.destroy = function (options) {
            objectService.deleteObject(options.data[gConfig.modelId], objectDefinitionName, true).
                then(function (result) {
                    options.success(result);
                }, function (error) {
                    var msg = localizationService.translate('Messages.UnableToDeleteRecord');
                    notificationService.showNotification(msg, true);
                });
        };

        /// <summary>
        /// Method to save "resized" event.
        /// </summary>
        /// <param name="e">scheduler component event</param>
        SchedulerHelper.eventResizedSave = function (e) {
            var event = e.event;
            var dateStr, oldValue, field;
            var eventChanged = false;
            // determine start or end date changed
            dateStr = kendo.toString(e.start, "yyyy-MM-dd HH:mm:ss");
            if (dateStr != kendo.toString(event.start, "yyyy-MM-dd HH:mm:ss")) {
                // save date to rollback if saving fails
                oldValue = event.start;
                field = schedulerConfig.startField;
                event.start = e.start;
                eventChanged = true;
            }
            else {
                dateStr = kendo.toString(e.end, "yyyy-MM-dd HH:mm:ss");
            }
            // if start_date didn't change - check end_date
            if (!eventChanged && dateStr != kendo.toString(event.end, "yyyy-MM-dd HH:mm:ss")) {
                oldValue = event.end;
                field = schedulerConfig.endField;
                event.end = e.end;
                eventChanged = true;
            }
            // if start- or end-date changed - save the value
            if (eventChanged) {
                var objId = event.ObjectEntry_ID;

                objectService.getSettingsAndSaveObjectField(field, dateStr, objId, objectDefinitionName, true).
                    then(function () {
                        e.sender.refresh();
                    }, function (error) {
                        notificationService.showNotification(error, true);
                        event.field = oldValue
                    });

            }
            e.preventDefault();
        };
        /// <summary>
        /// Method to save "moved"(dragged) event.
        /// </summary>
        /// <param name="e">scheduler component event</param>
        SchedulerHelper.eventMovedSave = function (e) {
            var event = e.event;
            // check, whether user didn't move event back
            if (kendo.toString(e.start, "yyyy-MM-dd HH:mm:ss") !=
                kendo.toString(event.start, "yyyy-MM-dd HH:mm:ss")) {
                var objId = event.ObjectEntry_ID;
                // save dates to rollback if saving fails
                var oldStart = event.start;
                var oldEnd = event.end;
                // update events dates
                event.start = e.start;
                event.end = e.end;
                // function to be called on succesfull save
                var successFn = function () {
                    e.sender.refresh();
                }
                // if startDate save request failed
                var startDateSaveFailed = function (error) {
                    notificationService.showNotification(error, true);
                    event.start = oldStart;
                    event.end = oldEnd;
                }
                // if endDate save request failed
                var endDateSaveFailed = function (error) {
                    notificationService.showNotification(error, true);
                    event.end = oldEnd;
                    e.sender.refresh();
                }

                var startField = schedulerConfig.startField;
                var endField = schedulerConfig.endField;
                var startDateStr = kendo.toString(event.start, "yyyy-MM-dd HH:mm:ss");
                var endDateStr = kendo.toString(event.end, "yyyy-MM-dd HH:mm:ss");
                // save start_date. if failed -> show error, don't refresh scheduler
                // if success -> save end_date. if failed-> rollback end_date, refresh scheduler
                // if success -> refresh scheduler
                objectService.getSettingsAndSaveObjectField(startField, startDateStr, objId, objectDefinitionName, true).
                    then(objectService.getSettingsAndSaveObjectField(endField, endDateStr, objId, objectDefinitionName, true).
                        then(successFn, endDateSaveFailed), startDateSaveFailed);
            } else {
            }
            e.preventDefault();
        };

        /// <summary>
        /// Method to create parse response from API read call
        /// </summary>
        /// <param name="response">response object</param>
        SchedulerHelper.parseResponse = function (response) {
            var schedulerConfig = configService.getSchedulerConfig();

            var start = schedulerConfig.startField;
            var end = schedulerConfig.endField;
            var title = schedulerConfig.titleField;
            var startDateTimeStamp, endDateTimeStamp;

            try {
                if (response != null && response.length > 0)
                    response = $.parseJSON(response);
                var convertedResponse = [];
                var header;
                var resourceProperty = schedulerConfig.resourceField;
                // Scheduler requires date to be DateTime2-string.
                // We don't have it, so, create Date objects instead of strings
                response.forEach(function (elem) {
                    startDateTimeStamp = SchedulerHelper._getDateTimeStamp(elem[start]);
                    if (startDateTimeStamp) {
                        endDateTimeStamp = SchedulerHelper._getDateTimeStamp(elem[end]);
                        if (typeof(elem["Header"]) == "undefined") {
                            elem["Header"] = elem[title];
                        }
                        if (endDateTimeStamp) {
                            // check if start<=end
                            if (endDateTimeStamp > startDateTimeStamp) {
                                elem[start] = "\/Date(" + startDateTimeStamp + ")\/";
                                elem[end] = "\/Date(" + endDateTimeStamp + ")\/";

                                convertedResponse.push(elem);
                            }
                        } else {
                            console.log(elem[title] + " End date is incorrect.");
                        }
                    } else {
                        console.log(elem[title] + " Start date is incorrect.");
                    }
                    schedulerDataSourceService.checkAndUpdateIfDatePassed(elem, false, resourceProperty);
                })
            }
            catch (ex) {
                notificationService.showNotification($.objectLanguage.Messages.InvalidJson, true);
            }

            return convertedResponse;
        };



        // translates "our" date string to date
        // string Kendo Scheduler can understand
        SchedulerHelper._getDateTimeStamp = function (dateString) {
            var date = new Date(dateString);
            if (!SchedulerHelper._validateDate(date)) {
                date = kendo.parseDate(dateString, "yyyy-MM-dd HH:mm:ss");
                if (!date) {
                    date = kendo.parseDate(dateString, "yyyy-MM-dd HH:mm");
                    if (!date) {
                        return "";
                    }
                }
            }

            return date.getTime();
        };

        // checks if date string is in valid format
        SchedulerHelper._validateDate = function (date) {
            // if date is invalid getTime returns NaN
            var time = date.getTime();
            // and NaN !== NaN
            return time === time;
        };




        return SchedulerHelper;
    }]);