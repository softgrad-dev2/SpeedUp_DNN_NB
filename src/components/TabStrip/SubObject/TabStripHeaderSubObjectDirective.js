/**
 * Created by antons on 7/2/15.
 */
speedupObjectDetailModule.directive('tsHeaderSubObject', ['$timeout', 'configService',
    function ($timeout, configService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('TabStrip/SubObject/TabStripHeaderSubObject.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            link: function ($scope, $element) {

            }
        }
    }
]);
