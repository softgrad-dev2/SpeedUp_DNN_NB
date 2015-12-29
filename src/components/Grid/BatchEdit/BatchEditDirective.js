/**
 * Created by C4off on 06.10.15.
 */
speedupGridModule.directive('gridBatchEditForm', ['$compile', 'configService', 'batchEditService',
        'fieldService', 'objectDetailService', 'eventManager', 'localizationService',
        function ($compile, configService, batchEditService, fieldService, objectDetailService,
                  eventManager, localizationService) {

            var gConfig = configService.getGlobalConfig();

            return {
                templateUrl: configService.getTemplateUrl('Grid/BatchEdit/BatchEditTemplate.html'),
                restrict: "EA",
                replace: true,
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    batchEditService.getEmptyDataItem($scope.odn).then(function(fields){
                        fields.forEach(function(field){
                            field.PropertyValue = "";
                        });
                        var dataTypes = gConfig.dataTypes;
                        // filter fields
                        // skip 'read-only fields' from tabbing
                        var filteredFields = fields.filter(function (field) {
                            // skip some fields, like map
                            if (field.DataType == dataTypes.GeoData ||
                                field.DataType == dataTypes.AutoText) {
                                return false;
                            }
                            return !fieldService.isFieldReadOnly(field.PropertyName);
                        });

                        $scope.fields = [filteredFields];

                        // translations
                        $scope.tr = {
                            title: localizationService.translate('Titles.BatchEdit')
                        };

                        var tpl = angular.element('<grid-batch-edit-blocks></grid-batch-edit-blocks>');

                        $compile(tpl)($scope);

                        $element.find('.contentBlock').append(tpl);

                        var editFormEl = $element.find('.batchEditForm');
                        // bind events
                        // bind 'open' button click
                        $scope.$on(BatchEditBtnClickedEvent, function(){
                            if (editFormEl.css('display') == 'none') {
                                eventManager.fireEvent(BatchFormOpenedEvent);
                                editFormEl.css('display', 'block');
                            } else {
                                eventManager.fireEvent(BatchFormClosedEvent);
                                editFormEl.css('display', 'none');
                            }
                        });

                        $scope.containerElement = $element;
                    });
                }
            }
        }
    ]).directive('gridBatchEditBlocks', ['$compile', '$rootScope', 'configService', 'filesystemService',
        'fieldService', 'objectDetailService', 'batchEditService', 'gridWidgetService',
        'objectService', 'objectEditService', 'eventManager', 'localizationService',
        'detailPageFieldValuesService',
        function ($compile, $rootScope, configService, filesystemService, fieldService,
                  objectDetailService, batchEditService, gridWidgetService, objectService,
                  objectEditService, eventManager, localizationService,
                  detailPageFieldValuesService) {

            var gConfig = configService.getGlobalConfig();

            return {
                templateUrl: configService.getTemplateUrl('Grid/BatchEdit/BatchForm.html'),
                restrict: "EA",
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
                        // translations
                        $scope.fields[0].editBtnTitle = localizationService.translate('Buttons.Update');
                        var rendered = kendo.render(tpl, $scope.fields);
                        $element.html(rendered);
                    }
                },
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    // init editors fields
                    fieldService.initializeEditors($scope.fields[0], $element);
                    // bind related object search click
                    $element.find('._objRelButton').click(function (e) {
                        var target = angular.element(e.currentTarget);
                        var value = target.parent().find('input[id^="txt"]').val();
                        objectDetailService.openRelationalRecordPopup(target, $scope.fields[0], value);
                        // Not returning false caused page reloading
                        return false;
                    });
                    // filter fields for keyboard
                    var fieldsHash = batchEditService.fieldsArrayToHash($scope.fields[0]);
                    var dataTypes = gConfig.dataTypes;
                    // skip 'read-only fields' from tabbing
                    var allBlocks = $element.find('._keycontainer').filter(function (idx, block) {
                        var fieldName = $(block).attr("key");
                        var fieldProperties = fieldsHash[fieldName];
                        // skip some fields, like map
                        if (angular.isObject(fieldProperties) && fieldProperties.DataType) {
                            if (fieldProperties.DataType == dataTypes.GeoData ||
                                fieldProperties.DataType == dataTypes.AutoText) {
                                return false;
                            }
                        }
                        return !fieldService.isFieldReadOnly(fieldName);
                    });
                    var batchFormEl = $scope.containerElement.find('.batchEditForm');
                    // bind 'batch form open' handler
                    eventManager.addListener(BatchFormOpenedEvent, function () {
                        batchEditService.activateWidget(batchFormEl, $scope, null);
                    });
                    // bind 'batch form close' handler
                    eventManager.addListener(BatchFormClosedEvent, function () {
                        $rootScope.currentPageBlock = null;
                    });
                    // bind 'click' handler
                    batchFormEl.on('mousedown', function (e) {
                        var targetSimpleBlock = batchEditService.getTargetSimpleBlock($(e.target));
                        // check if click was 'outside' of edited input
                        if(targetSimpleBlock && !targetSimpleBlock.is($scope.selectedBlock)){
                            // if currently edited field has value
                            if(targetSimpleBlock){
                                // get dataType and property name of a field
                                var dataType = $scope.selectedBlock.attr('dtype');
                                var fieldName = $scope.selectedBlock.attr('key');
                                var value = detailPageFieldValuesService.getElementsValue($scope.selectedBlock,
                                    dataType, fieldName);
                                if (value != "" && value != undefined && value != null && value != ":" &&
                                    objectEditService.performValidation(batchFormEl, $scope.selectedBlock)) {
                                    $scope.selectedBlock.parent().find('.checkbox input').prop('checked', true);
                                }
                            }
                        }
                        batchEditService.activateWidget(batchFormEl, $scope, batchFormEl.find(e.target));
                    });
                    // bind 'tab' and 'enter' press
//                    $scope.containerElement.off('keydown');
                    $scope.containerElement.on('detailKeypress', function (e) {
                        batchEditService.bindKeyboardKeyPressEvt(e, $element, $scope, allBlocks);
                    });
                    // bind 'filter' btn
                    $element.find('._batchEditBtn').on('click', function (e) {
                        var userName = gConfig.userName;
                        batchEditService.getFieldsValues($element, $scope.fields[0], $scope.odn, userName).
                            then(function (fieldValuesObj) {
                                batchEditService.sendSaveRequest(fieldValuesObj, $scope)
                            });
                        return false;
                    });
                }
            }
        }
    ]).directive('gridBatchEditBtn', ['$rootScope', 'configService',
        function ($rootScope, configService) {
            return {
                templateUrl: configService.getTemplateUrl('Grid/BatchEdit/BatchEditBtnTemplate.html'),
                restrict: "EA",
                replace: true,
                controller: function ($scope) {
                    $scope.click = function () {
                        $rootScope.$broadcast(BatchEditBtnClickedEvent);
                    }
                }
            }
        }
    ]);