/**
 * Created by antons on 5/27/15.
 */
speedupObjectDetailModule.directive('odActionsList', ['$timeout', 'configService',
    'eventManager', 'objectService', 'existingObjectDetailService', 'actionsListService',
    'repeatActionService',
    function ($timeout, configService, eventManager, objectService, existingObjectDetailService,
              actionsListService, repeatActionService) {
        var directiveObject = {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('ActionsList/ActionsList.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            link: function ($scope, $element) {
                // Give time inner ng-repeat to process values
                $timeout(function () {
                    // bind 'delete' button click
                    $element.find('.deleteObjectAction').bind('click', function (e) {
                        var settings = $scope.settings;
                        actionsListService.deleteObject($scope.pageBlock);
                    });
                    // bind 'repeat' button click
                    $element.find('.repeatObjectAction').bind('click',function (e) {
                        var settings = $scope.settings;
                        var startDateStr = settings.overridenFields["Start_Date"];
                        var top = $(this).offset().top;
                        repeatActionService.repeatObject(settings.currentRecord.id,
                            new Date(startDateStr), top);
                    });
                    // bind 'copy' button click
                    $element.find('.copyObjectAction').bind('click',function (e) {
                        var settings = $scope.settings;
                        eventManager.fireEvent(LoadActionStartEvent);
                        actionsListService.copyObject(settings.currentRecord.id, $scope.fields[0],
                            $scope.pageBlock, $scope.settings.odn);
                    });
                    // bind click on 'create new' button with callback
                    $element.find('.subobjectAction').bind('click',function (e) {
                        // TODO: use ODN from scope
                        var odn = $(e.currentTarget).data('objectname');
                        actionsListService.createNewSubObject($scope, odn).
                            then(function () {
                                actionsListService.addNewObjectPageBlockAfterSave($scope);
                            });
                    });
                });
            }
        };


        return directiveObject;
    }]);