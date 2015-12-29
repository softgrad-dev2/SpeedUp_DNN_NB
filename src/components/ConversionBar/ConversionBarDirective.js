/**
 * Created by antons on 7/3/15.
 */
speedupConversionBar.directive('conversionBar', ['configService', 'conversionBarService',
    'gridWidgetService', 'localizationService', 'notificationService', 'existingObjectDetailService',
    'eventManager',
    function (configService, conversionBarService, gridWidgetService, localizationService, notificationService,
              existingObjectDetailService, eventManager) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('ConversionBar/ConversionBar.html');
            },
            restrict: "EA",
            replace: true,
            link: function ($scope, $element) {
                var odn = $scope.gridParameters.odn;
                conversionBarService.bindConversionBar($element, odn);
                $element.find("._btnObjectConversion").click(function (e) {
                    var control = $element.find("input._selectConversionType").data("kendoDropDownList")
                    if (control != null && control.value().length > 0) {
                        var gConfig = configService.getGlobalConfig();
                        var gridElement = angular.element(gConfig.gridContainer);
                        if (gridElement.length) {
                            var selectedRows = gridWidgetService.getSelectedRows(gridElement);
                            var selectedRowIds = [];
                            selectedRows.forEach(function (rowData) {
                                if (rowData.ObjectEntry_ID) {
                                    selectedRowIds.push(rowData.ObjectEntry_ID);
                                }
                            });
                            if (selectedRowIds.length) {
                                // display loader
                                eventManager.fireEvent(LoadActionStartEvent);

                                conversionBarService.runObjectConversion(control.value(),
                                        odn, selectedRowIds)
                                    .then(function (response) {
                                        // hide loader
                                        eventManager.fireEvent(LoadActionEndEvent);

                                        var msg = localizationService.translate('Messages.ConversionSuccessfully');
                                        notificationService.showNotification(msg);
                                        if(response.NewRecordID && response.NewRecordObjectDefinitionName){
                                            // display new object detail in popup
                                            existingObjectDetailService.displayObjectDetail(response.NewRecordID,
                                            response.NewRecordObjectDefinitionName, {
                                                    type: 'popup'
                                                })
                                        }
                                    }, function(){
                                        eventManager.fireEvent(LoadActionEndEvent);

                                        var msg = localizationService.translate('Messages.ConversionFailed');
                                        notificationService.showNotification(msg, true);
                                    });
                            } else{
                                var msg = localizationService.translate('Messages.NoRecordsForConversion');
                                alert(msg);
                            }
                        }
                    }
                });
            }
        };
    }]);