/**
 * Created by antons on 5/18/15.
 */
speedupObjectDetailModule.directive('tabStrip', [ '$timeout', 'tabStripService', 'configService',
        function ($timeout, tabStripService, configService) {
            var defaultSettings = {
                showAttachments: true,
                addAttachment: true,
                recordId: null,
                odn: null
            };
            return {
                templateUrl: function (tElement, tAttrs) {
                    // TODO: get address of templates from options
                    return tAttrs.templateUrl ||
                        configService.getTemplateUrl('TabStrip/TabStrip.html');
                },
                restrict: "EA",
                transclude: true,
                replace: true,
                controller: ['$scope', function ($scope) {
                    // merge directive settings with default
                    $scope.tabStrip.settings = $scope.tabStrip.settings ?
                        angular.extend(defaultSettings, $scope.tabStrip.settings) :
                        defaultSettings;
                    // if we want to show attachments
                    // tab we need to initialize $scope.attachments
                    if ($scope.tabStrip.settings.showAttachments) {
                        $scope.tabStrip.attachments = $scope.tabStrip.attachments || [];
                    }
                }],
                link: {
                    post: function ($scope, $element) {
                        // timeout is needed, because nested
                        // ng-repeat hasn't been compiled yet
                        $timeout(function () {
                            // wrap tabstrip with kendo
                            $element.kendoTabStrip({
                                select: function (e) {
                                    return tabStripService.onSelectTab(
                                        $scope.tabStrip, $element, e,
                                        $scope.settings, $scope.pageBlock);
                                },
                                animation: false,
                                navigatable : false
                            });
                            // set equal min height to all content panes
                            $element.find(".k-content").css('min-height', $element.find("._detailsContent:first").height());
                            // Bind attachment image change
                            $scope.$on(AttachmentImageChangedEvent, function(scope, imgUrl){
                                $element.find('.ContainerDiv.widen').removeClass('widen');
                                $element.find('.ContainerDiv.hidden').removeClass('hidden');
                                $element.find('._AttachmentImages>img').attr('src', imgUrl);
                            })
                        });
                    }
                }
            };
        }]);

