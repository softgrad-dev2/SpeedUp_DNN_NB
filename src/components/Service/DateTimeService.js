/**
 * Created by antons on 5/14/15.
 */
CSVapp.factory('dateTimeService', ['configService', function (configService) {

    var gConfig = configService.getGlobalConfig();

    var DateTimeService = {

    };

    /// <summary>
    /// method will Format the Date
    /// </summary>
    DateTimeService.FormatDateAmPm = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// returns date in yyyy-MM-dd HH:mm:ss format
    /// returns empty if values is undefined, null or empty
    /// </summary>
    /// <param name="value">value to parse into datetime</param>
    DateTimeService.DateTimeFormat = function (value) {
        return DateTimeHelper.DateTimeFormat(value);
    }
    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// returns date in yyyy-MM-dd format
    /// returns empty if values is undefined, null or empty
    /// </summary>
    /// <param name="value">value to parse into datetime</param>
    DateTimeService.DateFormat = function (value) {
        return DateTimeHelper.DateFormat(value);
    }

    return DateTimeService;
}]);