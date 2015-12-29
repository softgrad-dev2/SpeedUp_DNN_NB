/**
 * Created by antons on 6/1/15.
 */
speedupObjectDetailModule.factory('objectEditService', ['$q', 'eventManager', 'localizationService',
    'objectDetailDisplayerService', 'configService', 'objectDetailService',
    'fieldService', 'notificationService', 'inlineFieldValueValidatorService',
    function ($q, eventManager, localizationService, objectDetailDisplayerService, configService, objectDetailService, fieldService, notificationService, inlineFieldValueValidatorService) {

        var gConfig = configService.getGlobalConfig();

        var ObjectEditService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to perform validation of a single field
        /// </summary>
        /// <param name="container">container element</param>
        /// <param name="simpleBlock">element 'wrapper' block</param>
        ObjectEditService.performValidation = function (container, simpleBlock) {
            var validated = true;
            var input = simpleBlock.find('input[type!=\'hidden\']');
            var dataType = input.attr('v-type');
            var validator = inlineFieldValueValidatorService.getValidator(container, dataType);
            if (validator) {
                validated = validator.validateInput(input);
            }

            return validated;
        };

        /// <summary>
        /// This method will be called on 'TAB' button
        /// </summary>
        /// <param name="selectedBlock">selected element</param>
        /// <param name="pageBlock">current page block</param>
        /// <param name="otherBlocks">other element blocks on page</param>
        /// <param name="isReverse">go to previous element (if not set will go to next)</param>
        ObjectEditService.tabPressed = function (selectedBlock, pageBlock, otherBlocks, isReverse) {
            this.deactivateAllSimpleBlocks(pageBlock.contentObject.element);
            if (selectedBlock) {
                // try to save the value if it was edited
                if (inlineFieldValueValidatorService.performValidation(pageBlock, selectedBlock)) {
                    selectedBlock = this.setNextBlockEdited(selectedBlock, otherBlocks, isReverse);
                }
            }

            return selectedBlock;
        };
        /// <summary>
        /// This method will be called on 'ENTER' button
        /// </summary>
        /// <param name="selectedBlock">selected element</param>
        /// <param name="pageBlock">current page block</param>
        /// <param name="allBlocks">other element blocks on page</param>
        ObjectEditService.enterPressed = function (selectedBlock, pageBlock, allBlocks) {
            var dataTypes = gConfig.dataTypes;
            var container = selectedBlock.closest('._keycontainer');
            var fieldType = container.attr('dtype');
            // enter pressed over edited checkbox
            if (fieldType == dataTypes.CheckBox) {
                _toggleCheckbox(container);
                // if we try to save value for relational property - just navigate to next
                // saving is performed in inlineEdit method
            } else {
                return this.tabPressed(selectedBlock, pageBlock, allBlocks, false);
            }

            return selectedBlock;
        };
        /// <summary>
        /// This method will put 'active' class on current block and select its content
        /// </summary>
        /// <param name="simpleBlock">selected element</param>
        ObjectEditService.activateSimpleBlock = function (simpleBlock) {
            simpleBlock.addClass('active');
            _focusBlock(simpleBlock).select();
        };
        /// <summary>
        /// This method will remove 'active' class from all blocks
        /// </summary>
        /// <param name="simpleBlock">selected element</param>
        ObjectEditService.deactivateAllSimpleBlocks = function (pageBlockContainer) {
            pageBlockContainer.find('._keycontainer').removeClass('active');
        };
        /// <summary>
        /// This method will save newly created entry, fire event
        //  and save temporary attachments
        /// </summary>
        /// <param name="$element">root element of directive</param>
        /// <param name="odn">object definition name</param>
        /// <param name="detailBlockContainer">container element of page block</param>
        ObjectEditService.saveObject = function ($element, odn, detailBlockContainer) {
            eventManager.fireEvent(LoadActionStartEvent);
            return objectDetailService.saveNewRecord(detailBlockContainer, odn).then(function (response) {
                eventManager.fireEvent(LoadActionStartEvent);
                // saving temporary attachments after entry creation
                objectDetailService.afterCreateNewRecord($element, odn, response);
                eventManager.fireEvent(NewOEActionButtonClicked);
                var msg = localizationService.translate('Messages.RecordSavedSuccessfully');
                notificationService.showNotification(msg);
            }, function (error) {
                eventManager.fireEvent(LoadActionStartEvent);
                notificationService.showNotification(error, true);
            });
        };
        /// <summary>
        /// This method will save newly created entry, fire event
        //  and save temporary attachments
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="parentRecordId">id of parent record</param>
        /// <param name="parentRecordName">name of parent record</param>
        /// <param name="overridenFields">fields with preset values</param>
        ObjectEditService.createNewObject = function (odn, parentRecordId, parentRecordName, parentRecordFK, overridenFields) {
            var detailPageSettings = {
                odn: odn,
                recordId: null,
                fieldEditMode: 'multiple',  // multiple | single
                pageSize: 5,
                displayMode: {
                    type: 'popup'           // popup | element
                },
                editMode: 'edit'            // edit | detail
            };
            if (overridenFields) {
                detailPageSettings.overridenFields = overridenFields;
            }

            if (parentRecordId) {
                detailPageSettings.currentRecord = {
                    id: parentRecordId,
                    name: parentRecordName,
                    fk: parentRecordFK
                }
            }

            return objectDetailService.addNewRecord(odn, detailPageSettings).then(function (displayer) {
                // Listen to 'create' and 'close' buttons
                eventManager.addListener(NewOEActionButtonClicked, function () {
                    // dispose bound events (not to create excess popups)
                    displayer.onClose(function () {
                        eventManager.disposeListeners(detailPageSettings);
                        // rebind keyboard events for detail page
                        var evt = jQuery.Event("bindKeyboardEvents");
                        $(window).trigger(evt);
                    });
                    displayer.close();
                }, detailPageSettings);
            });
        };
        /// <summary>
        /// This method will disable the editor elements
        /// </summary>
        /// <param name="objField">array of fields</param>
        /// <param name="isNewRecord">if new record (true or false)</param>
        /// <param name="container">container of elements</param>
        ObjectEditService.disableEditors = function (fieldsArray, isNewRecord, container) {
            var dataTypes = gConfig.dataTypes;
            $.each(fieldsArray, function (key, val) {
                var dataType = val.DataType;
                var isReadOnlyField = fieldService.isFieldReadOnly(val.PropertyName);

                if ((val.SystemProperty && val.PropertyName != 'Name') ||
                    (isReadOnlyField) || (isNewRecord && val.DataType == dataTypes.AutoText) ){
                        switch (dataType) {
                            case dataTypes.DateTime:
                                var control = container.find("#txtdateTime" + val.PropertyName).data("kendoDateTimePicker");
                                if (control) {
                                    control.readonly();
                                }
                                break;
                            default:
                                control = container.find("#txt" + val.PropertyName);
                                if (control) {
                                    control.prop("disabled", true);
                                }
                        }
                    }
            });
        };

        /*PRIVATE METHODS*/

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
        /// <summary>
        /// This method will find and select next field. Also can understand
        //  the need to go to next pageBlock and fire the event
        /// </summary>
        /// <param name="selectedBlock">edited field container</param>
        /// <param name="otherBlocks">all fields in block</param>
        /// <param name="isReverse">if true will select previous field</param>
        ObjectEditService.setNextBlockEdited = function(selectedBlock, otherBlocks, isReverse) {
            objectDetailService.unSelectWidget(selectedBlock);
            // get next element
            var idx = otherBlocks.index(selectedBlock);
            var needToFocus = false;
            if (idx != -1) {
                //
                if (isReverse) {
                    if (idx == 0) {
                        selectedBlock = otherBlocks.last();
                    } else {
                        selectedBlock = otherBlocks.eq(idx - 1);
                    }
                } else {
                    if (idx == otherBlocks.length - 1) {
                        selectedBlock = otherBlocks.first();
                    } else {
                        selectedBlock = otherBlocks.eq(idx + 1);
                    }
                }
                needToFocus = true;
            }
            else if (!selectedBlock && otherBlocks.length) {
                needToFocus = true;
                selectedBlock = otherBlocks[0];
            }

            if (needToFocus) {
                _focusBlock(selectedBlock).select();
                objectDetailService.selectWidget(selectedBlock);
            }

            return selectedBlock;
        }
        /// <summary>
        /// This method will focus current block
        /// </summary>
        /// <param name="container">edited field container</param>
        function _focusBlock(container) {
            var dataTypes = gConfig.dataTypes;

            var focused = false;
            // set focus on editing input
            container.addClass('active');
            var dataType = container.attr('dtype');
            var editBlockInput;
            if (dataType == dataTypes.ObjectRelationship) {
                editBlockInput = container.find('input[type!="hidden"]');
                var widget = editBlockInput.data('kendoAutoComplete');
                if (widget) {
                    widget.focus();
                }
            } else {

                editBlockInput = container.find('input[type!="hidden"]');
                if (!editBlockInput.length) {
                    editBlockInput = container.find('textarea');
                }
                if (!editBlockInput.length) {
                    editBlockInput = container.find('select');
                    if (editBlockInput.length) {
                        var selectWidget = editBlockInput.data('kendoDropDownList');
                        if (selectWidget) {
                            selectWidget.focus();
                            focused = true;
                        }
                    }
                }
                if (!focused) {
                    editBlockInput.focus();
                }
            }

            return editBlockInput;
        }

        return ObjectEditService;
    }]);