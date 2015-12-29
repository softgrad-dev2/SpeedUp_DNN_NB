/**
 * Created by antons on 5/22/15.
 */
speedupObjectDetailModule.factory('detailPageFieldService', ['configService', 'autocompleteService', 'listDataLoaderService',
    'dateTimeService', 'detailPageMapService', 'fieldPropertiesService',
    'objectService', 'notificationService', 'localizationService', 'fieldService', 'existingObjectDetailService',
    'detailPageFieldValuesService', 'animationService',
    function (configService, autocompleteService, listDataLoaderService, dateTimeService, detailPageMapService,
              fieldPropertiesService, objectService, notificationService, localizationService,
              fieldService, existingObjectDetailService, detailPageFieldValuesService, animationService) {

        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        function DetailPageFieldService() {
        }

        /*PUBLIC METHODS*/


        /// <summary>
        /// This method will disable the editor elements
        /// </summary>
        /// <param name="fieldsArray">array of fields</param>
        /// <param name="isNewRecord">if new record (true or false)</param>
        /// <param name="container">container of elements</param>
        DetailPageFieldService.disableEditors = function (fieldsArray, isNewRecord, container) {
            $.each(fieldsArray, function (key, val) {
                var isReadOnlyField = fieldService.isFieldReadOnly(val.PropertyName);
                // here we check for system property only when creating new entry
                // if we edit existing one, we just check for isReadOnly
                if ((val.SystemProperty && val.PropertyName != 'Name') ||
                    (isReadOnlyField) || (isNewRecord && val.DataType == dataTypes.AutoText) ){
                    _doDisableEditor(container, val.PropertyName);
                }
                // TODO: old checks. Need to keep it
//                if (val.SystemProperty || isReadOnlyField) {
//                    if(isNewRecord || isReadOnlyField){
//                        _doDisableEditor(container, val.PropertyName);
//                    }
//                // Disable AutoText field when editing record
//                } else if(val.DataType == dataTypes.AutoText){
//                    _doDisableEditor(container, val.PropertyName);
//                }
            });
        };

        /// <summary>
        /// This method will update related field on autocomplete value selected
        /// </summary>
        /// <param name="container">detail page container</param>
        /// <param name="value">value for a field</param>
        /// <param name="propertyId">id of a value</param>
        /// <param name="propertyFk">property definition id</param>
        /// <param name="propertyName">property name</param>
        DetailPageFieldService.updateRelatedField = function (container, value, propertyId, propertyFk, propertyName) {
            // find field and update visible value
            var field = container.find('[key="' + propertyName + '"]>._simpleBlock a');
            if (field.length) {
                field.html(value);
            }
            // get odn and record id (maybe, from container)
            var wrapper;
            if (container.hasClass('ContentObject')) {
                wrapper = container.find('._detailsContent');
            } else {
                wrapper = container.closest('._detailsContent');
            }
            var odn = wrapper.attr('odn');
            var recordId = wrapper.attr('recordId');
            // save particular value
            var concatenatedValue = propertyId + ":" + value;
            objectService.saveObjectField(odn, propertyName, propertyFk, concatenatedValue, recordId, true);
        };

        /// <summary>
        /// Method will cancel current inline edit mode and display value as label
        /// </summary>
        /// <param name="input">field input</param>
        /// <param name="cell">field container</param>
        /// <param name="recordId">record id</param>
        /// <param name="detailPage">detail page container</param>
        DetailPageFieldService.cancelInlineEditing = function (input, cell, recordId, detailPage) {
            // remove "._editedElement" class to avoid saving
            cell.find("._editedElement").removeClass("_editedElement");
            // TODO: bring back old input value
            var dataTypes = gConfig.dataTypes;
            var dataType = cell.attr("dtype");
            var key = cell.attr("key");
            var propertyValue = cell.find("._hdnOldPropertyValue").val();
            var objInlineEditSchema = {
                PropertyValue: propertyValue,
                DataType: dataType,
                UniqueKey: recordId
            };
            var objData = detailPageFieldValuesService.setValuesForElements(objInlineEditSchema, key);
            if (dataTypes.CheckBox == dataType) {
                cell.find("._simpleBlock input[type='checkbox']").prop("checked", objInlineEditSchema.PropertyValue == 1);
            }
            else if (dataTypes.RichTextBox == dataType) {
                cell.find("._simpleBlock").html(objInlineEditSchema.PropertyValue);
            }
            else if (dataTypes.DateTime == dataType) {
                cell.find("._simpleBlock").text(dateTimeService.DateTimeFormat(objData.LabelValue));
            }
            else if (dataTypes.Date == dataType) {
                cell.find("._simpleBlock").text(dateTimeService.DateFormat(objData.LabelValue));
            }
            else if (dataTypes.GeoData == dataType) {
                var geoDataField = _getElementsName(cell, dataType);
                detailPage.find("#" + geoDataField.latField).val(objData.Latitude);
                detailPage.find("#" + geoDataField.longField).val(objData.Longitude);
                detailPage.find("#" + geoDataField.mapZoomField).val(objData.MapZoom);
                detailPage.find("#" + geoDataField.addressField).val(objData.Address);
                detailPage.find("#" + geoDataField.mapTypeField).val(objData.MapType);
                var editable = false;
                var saveZoomLevel = true;
                var saveMapType = false;
                cell.find("._simpleBlock").text(objData.Address);
                detailPageMapService.initializeMap(objData.Latitude, objData.Longitude,
                    geoDataField.latField, geoDataField.longField, editable, geoDataField.mapDiv,
                    objData.Address, geoDataField.addressField, geoDataField.mapZoomField,
                    geoDataField.mapTypeField, objData.MapZoom, objData.MapType, saveZoomLevel, saveMapType, true);
            }
            else if (dataTypes.MultiObjectRelationshipField == dataType || dataTypes.ObjectRelationship == dataType || dataTypes.ParentRelationship == dataType) {
                cell.find("._simpleBlock").find("._viewdetailObjectRelationship").text(objData.ObjectName);
                cell.find('#txt' + key).val(objData.ObjectName);
                //change title
                cell.parent().find('[key="' + key + '"]').attr('title', objData.PropertyValue);
            }
            else {
                cell.find("._simpleBlock").text(objData.LabelValue);
            }
            var editblock = cell.find("._editBlock");
            var simpleblock = cell.find("._simpleBlock");
            editblock.removeClass("displayblock").addClass("displaynone");
            simpleblock.removeClass("displaynone").addClass("displayblock");
            detailPage.find("._editBlock").removeClass("_editedElement");
            animationService.hideInlineLoader(input);
        };

        /*PRIVATE METHODS*/

        function _doDisableEditor(container, propertyName){
            var control = container.find("div[key='" + propertyName + "']>._simpleBlock ");
            if (control) {
                control.addClass("disabled");
            }
        }

        function _getElementsName(container, dataType) {
            var fieldNames = {};
            var DataType = gConfig.dataTypes;
            switch (dataType) {
                case DataType.GeoData:
                    fieldNames.latField = container.find("._maplatfield").attr("id");
                    fieldNames.longField = container.find("._maplongfield").attr("id");
                    fieldNames.mapZoomField = container.find("._mapzoomfield").attr("id");
                    fieldNames.addressField = container.find("._mapaddressfield").attr("id");
                    fieldNames.mapTypeField = container.find("._maptypefield").attr("id");
                    fieldNames.mapDiv = container.find(".mapdiv").attr("id");
                    break;
                default:
            }

            return fieldNames;
        }

        // TODO: think of it
        // NOT CHECKED
        /// <summary>
        /// method will check if its inline editing then it will load the current element otherwise it will check if the current element has dependency on others then event will be binded to it
        /// <param name="container">container containing elements ie.e dom element</param>
        /// <param name="propertyname">propertyname of element</param>
        /// <param name="propertyid">propertyid of element</param>
        /// <param name="datatype">datatype of element</param>
        /// <param name="inlineediting">inlineediting i.e true or false</param>
        /// </summary>
//        DetailPageFieldService.bindFieldEventIfConditional = function (container, propertyname, propertyid, datatype, inlineediting) {
//            // TODO: CHECK it
//            if (inlineediting != undefined && inlineediting != null) {
//                $config.LoadCurrentElement(container.settings.ObjectDefinitionName, propertyid, container.currentRecordDetail[0], datatype, container);  // load the element if its inline editing mode
//            } else {
//                var isConditional = $config.CheckIfConditional(container.settings.ObjectDefinitionName, propertyid);  // To check if element has dependency on others then bind events on it as per datatype
//                if (isConditional) {
//                    var DataType = $.config.DataType;
//                    switch (datatype) {
//                        case DataType.ObjectRelationship:
//                            var objRelationshipField = container.find("#txt" + propertyname);
//                            objRelationshipField.on('blur', function (e) {
//                                $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, $(this).val(), container);
//                                e.preventDefault();
//                                e.stopPropagation();
//                            });
//                            break;
//                        case DataType.DropDownList:
//                            var dropDownData = container.find("#" + propertyname).data("kendoDropDownList");
//                            dropDownData.setOptions({
//                                change: function (event) {
//
//                                    $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, event.sender.value(), container);
//                                }
//                            });
//                            break;
//                        case DataType.SearchableDropDownList:
//                            var dropDownData = container.find("#" + propertyname).data("kendoComboBox");
//                            dropDownData.setOptions({
//                                change: function (event) {
//                                    $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, event.sender.value(), container);
//                                }
//                            });
//                            break;
//                        case DataType.MultiObjectRelationshipField:
//
//                            var dropDownData = container.find("#ddl" + propertyname).data("kendoDropDownList");
//                            dropDownData.setOptions({
//                                change: function (event) {
//                                    $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, event.sender.value(), container);
//                                }
//                            });
//                            break;
//                        case DataType.NumericText:
//                            var numericTextBox = container.find("#txtNum" + propertyname).data("kendoNumericTextBox");
//                            numericTextBox.setOptions({
//                                change: function (event) {
//                                    $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, event.sender.value(), container);
//                                }
//                            });
//                            break;
//                        case DataType.Numeric:
//                            var numericTextBox = container.find("#txtNum" + propertyname).data("kendoNumericTextBox");
//                            numericTextBox.setOptions({
//                                change: function (event) {
//                                    $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, event.sender.value(), container);
//                                }
//                            });
//                            break;
//                        case DataType.ParentRelationship:
//                            container.find("#txt" + propertyname).on('blur', function (e) {
//                                $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, $(this).val(), container);
//                                e.preventDefault();
//                                e.stopPropagation();
//                            });
//                            break;
//                        case DataType.TableRelationship:
//                            container.find("#txt" + propertyname).on('blur', function (e) {
//                                $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, $(this).val(), container);
//                                e.preventDefault();
//                                e.stopPropagation();
//                            });
//                            break;
//                        case DataType.Text:
//                            container.find("#txt" + propertyname).on('blur', function (e) {
//                                $config.LoadConditionalDDLs(container.settings.ObjectDefinitionName, propertyid, $(this).val(), container);
//                                e.preventDefault();
//                                e.stopPropagation();
//                            });
//                            break;
//                    }
//                }
//            }
//        }


        return DetailPageFieldService;
    }

]);