/**
 * Created by antons on 5/20/15.
 */
speedupObjectDetailModule.directive('objectDetailAttachment', ['$timeout', 'attachmentsService',
    'notificationService', 'configService',
    function ($timeout, attachmentsService, notificationService, configService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('TabStrip/ObjectDetailAttachmentTemplate.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            scope: {
                source: '=source',
                settings: '=settings'
            },
            controller: ['$scope', function ($scope) {
                $scope.removeFile = function (fileId, odn, recordId) {
                    attachmentsService.removeFile(fileId, odn, recordId).then(function () {
                        debugger;
                        var refreshedAttachments = [];
                        // delete attachment from scope.attachments to refresh the list
                        $scope.source.attachments.forEach(function (elem) {
                            if (elem.FileId != fileId) {
                                refreshedAttachments.push(elem);
                            }
                        });
                        $scope.source.attachments = refreshedAttachments;
                        // update image if needed
                        var imgUrl = attachmentsService.updateImage($scope.source.attachments);
                        if(imgUrl){
                            $scope.$emit(AttachmentImageChangedEvent, imgUrl);
                        }
                    }, function (message) {
                        notificationService.showNotification(message, true);
                    })
                }
            }],
            link: function ($scope, $element) {
                var odn = $scope.settings.odn;
                var recordId = $scope.settings.recordId;
                // wrap uploader if needed
                $scope.$watch('source', function (src) {
                    if (src.addAttachment) {
                        $timeout(function () {
                            var uploaderElement = $element.find("." + src.fileUploadId);
                            attachmentsService.wrapUploader(uploaderElement, odn, recordId, $scope.source,
                            function(attachments){
                                var imgUrl = attachmentsService.updateImage(attachments);
                                if(imgUrl){
                                    $scope.$emit(AttachmentImageChangedEvent, imgUrl);
                                }
                            });
                        });
                    }
                });
            }
        }
    }
]);
