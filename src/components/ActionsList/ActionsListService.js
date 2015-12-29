/**
 * Created by antons on 6/16/15.
 */
speedupObjectDetailModule.factory('actionsListService', ['objectEditService', 'eventManager',
    'objectService', 'existingObjectDetailService', 'localizationService', 'notificationService',
    'popupService',
    function (objectEditService, eventManager, objectService, existingObjectDetailService, localizationService, notificationService, popupService) {
        var ActionsListService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to remove object
        /// </summary>
        /// <param name="pageBlock">target page block</param>
        ActionsListService.deleteObject = function (pageBlock) {
            // confirm delete
            var title = localizationService.translate('Titles.DeleteObject');
            var msg = localizationService.translate('Messages.DeleteObject');
            popupService.confirm(title, msg).then(function () {
                // if it's last subobject
                var parent = pageBlock.parentBlock;
                if (parent && parent.getChildrenCount() <= 1) {
                    // i'm the only child...
                    msg = localizationService.translate('Messages.DeleteParentIfNoSubobjects');
                    popupService.confirm(title, msg, {
                        position: {
                            top: pageBlock.element.offset().top + 25 + ""
                        }
                    }).then(function () {
                        _deleteObjectWithPageBlock(parent);
                    }, function () {
                        // delete object
                        _deleteObjectWithPageBlock(pageBlock);
                    });
                } else {
                    // delete object
                    _deleteObjectWithPageBlock(pageBlock);
                }
            })
        };
        /// <summary>
        /// Method to copy object
        /// </summary>
        /// <param name="objectID">record id</param>
        /// <param name="dataItem">object data</param>
        /// <param name="pageBlock">target page block</param>
        /// <param name="odn">object definition name</param>
        ActionsListService.copyObject = function (objectID, dataItem, pageBlock, odn) {
            return objectService.copyObject(objectID, odn, true).then(function (objectMeta) {
                var msg = localizationService.translate('Messages.RecordCopiedSuccessfully');
                notificationService.showNotification(msg);
                // update pageBlock settings
                var pageBlockSettings = angular.merge({}, pageBlock.settings, {
                    currentRecord: {
                        id: objectMeta.ObjectEntry_ID,
                        name: objectMeta.Name
                    },
                    recordId: objectMeta.ObjectEntry_ID,
                    displayMode: {
                        type: 'element',
                        element: '<div></div>'
                    }
                });
                existingObjectDetailService.getObjectsWithSubObjects(pageBlockSettings, false).then(function(displayer){
                    eventManager.fireEvent(LoadActionEndEvent);
                    var newPageBlock = displayer.pageBlock;
                        // if we copy subobject - add it to siblings
                        if (pageBlock.parentBlock) {
                            pageBlock.parentBlock.appendChildBlock(newPageBlock);
                            // scroll to it
                            $("html, body").animate({scrollTop: newPageBlock.element.offset().top}, 1000);
                        } else {
                            // if we copy 'parent' -> show new one instead of old one
                            pageBlock.substituteBlockBy(newPageBlock);
                            // scroll to it
                            $("html, body").animate({scrollTop: newPageBlock.element.offset().top}, 1000);
                        }
                });
            }, function (error) {
                eventManager.fireEvent(LoadActionEndEvent);
                notificationService.showNotification(error, true);
            });
        };
        /// <summary>
        /// Method to create new subObject
        /// </summary>
        /// <param name="$scope">parent scope</param>
        /// <param name="odn">object definition name</param>
        ActionsListService.createNewSubObject = function ($scope, odn) {
            var parentRecord = $scope.settings.currentRecord;
            if (parentRecord) {
                return objectEditService.createNewObject(odn,
                    parentRecord.id,
                    parentRecord.name,
                    parentRecord.fk,
                    $scope.settings.overridenFields
                );
            } else {
                // Warning. if we got here, we will not be able to auto-bind subObject to parent
                return objectEditService.createNewObject(odn);
            }
        };
        /// <summary>
        /// Method to show newly created page block in 'detail' mode
        /// </summary>
        /// <param name="$scope">parent scope</param>
        ActionsListService.addNewObjectPageBlockAfterSave = function (scope) {
            // start listening for 'create new object' event
            var listenerHolder = {};
            eventManager.addListener(ObjectSavedEvent, function (apiResponse) {
                // add subObject to parent on detail page
                var parentPageBlock = scope.pageBlock;
                var pageBlockSettings = angular.merge({}, parentPageBlock.settings);
                pageBlockSettings.odn = apiResponse.ObjectDefinitionName;
                pageBlockSettings.recordId = apiResponse.ObjectEntryID;
                pageBlockSettings.currentRecord = {
                    fk: apiResponse.ObjectDefinitionID,
                    id: apiResponse.ObjectEntryID,
                    name: apiResponse.ObjectEntryName
                };
                var fields = objectService.extractItemFromSaveAPIResponse(apiResponse);
                existingObjectDetailService.createDetailPageBlock(pageBlockSettings, fields).then(
                    function (pageBlock) {
                        parentPageBlock.appendChildBlock(pageBlock);
                    }
                );
                // unbind listener
                eventManager.disposeListeners(listenerHolder);
            }, listenerHolder);
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Method to delete object and its pageBlock
        /// </summary>
        /// <param name="pageBlock">page block</param>
        function _deleteObjectWithPageBlock(pageBlock) {
            // delete parent
            var recordId = pageBlock.settings.currentRecord.id;
            var odn = pageBlock.settings.odn;

            return objectService.deleteObject(recordId, odn, true).then(function () {
                // remove pageBlock
                pageBlock.removeBlock();
                var msg = localizationService.translate('Messages.RecordDeletedSuccessfully');
                notificationService.showNotification(msg);
                // if it's a root pageBlock - we need to close displayer
                if (!pageBlock.parentBlock && pageBlock.displayer) {
                    pageBlock.displayer.close();
                }
            }, function () {
                var msg = localizationService.translate('Messages.UnableToDeleteRecord');
                notificationService.showNotification(msg, true);
            });
        }

        return ActionsListService;
    }]);