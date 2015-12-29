/**
 * Created by antons on 7/21/15.
 */
CSVapp.factory('popupNotificationService', ['$cookies', '$modal', 'localizationService',
    'filesystemService',
    function ($cookies, $modal, localizationService, filesystemService) {

        var _notificationPopupDefaultSettings = {
            modal: true,
            visible: false,
            maxHeight: 1000,
            minHeight: 300,
            width: 750,
            resizable: false,
            actions: ["Close"]
        };

        var PopupNotificationService = {};

        PopupNotificationService.displayMainPageNotification = function(){
            // display notification popup if needed
            var notificationCookieName = SUConstants.NotificationCookieName;
            if (!$cookies.get(notificationCookieName) && $("#notificationBlock").length) {
                PopupNotificationService.displayNotificationPopup($("#notificationBlock"));
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 100);
                $cookies.put(notificationCookieName, "1", {expires: expireDate});
            }
        };

        PopupNotificationService.displayNotificationPopup = function (element) {
            element.show();
            var pages = element.find('li');
            if (pages.length) {
                var notificationList = element.find('.notificationsList');

                // create images full paths
                element.find('img').each(function(index, img){
                    $(img).attr('src', filesystemService.getImageUrl($(img).data('addr')));
                });

                var slider = notificationList.anythingSlider({
                    buildArrows: true,
                    buildNavigation: false,
                    buildStartStop: false
                });

                var modalInstance = _openPopup(element);
                modalInstance.opened.then(function () {
                    // show dispose button on last slide
                    var gotItBtn = angular.element('#popupYesButton');
                    if(pages.length == 1){
                        gotItBtn.css('visibility', 'visible');
                    }
                    slider.bind('slide_complete', function (event, slider) {
                        if (slider.currentPage == pages.length) {
                            gotItBtn.css('visibility', 'visible');
                        }
                    });
                    gotItBtn.click(function () {
                        modalInstance.dismiss();
                    });
                });
            }
        };

        /// <summary>
        /// Method to open simple popup
        /// </summary>
        /// <param name="settings">settings of popup</param>
        /// <param name="content">content of the popup</param>
        function _openPopup(content) {
            var tpl = '<div>' +
                '<div class="content"></div>' +
                '<button class="k-button k-primary" id="popupYesButton"' +
                '">' +
                localizationService.translate("Buttons.GotIt") +
                '</button>' +
                '</div>';
            return $modal.open({
                template: tpl,
                settings: _notificationPopupDefaultSettings,
                resolve: {
                    items: function () {
                        return content;
                    }
                },
                content: content
            });
        }

        return PopupNotificationService;
    }
]);