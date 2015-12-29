/**
 * Created by C4off on 17.06.15.
 */
CSVapp.factory('popupService', ['$q', '$modal', 'localizationService',
    function ($q, $modal, localizationService) {

        var _confirmDefaultSettings = {
            width: "250px",
            modal: true,
            visible: false,
            doCenterVert: true
        };

        var _confirmWithContentDefaultSettings = {
            width: "405px",
            modal: true,
            visible: false,
            doCenterVert: true
        };

        var _printTemplateDefaultSettings = {
            modal: true,
            visible: false,
            resizable: true,
            maxHeight: 650,
            minHeight: 300,
            width: 700,
            actions: ["Pin", "Minimize", "Maximize", "Close"]
        };

        var PopupService = function () {
        };

        PopupService.displayPrintTemplatePopup = function(title, content){
            return _openStandardPopup(_printTemplateDefaultSettings, content);
        };

        PopupService.displayMapPopup = function(title, content){
            return _openStandardPopup(_printTemplateDefaultSettings, content);
        };

        /// <summary>
        /// Method to show "Yes/No" modal popup with message
        /// </summary>
        /// <param name="title">title of popup</param>
        /// <param name="message">message of the popup</param>
        PopupService.confirm = function (title, message, settings) {
            var yesBtnText = localizationService.translate("Buttons.Yes");
            var noBtnText = localizationService.translate("Buttons.No");
            var html =
                '<div id="okCancelWindow"> ' +
                    ' <div style="text-align: center; width:100%"> ' +
                    '   <div style="margin:10px 0 15px 0">' + message + '</div> ' +
                    '   <button class="k-button k-primary" id="yesButton" style="z-index=20000">' + yesBtnText + '</button> ' +
                    '   <button class="k-button" id="noButton" style="z-index=20000">' + noBtnText + '</button> ' +
                    '   </div> ' +
                    '</div> ';
            // settings
            var modalSettings;
            if (settings) {
                modalSettings = angular.extend({}, _confirmDefaultSettings, settings);
            } else {
                modalSettings = _confirmDefaultSettings;
            }
            // content
            var content = angular.element(html);

            return _openPopup(modalSettings, content);
        };

        /// <summary>
        /// Method to show "Yes/No" modal popup with content
        /// </summary>
        /// <param name="title">title of popup</param>
        /// <param name="message">message of the popup</param>
        PopupService.confirmWithContent = function (title, contentHTML, settings) {
            var yesBtnText = localizationService.translate("Buttons.Done");
            var noBtnText = localizationService.translate("Buttons.Cancel");
            var html =
                '<div id="confirmPopup"> ' +
                    ' <div style="text-align: center; width:100%">' +
                '   <div id="ModalPopupContent"></div>' +
                '   <button class="k-button k-primary" id="yesButton" style="z-index:20001">' + yesBtnText + '</button> ' +
                '   <button class="k-button" id="noButton" style="z-index:20001">' + noBtnText + '</button> ' +
                '   </div> ' +
            '</div> ';
            var content = angular.element(html);
            content.find('#ModalPopupContent').append(angular.element(contentHTML));
            // settings
            var modalSettings;
            if (settings) {
                modalSettings = angular.extend({}, _confirmWithContentDefaultSettings, settings);
            } else {
                modalSettings = _confirmWithContentDefaultSettings;
            }
            modalSettings.title = title;

            return _openPopup(modalSettings, content);
        };

        /// <summary>
        /// Method to open simple popup
        /// </summary>
        /// <param name="settings">settings of popup</param>
        /// <param name="content">content of the popup</param>
        function _openStandardPopup(settings, content) {
            var modalInstance = $modal.open({
                template: "<div></div>",
                settings: settings,
                resolve: {
                    items: function () {
                        return content;
                    }
                },
                content: content
            });

            return modalInstance;
        }

        /// <summary>
        /// Method to open simple popup
        /// </summary>
        /// <param name="settings">settings of popup</param>
        /// <param name="content">content of the popup</param>
        function _openPopup(settings, content) {
            var deferred = $q.defer();

            var modalInstance = $modal.open({
                template: "<div></div>",
                settings: settings,
                resolve: {
                    items: function () {
                        return content;
                    }
                },
                content: content
            });
            content.find('#yesButton').one('click',function (e) {
                modalInstance.close();
                deferred.resolve();
            });

            content.find('#noButton').one('click',function (e) {
                modalInstance.close();
                deferred.reject()
            });

            return deferred.promise;
        }

        return PopupService;
    }]);