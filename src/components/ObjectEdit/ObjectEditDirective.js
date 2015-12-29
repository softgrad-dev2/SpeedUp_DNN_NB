/**
 * Created by antons on 6/1/15.
 */
speedupObjectDetailModule.directive('oeDetailsBlock', ['$rootScope', 'configService', 'localizationService',
    'filesystemService', 'objectDetailService', 'detailPageMapService', 'eventManager',
    'fieldService', 'objectEditService', 'fieldInlineEditService', 'fieldPropertiesService',
    function ($rootScope, configService, localizationService, filesystemService, objectDetailService, detailPageMapService,
        eventManager, fieldService, objectEditService, fieldInlineEditService, fieldPropertiesService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('ObjectEdit/ObjectEdit.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                if ($scope.fields && $scope.fields.length) {
                    // hack to use kendo template in angular
                    // wrap <script> in div
                    var contentTpl = angular.element('#oeDetailsBlock', $element);
                    var tpl = kendo.template(contentTpl.html());
                    // add helpers to template
                    $scope.fields[0].helpers = {
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
                    var pageBlock = $scope.pageBlock;
                    var detailBlockContainer = pageBlock.contentObject.element;

                    // skip 'read-only fields' from tabbing
                    var allBlocks = detailBlockContainer.find('._keycontainer').filter(function (idx, block) {
                        var fieldName = $(block).attr("key");
                        var fieldProperties = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, odn);
                        // skip some fields, like map
                        if (angular.isObject(fieldProperties) && fieldProperties.DataType) {
                            if (fieldProperties.DataType == dataTypes.GeoData ||
                                fieldProperties.DataType == dataTypes.AutoText) {
                                return false;
                            }
                        }
                        return !fieldService.isFieldReadOnly(fieldName);
                    });

                    objectEditService.activateSimpleBlock(allBlocks.first());
                    $scope.selectedBlock = allBlocks.first();
                    $rootScope.currentPageBlock = pageBlock;

                    // bind 'click' handler
                    detailBlockContainer.click(function (e) {
                        objectEditService.deactivateAllSimpleBlocks($(this));
                        var target = $element.find(e.target);
                        var container = target.closest('._keycontainer');
                        if(container.length){
                            $scope.selectedBlock = container;
                        }
                    });
                    // bind 'tab' and 'enter' press
                    detailBlockContainer.on('detailKeypress', function (e) {
                        var keyCode = e.keyCode || e.which;
                        if (keyCode == 9 ) {
                            e.preventDefault();
                            $scope.selectedBlock = objectEditService.tabPressed(
                                $scope.selectedBlock, pageBlock, allBlocks);
                        }  else if(keyCode == 13){
                            $scope.selectedBlock = objectEditService.enterPressed(
                                $scope.selectedBlock, pageBlock, allBlocks);
                        }else if (keyCode == 169) {
                            e.preventDefault();
                            $scope.selectedBlock = objectEditService.tabPressed(
                                $scope.selectedBlock, pageBlock, allBlocks, true);
                        }
                    });


                    setTimeout(function () {
                        detailPageMapService.createMaps($scope.fields[0].Maps);
                    }, 2000);

                    // init editors fields
                    fieldService.initializeEditors($scope.fields[0], $element);
                    // disable editors
                    var isNewEntry = $scope.settings.isNewEntry || false;
                    objectEditService.disableEditors($scope.fields[0], isNewEntry, $element);
                    // bind buttons click
                    // bind related object search click
                    detailBlockContainer.find('._objRelButton').click(function (e) {
                        var target = angular.element(e.currentTarget);
                        var value = target.parent().find('input[id^="txt"]').val();
                        objectDetailService.openRelationalRecordPopup(target, $scope.fields[0], value);
                        // Not returning false caused page reloading
                        return false;
                    });
                    // bind save button click
                    detailBlockContainer.find('._saveObjectButton').bind('click', function (e) {
                        var validator = $element.find(".tbldetail").kendoValidator().data("kendoValidator");
                        if (validator.validate()) {
                            $(this).unbind('click');
                            objectEditService.saveObject($element, odn, detailBlockContainer);
                        }
                        else {
                            //Apply Validation Style for Control
//                            $.fn.ControlValidation({}).ValidateControlStyle();
                        }

                    });
                    // bind cancel button click
                    detailBlockContainer.find('._cancelObjectButton').bind('click', function(){
                        eventManager.fireEvent(NewOEActionButtonClicked);
                    });
                    // bind 'get address' map button
                    detailBlockContainer.find('.getAddressLink').click(function(){
                        var geoData = $scope.fields[0].Maps[0];
                        detailPageMapService.getAddressFromLatLong(geoData.LatField, geoData.LongField,
                            geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                    });
                    // bind 'get coordinates' map button
                    detailBlockContainer.find('.getLatLongLink').click(function(){
                        var geoData = $scope.fields[0].Maps[0];
                        detailPageMapService.getLatLongFromAddress(geoData.LatField, geoData.LongField,
                            geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                    });
                    // bind 'get current location' map button
                    detailBlockContainer.find('.getCurrentLocationLink').click(function(){
                        var geoData = $scope.fields[0].Maps[0];
                        detailPageMapService.getCurrentLocation(geoData.LatField, geoData.LongField,
                            geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                    });
                    // Bind update attachment image (for new entries)
                    eventManager.addListener(NewEntryAttachmentUploadedEvent, function (imgUrl) {
                        if(imgUrl){
                            // show image container
                            $element.find('.imageContainer').removeClass('hidden');
                            // update image
                            $element.find('.attachmentImages img').attr('src', imgUrl);
                        }
                    }, $scope.pageBlock.settings);
                }
            }
        };
    }])
    .directive('newObjectEdit', ['$timeout', 'configService', 'attachmentsService', 'objectDetailService',
        function ($timeout, configService, attachmentsService, objectDetailService) {
        return {
            templateUrl: configService.getTemplateUrl('ObjectEdit/CreateNewObjectEdit.html'),
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

                        //Add Attachment Hidden Field During Save and Copy
//                            var id = "recordAttachment_" + $thisEditObject.settings.ObjectDefinitionName + "_" + document.getElementById("hdnTempId").value;
//                            $($thisEditObject).find("._recordAttachment").attr("id", id);
//                            $($thisEditObject).find("._recordAttachment").html('');
//                            $($thisEditObject).find("._recordAttachment").append('<input class="_kendoFileUploader" type="file" name="_kendoFileUploader" id="_kendoFileUploader" />');
//                            $thisEditObject.FileUpload();
                        attachmentsService.wrapUploader(attachmentCtrl, odn, recordIdTmp, []);
                    }
                }, 100);
            }
        };
    }]);