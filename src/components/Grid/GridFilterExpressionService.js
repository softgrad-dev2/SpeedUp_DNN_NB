/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.factory('gridFilterExpressionService', ['configService',
    function (configService) {

        var gConfig = configService.getGlobalConfig();
        var _filterDateParamFormat = "yyyy-MM-dd";
        var _defaultSortOrder = "";

        var SqlOperator = {
            NotLikeOperator: ' NOT LIKE ',
            LikeOperator: ' LIKE ',
            NotOperator: ' NOT',
            NotEqualTo: " <>",
            EqualTo: " =",
            LeftPerc: "'%",
            RightPerc: "%'",
            GreaterThanOrEqualTo: " >= ",
            LessThanOrEqualTo: " <= "
        };
        var GridOperator = {
            EqualTo: "eq",
            NotEqualTo: "neq",
            GreaterThanOrEqualTo: "gte",
            LessThanOrEqualTo: "lte",
            Contains: "contains",
            StartsWith: "startswith",
            EndsWith: "endswith"
        };

        var GridFilterExpressionService = function () {
        };

        // CHECKED
        /// <summary>
        /// will return string of sorting expression of selected column.
        /// example: [fieldName] asc
        /// </summary>
        /// <param name="sort">for creation of sort expression</param>
        GridFilterExpressionService.getSortExpression = function(sort) {
            var sortExpression = '';
            var fieldName = '';
            var sortdirection = '';
            if (sort != undefined && sort != null) {

                $.each(sort, function (key, value) {

                    fieldName = '[' + value.field + ']';
                    sortdirection = value.dir;
                    if (sortExpression == '') {
                        sortExpression = fieldName + ' ' + sortdirection
                    }
                    else {
                        sortExpression += ', ' + fieldName + ' ' + sortdirection;
                    }

                });
            }
            return sortExpression == "" ? _defaultSortOrder : sortExpression;
        };

        // CHECKED
        /// <summary>
        /// will return filter expression to filter data based on selected kendo Grid Column.
        /// will further call two methods for return string or date filter expression.
        /// </summary>
        /// <param name="filter">for creation of filter expression</param>
        /// <param name="logic">for adding a logic like and, or etc</param>
        /// <param name="columnsList">array of columns object</param>
        GridFilterExpressionService.getFilterExpression = function (filter, logic, columnsList) {
            var filterExpression = '';
            var fieldName = '';
            var operator = '';
            var fieldValue = '';
            if (filter != undefined && filter != null) {
                $.each(filter.filters, function (key, value) {

                    operator = value.operator;
                    if (value.field != undefined) {
                        fieldName = '[' + value.field + ']';
                        fieldValue = value.value;
                        if (_isDateField(value.field, columnsList)) {
                            filterExpression = _getDateFilterExpression(operator, logic, fieldName, fieldValue, filterExpression);
                        } else if (_isRelationalColumn(value.field, columnsList)){
                            filterExpression = _getRelatedFilterExpression(operator, logic, fieldName, fieldValue, filterExpression);
                        }
                        else {
                            filterExpression = _getStringFilterExpression(operator, logic, fieldName, fieldValue, filterExpression);
                        }
                    }
                });
            }
            return filterExpression;
        };

        /// <summary>
        /// To check if field name of column's header is of date type
        /// </summary>
        /// <param name="fieldName">property name of grid</param>
        /// <param name="gridColumnsList">list of grid column objects</param>
        function _isDateField(fieldName, gridColumnsList) {
            var dataTypes = gConfig.dataTypes;
            for (var column in gridColumnsList) {
                if (gridColumnsList[column].field == fieldName) {
                    if (gridColumnsList[column].dataType == dataTypes.DateTime ||
                        gridColumnsList[column].dataType == dataTypes.Date) {

                        return true;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// To check if field name of column's header is of relational type
        /// </summary>
        /// <param name="fieldName">property name of grid</param>
        /// <param name="gridColumnsList">list of grid column objects</param>
        function _isRelationalColumn(fieldName, gridColumnsList){
            var dataTypes = gConfig.dataTypes;
            for (var column in gridColumnsList) {
                if (gridColumnsList[column].field == fieldName) {
                    if (gridColumnsList[column].dataType == dataTypes.ParentRelationship ||
                        gridColumnsList[column].dataType == dataTypes.ObjectRelationship) {

                        return true;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// will return filter expression for date data type.
        /// example: Convert(datetime,[fieldName]) > Convert(datetime,'fieldvalue')
        /// </summary>
        /// <param name="operator">grid operators</param>
        /// <param name="logicOperator">for adding a logic like and, or etc</param>
        /// <param name="fieldName">Property/header name</param>
        /// <param name="fieldValue">value of property</param>
        /// <param name="OldExpression">any previously applied filter expression</param>
        function _getDateFilterExpression(operator, logicOperator, fieldName, fieldValue, OldExpression) {
            var newExpression;
            var space = " ";
//            fieldValue = kendo.toString(new Date(fieldValue), _filterDateParamFormat);
            switch (operator) {
                case GridOperator.StartsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + "'" + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.EndsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + "'";
                    break;
                case GridOperator.NotEqualTo:
                    newExpression = fieldName + SqlOperator.NotLikeOperator + SqlOperator.LeftPerc + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.EqualTo:
                case GridOperator.Contains:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.GreaterThanOrEqualTo:
                    newExpression = "Convert(datetime," + fieldName + ")" +
                        SqlOperator.GreaterThanOrEqualTo + "Convert(datetime,'" + fieldValue + "')";
                    break;
                case GridOperator.LessThanOrEqualTo:
                    newExpression = "Convert(datetime," + fieldName + ")" +
                        SqlOperator.LessThanOrEqualTo + "Convert(datetime,'" + fieldValue + "')";
                    break;
                default:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc + fieldValue +
                        SqlOperator.RightPerc;
            }
            if (logicOperator != undefined && logicOperator != null) {
                if (OldExpression != '') {
                    OldExpression = OldExpression + space + logicOperator + space + newExpression;
                }
                else {
                    OldExpression = newExpression;
                }
            }
            else {
                OldExpression = OldExpression + space + newExpression;
            }

            return OldExpression;
        }
        /// <summary>
        /// will return filter expression for string data type.
        /// example: [fieldName] <> 'fieldvalue'
        /// </summary>
        /// <param name="operator">grid operators</param>
        /// <param name="logicOperator">for adding a logic like and, or etc</param>
        /// <param name="fieldName">Property/header name</param>
        /// <param name="fieldValue">value of property</param>
        /// <param name="OldExpression">any previously applied filter expression</param>
        function _getStringFilterExpression(operator, logicOperator, fieldName, fieldValue, OldExpression) {

            var newExpression;
            var space = " ";
            switch (operator) {
                case GridOperator.StartsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + "'" + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.EndsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + "'";
                    break;
                case GridOperator.NotEqualTo:
                    newExpression = fieldName + SqlOperator.NotEqualTo + "'" + fieldValue + "'";
                    break;
                case GridOperator.EqualTo:
                    newExpression = fieldName + SqlOperator.EqualTo + "'" + fieldValue + "'";
                    break;
                case GridOperator.Contains:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + SqlOperator.RightPerc;
                    break;
            }
            if (logicOperator != undefined && logicOperator != null) {
                if (OldExpression != '') {
                    OldExpression = OldExpression + space + logicOperator +
                        space + newExpression;
                }
                else {
                    OldExpression = newExpression;
                }
            }
            else {
                OldExpression = OldExpression + space + newExpression;
            }

            return OldExpression;
        }

        /// <summary>
        /// will return filter expression for related data type.
        /// </summary>
        /// <param name="operator">grid operators</param>
        /// <param name="logicOperator">for adding a logic like and, or etc</param>
        /// <param name="fieldName">Property/header name</param>
        /// <param name="fieldValue">value of property</param>
        /// <param name="OldExpression">any previously applied filter expression</param>
        function _getRelatedFilterExpression(operator, logicOperator, fieldName, fieldValue, OldExpression) {

            var newExpression;
            var space = " ";
            switch (operator) {
                case GridOperator.StartsWith:
                    /* '%:VALUE%' */
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        ":" + fieldValue + SqlOperator.RightPerc;
                    break;
                case GridOperator.EndsWith:
                    /* '%:%VALUE' */
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        ":%" + fieldValue + "'";
                    break;
                case GridOperator.NotEqualTo:
                    newExpression = fieldName + SqlOperator.NotLikeOperator + SqlOperator.LeftPerc +
                        fieldValue + SqlOperator.RightPerc;
                    break;
                case GridOperator.Contains:
                case GridOperator.EqualTo:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + SqlOperator.RightPerc;
                    break;
            }
            if (logicOperator != undefined && logicOperator != null) {
                if (OldExpression != '') {
                    OldExpression = OldExpression + space + logicOperator +
                        space + newExpression;
                }
                else {
                    OldExpression = newExpression;
                }
            }
            else {
                OldExpression = OldExpression + space + newExpression;
            }

            return OldExpression;
        }


        return GridFilterExpressionService;
    }]);