/**
 * Created by me on 24.11.15.
 */
speedupSchedulerModule.factory('schedulerAPIFilterService', ['configService',
    function (configService) {
        var SchedulerAPIFilterService = function () {}

        var schedulerConfig = configService.getSchedulerConfig();

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to merge filter expressions.
        /// </summary>
        /// <param name="ownFilter">scheduler filter with dates period</param>
        /// <param name="foreignFilter">filter passed from filter component</param>
        SchedulerAPIFilterService.mergeFilterExpression = function (ownFilter, foreignFilter) {
            if (ownFilter) {
                if (foreignFilter) {
                    return ownFilter + " AND " + foreignFilter;
                } else {
                    return ownFilter;
                }
            } else {
                return foreignFilter;
            }
        };
        /// <summary>
        /// Method to create filter expression by a date string.
        /// </summary>
        /// <param name="date">date</param>
        SchedulerAPIFilterService.getFilterExpressionByDate = function (date) {
            var schedulerConfig = configService.getSchedulerConfig();

            // Get last day in current month
            var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            // widen the date interval by N days
            var numberOfDaysToAdd = schedulerConfig.numberOfDaysToAdd;
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() - numberOfDaysToAdd);
            lastDayOfMonth.setDate(lastDayOfMonth.getDate() + numberOfDaysToAdd);
            // Convert date to string in order for API to perform search
            var firstDateString = firstDayOfMonth.getFullYear() + "-" + (firstDayOfMonth.getMonth() + 1) + "-" + firstDayOfMonth.getDate();
            var lastDateString = lastDayOfMonth.getFullYear() + "-" + (lastDayOfMonth.getMonth() + 1) + "-" + lastDayOfMonth.getDate();

            return _getFilterExpression(firstDateString, lastDateString);
        };

        /*PRIVATE METHODS*/
        // makes filter expression by start and end strings
        function _getFilterExpression(startDate, endDate) {
            var start = schedulerConfig.startField;
            return "[" + start + "] IS NOT NULL AND [" + start + "] <> ''" +
                " AND SUBSTRING([" + start + "], 1, 3) = '201' AND " +
                "CONVERT(DATETIME2, [" + start + "]) >= CONVERT(DATETIME2, '" + startDate + "')" +
                " AND " +
                "CONVERT(DATETIME2, [" + start + "]) <= CONVERT(DATETIME2, '" + endDate + "')";
        }

        return SchedulerAPIFilterService;
    }
]);
