/**
 * Created by antons on 3/20/15.
 */
// Operating control. 'Filter' button
CSVapp.directive('filterDropdownScheduler', ['$rootScope', 'filterService', 'notificationService',
    function ($rootScope, filterService, notificationService) {
        // kendo dropdown object (jqlite)
        var dropDown;

        function _onChange(e, odn) {
            var item = e.sender.dataItem();
            // Fire event
            $rootScope.$broadcast(FilterSetEvent, item);
            filterService.AddFilterSetting(item, odn);
        }

        return {
            restrict: 'E',
            template: "<li class=\"filterDropdownContainer\"><div id=\"filterDropDown\"></div></li>",
            replace: true,
            scope: true,
            priority: 120,
            link: function ($scope, $element, attributes) {
                dropDown = $element.find('#filterDropDown').kendoDropDownList({
                    dataTextField: "FitlerLabel",
                    dataValueField: "FitlerID",
                    dataSource: $scope.filterList,
                    index: 0,
                    change: function(e){
                        _onChange(e, $scope.odn);
                    }
                });
                // when filterList changes bind it to dropdown data source
                $scope.$watch('filterList', function (filters) {
                    var selectedIndex = null;
                    // set data source
                    dropDown.data("kendoDropDownList").dataSource.data(filters);
                    if (filters.length) {
                        // find selected filter
                        filters.some(function (val, index) {
                            if (val["Checked"]) {
                                selectedIndex = index;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        // set selected filter
                        if (selectedIndex !== null) {
                            dropDown.data("kendoDropDownList").select(selectedIndex);
                        }
                        // inform filters are loaded and component is up and ready
                        $scope.$emit(FilterReadyEvent);
                    }
                });
            },
            controller: ["$scope", "$attrs",
                function ($scope, $attrs) {
                    var defaultOptions = {};
                    // get component options
                    // if no options provided - use defaults
                    var options;
                    if($attrs.filterOptions && angular.isObject($scope[$attrs.filterOptions])){
                        options = angular.extend(defaultOptions, $scope[$attrs.filterOptions]);
                    } else{
                        options = defaultOptions;
                    }
                    if(!filterService.CheckOptions(options)){
                        notificationService.showNotification('Filter component options are invalid', true);
                        return;
                    }
                    $scope.odn = options.odn;

                    $scope.filterList = [];
                    // Send a scheduled request to obtain filter list
                    // after API return them, they're bound to $scope.filterList
                    filterService.getFiltersList($scope.odn, $scope);
                }
            ]
        };
    }]);
// Operating control. 'Filter' button
CSVapp.directive('filterdropdown', ['$rootScope', 'filterService', 'notificationService',
    function ($rootScope, filterService, notificationService) {
        // kendo dropdown object (jqlite)
        var dropDown;

        function _onChange(e, odn) {
            var item = e.sender.dataItem();
            // Fire event
            $rootScope.$broadcast(FilterSetEvent, item);
            filterService.AddFilterSetting(item, odn);
        }

        return {
            restrict: 'E',
            template: "<span class=\"filterDropdownContainer\"><div id=\"filterDropDown\"></div></span>",
            replace: true,
            scope: true,
            priority: 120,
            link: function ($scope, $element, attributes) {
                dropDown = $element.find('#filterDropDown').kendoDropDownList({
                    dataTextField: "FitlerLabel",
                    dataValueField: "FitlerID",
                    dataSource: $scope.filterList,
                    index: 0,
                    change: function(e){
                        _onChange(e, $scope.odn);
                    }
                });
                // when filterList changes bind it to dropdown data source
                $scope.$watch('filterList', function (filters) {
                    var selectedIndex = null;
                    // set data source
                    dropDown.data("kendoDropDownList").dataSource.data(filters);
                    if (filters.length) {
                        // find selected filter
                        filters.some(function (val, index) {
                            if (val["Checked"]) {
                                selectedIndex = index;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        // set selected filter
                        if (selectedIndex !== null) {
                            dropDown.data("kendoDropDownList").select(selectedIndex);
                        }
                        // inform filters are loaded and component is up and ready
                        $scope.$emit(FilterReadyEvent);
                    }
                });
            },
            controller: ["$scope", "$attrs",
                function ($scope, $attrs) {
                    var defaultOptions = {};
                    // get component options
                    // if no options provided - use defaults
                    var options;
                    if($attrs.filterOptions && angular.isObject($scope[$attrs.filterOptions])){
                        options = angular.extend(defaultOptions, $scope[$attrs.filterOptions]);
                    } else{
                        options = defaultOptions;
                    }
                    if(!filterService.CheckOptions(options)){
                        notificationService.showNotification('Filter component options are invalid', true);
                        return;
                    }
                    $scope.odn = options.odn;

                    $scope.filterList = [];
                    // Send a scheduled request to obtain filter list
                    // after API return them, they're bound to $scope.filterList
                    filterService.getFiltersList($scope.odn, $scope);
                }
            ]
        };
    }]);
// Directive for tab, containing filters
CSVapp.directive('filtertab', ['$rootScope', function ($rootScope) {
    var tpl = $("#ObjectFilterToolbarTemplate").html();
    // Collapsing and expanding filterTab fire event for "neighbour"
    // to expand/collapse respectively
    var _showHide = function (isShown) {
        if (!isShown) {
            $rootScope.$broadcast(FilterCollapsedEvent);
        } else {
            $rootScope.$broadcast(FilterExpandedEvent);
        }
    };
    return {
        restrict: 'EA',
        template: tpl,
        replace: true,
        scope: true,
        priority: 110,
        controller: ["$scope", "$element", "$attrs", "$timeout", "$rootScope", "filterService", "notificationService",
            function ($scope, $element, $attrs, $timeout, $rootScope, filterService, notificationService) {
                var defaultOptions = {};
                // get component options
                // if no options provided - use defaults
                var options;
                if($attrs.filterOptions && angular.isObject($scope[$attrs.filterOptions])){
                    options = angular.extend(defaultOptions, $scope[$attrs.asOptions]);
                } else{
                    options = defaultOptions;
                }
                if(!filterService.CheckOptions(options)){
                    notificationService.showNotification('Filter component options are invalid', true);
                    return;
                }
                var odn = options.odn;
                $scope.filterList = [];
                // Send a scheduled request to obtain filter list
                // after API return them, they're bound to $scope.filterList and
                // ng-repeat inside template will repaint filter tab
                filterService.getFiltersList(odn, $scope);
                // Hidden by default
                $scope.showMe = false;
                // last filter has been bound by ng-repeat, time to beautify the container
                $scope.$on(CheckFilterStateEvent, function () {
                    console.log('FilterEvent');
                    $timeout(function () {
                        $('._filterContainer', $element).buttonset();
                    }, 0);
                });
                // Events to show/hide filter tab (comes from operating
                // control, e.g. 'filter' button)
                $rootScope.$on(FilterTabButtonCollapsedEvent, function () {
                    $scope.showMe = false;
                    _showHide($scope.showMe);
                });
                $rootScope.$on(FilterTabButtonExpandedEvent, function () {
                    $scope.showMe = true;
                    _showHide($scope.showMe);
                });
                $scope.toggle = function toggle() {
                    $scope.showMe = !$scope.showMe;
                };
                // Handler for filter selection
                $scope.selected = function (index) {
                    var selectedList = $scope.filterList[index];
                    if (selectedList && !selectedList["Checked"]) {
                        $scope.filterList.forEach(function (elem, key) {
                            elem["Checked"] = key == index ? true : false;
                        });
                        // Fire event
                        $rootScope.$broadcast(FilterSetEvent, selectedList);
                        filterService.AddFilterSetting(selectedList, odn);
                    }
                }
            }
        ]
    };
}]);
// Directive for "catching" event of painting all the filters in list
// and adding some JQuery-iu to it
CSVapp.directive("onRepeatDone", function () {
    return {
        restriction: 'A',
        link: function ($scope, element, attributes) {
            if ($scope.$last) {
                $scope.$emit(FilterReadyEvent);
            }
        }
    }
});
// Operating control. 'Filter' button
CSVapp.directive('filtertabbutton', ['$rootScope', '$cookieStore', 'configService',
    function ($rootScope, $cookieStore, configService) {

        var gConfig = configService.getGlobalConfig();
        var cookieName = gConfig["cookies"]["CookieFilterOpened"];

        var tpl = $("#ObjectFilterToolbarButtonTemplate").html();
        // click on a control causes event emitting for "child" object (filter tab)
        // to show/hide, saving a setting to a cookie
        var _showHide = function (isShown) {
            if (!isShown) {
                $rootScope.$broadcast(FilterTabButtonCollapsedEvent);
                $cookieStore.remove(cookieName);
            } else {
                $rootScope.$broadcast(FilterTabButtonExpandedEvent);
                $cookieStore.put(cookieName, '1');
            }
        };
        return {
            restrict: 'EA',
            template: tpl,
            replace: true,
            scope: true,
            priority: 120,
            controller: ["$scope",
                function ($scope) {
                    // Event tells all components are loaded
                    // and can be operated
                    $scope.$on(CheckFilterStateEvent, function () {
                        console.log(CheckFilterStateEvent + " catched")
                        $scope.showMe = $cookieStore.get(cookieName) ? true : false;
                        _showHide($scope.showMe);
                    });
                    $scope.title = $.objectLanguage.Headers.Filters;
                    $scope.labelHide = $.objectLanguage.Filters.Hide;
                    $scope.showMe = false;
                    $scope.toggle = function toggle() {
                        $scope.showMe = !$scope.showMe;
                        _showHide($scope.showMe);
                    };
                }
            ]
        };
    }]);
