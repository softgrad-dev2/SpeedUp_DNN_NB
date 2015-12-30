/**
 * Created by antons on 4/16/15.
 */
// for simple grid control (ViewObjectDataGrid.ascx)
var CSVapp = angular.module('speedup.CSVModule',
        ['kendo.directives', 'ngCookies', 'ngResource', 'speedup.modal',
            'speedup.localization', 'speedup.objectDetail',
            'speedup.exceptionHandling', 'speedup.grid', 'speedup.conversionBar',
            'speedup.printBar'
        ])
    .run(['configService', 'schemaService', 'autocompleteService', 'listDataLoaderService', function (configService, schemaService, autocompleteService, listDataLoaderService) {
        configService.Init();

        var gConfig = configService.getGlobalConfig();
        var objectDefinitionName = gConfig.objectDefinitionName;

        // Init Schema
        schemaService.Init();
        // TODO: cut restore later
//        // Prepare autocomplete data
//        // (here acData is global variable from incoming .js files)
//        if (typeof(acData) != 'undefined') {
//            autocompleteService.prepareACData(acData);
//        }
//        // LOAD list values for both objects
//        listDataLoaderService.fetchMultipleListsData(objectDefinitionName);
    }]);

CSVapp.controller("PageLogicController", ["$scope", "$rootScope", "configService",
    'eventManager', 'animationService', 'popupNotificationService', 'filesystemService',
    function ($scope, $rootScope, configService, eventManager, animationService, popupNotificationService, filesystemService) {
        var filterReady = false;

        var gConfig = configService.getGlobalConfig();
        var objectDefinitionName = gConfig.objectDefinitionName;
        // display notification popup, if any
        popupNotificationService.displayMainPageNotification();

        // disable enter click lead to another page
        $(document).keypress(function (e) {
            if (e.which == 13) {
                debugger;
                if (e.currentTarget && e.currentTarget.activeElement &&
                    e.currentTarget.activeElement.tagName &&
                    typeof(e.currentTarget.activeElement.tagName) == 'string' &&
                    e.currentTarget.activeElement.tagName.toLowerCase() == 'textarea') {

                } else {
                    e.preventDefault();
                }
            }
        });

        // add toolbar to grid
        $scope.gridToolbar = {
            odn: objectDefinitionName,
            showCreateNewButton: true,
            filter: {
                odn: objectDefinitionName
            },
            genericSearch: true,
            batchUpdate: gConfig.batchUpdate
        };
        // advanced search component options
        $scope.asOptions = {
            type: "api",
            odn: objectDefinitionName,
            propertyViewType: "selected"
        };
        // grid 'overriding' fields (fields only for main grid)
        $scope.mainGridOptions = {
            // hack for grid to wait until filter is loaded
            autoBind: !gConfig.waitForFilter
        };
        $scope.batchUpdate = gConfig.batchUpdate;
        $scope.odn = objectDefinitionName;
        $scope.gridElement = $(gConfig.gridContainer);

        // bind keyboard functionality to detail page
        if (gConfig.enableKeyboard) {
            // bind global keyboard events
            $(document).off('keydown');
            $(document).on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    var tabPressEvent = jQuery.Event("detailKeypress");
                    tabPressEvent.which = $rootScope.shiftPressed ? 169 : 9;
                    // currentPageBlock may not have been set yet
                    if ($rootScope.currentPageBlock &&
                        $rootScope.currentPageBlock.contentObject &&
                        $rootScope.currentPageBlock.contentObject.element) {
                        $rootScope.currentPageBlock.contentObject.element.trigger(tabPressEvent);
                    } else {
                        _activateFirstDetailPageBlock();
                    }
                    e.preventDefault();
                } else if (keyCode == 13) {
                    // exclude "search" button click
                    if(e.currentTarget && e.currentTarget.activeElement &&
                        $(e.currentTarget.activeElement).hasClass('_txtObjectSearch')){
                        return false;
                    }
                    var enterPressEvent = jQuery.Event("detailKeypress");
                    enterPressEvent.which = 13;
                    if ($rootScope.currentPageBlock &&
                        $rootScope.currentPageBlock.contentObject &&
                        $rootScope.currentPageBlock.contentObject.element) {
                        $rootScope.currentPageBlock.contentObject.element.trigger(enterPressEvent);
                    } else {
                        _activateFirstDetailPageBlock();
                    }
                } else if (keyCode == 27) {
                    var escPressEvent = jQuery.Event("escPressed");
                    escPressEvent.which = 27;
                    $(document).trigger(escPressEvent);
                } else if (keyCode == 16) {
                    $rootScope.shiftPressed = true;
                }
            });
            $(document).on('keyup', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 16) {
                    $rootScope.shiftPressed = false;
                }
            });
            eventManager.addListener(DisplayerElementClosedEvent, function () {
                _activateFirstDetailPageBlock();
            });
            function _activateFirstDetailPageBlock() {
                // hack to keep batch edit form active
                // on related entry popup close, because when popup closes event to activate
                // first object detail page field is triggered
                if(!$rootScope.currentPageBlock || !$rootScope.currentPageBlock.batchEditBlock){
                    $rootScope.currentPageBlock = null;
                    var actvtEvt = jQuery.Event("activateFirstPageBlock");
                    $(document).trigger(actvtEvt);
                }
            }
        }
        // load mobile styles if needed
        if (gConfig.mobileView) {
            var url = filesystemService.getImageUrl("DesktopModules/src/assets/style/mobile.css");
            var cssLink = $("<link rel='stylesheet' type='text/css' href='" + url + "'>");
            $("head").append(cssLink);
        }

        var _asComponentFilterExpression = null;
        var _filterComponentFilterExpression = null;
        var _customFilters = null;

        function _propagateFilterExpression(filterStr, advancedSearchStr, customASFilters) {
            var filters = [];
            if (advancedSearchStr === null
                && filterStr === null) {
                return;
            }
            if (advancedSearchStr) {
                filters.push(advancedSearchStr);
            }
            if (filterStr) {
                filters.push(filterStr);
            }
            customASFilters = customASFilters || _customFilters;
            var filterExpression = filters.join(" AND ");
            var eventData = {
                odn: gConfig.objectDefinitionName,
                filterExpression: filterExpression
            }
            if(customASFilters){
                eventData.customASFilters = customASFilters
            }
            eventManager.fireEvent(FilterGridByFilterExpressionEvent, eventData);
        }

        // events to animate 'loading' - process
        eventManager.addListener(LoadActionStartEvent, function () {
            animationService.displayGlobalLoader();
        });
        eventManager.addListener(LoadActionEndEvent, function () {
            animationService.hideGlobalLoader();
        });
        // events to expand/collapse grid
        $scope.$on(FilterExpandedEvent, function () {
            $(".GridHolder").css("width", "77%");
        });
        $scope.$on(FilterCollapsedEvent, function () {
            $(".GridHolder").css("width", "100%");
        });

        $scope.$on(GridEventListenReadyEvent, function (e) {
            _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression);
        });
        $scope.$on(AdvancedSearchFilterSetEvent, function (e, filterObject) {
            var filterExpression = filterObject.filters;
            var customFilters = filterObject.customASFilters;
            if (filterExpression || filterExpression === "" ||
                ($.isArray(customFilters) && customFilters.length)) {
                _asComponentFilterExpression = filterExpression;
                _customFilters = filterObject.customASFilters;
                _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression,
                    _customFilters);
            }

        });
        $scope.$on(FilterSetEvent, function (e, filter) {
            if (filter === "") {
                _filterComponentFilterExpression = filter;
                _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression);
            } else if (filter) {
                if (angular.isObject(filter)) {
                    _filterComponentFilterExpression = filter.FitlerExpression;
                } else {
                    _filterComponentFilterExpression = filter;
                }
                _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression);
            }
        });

        function operate() {
            if (filterReady) {
                $scope.$broadcast(CheckFilterStateEvent);
            }
        }

        $scope.$on(FilterReadyEvent, function () {
            filterReady = true;
            operate();
        });
    }
]);