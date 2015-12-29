/**
 * Created by antons on 6/23/15.
 */
speedupGridModule.directive('gridToolbar', ['$timeout', 'configService', 'objectEditService', 'eventManager',
    function ($timeout, configService, objectEditService, eventManager) {

        return {
            templateUrl: function (tElement, tAttrs) {
                // TODO: get address of templates from options
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('Grid/Toolbar/GridToolbar.html');
            },
            restrict: "EA",
            replace: true,
            link: function ($scope, $element) {
                // give inner directives time to generate DOM
                $timeout(function () {
                    // bind 'create new' button click
                    $element.find('._btnAddNewRecord').click(function () {
                        if ($scope.odn) {
                            objectEditService.createNewObject($scope.odn);
                        }
                    });
                    // bind 'generic search' button click
                    $element.find('._objectSearchButton').click(function () {
                        var genericSearchStr = $element.find('._txtObjectSearch').val();
                        eventManager.fireEvent(FilterGridByGenericSearchEvent, {
                            odn: $scope.odn,
                            genericSearchStr: genericSearchStr
                        });
                    });
                    // bind 'generic search' enter click
                    $element.find('._txtObjectSearch').on('keydown', function (e) {
                        if (e.which == 13) {
                            var genericSearchInput = $element.find('._txtObjectSearch');
                            eventManager.fireEvent(FilterGridByGenericSearchEvent, {
                                odn: $scope.odn,
                                genericSearchStr: genericSearchInput.val()
                            });
                            genericSearchInput.select();
                        }
                    });
                });
            }
        }
    }
]);