speedupObjectDetailModule.directive('odDetailsBlock', ['configService', 'dateTimeService', 'filesystemService', 'objectDetailService',
        'detailPageFieldService', 'eventManager', 'notificationService', 'localizationService',
        'fieldService', 'detailPageMapService', 'fieldInlineEditService', 'fieldPropertiesService',
        function (configService, dateTimeService, filesystemService, objectDetailService, detailPageFieldService, eventManager, notificationService, localizationService, fieldService, detailPageMapService, fieldInlineEditService, fieldPropertiesService) {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl || configService.getTemplateUrl('ObjectDetail/DetailsBlock.html');
                },
                restrict: "EA",
                transclude: true,
                replace: true,
                controller: function ($scope, $element, $attrs, $transclude) {
                    if ($scope.fields && $scope.fields.length) {
                        // hack to use kendo template in angular
                        // wrap <script> in div
                        var contentTpl = angular.element('#odDetailsBlock', $element);
                        var tpl = kendo.template(contentTpl.html());
                        // add helpers to template
                        $scope.fields[0].helpers = {
                            'dateTimeFormat': dateTimeService.DateTimeFormat,
                            'dateFormat': dateTimeService.DateFormat,
                            'getPluginImageUrl': filesystemService.getPluginImageUrl
                        };
                        var rendered = kendo.render(tpl, $scope.fields);
                        $element.html(rendered);
                    }
                },
                link: function ($scope, $element) {
                    if ($scope.fields && $scope.fields.length) {
                        var gConfig = configService.getGlobalConfig();
                        var dataTypes = gConfig.dataTypes;

                        var odn = $scope.settings.odn;
                        var recordId = $scope.settings.recordId;
                        var editMode = $scope.settings.fieldEditMode;
                        var pageBlock = $scope.pageBlock;
                        var detailBlockContainer = pageBlock.contentObject.element;
                        // set this pageBlock as current (with second param == true
                        // only first pagBlock will be set as current)
                        setTimeout(function () {
                            pageBlock.setRootAwareOfCurrent(pageBlock, true);
                            var rootBlock = pageBlock.getRootBlock(pageBlock);
                            // activate page block if it's current
                            if (pageBlock.id == rootBlock.currentPageBlock.id) {
                                fieldInlineEditService.activateCurrentPageBlock(pageBlock, $scope, allBlocks, false);
                                // bind 'activateFirstPagBlock' event
                                $(document).on('activateFirstPageBlock', function (evt) {
                                    var rootBlock = pageBlock.getRootBlock(pageBlock);
                                    // activate page block if it's current
                                    fieldInlineEditService.activateCurrentPageBlock(pageBlock, $scope, allBlocks, false);
                                });
                            }
                        }, 1000);
//                        pageBlock.setRootAwareOfCurrent(pageBlock, true);
                        // skip 'read-only fields' from tabbing
                        var allBlocks = detailBlockContainer.find('.simpleBlock').filter(function (idx, block) {
                            var container = $(block).closest("._keycontainer");
                            var fieldName = $(container).attr("key");
                            if(fieldName && fieldName.indexOf('empty') != -1){
                                return false;
                            }
                            var fieldProperties = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, odn);
                            // skip some fields, like map
                            if (angular.isObject(fieldProperties) && fieldProperties.DataType) {
                                if (fieldProperties.DataType == dataTypes.GeoData) {
                                    return false;
                                }
                            }
                            return !fieldService.isFieldReadOnly(fieldName);
                        });
                        // init editors fields
                        fieldService.initializeEditors($scope.fields[0], $element);
                        // disable editors
                        var isNewEntry = $scope.settings.isNewEntry || false;
                        detailPageFieldService.disableEditors($scope.fields[0], isNewEntry, $element);
                        // init maps
                        if($scope.fields[0].Maps){
                            setTimeout(function () {
                                detailPageMapService.createMaps($scope.fields[0].Maps);
                            }, 2000);
                        }
                        // bind 'click' handler
                        detailBlockContainer.find('.detailPageMainBlock').click(function (e) {
                            var target = $element.find(e.target);
                            fieldInlineEditService.checkBlockIsCurrent(pageBlock);
                            fieldInlineEditService.inlineClick(target, pageBlock, odn, recordId, editMode, $scope);
                        });
                        // bind 'tab' and 'enter' press
                        detailBlockContainer.on('detailKeypress', function (e) {
                            var keyCode = e.keyCode || e.which;
                            if (keyCode == 9) {
                                e.preventDefault();
                                $scope.selectedBlock = fieldInlineEditService.tabPressed(
                                    $scope.selectedBlock, allBlocks, odn, pageBlock,
                                    recordId, editMode, $scope);
                            } else if (keyCode == 13) {
                                var target = $element.find(e.target);
                                fieldInlineEditService.enterPressed(target, $scope,
                                    pageBlock, odn, recordId, editMode, allBlocks);
                            } else if (keyCode == 169) {
                                e.preventDefault();
                                $scope.selectedBlock = fieldInlineEditService.tabPressed(
                                    $scope.selectedBlock, allBlocks, odn, pageBlock,
                                    recordId, editMode, $scope, true);
                            }
                        });
                        // bind 'activatePagBlock' event
                        detailBlockContainer.on('activatePageBlock', function (evt) {
                            var rootBlock = pageBlock.getRootBlock(pageBlock);
                            // activate page block if it's current
                            if (pageBlock.id == rootBlock.currentPageBlock.id) {
                                fieldInlineEditService.activateCurrentPageBlock(pageBlock, $scope, allBlocks,
                                    evt.reverse);
                            }
                        });
                        if ($scope.fields[0].DisplaySaveRecordButton) {
                            detailBlockContainer.find('._btnCreateRecord').one('click', function (e) {
                                eventManager.fireEvent(LoadActionStartEvent);
                                return objectDetailService.saveNewRecord(detailBlockContainer, odn).then(function (response) {
                                    eventManager.fireEvent(LoadActionStartEvent);
                                    objectDetailService.afterCreateNewRecord($element, odn, response);
                                }, function (error) {
                                    eventManager.fireEvent(LoadActionStartEvent);
                                    notificationService.showNotification(error, true);
                                });
                            });
                            detailBlockContainer.find('._btnCancelCreateRecord').bind('click', function () {
                                eventManager.fireEvent(NewODActionButtonClicked);
                            });
                        }
                        // bind related object search click
                        detailBlockContainer.find('._objRelButton').click(function (e) {
                            var target = angular.element(e.currentTarget);
                            var container = target.closest('._editBlock');
                            var value = container.find('input[id^="txt"]').val();
                            var popupTop = pageBlock.element.offset().top + 50 + 'px';
                            objectDetailService.openRelationalRecordPopup(target, $scope.fields[0], value, popupTop);
                            // Not returning false caused page reloading
                            return false;
                        });
                        // bind 'get address' map button
                        detailBlockContainer.find('.getAddressLink').click(function () {
                            var geoData = $scope.fields[0].Maps[0];
                            detailPageMapService.getAddressFromLatLong(geoData.LatField, geoData.LongField,
                                geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                        });
                        // bind 'get coordinates' map button
                        detailBlockContainer.find('.getLatLongLink').click(function () {
                            var geoData = $scope.fields[0].Maps[0];
                            detailPageMapService.getLatLongFromAddress(geoData.LatField, geoData.LongField,
                                geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                        });
                        // bind 'get current location' map button
                        detailBlockContainer.find('.getCurrentLocationLink').click(function () {
                            var geoData = $scope.fields[0].Maps[0];
                            detailPageMapService.getCurrentLocation(geoData.LatField, geoData.LongField,
                                geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                        });
                        // Bind dependant field update on autocomplete
                        eventManager.addListener(ObjectDetailFieldUpdatedEvent, function (data) {
                            detailPageFieldService.updateRelatedField(data.container, data.value,
                                data.propertyId, data.propertyFk, data.propertyName);
                        }, pageBlock.settings);
                        // Bind update attachment image (for new entries)
                        eventManager.addListener(NewEntryAttachmentUploadedEvent, function (imgUrl) {
                            if (imgUrl) {
                                $element.find('.attachmentImages img').attr('src', imgUrl);
                            }
                        }, pageBlock.settings);

                    }
                }
            };
        }])
    .directive('newObjectDetail', ['$timeout', 'configService', 'attachmentsService', 'objectDetailService',
        function ($timeout, configService, attachmentsService, objectDetailService) {
            return {
                templateUrl: configService.getTemplateUrl('ObjectDetail/CreateNewObjectDetail.html'),
                restrict: "EA",
                replace: true,
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    $timeout(function () {
                        // wrap 'add attachment' control
                        var attachmentCtrl = $element.find('._recordAttachment');
                        if (attachmentCtrl.length) {
                            var odn = $scope.settings.odn;
                            //Add Attchment Template For Save And Copy New
                            var recordIdTmp = objectDetailService.generateTmpId(odn);
                            $element.find("#hdnTempId").val(recordIdTmp);
                            attachmentsService.wrapUploader(attachmentCtrl, odn, recordIdTmp, []);
                        }
                    }, 500);
                }
            };
        }]);