/**
 * Created by C4off on 07.10.15.
 */
speedupGridModule.factory('batchEditService', ['$q', '$rootScope', 'objectDetailService',
    'objectEditService', 'gridWidgetService', 'objectService', 'inlineFieldValueValidatorService',
    'detailPageFieldValuesService', 'configService', 'localizationService', 'notificationService',
    'popupService', 'objectTemplateService', 'fieldPropertiesService',
    'gridHelper',
    function ($q, $rootScope, objectDetailService, objectEditService,
              gridWidgetService, objectService, inlineFieldValueValidatorService,
              detailPageFieldValuesService, configService, localizationService,
              notificationService, popupService, objectTemplateService, fieldPropertiesService,
              gridHelper) {
        var BatchEditService = function () {
        };

        var gConfig = configService.getGlobalConfig();

        /*PUBLIC METHODS*/

        BatchEditService.getTargetSimpleBlock = function (target) {
            if (target.hasClass('_keycontainer')) {
                return target;
            }
            var closestParent = target.closest('._keycontainer');
            if (closestParent.length) {
                return closestParent;
            }

            return null;
        };

        BatchEditService.getEmptyDataItem = function (odn) {
            return  objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // get fields selected for template
                var selectedFieldsString = "";
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedColumnsForTemplate) {
                    selectedFieldsString = jsonSettings[0].SelectedColumnsForTemplate;
                }
                var selectedFields = [];
                // getting selected fields array from string
                selectedFieldsString.split(",").forEach(function (fieldName) {
                    if (fieldName != "") {
                        selectedFields.push(fieldName.replace(/[[\]]/g, ''));
                    }
                });
                // get properties for that fields
                var fieldsWithProperties = fieldPropertiesService.getAllPropertiesOfFieldsArray(selectedFields, odn);

                var fields = [];
                $.each(fieldsWithProperties, function (index, objField) {
                    var key = objField.PropertyName;
                    if (objField != null && objField.PropertyLabel != undefined) {
                        if (key == "CreatedDate" || key == "ChangedDate") {
                        }
                        else {
                            if (objField.DataType == gConfig.dataTypes.Date) {
                                objField.DefaultValue = "";
                            }
                            else if (objField.DataType == gConfig.dataTypes.DateTime) {

                                objField.DefaultValue = dateTimeService.DateTimeFormat(new Date());

                            }
                            else if (objField.DataType == gConfig.dataTypes.Time) {
                                objField.DefaultValue = kendo.toString(new Date(), "HH:mm");
                            }
                        }

                        //default values for controls in case of new record.
                        objField.PropertyName = key;

                        objField = detailPageFieldValuesService.setValuesForElements(objField, key);
                        fields.push(objField);
                    }
                });

                return fields;
            });
        };

        /// <summary>
        /// This method will be called on 'ENTER' button
        /// </summary>
        /// <param name="selectedBlock">selected element</param>
        /// <param name="pageBlock">current page block</param>
        /// <param name="allBlocks">other element blocks on page</param>
        BatchEditService.enterPressed = function (selectedBlock, pageBlock, allBlocks) {
            var dataTypes = gConfig.dataTypes;
            var fieldType = selectedBlock.attr('dtype');
            // enter pressed over edited checkbox
            if (fieldType == dataTypes.CheckBox) {
                _toggleCheckbox(selectedBlock);
                // if we try to save value for relational property - just navigate to next
                // saving is performed in inlineEdit method
            }
            else if (fieldType == dataTypes.TextBox) {
                // do nothing. Otherwise break to new line will not work
            } else {
                return this.tabPressed(selectedBlock, pageBlock, allBlocks, false);
            }

            return selectedBlock;
        };

        /// <summary>
        /// This method will be called on 'TAB' button
        /// </summary>
        /// <param name="selectedBlock">selected element</param>
        /// <param name="pageBlock">current page block</param>
        /// <param name="otherBlocks">other element blocks on page</param>
        /// <param name="isReverse">go to previous element (if not set will go to next)</param>
        BatchEditService.tabPressed = function (selectedBlock, pageBlock, otherBlocks, isReverse) {
            objectEditService.deactivateAllSimpleBlocks(pageBlock.contentObject.element);
            if (selectedBlock) {
                // get dataType and property name of a field
                var dataType = selectedBlock.attr('dtype');
                var fieldName = selectedBlock.attr('key');
                var value = detailPageFieldValuesService.getElementsValue(selectedBlock,
                    dataType, fieldName);
                // try to save the value if it was edited
                if (value != "" && value != undefined && value != null && value != ":" && objectEditService.performValidation(pageBlock.contentObject.element, selectedBlock)) {
                    selectedBlock.parent().find('.checkbox input').prop('checked', true);
                }
                selectedBlock = objectEditService.setNextBlockEdited(selectedBlock, otherBlocks, isReverse);
            }

            return selectedBlock;
        };

        BatchEditService.bindKeyboardKeyPressEvt = function (e, $element, $scope, allBlocks) {
            var keyCode = e.keyCode || e.which;
            var pageBlock = {
                contentObject: { element: $element },
                batchEditBlock: true
            };
            switch (keyCode) {
                case 169:
                    e.preventDefault();
                    $scope.selectedBlock = this.tabPressed(
                        $scope.selectedBlock, pageBlock, allBlocks, true);
                    break;
                case 9:
                    e.preventDefault();
                    $scope.selectedBlock = this.tabPressed(
                        $scope.selectedBlock, pageBlock, allBlocks);
                    break;
                case 13:
                    $scope.selectedBlock = this.enterPressed(
                        $scope.selectedBlock, pageBlock, allBlocks);
                    break;
                case 16:
                    e.preventDefault();
                    $scope.shiftPressed = true;
                    break;
            }
        };

        BatchEditService.activateWidget = function (batchFormEl, $scope, target) {
            // if we clicked input and currently
            // already are editing this form
            if (target == null) {
                objectEditService.deactivateAllSimpleBlocks($(this));
                $scope.selectedBlock = batchFormEl.find('._keycontainer').first();
                objectEditService.activateSimpleBlock($scope.selectedBlock);
                // make pageBlock active
                $rootScope.currentPageBlock = {
                    contentObject: {
                        element: batchFormEl
                    },
                    batchEditBlock: true
                };

                return $scope.selectedBlock;
            }
            var container = target.closest('._keycontainer');
            // on 'tab' press on some widgets we have wrong target
            if (!container.length) {
                return $scope.selectedBlock;
            }
            if (_isCurrentPageBlock($rootScope.currentPageBlock, batchFormEl)) {
                if (!_sameContainer(container, $scope.selectedBlock)) {
                    // make active
                    objectEditService.deactivateAllSimpleBlocks($(this));
                    objectEditService.activateSimpleBlock(container);
                    $scope.selectedBlock = container;
                }
            } else {
                // make pageBlock active
                $rootScope.currentPageBlock = {
                    contentObject: {
                        element: batchFormEl
                    },
                    batchEditBlock: true
                };
                if (container.length) {
                    // activate this block
                    $scope.selectedBlock = container;
                } else {
                    // activate 1-st block
                    $scope.selectedBlock = batchFormEl.find('._keycontainer').first();
                }
                objectEditService.activateSimpleBlock(container);
            }

            return $scope.selectedBlock;
        };

        /// <summary>
        /// This method will toggle checkbox value
        /// </summary>
        /// <param name="block">edited field container</param>
        function _toggleCheckbox(block) {
            var target = block.find('input[type!="hidden"]');
            // toggle value
            if (!target.prop("checked")) {
                target.prop("checked", true);
            } else {
                target.prop("checked", false);
            }
        }

        function _isCurrentPageBlock(currentPageBlock, batchFormEl) {
            return currentPageBlock && currentPageBlock.contentObject &&
                currentPageBlock.contentObject.element &&
                batchFormEl.is(currentPageBlock.contentObject.element);
        }

        function _sameContainer(container, selectedBlock) {
            if (!container || !container.length || !selectedBlock || !selectedBlock.length) {
                return false;
            }

            return container.is(selectedBlock);
        }

        /// <summary>
        /// Method to get values of batch edit form
        /// </summary>
        /// <param name="container">form container</param>
        /// <param name="fields">field objects array</param>
        /// <param name="odn">grid odn</param>
        /// <param name="userName">user name</param>
        BatchEditService.getFieldsValues = function (container, fields, odn, userName) {
            return objectDetailService.getEditedObjectData(container, odn, userName).then(function (data) {
                var fieldsValues = [];
                if (!(angular.isArray(data) && angular.isObject(data[0]))) {
                    return fieldsValues;
                }

                var fieldContainers = container.find('.inputContainer');
                var valuesObj = data[0];
                var fieldsHash = BatchEditService.fieldsArrayToHash(fields);

                fieldContainers.each(function (key, field) {
                    // if field is selected
                    if (!$(field).find('.checkbox input').prop('checked')) {
                        return;
                    }
                    // get field type
                    var fieldName = $(field).find('.b-field-label').attr('key');
                    if (!fieldName) {
                        return;
                    }
                    var value = valuesObj[fieldName] || "";
                    var fieldPropsObj = fieldsHash[fieldName];
                    if (!angular.isObject(fieldPropsObj)) {
                        return;
                    }
                    fieldsValues.push({
                        name: fieldPropsObj.PropertyName,
                        fk: fieldPropsObj.PropertyDefinition_ID,
                        value: value
                    });
                });

                return fieldsValues;
            });
        };

        BatchEditService.sendSaveRequest = function (fieldValuesArray, $scope) {
            var selectedEntries = [];
            gridWidgetService.getSelectedRows($scope.gridElement).forEach(function (row) {
                var entryId = row.ObjectEntry_ID;
                if (entryId) {
                    selectedEntries.push(entryId);
                }
            });
            if (!fieldValuesArray.length) {
                var msg = localizationService.translate('Messages.SelectAtLeastOneFieldForBatchEdit');
                notificationService.showNotification(msg, true);
                var deferred = $q.defer();
                deferred.reject();

                return deferred;
            }
            if (selectedEntries.length) {
                return objectService.batchEdit({
                    entries: selectedEntries,
                    data: fieldValuesArray
                }, $scope.odn, true).then(function (recordsCount) {
                    var widget =  $scope.gridElement.data("kendoGrid");
                        setTimeout(gridHelper.selectRowsByIds(widget, selectedEntries), 200);
                        var msg = localizationService.translate('Messages.BatchEditSuccess');
                        notificationService.showNotification(msg, false);
                    }, function () {
                        var msg = localizationService.translate('Messages.FailedToBatchEdit');
                        notificationService.showNotification(msg, true);
                    });
            } else {
                var msg = localizationService.translate('Messages.SelectAtLestOneForBatchEdit');
                notificationService.showNotification(msg, true);

                return false;
            }
        };

        /// <summary>
        /// Convert array to hash
        /// </summary>
        /// <param name="fields">field objects array</param>
        BatchEditService.fieldsArrayToHash = function (fields) {
            var hash = {};
            fields.forEach(function (fieldObj) {
                hash[fieldObj.PropertyName] = fieldObj;
            });

            return hash;
        };

        /*PRIVATE METHODS*/

        return BatchEditService;
    }]);