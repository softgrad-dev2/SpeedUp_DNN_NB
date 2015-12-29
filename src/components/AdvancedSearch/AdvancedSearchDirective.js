/**
 * Created by antons on 4/7/15.
 */
// Directive for tab, containing filters
CSVapp.directive('advancedsearchtab', [
    '$rootScope', 'configService', 'localizationService',
    function ($rootScope, configService, localizationService) {
        var defaultOptions = {
            type: "local",
            propertyID: "PropertyDefinition_ID",
            propertyViewType: "selected"
        };

        // Collapsing and expanding filterTab fire event for "neighbour"
        // to expand/collapse respectively
        var _showHide = function (isShown, $scope, $element) {
            isShown ? $element.show() :
                $element.hide();

            var elemWidth = $element.width();
            // for grid
            if (!isShown) {
                $scope.$emit(FilterCollapsedEvent, elemWidth);
            } else {
                $scope.$emit(FilterExpandedEvent, elemWidth);
            }
            // for scheduler
            var width = isShown ? -elemWidth : elemWidth;
            $scope.$emit(ASTabChangeWidthEvent, width)
        };


        return {
            restrict: 'EA',
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('AdvancedSearch/AdvancedSearchToolbarTemplate.html');
            },
            replace: true,
            scope: true,
            controller: ["$scope", "$element", "$rootScope", "$timeout", "$attrs", "schemaService", "configService",
                "advancedSearchService", "notificationService", "advancedSearchTemplateService",
                function ($scope, $element, $rootScope, $timeout, $attrs, schemaService, configService,
                          advancedSearchService, notificationService, advancedSearchTemplateService) {
                    $timeout(function () {
                        // get component options
                        // if no options provided - use defaults
                        var options;
                        if ($attrs.asOptions && angular.isObject($scope[$attrs.asOptions])) {
                            options = angular.extend(defaultOptions, $scope[$attrs.asOptions]);
                        } else {
                            options = defaultOptions;
                        }
                        if (!advancedSearchService.CheckOptions(options)) {
                            notificationService.showNotification('Advanced search component options are invalid', true);
                            return;
                        }

                        // get fields template
                        advancedSearchTemplateService.getAdvancedSearchTemplate(options.odn, options.propertyViewType).
                            then(function (fieldsTplObjArr) {
                                // get fields objects
                                advancedSearchService.getFieldsObjects(fieldsTplObjArr).then(function(fields){
                                    $scope.propertyList = fields;
                                    $scope.asTemplateObjects = fieldsTplObjArr;
                                });
                            });

                        $scope.odn = options.odn;
                        $scope.options = options;
                        $scope.dateTimePickerOptions = {
                            format: "G"
                        };
                        $scope.tr = {
                            search: localizationService.translate('AdvancedSearch.Search'),
                            clear: localizationService.translate('AdvancedSearch.Clear'),
                            before: localizationService.translate('AdvancedSearch.Before'),
                            after: localizationService.translate('AdvancedSearch.After')
                        };

                        $scope.filter = "";
                        $scope.propertyList = [];
                        $scope.elementParams = [];
                        $scope.propertyID = options.propertyID;

                        $scope.search = function () {
                            var filterObj = advancedSearchService.createFilterObject(
                                $scope.elementParams, $scope.propertyList,
                                $scope.asTemplateObjects, $scope.options.type
                            );
                            var errors = filterObj.errors;
                            advancedSearchService.ClearInvalidFields($scope.elementParams);
                            if (angular.isArray(errors) && errors.length > 0) {
                                errors.forEach(function (error) {
                                    $scope.elementParams[error.index]['valid'] = false;
                                })
                            } else if(!advancedSearchService.filterIsEmpty(filterObj, $scope.options.type)){
                                $rootScope.$broadcast(AdvancedSearchFilterSetEvent, {
                                    filters: filterObj.filters,
                                    customASFilters: filterObj.customASFilters
                                });
                            }

                            return false;
                        };

                        $scope.clear = function () {
                            if ($scope.type == 'local') {
                                $scope.filter = [];
                            } else {
                                $scope.filter = "";
                            }
                            advancedSearchService.ClearParamsValues($scope.elementParams, $scope.propertyList);
                            advancedSearchService.ClearInvalidFields($scope.elementParams);
                            $rootScope.$broadcast(AdvancedSearchFilterSetEvent, {
                                filters: $scope.filter,
                                customASFilters: []
                            });
                        };
                        // Events to show/hide filter tab (comes from operating
                        // control, e.g. 'advanced search' button)
                        $rootScope.$on(AdvancedSearchTabButtonCollapsedEvent, function () {
                            $scope.showMe = false;
                            _showHide($scope.showMe, $scope, $element);
                        });
                        $rootScope.$on(AdvancedSearchTabButtonExpandedEvent, function () {
                            $scope.showMe = true;
                            _showHide($scope.showMe, $scope, $element);
                        });
                    });
                }
            ]
        };
    }
])
;
// Directive for "catching" event of painting all the filters in list
// and adding some kendo functionality
CSVapp.directive("onRepeatDoneAs", ['$timeout', 'advancedSearchService',
    function ($timeout, advancedSearchService) {

        return {
            restriction: 'A',
            link: function ($scope, element, attributes) {
                $timeout(function () {
                    if ($scope.$last) {
                        advancedSearchService.WrapElements($scope.propertyList, $scope.elementParams);
                        advancedSearchService.setDefaultValues($scope.propertyList, $scope.elementParams);
                    }
                }, 500);
            }
        }
    }]);
// Operating control. 'Advanced search' button
CSVapp.directive('advancedsearchtabbutton', ['$rootScope', '$cookieStore', 'configService',
    'localizationService',
    function ($rootScope, $cookieStore, configService, localizationService) {

        var gConfig = configService.getGlobalConfig();
        var cookieName = gConfig["cookies"]["CookieAdvancedSearchTabOpened"];
        // click on a control causes event emitting for "child" object (advanced search tab)
        // to show/hide, saving a setting to a cookie
        var _showHide = function (isShown) {
            if (!isShown) {
                $rootScope.$broadcast(AdvancedSearchTabButtonCollapsedEvent);
                $cookieStore.remove(cookieName);
            } else {
                $rootScope.$broadcast(AdvancedSearchTabButtonExpandedEvent);
                $cookieStore.put(cookieName, '1');
            }
        };
        return {
            restrict: 'EA',
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('AdvancedSearch/ButtonTemplate.html');
            },
            replace: true,
            scope: true,
            priority: 120,
            controller: ["$scope",
                function ($scope) {
                    $scope.showMe = $cookieStore.get(cookieName) ? true : false;
                    _showHide($scope.showMe);

                    $scope.title = localizationService.translate('Headers.AdvancedSearch');
                    $scope.labelHide = localizationService.translate('Filters.Hide');
                    $scope.showMe = false;
                    $scope.toggle = function toggle() {
                        $scope.showMe = !$scope.showMe;
                        _showHide($scope.showMe);
                    };
                }
            ]
        };
    }]);
// Advanced search pane element
CSVapp.directive('advancedsearchelement', ['configService', function (configService) {
    return {
        restrict: 'E',
        templateUrl: function (tElement, tAttrs) {
            return tAttrs.templateUrl || configService.getTemplateUrl('AdvancedSearch/ElementTemplate.html');
        },
        replace: true
    };
}]);