/**
 * Created by antons on 7/3/15.
 */
speedupPrintBar.directive('printBar', ['configService', 'printBarService',
        function (configService, printBarService) {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl ||
                        configService.getTemplateUrl('PrintBar/PrintBar.html');
                },
                restrict: "EA",
                replace: true,
                transclude: true,
                link: function ($scope, $element) {
                    var odn = $scope.gridParameters.odn;
                    printBarService.bindPrint(odn, $element).then(function () {
                        // bind button click
                        $element.find('._btnDisplayObjectTempl').click(function () {
                            var control = $element.find("input._printTemplList").data("kendoDropDownList")
                            if (control != null && control.value().length > 0) {
                                printBarService.displayPrintTemplate(odn, control.value());
                            }
                        });
                    });
                }
            };
        }]).directive('printTemplate', ['$modalStack', 'configService', 'eventManager',
        function ($modalStack, configService, eventManager) {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl ||
                        configService.getTemplateUrl('PrintBar/PrintTemplate.html');
                },
                restrict: "EA",
                transclude: true,
                replace: true,
                link: function ($scope, $element) {
                    var content = $element.find('#printTemplContainer').html();
                    $("#hdnprintcontent").remove();
                    var div = $("._dynamicNoprintdiv");
                    div.contents().unwrap();
                    $('body').wrapInner('<div class="noprintable _dynamicNoprintdiv" />');
                    $('body').append('<div class="printable" id="hdnprintcontent"/>');
                    $("#objectPrintTmplWnd").find("#printTemplContainer").html(content);
                    $("#hdnprintcontent").html(content);
                    $element.find('._btnPrintTemplate').click(function () {
                        window.print();
                    });
                    $scope.modalInstance.result.then(function (result) {
                        var div = $("._dynamicNoprintdiv");
                        div.contents().unwrap();
                    }, function () {
                        $('.k-overlay:visible').remove()
                        var div = $("._dynamicNoprintdiv");
                        div.contents().unwrap();
                    });
                    eventManager.fireEvent(LoadActionEndEvent);
                    // TODO: paste 'onChange' code
                }
            };
        }]);
