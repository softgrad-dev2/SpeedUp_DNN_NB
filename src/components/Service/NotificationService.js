/**
 * Created by antons on 2/26/15.
 */
CSVapp.factory('notificationService', [function () {
    var NotificationService = {};
    /// <summary>
    /// Method will show the notification
    /// </summary>
    /// <param name="msg">message to display</param>
    /// <param name="iserror">error if any</param>
    NotificationService.showNotification = function (msg, isError) {
         if ($("._pluginnotificationmsg").length == 0) {
                var message = $("<div class='pluginNotificationMsg _pluginnotificationmsg '><h3>" + msg + "</h3></div>");
                $(document.body).prepend(message);
            }
            if (isError) {
                $("._pluginnotificationmsg").removeClass("pluginsuccessmsg").addClass("pluginerrormsg");
            }
            else {
                $("._pluginnotificationmsg").removeClass("pluginerrormsg").addClass("pluginsuccessmsg");
            }
            $('._pluginnotificationmsg').animate({ left: "35%" }, 500);
            $('._pluginnotificationmsg').bind("click", function () {
                $(this).fadeOut().remove();
            })
            var timeout = 2000;
            if (isError) {
                timeout = 4000;
            }
            setTimeout(function () {
                $('._pluginnotificationmsg').fadeOut().remove();
            }, timeout);
    };

    return NotificationService;
}]);