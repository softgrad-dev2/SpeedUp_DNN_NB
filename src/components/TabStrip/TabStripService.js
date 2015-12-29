/**
 * Created by antons on 5/19/15.
 */
speedupObjectDetailModule.factory('tabStripService', ['attachmentsService', 'existingObjectDetailService',
    'objectDetailService', 'objectDetailDisplayerService', 'tsHeaderSubObjectService',
    function (attachmentsService, existingObjectDetailService,
              objectDetailService, objectDetailDisplayerService, tsHeaderSubObjectService) {
        var TabStripService = function () {

        };

        /*PUBLIC METHODS*/
        TabStripService.onSelectTab = function (tabStripData, element, e, settings, pageBlock) {
            // TODO: maybe, there will be a need to choose only related subobjects
//            var recordId = settings.recordId;
            var recordId = settings.currentRecord.id;
            var odn = settings.odn;
            var selectedTab = $(element).find(e.item);
            var currentTab = e.sender.select();
            if(currentTab.hasClass('_tabDetails')){
                pageBlock.hideChildren();
            } else if(selectedTab.hasClass('_tabDetails')){
                pageBlock.showChildren();
            }
            if (selectedTab.hasClass('_tabAttachments')) {
                // if scope.attachments has elements, then
                // attachments have been already bound
                if (!tabStripData.attachments || !tabStripData.attachments.attachments) {
                    attachmentsService.getAttachments(recordId, odn).then(function (attachments) {
                        tabStripData.attachments = attachments;
                    });
                }
            }
            else if (selectedTab.hasClass("_subObjectTab")) { /// to show the subobject in tab
                var tabData = selectedTab.data().$scope.tab;
                var contentElement = angular.element(e.contentElement);
                var objectDataContainer = contentElement.find('._subObjectContent');
                tsHeaderSubObjectService.createSubObjectPage(objectDataContainer, tabData.ObjectDefinitionName, "Default", recordId,
                    tabData.PropertyName);
            }
        };

        return TabStripService;
    }]);