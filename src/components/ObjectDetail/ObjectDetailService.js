/**
 * Created by C4off on 17.05.15.
 */
speedupObjectDetailModule.factory('objectDetailService', ['$q', '$rootScope', '$compile', '$http',
    'configService', 'schemaService', 'detailPageFieldValuesService', 'fieldPropertiesService',
    'dateTimeService', 'filesystemService', 'objectService', 'objectDetailDisplayerService',
    'localizationService', 'eventManager', 'relatedObjectsService', 'notificationService',
    'attachmentsService', 'objectTemplateService',
    function ($q, $rootScope, $compile, $http, configService, schemaService,
              detailPageFieldValuesService, fieldPropertiesService, dateTimeService,
              filesystemService, objectService, objectDetailDisplayerService,
              localizationService, eventManager, relatedObjectsService, notificationService,
              attachmentsService, objectTemplateService) {
        var gConfig = configService.getGlobalConfig();

        var ObjectDetailService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// method will close widget (wrap select etc)
        /// <param name="block">edited block</param>
        /// </summary>
        ObjectDetailService.unSelectWidget = function(block) {
            return this.selectWidget(block, true)
        };
        /// <summary>
        /// method will close widget (wrap select etc)
        /// <param name="block">edited block</param>
        /// <param name="close">close flag. If true-will close the widget</param>
        /// </summary>
        ObjectDetailService.selectWidget = function(block, close) {
            // get data type of field
            var dataTypes = gConfig.dataTypes;
            var container = block.closest('._keycontainer');
            var fieldType = container.attr('dtype');
            var widget;
            switch(fieldType){
                case dataTypes.DropDownList:
                    widget = container.find('select').data('kendoDropDownList');
                    break;
               case dataTypes.SearchableDropDownList:
                    widget = container.find('select').data('kendoComboBox');
                    break;
                case dataTypes.Date:
                    widget = container.find('input[type!="hidden"]').data('kendoDatePicker');
                    break;
                case dataTypes.DateTime:
                    widget = container.find('input[type!="hidden"]').data('kendoDateTimePicker');
                    break;
            }
            if (widget) {
                if(close){
                    widget.close();
                } else{
                    widget.open();
                }
            }
        };
//        /// <summary>
//        /// method will bind keyboard events for detail page
//        /// <param name="pageBlock">page block</param>
//        /// </summary>
//        ObjectDetailService.bindKeyboardEvents = function(pageBlock){
//            $(document).off('keydown');
//            $(document).on('keydown', function (e) {
//                var keyCode = e.keyCode || e.which;
//                var rootBlock = pageBlock.getRootBlock(pageBlock);
//                if (keyCode == 9) {
//                    var tabPressEvent = jQuery.Event("detailKeypress");
//                    tabPressEvent.which = rootBlock.shiftPressed ? 169 : 9;
//                    // currentPageBlock may not have been set yet
//                    if (rootBlock.currentPageBlock &&
//                        rootBlock.currentPageBlock.contentObject &&
//                        rootBlock.currentPageBlock.contentObject.element) {
//                        rootBlock.currentPageBlock.contentObject.element.trigger(tabPressEvent);
//                    } else {
//                        rootBlock.contentObject.element.trigger(tabPressEvent);
//                    }
//                    e.preventDefault();
//                } else if (keyCode == 13) {
//                    var enterPressEvent = jQuery.Event("detailKeypress");
//                    enterPressEvent.which = 13;
//                    if (rootBlock.currentPageBlock &&
//                        rootBlock.currentPageBlock.contentObject &&
//                        rootBlock.currentPageBlock.contentObject.element) {
//                        rootBlock.currentPageBlock.contentObject.element.trigger(enterPressEvent);
//                    } else {
//                        rootBlock.contentObject.element.trigger(enterPressEvent);
//                    }
//                } else if (keyCode == 27) {
//                    var escPressEvent = jQuery.Event("escPressed");
//                    escPressEvent.which = 27;
//                    $(document).trigger(escPressEvent);
//                } else if (keyCode == 16) {
//                    rootBlock.shiftPressed = true;
//                }
//            });
//        };
        /// <summary>
        /// Method to Generate Temporary ID
        /// <param name="odn">object definition name</param>
        /// </summary>
        ObjectDetailService.generateTmpId = function (odn) {

            var length = 8;
            var timestamp = +new Date();

            var ts = timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "";

            for (var i = 0; i < length; ++i) {
                var index = _getRandomInt(0, parts.length - 1);
                id += parts[index];
            }

            return "Temp_" + odn + "_" + id;
        };
        /// <summary>
        /// Method to open popup for related record
        /// <param name="odn">object definition name</param>
        /// </summary>
        ObjectDetailService.openRelationalRecordPopup = function (target, dataItem, value, top) {
            var dataTypes = gConfig.dataTypes;
            var container = target.closest("._keycontainer");
            var fieldName = container.attr("key");
            // get field from dataItem
            var field = null;
            dataItem.some(function (fieldObj) {
                if (fieldObj.PropertyName == fieldName) {
                    field = fieldObj;
                    return true;
                } else {
                    return false;
                }
            });
            var dropdownList = null;
            var inputValue;
            var recordId;
            var inputSettings = field.InputSettings;

            var dataType = container.attr("dtype");
            if (dataType == dataTypes.MultiObjectRelationshipField) {
                dropdownList = $(container).find("#ddl" + fieldName).data("kendoDropDownList");
                inputValue = dropdownList.text();
            }
            else {
                inputSettings = inputSettings.split(':');
                if (inputSettings.length > 0) {
                    recordId = inputSettings[0];
                    inputValue = inputSettings[1];
                }
            }
            var odn = inputValue;

            relatedObjectsService.openRelatedObjectPopup(fieldName, odn, recordId, container, value, top,
                function (eventData) {
                    // onselect part
                    var itemId = eventData.ObjectEntry_ID;
                    var name = eventData.Name
                    var value = itemId + ':' + name;
                    if (dataType.MultiObjectRelationshipField == dataType) {
                        if (dropdownList != null) {
                            value = value + ":" + dropdownList.value() + ":" + dropdownList.text();
                        }
                    }
                    $(container).find('#txt' + fieldName).val(name);
                });
        };
        /// <summary>
        /// Method will open popup to create new entry
        /// <param name="odn">object definition name</param>
        /// <param name="parentRecordId">id of parent record</param>
        /// <param name="parentRecordName">name of parent record</param>
        /// <param name="parentRecordFK">id of parent record type</param>
        /// </summary>
        ObjectDetailService.createNewObject = function (odn, parentRecordId, parentRecordName, parentRecordFK) {
            var detailPageSettings = {
                odn: odn,
                recordId: null,
                fieldEditMode: 'multiple',
                pageSize: 5,
                displayMode: {
                    type: 'popup'
                },
                editMode: 'detail'
            };
            if (parentRecordId) {
                detailPageSettings.currentRecord = {
                    id: parentRecordId,
                    name: parentRecordName,
                    fk: parentRecordFK
                }
            }

            return ObjectDetailService.addNewRecord(odn, detailPageSettings).then(function (displayer) {
                // Listen to 'create' and 'close' buttons
                eventManager.addListener(NewODActionButtonClicked, function () {
                    // dispose bound events (not to create excess popups)
                    displayer.onClose(function () {
                        eventManager.disposeListeners(detailPageSettings);
                    });
                    displayer.close();
                }, detailPageSettings);
            });
        };
        /// <summary>
        /// Method will display detail block for new record
        /// <param name="odn">object definition name</param>
        /// <param name="settings">page block settings</param>
        /// <param name="title">popup title</param>
        /// </summary>
        ObjectDetailService.addNewRecord = function (odn, settings, title) {
            title = title || localizationService.translate("Headers.NewDetailTitle");
            settings.isNewEntry = true;
            var promise = ObjectDetailService.getNewDetailPageBlockPromise(odn, settings);
            return promise.then(function (detailPageBlock) {
                var displayer = objectDetailDisplayerService.getDisplayer(settings.displayMode);
                displayer.getDetailViewNew(title, detailPageBlock);

//                modalInstance.result.then(function (result) {
//                    console.log(result);
//                }, function () {
//                    console.log('Modal dismissed at: ' + new Date());
//                });

                return displayer;
            });
        };
        /// <summary>
        /// Method will act after creation of new record to save temporary attachments
        /// <param name="odn">object definition name</param>
        /// <param name="parentRecordId">id of parent record</param>
        /// <param name="parentRecordName">name of parent record</param>
        /// <param name="parentRecordFK">id of parent record type</param>
        /// </summary>
        ObjectDetailService.afterCreateNewRecord = function ($element, odn, response) {
            // save temporary attachments
            var hdnId = $element.parent().find('#hdnTempId');
            if (hdnId.length) {
                var temporaryId = hdnId.val();
                var saveData = jQuery.parseJSON(response.SavedData);
                var newRecordId = saveData[0].ObjectEntry_ID;
                // wait until attachments are saved to get them and add to the new created entry
                attachmentsService.saveTemporaryAttachments(odn, newRecordId, temporaryId).then(function () {                                        // get attachments
                    attachmentsService.getAttachments(newRecordId, odn).then(function (attachmentsObj) {
                        if (attachmentsObj && attachmentsObj.attachments) {
                            // get image for attachment
                            var imgUrl = attachmentsService.updateImage(attachmentsObj.attachments);
                            // add it to response
                            if (imgUrl) {
                                response.image = imgUrl;
                            }
                        }
                        _finishNewEntryCreation(response);
                    }, function () { // somehow failed to fetch attachments
                        _finishNewEntryCreation(response);
                    });
                });
            } else {
                _finishNewEntryCreation(response);
            }
        };
        /// <summary>
        /// Method will save new record data
        /// <param name="objectDetailContainer">page block element</param>
        /// <param name="odn">object definition name</param>
        /// </summary>
        ObjectDetailService.saveNewRecord = function (objectDetailContainer, odn) {
            var userName = gConfig.userName;
            return ObjectDetailService.getEditedObjectData(objectDetailContainer, odn, userName).then(function (objSchema) {
                objSchema[0]["ObjectEntry_ID"] = null;
                objSchema[0]["CreatedBy"] = userName;
                objSchema[0]["CreatedDate"] = dateTimeService.DateTimeFormat(new Date());

                return objectService.saveObject(objSchema, odn, true);
            });

        };
        /// <summary>
        /// method will return the edited record data.
        /// <param name="objectDetailContainer">page block element</param>
        /// <param name="odn">object definition name</param>
        /// <param name="userName">user name</param>
        /// </summary>
        ObjectDetailService.getEditedObjectData = function (objectDetailContainer, odn, userName) {
            return schemaService.EmptySchema(odn).then(function (objSchema) {
                objectDetailContainer.find("._tbldetail ._keycontainer").each(function () {
                    var key = $(this).attr("key");
                    var type = $(this).attr("dtype");
                    var $td = $(this);
                    var value = null;
                    if (key != undefined && key != null && key != "" && type != null) {
                        value = detailPageFieldValuesService.getElementsValue($td, type, key);
                        objSchema[0][key] = value != undefined && value != null ? $.trim(value.toString()) : value;

                    }
                });
                objSchema[0]["ObjectDefinition_fk"] = undefined;
                objSchema[0]["oeIsDeleted"] = undefined;
                objSchema[0]["oeOrganizationID"] = undefined;
                objSchema[0]["oeOwnerID"] = undefined;
                objSchema[0]["oePortalID"] = undefined;
                objSchema[0]["RowNum"] = undefined;
                objSchema[0]["OrganizationID"] = undefined;
                objSchema[0]["OwnerID"] = undefined;
                objSchema[0]["PortalID"] = undefined;
                objSchema[0]["RecordType"] = undefined;
                objSchema[0]["IsDeleted"] = undefined;
                objSchema[0]["ChangedBy"] = userName;

                return objSchema;
            });
        };
        /// <summary>
        /// method will create scope object for new entry page
        /// <param name="odn">object definition name</param>
        /// <param name="settings">page block settings</param>
        /// </summary>
        ObjectDetailService.getNewDetailScope = function (odn, settings) {
            // get fields
            var fieldPromise = ObjectDetailService.getFieldsForNewDetail(odn, settings);
            // get tabStrip
            var tabStrip = ObjectDetailService.getEmptyTabStripObject();

            return fieldPromise.then(function (data) {
                return schemaService.createPageTitle(odn).then(function (title) {
                    var scope = $rootScope.$new();
                    scope.fields = data;
                    scope.tabStrip = tabStrip;
                    scope.objectName = title;

                    return scope;
                });
            });
        };
        /// <summary>
        /// method will return promise of getting metadata for new entry fields
        /// <param name="odn">object definition name</param>
        /// <param name="settings">page block settings</param>
        /// </summary>
        ObjectDetailService.getNewDetailPageBlockPromise = function (odn, settings) {
            // Get 'create new' page template
            var pageType = settings.editMode;
            var tpl;
            if (pageType == 'edit') {
                tpl = angular.element('<new-object-edit></new-object-edit>');
            } else {
                tpl = angular.element('<new-object-detail></new-object-detail>');
            }

            return ObjectDetailService.getNewDetailScope(odn, settings).then(function (scope) {
                var newDetailPageBlock = new DetailPageBlock(settings);
                var contentObject = new ContentObject();
                scope.pageBlock = newDetailPageBlock;
                scope.settings = settings;
                contentObject.content = $compile(tpl)(scope);
                contentObject.scope = scope;

                newDetailPageBlock.contentObject = contentObject;

                return newDetailPageBlock;
            });
        };
        /// <summary>
        /// method will get meta for new entry page
        /// <param name="odn">object definition name</param>
        /// <param name="containerSettings">page block settings</param>
        /// </summary>
        ObjectDetailService.GetEmptyDataItem = function (odn, containerSettings) {
            return schemaService.EmptySchema(odn).then(function (emptyObjectSchema) {
                    containerSettings = containerSettings || {};
                    var dataArrary = [];
                    dataArrary.Maps = new Array();
                    dataArrary.Summary = new Array();
                    var fieldNames = Object.getOwnPropertyNames(emptyObjectSchema[0]);
                    var objFields = fieldPropertiesService.getAllPropertiesOfFieldsArray(fieldNames, odn);
                    // $thisEditObject.currentRecordDetail = val1;
                    $.each(objFields, function (index, objField) {
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

                            // overridenFields
                            if (containerSettings.overridenFields &&
                                containerSettings.overridenFields.odn == odn &&
                                containerSettings.overridenFields[objField.PropertyName]) {
                                objField.PropertyValue = containerSettings.overridenFields[objField.PropertyName];
                            } else {
                                objField.PropertyValue = objField.DefaultValue;
                            }
                            // If we pass parent record info
                            if ((objField.DataType == gConfig.dataTypes.ParentRelationship ||
                                objField.DataType == gConfig.dataTypes.ObjectRelationship ||
                                objField.DataType == gConfig.dataTypes.MultiObjectRelationshipField) &&
                                (containerSettings.currentRecord && containerSettings.currentRecord.id)) {

                                // we need to check entry foreignKey, to set parent field value right
                                if (objField.InputSettings) {
                                    var settingsArr = objField.InputSettings.split(":");
                                    if (settingsArr[0]) {
                                        if (containerSettings.currentRecord.fk) {
                                            if (settingsArr[0] == containerSettings.currentRecord.fk) {
                                                objField.PropertyValue = containerSettings.currentRecord.id + ":" + containerSettings.currentRecord.name;
                                            }
                                        }
                                    }
                                }
                            }

                            //default values for controls in case of new record.
                            objField.PropertyName = key;
                            objField.UniqueKey = containerSettings.recordId;

                            objField = detailPageFieldValuesService.setValuesForElements(objField, key);
                            if (objField.DataType == gConfig.dataTypes.GeoData) {
                                _checkMapFieldDefaults(objField);
                                dataArrary.Maps.push(objField);
                            }
                            else if (objField.DataType == gConfig.dataTypes.Summary) {
                                dataArrary.Summary.push(objField);
                            }
                            else
                                dataArrary.push(objField);
                        }
                    });

                    dataArrary.ImageUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");

                    return dataArrary;
                }
            );

        };
        /// <summary>
        /// method will return fields for new entry page
        /// <param name="odn">object definition name</param>
        /// <param name="settings">page block settings</param>
        /// </summary>
        ObjectDetailService.getFieldsForNewDetail = function (odn, settings) {
            return ObjectDetailService.GetEmptyDataItem(odn, settings).then(function (data) {
                // get object settings from cache or make API call
                return  objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                    // get fields selected for template
                    var selectedFieldsString = "";
                    if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedColumnsForTemplate) {
                        selectedFieldsString = jsonSettings[0].SelectedColumnsForTemplate;
                    }
                    var selectedFields = schemaService.FilterFieldsSelected4Template(data, selectedFieldsString);

                    var fields = [selectedFields];
                    fields[0].Maps = data.Maps;
                    fields[0].Summary = data.Summary;
                    fields[0].ImageUrl = data.ImageUrl;
                    fields[0].DisplaySaveRecordButton = true;

                    return fields;
                });

            });
        };
        /// <summary>
        /// method will return data for 'tabStrip' for new entry page
        /// </summary>
        ObjectDetailService.getEmptyTabStripObject = function () {
            return {
                settings: {
                    showAttachments: false,
                    addAttachment: false,
                    recordId: null,
                    displaySubObjectRecordAddButton: false
                },
                tabs: [],
                attachments: []
            }
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// method will check and add default values for map, if absent
        /// <param name="settings">page block settings</param>
        /// </summary>
        function _checkMapFieldDefaults(fieldObj){
            if(!fieldObj.DefaultValue){
                fieldObj.DefaultValue = "59.332488979498976:18.06976318359375:";
            }
            if(!fieldObj.Latitude){
                fieldObj.Latitude = "59.332488979498976";
            }
            if(!fieldObj.Longitude){
                fieldObj.Longitude = "18.06976318359375";
            }

            return fieldObj;
        }
        /// <summary>
        /// method will fire events and show message after entry creation
        /// <param name="response">API response</param>
        /// </summary>
        function _finishNewEntryCreation(response) {
            eventManager.fireEvent(NewODActionButtonClicked);
            eventManager.fireEvent(NewODCreated, response);
            var msg = localizationService.translate('Messages.RecordSavedSuccessfully');
            notificationService.showNotification(msg);
        }

        /// <summary>
        /// helper to get random int
        /// <param name="min">minimum value</param>
        /// <param name="max">maximum value</param>
        /// </summary>
        function _getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        return ObjectDetailService;
    }]);