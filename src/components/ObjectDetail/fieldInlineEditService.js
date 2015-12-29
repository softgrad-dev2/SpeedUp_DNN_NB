/**
 * Created by C4off on 31.08.15.
 */
speedupObjectDetailModule.factory('fieldInlineEditService', ['$rootScope', 'configService', 'animationService',
    'fieldPropertiesService', 'detailPageFieldValuesService', 'dateTimeService',
    'detailPageMapService', 'inlineFieldValueValidatorService', 'inlineFieldValueSaverService',
    'detailPageFieldService', 'fieldService', 'existingObjectDetailService',
    'objectDetailService',
    function ($rootScope, configService, animationService, fieldPropertiesService,
              detailPageFieldValuesService, dateTimeService, detailPageMapService,
              inlineFieldValueValidatorService, inlineFieldValueSaverService,
              detailPageFieldService, fieldService, existingObjectDetailService,
              objectDetailService) {

        var gConfig = configService.getGlobalConfig();

        var FieldInlineEditService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// method will check, if page block is current, otherwise
        /// fire event to select other
        /// <param name="pageBlock">detail page block object</param>
        /// </summary>
        FieldInlineEditService.checkBlockIsCurrent = function (pageBlock) {
//            var rootBlock = pageBlock.getRootBlock(pageBlock);
            if ($rootScope.currentPageBlock && $rootScope.currentPageBlock.id != pageBlock.id) {
//                rootBlock.currentPageBlock = pageBlock;
                $rootScope.currentPageBlock = pageBlock;
                var actvtEvt = jQuery.Event("activatePageBlock");
                pageBlock.contentObject.element.trigger(actvtEvt);
            }
        };
        /// <summary>
        /// method will check, if page block is current, otherwise
        /// fire event to select other
        /// <param name="pageBlock">detail page block object</param>
        /// <param name="scope">scope object</param>
        /// <param name="allBlocks">other fields</param>
        /// <param name="activateLast">if true previous block will be activated, otherwise - next</param>
        /// </summary>
        FieldInlineEditService.activateCurrentPageBlock = function (pageBlock, scope, allBlocks, activateLast) {
            scope.selectedBlock = activateLast ? allBlocks.last() : allBlocks.first();
            if (scope.selectedBlock) {
                this.activateSimpleBlock(scope.selectedBlock);
            }
            $rootScope.currentPageBlock = pageBlock;
        };
        /// <summary>
        /// method will be called on 'TAB' button press
        /// <param name="selectedBlock">selected field</param>
        /// <param name="otherBlocks">all fields</param>
        /// <param name="odn">object definition name</param>
        /// <param name="pageBlock">detail page block object</param>
        /// <param name="recordId">id of record</param>
        /// <param name="editMode">detail page edit mode (single|multiple)</param>
        /// </summary>
        FieldInlineEditService.tabPressed = function (selectedBlock, otherBlocks, odn, pageBlock, recordId, editMode, scope, isReverse) {
            this.deactivateAllSimpleBlocks(pageBlock.contentObject.element);
            var fieldIsValid = true;
            if (selectedBlock && pageBlock.fieldInEditMode) {
                // try to save the value if it was edited
                // check if value hasn't change
                if (inlineFieldValueSaverService.checkValueChanged(pageBlock.fieldInEditMode, recordId, odn)){
                    if(inlineFieldValueValidatorService.performValidation(pageBlock, pageBlock.fieldInEditMode)){
                        inlineFieldValueSaverService.saveData(pageBlock, recordId, odn, editMode);
                    } else {
                        fieldIsValid = false;
                    }
                } else{
                    var detailContainer = pageBlock.contentObject.element;
                    var container = pageBlock.fieldInEditMode.closest('._keycontainer');
                    var editBlock = container.find('._editBlock');
                    detailPageFieldService.cancelInlineEditing(editBlock, container, recordId, detailContainer)
                }
            }
            if (fieldIsValid) {
                selectedBlock = _setNextBlockEdited(selectedBlock, otherBlocks, odn, pageBlock, scope, isReverse);
            }

            return selectedBlock;
        };
        /// <summary>
        /// method will be called on 'ENTER' button press
        /// <param name="target">event target</param>
        /// <param name="scope">scope object</param>
        /// <param name="pageBlock">detail page block object</param>
        /// <param name="odn">object definition name</param>
        /// <param name="recordId">id of record</param>
        /// <param name="editMode">detail page edit mode (single|multiple)</param>
        /// <param name="otherBlocks">all blocks</param>
        /// </summary>
        FieldInlineEditService.enterPressed = function (target, scope, pageBlock, odn, recordId, editMode, otherBlocks) {
            var dataTypes = gConfig.dataTypes;
            var selectedBlock = scope.selectedBlock;
            var container, fieldType;
            if(selectedBlock){
                container = selectedBlock.closest('._keycontainer');
                fieldType = container.attr('dtype');
            }
//            var container = target.closest('._keycontainer');
            // enter pressed over edited checkbox
            if (fieldType == dataTypes.CheckBox) {
                _toggleCheckbox(selectedBlock);
                // if we try to save value for relational property - just navigate to next
                // saving is performed in inlineEdit method
            } else if (fieldType == dataTypes.TextBox) {
                // do nothing. Otherwise break to new line will not work
            }
//            else if (fieldType == dataTypes.ObjectRelationship || fieldType == dataTypes.ParentRelationship) {
//                scope.selectedBlock = _setNextBlockEdited(selectedBlock, otherBlocks, odn, pageBlock, scope);
//                // enter pressed there's currently edited input
//            }
            else if (pageBlock.fieldInEditMode) {
                scope.selectedBlock = selectedBlock = pageBlock.fieldInEditMode;
                // if checkbox is edited
                container = pageBlock.fieldInEditMode.closest('._keycontainer');
                fieldType = container.attr('dtype');
                if (fieldType == dataTypes.CheckBox) {
                    var input = container.find('._editBlock input[type!="hidden"]');
                    _toggleCheckbox(input);
                } else if (inlineFieldValueValidatorService.performValidation(pageBlock, pageBlock.fieldInEditMode)) {
                    inlineFieldValueSaverService.saveData(pageBlock, recordId, odn, editMode);
                    // "tab" to next field
                    scope.selectedBlock = _setNextBlockEdited(selectedBlock, otherBlocks, odn, pageBlock, scope);
                }
            }
            // 'enter' pressed over 'highlighted' label-field
            else if (scope.selectedBlock) {
                _startEditing(scope.selectedBlock, odn, pageBlock, scope);
            }
        };
        /// <summary>
        /// method will highlight selected block
        /// <param name="simpleBlock">edited field simple block (lebel)</param>
        /// </summary>
        FieldInlineEditService.activateSimpleBlock = function (simpleBlock) {
            simpleBlock.addClass('active');
        };
        /// <summary>
        /// method will un-highlight all blocks
        /// <param name="pageBlockContainer">page block container</param>
        /// </summary>
        FieldInlineEditService.deactivateAllSimpleBlocks = function (pageBlockContainer) {
            pageBlockContainer.find('._simpleBlock').removeClass('active');
        };
        /// <summary>
        /// method will process inline click on a field
        /// <param name="target">target element of a click</param>
        /// <param name="detailBlock">detail page block object</param>
        /// <param name="odn">object definition name</param>
        /// <param name="recordId">record id</param>
        /// <param name="editMode">detail page edit mode</param>
        /// <param name="scope">scope object</param>
        /// </summary>
        FieldInlineEditService.inlineClick = function (target, detailBlock, odn, recordId, editMode, scope) {
            var targetContainer = target.hasClass('ContainerDiv') ? target : target.closest('.ContainerDiv');
            // not to save value for relational fields when pressing 'magnifier' button
            if (targetContainer.find('._objRelButton').length &&
                detailBlock.fieldInEditMode &&
                targetContainer.find('.simpleBlock').is(detailBlock.fieldInEditMode)) {
                return;
            }
            if ((detailBlock.fieldInEditMode && target.parents("._editBlock").length == 0 && !target.hasClass("k-icon"))
                || target.is('._savelink')) {
                if (inlineFieldValueValidatorService.performValidation(detailBlock, detailBlock.fieldInEditMode)) {
                    inlineFieldValueSaverService.saveData(detailBlock, recordId, odn, editMode);
                    if (target.hasClass('_simpleBlock')) {
                        scope.selectedBlock = target;
                        this.activateSimpleBlock(target);
                    }
                }
            }
            else if (!target.hasClass('disabled') && target.is('._simpleBlock')) {
                _startEditing(target, odn, detailBlock, scope);
                this.deactivateAllSimpleBlocks(detailBlock.contentObject.element);
                // set this block 'active'
                scope.selectedBlock = target;
            }
            else if (target.is("._viewdetailObjectRelationship")) {
                _viewRelated(target, odn);
            }
        };


        /*PRIVATE METHODS*/

        /// <summary>
        /// method will process inline click on a field
        /// <param name="target">checkbox input</param>
        /// </summary>
        function _toggleCheckbox(simpleBlock) {
            var targetSimple = simpleBlock.find('input');
            var targetEditBlk = simpleBlock.siblings('._editBlock').find('input[type="checkbox"]');
            // toggle value
            if (!targetSimple.prop("checked") || !targetEditBlk.prop("checked")) {
                targetSimple.prop("checked", true);
                targetEditBlk.prop("checked", true);
            } else {
                targetSimple.prop("checked", false);
                targetEditBlk.prop("checked", false);
            }
        }
        /// <summary>
        /// method will find and select next edited field. It also will
        /// understand, that pageBlock has changed and fire event to activate it
        /// <param name="selectedBlock">selected field</param>
        /// <param name="otherBlocks">all blocks</param>
        /// <param name="odn">object definition name</param>
        /// <param name="pageBlock">page block object</param>
        /// <param name="scope object">page block object</param>
        /// <param name="isReverse">if true - will go back to previous page block, otherwise - to next</param>
        /// </summary>
        function _setNextBlockEdited(selectedBlock, otherBlocks, odn, pageBlock, scope, isReverse) {
            objectDetailService.unSelectWidget(selectedBlock);
            // get next element
            var idx = otherBlocks.index(selectedBlock);
            var lengthIdx = isReverse ? 0 : otherBlocks.length - 1;
            var needToFocus = false;
            if (idx != -1) {
                if (idx == lengthIdx) { // if is last element
                    // get next pageBlock
                    var nextPagBlock = isReverse ? pageBlock.getPrevBlock() : pageBlock.getNextBlock();
                    if (nextPagBlock && nextPagBlock.id != pageBlock.id) {
                        var rootPageBlock = pageBlock.getRootBlock(pageBlock);
                        rootPageBlock.setRootAwareOfCurrent(nextPagBlock);
                        var actvtEvt = jQuery.Event("activatePageBlock");
                        actvtEvt.reverse = isReverse;
                        nextPagBlock.contentObject.element.trigger(actvtEvt);
                        // scroll to target block
                        $("html, body").animate({scrollTop: nextPagBlock.element.offset().top}, 1000);
                    } else { // if it's the only pageBlock - just cycle to first
                        selectedBlock = isReverse ? otherBlocks.last() : otherBlocks.first();
                        // make this block editable
                        needToFocus = true;
                    }
                } else {
                    var nextIdx = isReverse ? idx - 1 : idx + 1;
                    selectedBlock = otherBlocks.eq(nextIdx);
                    // make this block editable
                    needToFocus = true;
                }

            } else if (!selectedBlock && otherBlocks.length) {
                // make this block editable
                needToFocus = true;
                selectedBlock = otherBlocks[0];
            }

            if (needToFocus) {
                _startEditing(selectedBlock, odn, pageBlock, scope);
                _focusBlock(selectedBlock).select();
                objectDetailService.selectWidget(selectedBlock);
            }

            return selectedBlock;
        }
        /// <summary>
        /// method will turn on field 'edit' mode
        /// <param name="target">target element of a click</param>
        /// <param name="odn">object definition name</param>
        /// <param name="detailBlock">detail page block object</param>
        /// <param name="scope">scope object</param>
        /// </summary>
        function _startEditing(target, odn, detailBlock, scope) {
            var container = target.closest("._keycontainer");
            var detailContainer = detailBlock.contentObject.element;
            // bind 'Esc' click to undo edition
            $(document).off('escPressed');
            $(document).on('escPressed', function (e) {
                var code = e ? e.which : event.keyCode;
                if (code == 27 && detailBlock.fieldInEditMode) {
                    scope.selectedBlock = detailBlock.fieldInEditMode;
                    // 'highlight' current field
                    var blockToFocus = detailBlock.fieldInEditMode;
                    FieldInlineEditService.activateSimpleBlock(detailBlock.fieldInEditMode);
                    // unset 'editing' field
                    detailBlock.fieldInEditMode = null;
                    // cancel edit process
                    detailPageFieldService.cancelInlineEditing(
                        target,
                        container,
                        detailBlock.settings.currentRecord.id,
                        detailContainer);
                    _focusBlock(blockToFocus);
                }
            });

            var fieldName = container.attr("key");
            if (fieldService.isFieldReadOnly(fieldName)) {
                container.css('cursor', 'not-allowed');
                return false;
            }

            var value = container.find("._hdnOldPropertyValue").val();
            var fieldProperties = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, odn);
            fieldProperties.PropertyName = fieldName;
            fieldProperties.PropertyValue = value;

            fieldService.initEditorField(fieldProperties, detailContainer);
            // TODO: where to get acData, if needed
            // TODO: bindIfConditional ?
            if (fieldProperties.DataType == gConfig.dataTypes.GeoData) {
                var latField = container.find("._maplatfield").attr("id");
                var longField = container.find("._maplongfield").attr("id");
                var mapZoomField = container.find("._mapzoomfield").attr("id");
                var addressField = container.find("._mapaddressfield").attr("id");
                var mapTypeField = container.find("._maptypefield").attr("id");
                var mapDiv = container.find(".mapdiv").attr("id");
                var lat = detailContainer.find("#" + latField).val();
                var long = detailContainer.find("#" + longField).val();
                var zoomLevel = detailContainer.find("#" + mapZoomField).val();
                zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
                var editable = true;
                var address = detailContainer.find("#" + addressField).val();
                var mapType = detailContainer.find("#" + mapTypeField).val();
                mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
                var saveZoomLevel = true;
                var saveMapType = true;
                detailPageMapService.initializeMap(lat, long, latField, longField, editable, mapDiv,
                    address, addressField, mapZoomField, mapTypeField, zoomLevel, mapType,
                    saveZoomLevel, saveMapType, false);
            }
            container.find("._editBlock").removeClass("displaynone");
            container.find("._editBlock").addClass("displayblock");
            detailContainer.find("._editBlock").removeClass("_editedElement");
            container.find("._editBlock").addClass("_editedElement");
            $(target).removeClass("displayblock").addClass("displaynone");
            detailBlock.fieldInEditMode = target;
            container.find("._editBlock input:text, ._editBlock textarea").first().focus();

            return false;
        }
        /// <summary>
        /// method will focus block
        /// <param name="simpleBlock">edited block (lebel part)</param>
        /// </summary>
        function _focusBlock(simpleBlock) {
            var focused = false;
            // set focus on editing input
            var editBlock = simpleBlock.siblings('._editBlock');
            var editBlockInput = editBlock.find('input[type!="hidden"]');
            if (!editBlockInput.length) {
                editBlockInput = editBlock.find('textarea');
            }
            if (!editBlockInput.length) {
                editBlockInput = editBlock.find('select');
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

            return editBlockInput;
        }
        /// <summary>
        /// method will show popup for related property
        /// <param name="target">target element of a click</param>
        /// <param name="mainOdn">object definition name</param>
        /// </summary>
        function _viewRelated(target, mainOdn) {
            var container = target.closest("._keycontainer");
            var fieldName = container.attr("key");
            var fieldProperties = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, mainOdn);
            var value = container.find("._hdnOldPropertyValue").val();
            var inputSettings = value.split(':');
            var recordId = inputSettings[0];
            var odn;
            if (fieldProperties.DataType == gConfig.dataTypes.MultiObjectRelationshipField) {
                odn = inputSettings[3];
            }
            else {
                if (fieldProperties.InputSettings != undefined) {
                    inputSettings = fieldProperties.InputSettings.split(':');
                    odn = inputSettings[1];
                }
            }
            var displayMode = {
                type: 'popup'
            };
            // TODO: how to get it?
            var pageTemplateName = "Default";
            existingObjectDetailService.displayObjectDetail(recordId, odn, pageTemplateName, displayMode, false);

            return false;
        }

        return FieldInlineEditService;
    }]);
