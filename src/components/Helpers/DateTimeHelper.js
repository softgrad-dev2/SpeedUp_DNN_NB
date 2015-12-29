/**
 * Created by antons on 5/14/15.
 */
var DateTimeHelper = function(){

}
    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// returns date in yyyy-MM-dd HH:mm:ss format
    /// returns empty if values is undefined, null or empty
    /// </summary>
    /// <param name="value">value to parse into datetime</param>
DateTimeHelper.DateTimeFormat = function (value) {
    if (value != undefined && value != null && value != "" && value != 'null') {
        var date = kendo.parseDate(value, 'yyyy-MM-dd HH:mm:ss');
        date = date == null ? new Date(value) : date;
        date = kendo.parseDate(date, 'yyyy-MM-dd HH:mm:ss');
        if (date == undefined || date == null || date == 'null') {
            return "";
        }

        return kendo.toString(date, "yyyy-MM-dd HH:mm:ss");

    }

    return "";
}
/// <summary>
/// To check whether the passed parameter has any value or not.
/// returns date in yyyy-MM-dd format
/// returns empty if values is undefined, null or empty
/// </summary>
/// <param name="value">value to parse into datetime</param>
DateTimeHelper.DateFormat = function (value) {

    if (value != undefined && value != null && value != "" && value != 'null') {
        var date = kendo.parseDate(value, 'yyyy-MM-dd ');
        date = date == null ? new Date(value) : date;
        date = kendo.parseDate(date, 'yyyy-MM-dd ');
        if (date == undefined || date == null || date == 'null') {
            return "";
        }
        return kendo.toString(date, "yyyy-MM-dd");

    }
    return "";
}
Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};