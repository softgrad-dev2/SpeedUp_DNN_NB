/**
 * Created by Мама on 08.06.15.
 */
CSVapp.factory('commonService', ['configService', function (configService) {
//    var gConfig = configService.getGlobalConfig();

    var CommonService = function () {
    }

    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// return true if has any value
    /// return false if doesn't have any value
    /// </summary>
    /// <param name="value">value to check</param>
    CommonService.isNotNullOrUndefinedOrEmpty = function (value) {
        return !(value == undefined || value == null || value == '');
    };

    return CommonService;
}]);