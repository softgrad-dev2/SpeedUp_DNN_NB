/**
 * Created by antons on 5/25/15.
 */
speedupSchedulerModule.factory('schedulerPopupService', ['$modal', '$log', 'configService', 'notificationService',
    'objectDataService', 'localizationService', 'objectDetailService', 'existingObjectDetailService',
    'eventManager', 'objectDetailDisplayerService', 'schemaService',
    function ($modal, $log, configService, notificationService, objectDataService, localizationService, objectDetailService,
              existingObjectDetailService, eventManager, objectDetailDisplayerService, schemaService) {
        var schedulerConfig = configService.getSchedulerConfig();
        var odn = schedulerConfig.objectDefinitionName;
        var mainOdn = schedulerConfig.mainObjectDefinitionName;
        var pageTemplateName = schedulerConfig.pageTemplateName || "Default";

        var SchedulerPopupService = {

        };

        /// <summary>
        /// handler for opening popup on event
        /// </summary>
        /// <param name="e">kendo scheduler event</param>
        SchedulerPopupService.openPopupHandler = function (e) {
            var dataItem = e.event;
            var container = $(schedulerConfig.schedulerPopupHolder);
            // Pass default values for start- and end-dates
            var startTime = kendo.toString(e.event.start, "yyyy-MM-dd HH:mm:ss");
            // Start and end dates should be overriden
            var defaultFieldValues = {
                odn: odn
            };
            defaultFieldValues[schedulerConfig.startField] = startTime;
            defaultFieldValues[schedulerConfig.endField] = kendo.toString(new Date(e.event.start.getTime() +
                schedulerConfig.startEndDiff * 60000), "yyyy-MM-dd HH:mm:ss");

            if (dataItem.id) {
                // TODO: place with a hardcode
                var EventData = dataItem["Work_Order"].split(":");
                var EventId = EventData[0];
                var EventName = EventData[1];
                // in fact we have 'Work Task' as 'main object' for scheduler,
                // but need to edit WT's 'Work Order'. So all we have here
                // is not editable object, but its id.
                SchedulerPopupService.openPopup(EventId, defaultFieldValues);
            } else {
                SchedulerPopupService.openPopupNewEntity(e, defaultFieldValues);
            }
            // prevent opening of default kendo popup
            e.preventDefault();
            e.container = $(container);
        };
        // NEW. Unchecked
        // Opens popup for new event creation
        SchedulerPopupService.openPopupNewEntity = function (e, overridenFields) {
            eventManager.fireEvent(LoadActionStartEvent);
            // TODO: get start and end dates and pass them
            var schedulerConfig = configService.getSchedulerConfig();

            var detailPageSettings = {
                odn: mainOdn,
                recordId: null,
                fieldEditMode: 'multiple',
                pageSize: 5,
                displayMode: {
                    type: schedulerConfig.ObjectDetailDisplayMode
                },
                editMode: 'detail'
            };
            if (overridenFields) {
                detailPageSettings.overridenFields = overridenFields;
            }

            objectDetailService.addNewRecord(mainOdn, detailPageSettings).then(function (displayer) {
                eventManager.fireEvent(LoadActionEndEvent);
                // Listen to 'create' and 'close' buttons
                eventManager.addListener(NewODActionButtonClicked, function () {
                    displayer.close();
                }, detailPageSettings);
                eventManager.addListener(NewODCreated, function (APIResponse) {
                    // dispose bound events (not to create excess popups)
                    eventManager.disposeListeners(detailPageSettings);
                    SchedulerPopupService.openPopupForRecentlyCreatedEvent(APIResponse, overridenFields);
                }, detailPageSettings);
                displayer.onClose(function(){
                    eventManager.disposeListeners(detailPageSettings);
                })
            });
        };

        // opens popup for edition/creating the event
        SchedulerPopupService.openPopupForRecentlyCreatedEvent = function (event, overridenFields) {
            var odn = event.ObjectDefinitionName;
            var item = JSON.parse(event.SavedData)[0];
            if(event.image){
                item[SUConstants.RecordFirstImageColumn] = event.image;
            }
            var recordId = event.ObjectEntryID;
            // create settings block, that'll be passed to inline methods
            var detailPageSettings = {
                odn: mainOdn,
                // TODO: find a way not to inherit page template from 'main' object
                pageTemplateName: pageTemplateName,
                recordId: recordId,
                fieldEditMode: 'single',
                pageSize: 5,
                displayMode: {
                    type: schedulerConfig.ObjectDetailDisplayMode
                },
                editMode: 'detail',
                currentRecord: {
                    id: event.ObjectEntryID,
                    name: event.ObjectEntryName,
                    fk: event.ObjectDefinitionID
                }
            };
            // fields, where default values would be overriden
            if (overridenFields) {
                detailPageSettings.overridenFields = overridenFields;
            }
            // create page block for main object
            existingObjectDetailService.createDetailPageBlock(detailPageSettings, item)
                .then(function (pageBlock) {
                    schemaService.createPageTitle(detailPageSettings.odn).then(function (title) {
                        // open popup and set page block as content
                        var displayer = objectDetailDisplayerService.getDisplayer(detailPageSettings.displayMode);
                        displayer.getDetailViewNew(title, pageBlock);
                    })
                });
        };
        // TODO: use existingObjectDetailService.displayObjectDetail
        // opens popup for edition/creating the event
        SchedulerPopupService.openPopup = function (eventId, overridenFields) {
            // create settings block, that'll be passed to inline methods
            var detailPageSettings = {
                odn: mainOdn,
                pageTemplateName: pageTemplateName,
                recordId: eventId,
                fieldEditMode: 'single',
                pageSize: 5,
                displayMode: {
                    type: schedulerConfig.ObjectDetailDisplayMode
                },
                editMode: 'detail'
            };
            // fields, where default values would be overriden
            if (overridenFields) {
                detailPageSettings.overridenFields = overridenFields;
            }
            existingObjectDetailService.getObjectsWithSubObjects(detailPageSettings);
        };

        return SchedulerPopupService;
    }]);