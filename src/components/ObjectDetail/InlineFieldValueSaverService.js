/**
 * Created by C4off on 31.08.15.
 */
speedupObjectDetailModule.factory('inlineFieldValueSaverService', ['animationService',
    'fieldPropertiesService', 'detailPageFieldValuesService', 'detailPageFieldService',
    'objectService', 'localizationService', 'notificationService', 'configService',
    function (animationService, fieldPropertiesService, detailPageFieldValuesService,
              detailPageFieldService, objectService, localizationService,
              notificationService, configService) {

        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        var InlineFieldValueSaverService = function () {
        };

        /// <summary>
        /// method to check if value of field has changed
        /// </summary>
        /// <param name="field">simple block element</param>
        /// <param name="recordId">id of a record</param>
        /// <param name="odn">object definition name</param>
        InlineFieldValueSaverService.checkValueChanged = function(field, recordId, odn){
            //container must have key and dtype props
            var container = field.closest('._keycontainer');
            var dataType = container.attr('dtype');
            var objInlineEditSchema = _getInlineEditedData(container, recordId, odn);
            var newValue = objInlineEditSchema.PropertyValue;

            return _valueChanged(newValue, container, dataType)
        };

        /// <summary>
        /// method to save inline edited filed value
        /// </summary>
        /// <param name="detailBlock">detail page block object</param>
        /// <param name="recordId">id of a record</param>
        /// <param name="odn">object definition name</param>
        /// <param name="mode">detail page edit mode</param>
        InlineFieldValueSaverService.saveData = function(detailBlock, recordId, odn, mode) {
            var detailObjectContainer = detailBlock.contentObject.element;
//            var element = detailObjectContainer.find("._editedElement");
            var currentEditedField = detailBlock.fieldInEditMode;
            if(!currentEditedField){
                return false;
            }
            var editBlock = currentEditedField.siblings('._editBlock');
            var container = detailObjectContainer.find(editBlock).closest("._keycontainer");
            detailBlock.fieldInEditMode = null;
            if (editBlock != null) {
                if (mode == 'single') {
                    _saveInlineData(editBlock, container, recordId, odn, detailObjectContainer);
                } else if (mode == 'multiple') {
                    _updateFieldValue(editBlock, container, recordId, detailObjectContainer);
                }
            }
            return false;
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Method will save current inline edited field value
        /// </summary>
        /// <param name="element">the current html element</param>
        /// <param name="container">container of a field</param>
        /// <param name="recordId">id of a record</param>
        /// <param name="odn">object definition name</param>
        /// <param name="detailContainer">container for object detail page</param>
        function _saveInlineData(element, container, recordId, odn, detailContainer) {
            var key = container.attr("key");
            var type = container.attr("dtype");
            animationService.displayInlineLoader(element);
            var objInlineEditSchema = _getInlineEditedData(container, recordId, odn);
            var newValue = objInlineEditSchema.PropertyValue;
            // if value hasn't changed - cancel editing
            if(!_valueChanged(newValue, container, type)){
                detailPageFieldService.cancelInlineEditing(element, container, recordId, detailContainer);
            }
            // save object field
            return objectService.saveObjectField(odn, key, objInlineEditSchema["PropertyDefinition_fk"],
                    objInlineEditSchema["PropertyValue"], recordId, true).then(function (response) {
                    if (response == "Update Successfull.") {
                        container.find("._hdnOldPropertyValue").val(objInlineEditSchema["PropertyValue"]);
                        detailPageFieldService.cancelInlineEditing(element, container, recordId, detailContainer);
                        var msg = localizationService.translate('Messages.RecordUpdatedSuccessfully');
                        notificationService.showNotification(msg);
                    }
                }, function (error) {
                    notificationService.showNotification(error, true);
                });
        }

        /// <summary>
        /// Method will save current inline edited field value
        /// </summary>
        /// <param name="newValue">new value of field</param>
        /// <param name="container">container of a field</param>
        /// <param name="dataType">field dataType</param>
        function _valueChanged(newValue, container, dataType){
            var oldValueCnt = container.find("._hdnOldPropertyValue");
            if (oldValueCnt.length) {
                var oldValue = oldValueCnt.val();
                var newValueTrimmed = (""+newValue).trim();
                var oldValueTrimmed = oldValue.trim();
                // in case of checkbox, there may be an issue with old value.
                // It can be either 0 or "" for unchecked
                if(dataType == dataTypes.CheckBox){
                    return ((!oldValueTrimmed && newValue) ||
                        (!oldValueTrimmed && newValue));
                } else if(dataType == dataTypes.ObjectRelationship){
                   if ((oldValueTrimmed == "" && newValueTrimmed == ":") ||
                        (oldValueTrimmed == ":" && newValueTrimmed == "")){
                       return false;
                   }
                    // for MultiObjectRelationship fields new value may look like
                    // "::1410447429587:FastPictureInspection"
                    // but old is ""
                } else if(dataType == dataTypes.MultiObjectRelationshipField){
                    var valueParts = newValueTrimmed.split(":");
                    if(oldValue == "" && !valueParts[0]){
                        return false;
                    }
                }
                if(newValueTrimmed == oldValueTrimmed ||
                    !(newValue || oldValue) &&
                        !(newValue === 0 && parseInt(oldValue) !== 0)&&
                        !((newValueTrimmed === "" || newValue === null) && oldValueTrimmed !== "") ){
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Method will return the value of current inline edited field value
        /// </summary>
        /// <param name="container">container of a field</param>
        /// <param name="recordId">id of a record</param>
        /// <param name="odn">object definition name</param>
        function _getInlineEditedData(container, recordId, odn) {
            var key = container.attr("key");
            var type = container.attr("dtype");
            var fieldProperties;
            var objInlineEditData = {};
            if (recordId) {
                fieldProperties = fieldPropertiesService.getAllPropertiesOfSingleField(key, odn);
                var value = null;
                if (key != undefined && key != null && key != "") {
                    value = detailPageFieldValuesService.getElementsValue(container, type, key);
                    objInlineEditData["PropertyValue"] = value;
                }
                objInlineEditData["ObjectEntry_fk"] = recordId;
                objInlineEditData["PropertyDefinition_fk"] = fieldProperties.PropertyDefinition_ID;
            }
            return objInlineEditData;
        }

        /// <summary>
        /// Method will update 'label'-wrapper field value
        /// </summary>
        /// <param name="element">field input</param>
        /// <param name="container">container of a field</param>
        /// <param name="recordId">id of a record</param>
        /// <param name="detailContainer">object detail page container </param>
        function _updateFieldValue(element, container, recordId, detailContainer) {
            var key = container.attr("key");
            var type = container.attr("dtype");
            var value = null;
            if (key) {
                value = detailPageFieldValuesService.getElementsValue(container, type, key);
            }
            container.find("._hdnOldPropertyValue").val(value);
            detailPageFieldService.cancelInlineEditing(element, container, recordId, detailContainer);
        }

        return InlineFieldValueSaverService;

    }]);