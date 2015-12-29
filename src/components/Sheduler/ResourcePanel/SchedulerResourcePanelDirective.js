/**
 * Created by C4off on 05.11.15.
 */
speedupSchedulerModule.directive('schedulerResourcePanel', ['configService',
        function (configService) {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl ||
                        configService.getTemplateUrl('Sheduler/ResourcePanel/SchedulerResourcePanelTemplate.html');
                },
                restrict: "EA",
                replace: true,
                transclude: true,
                link: function ($scope, $element) {
                    // color background of checkboxes
                    $scope.colorBackground = function () {
                        $element.find('.k-checkbox-label').each(function (k, v) {
                           if(k == 0) {
                               return;
                           }
                            var color = $scope.resourcePanelData[k-1].color;
                            var id = '#' + $(v).attr('id');
                            $('<style>' + id + ':before{background-color:' + color + '}</style>').appendTo('head');
                        });
                    };
                    // bind checkbox click
                    $scope.filterContent = function () {
                        var selectedResources = $scope.resourcePanelData.filter(function (resource) {
                            return resource.selected;
                        });
                        $scope.$emit(ResourcePanelFilterChangedEvent, selectedResources);
                    };
                    $scope.checkAllState = true;
                    $scope.checkAll = function () {
                        $scope.resourcePanelData.forEach(function (resource) {
                            resource.selected = $scope.checkAllState;
                        });
                        $scope.filterContent();
                    };
                    $scope.$on(SchedulerResourcePanelToggleEvent, function (event, state) {
                        state ? $element.show() : $element.hide();
                        var elWidth = $element.width() + 40;
                        var width = state ? -elWidth : elWidth;
                        $scope.$emit(SchedulerChangeWidthEvent, width)
                    })
                }
            };
        }]).directive('schedulerResourceButton', [
        function () {
            return {
                template: "<div class='scheduler-resource-button'>" +
                    "<span class='scheduler-resource-btn-img'></span>" +
                    "</div>",
                restrict: "EA",
                replace: true,
                transclude: true,
                link: function ($scope, $element) {
                    $scope.opened = false;

                    $element.on('click', function () {
                        $scope.opened = !$scope.opened;
                        $scope.$emit(SchedulerResourceButtonClickedEvent, $scope.opened);
                    })
                }
            };
        }]).directive('rpPostRepeat', ['$timeout',
        function ($timeout) {
            return {
                link: function ($scope, $element) {
                    if ($scope.$last) {
                        // give angular time to process ng-attr- things on label elements
                        $timeout($scope.colorBackground);
                    }
                }
            };
        }]);
