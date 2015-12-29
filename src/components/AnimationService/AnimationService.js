/**
 * Created by antons on 7/9/15.
 */
CSVapp.factory('animationService', ['filesystemService',
    function (filesystemService) {
        var _displayInlineLoaderInProgress = false;
        var _displayGlobaloaderInProgress = false;

        var globalLoader = filesystemService.getPluginImageUrl("js/img/fullpageloader.GIF");
        var inlineLoader = filesystemService.getPluginImageUrl("js/img/loader.gif");

        var AnimationService = function () {
        };

        /// <summary>
        /// Method will display loader (for 'global' events)
        /// </summary>
        AnimationService.displayGlobalLoader = function () {
            if (!_displayGlobaloaderInProgress) {
                var message = $("<div id='globalLoader' class='_messagediv1 messagediv' style='z-index: 20005;'>" +
                    "<img src='" + globalLoader + "' style='left: 45%;top: 50%; z-index: 20005; position: absolute;'/>" +
                    "<div style='position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; '></div>" +
                    "<div class='statusMessage rb-a-4 _status'>" +
                    "<span class='_message'></span>" +
                    "</div>" +
                    "</div>");
                _displayGlobaloaderInProgress = true;
                $(document.body).append(message);
            }
        };
        /// <summary>
        /// Method will hide loader
        /// </summary>
        /// <param name="element">HTML Element</param>
        AnimationService.hideGlobalLoader = function () {
            if (_displayGlobaloaderInProgress) {
                $("#globalLoader").remove();
                _displayGlobaloaderInProgress = false;
            }
        };
        // Checked
        /// <summary>
        /// Method will display loader
        /// </summary>
        /// <param name="element">HTML Element</param>
        AnimationService.displayInlineLoader = function (element) {
            if (!_displayInlineLoaderInProgress) {
                $('<img src="' + inlineLoader + '" class="_inlineLoader" Height="15px" Width="15px">').insertAfter(element);
                _displayInlineLoaderInProgress = true;
            }
        };
        // checked
        /// <summary>
        /// Method will hide loader
        /// </summary>
        /// <param name="element">HTML Element</param>
        AnimationService.hideInlineLoader = function (element) {
            if (_displayInlineLoaderInProgress) {
                $("._inlineLoader").remove();
                _displayInlineLoaderInProgress = false;
            }
        };


        return AnimationService;
    }]);