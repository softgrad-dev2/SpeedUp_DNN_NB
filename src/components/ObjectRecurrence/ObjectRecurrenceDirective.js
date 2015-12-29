/**
 * Created by C4off on 17.06.15.
 */
speedupObjectDetailModule.directive('eventRecurrence', ['$timeout', 'configService', 'repeatActionService',
    function ($timeout, configService, repeatActionService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('ObjectRecurrence/ObjectRecurrence.html');
            },
            restrict: "EA",
            replace: true,
            link: function ($scope, $element) {
                // wait for ng-repeat to wrap elements
                $timeout(function(){
                    // wrap fields
                    repeatActionService.initFields($element, $scope.repeatTypes, $scope.startDate,
                        $scope.endDate, $scope.defaultRepeatType)
                });
            }
        };
    }]);
