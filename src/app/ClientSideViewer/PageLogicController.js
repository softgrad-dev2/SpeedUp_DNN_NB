/**
 * Created by C4off on 26.03.15.
 */
// for calendar page control (ViewObjectDataGridCalendar.ascx)
var CSVapp = angular.module('speedup.CSVModule',
        ['kendo.directives', 'ngCookies', 'ngResource', 'speedup.modal',
            'speedup.localization', 'speedup.objectDetail', 'speedup.scheduler',
            'speedup.exceptionHandling', 'speedup.grid'
        ])
    .run(['configService', 'schemaService', 'autocompleteService', 'listDataLoaderService', function (configService, schemaService, autocompleteService, listDataLoaderService) {
        configService.Init();

        var schedulerConfig = configService.getSchedulerConfig();
        var objectDefinitionName = schedulerConfig.objectDefinitionName;
        var mainObjectDefinitionName = schedulerConfig.mainObjectDefinitionName;

        // Init Schema
        schemaService.Init();
        // Prepare autocomplete data
        // (here acData is global variable from incoming .js files)
        if (typeof(acData) != 'undefined') {
            autocompleteService.prepareACData(acData);
        }
        // LOAD list values for both objects
        listDataLoaderService.fetchMultipleListsData(objectDefinitionName);
        listDataLoaderService.fetchMultipleListsData(mainObjectDefinitionName);
    }]);

CSVapp.controller("PageLogicController", ["$rootScope",
    "$scope", "configService", 'eventManager', 'animationService',
    'popupNotificationService', 'filesystemService',
    function ($rootScope, $scope, configService, eventManager, animationService, popupNotificationService, filesystemService) {

        var filterReady = false;
        var schedulerReady = false;
        var schedulerConfig = configService.getSchedulerConfig();
        var objectDefinitionName = schedulerConfig.objectDefinitionName;
        var gConfig = configService.getGlobalConfig();

        // display notification popup, if any
        popupNotificationService.displayMainPageNotification();

        $scope.filterOptions = {
            odn: objectDefinitionName
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
                $rootScope.currentPageBlock = null;
                var actvtEvt = jQuery.Event("activateFirstPageBlock");
                $(document).trigger(actvtEvt);
            }
        }
        // timeout for 'hold' event
        var holdTimeout = 1000;
        // load mobile styles if needed
        if (gConfig.mobileView) {
            var url = filesystemService.getImageUrl("DesktopModules/src/assets/style/mobile.css");
            var cssLink = $("<link rel='stylesheet' type='text/css' href='" + url + "'>");
            $("head").append(cssLink);
        }

        function operate() {
            if (filterReady && schedulerReady) {
                $scope.$broadcast(CheckFilterStateEvent);
            }
        }

        // events to animate 'loading' - process
        eventManager.addListener(LoadActionStartEvent, function () {
            animationService.displayGlobalLoader();
        });
        eventManager.addListener(LoadActionEndEvent, function () {
            animationService.hideGlobalLoader();
        });

        // advanced search tab opened/closed need to notify scheduler
        $scope.$on(ASTabChangeWidthEvent, function (evt, width) {
            $scope.$broadcast(SchedulerChangeWidthEvent, width);
        });

        $scope.$on(FilterReadyEvent, function () {
            filterReady = true;
            operate();
        });
        $scope.$on(SchedulerReadyEvent, function () {
            if (gConfig.mobile) {
                // create long - press (hold) event
                var pressTimer, touchStartX, touchStartY;
                var scheduler = $(schedulerConfig.schedulerHolder).data("kendoScheduler");

                document.oncontextmenu = function () {
                    return false;
                };

                scheduler.wrapper.on("mouseup touchend", ".k-scheduler-table td, .k-event",function () {
                    touchStartX = touchStartY = null;
                    clearTimeout(pressTimer);
                    // Clear timeout
                    return false;
                }).on("mouseup touchstart", ".k-scheduler-table td, .k-event", function (e) {
                        // remember start coords
                        var target = e.currentTarget;
                        touchStartX = target.x;
                        touchStartY = target.y;

                        // Set timeout
                        pressTimer = window.setTimeout(function () {
                            var target = $(e.currentTarget);

                            if (target.hasClass("k-event")) {
                                var event = scheduler.occurrenceByUid(target.data("uid"));
                                scheduler.editEvent(event);
                            } else {
                                var slot = scheduler.slotByElement(target[0]);

                                scheduler.addEvent({
                                    start: slot.startDate,
                                    end: slot.endDate
                                });
                            }
                        }, holdTimeout);
                        return false;
                    });
            }
            schedulerReady = true;
            operate();
        });

    }
]);