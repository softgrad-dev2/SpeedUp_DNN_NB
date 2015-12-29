/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.factory('gridColumnsService', ['localizationService', 'notificationService',
    'objectService', 'configService', 'gridDataService', 'fieldService', 'listDataLoaderService',
    'filesystemService', 'relatedObjectsService', 'gridHelper', 'existingObjectDetailService',
    function (localizationService, notificationService, objectService, configService, gridDataService, fieldService, listDataLoaderService, filesystemService, relatedObjectsService, gridHelper, existingObjectDetailService) {

        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        /// <summary>
        /// custom template for kendo ui grid column for those datatypes which should not be display as merely text. This will be used when kendo ui grid column arrary is created.
        /// </summary>
        var _gridColumnsTemplate = {
            EllipsesContent: '<span class="_viewParentObjectRelationship decoration-none withellipsescontent" title="#= data.@#" >#= data.@#</span>',
            DefaultTemplateForTitle: '<span class="_viewParentObjectRelationship decoration-none" >#= data.@#</span>',
            URL: '<a href="#= data.@#" target="_blank" title="#= data.@#" >#= data.@#</a>',
            Image: '<img style="width:60px;"  src="#= data.@#" alt="" />',
            Date: "<span class='typeDatecolumn'> #=  DateTimeHelper.DateFormat(data.@) #</span>",
            DateTime: "<span > #=  DateTimeHelper.DateTimeFormat(data.@) #</span>",
            Time: '<span>#= kendo.toString(data.@, "HH:mm") #</span>',
            Checkbox: '<input type="checkbox" #=data.@ ==1 ? "checked=checked" : "" # disabled="disabled" ></input>',
            RichTextBox: "<span title='#=data.@#'> #= data.@# </span>",
            Email: '<a href="mailto:#= data.@#" target="_blank" title="#= data.@#" >#= data.@#</a>',
            MultiSelectList: "<span title='#= data.@#'> #= data.@ # </span>",
            ParentObjectRelationship: '<span class="_viewParentObjectRelationship k-grid-view decoration-none"                                   title="#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#" >#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</span>',
            ObjectRelationship: '<span class="_viewObjectRelationship k-grid-view decoration-none" title="#=data.@.split(":")[1]                 ==undefined?"":data.@.split(":")[1]#" > #=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</span>',
            TableRelationship: '<span title="#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#"> #=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</span>',
            MultiObjectRelationshipField: '<span  class="_viewObjectRelationship k-grid-view decoration-none" title="#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#" > #=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</span>',
            GeoData: '<a href="javascript:void(0)" data-lat="#=data.@.split(":")[0]==undefined?"":data.@.split(":")[0]#" data-long="#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#" data-add="#=data.@.split(":")[2]==undefined?"":data.@.split(":")[2]#" data-zoom="#=data.@.split(":")[3]==undefined?"":data.@.split(":")[3]#" data-maptype="#=data.@.split(":")[4]==undefined?"":data.@.split(":")[4]#"  class="_viewObjectGeoData k-grid-view decoration-none" title="Karta" > Karta</a>',
            ObjectRelationshipWithellipses: '<span  class="_viewObjectRelationship k-grid-view decoration-none withellipsescontent" title="#=!data.@ || data.@.split(":")[1]                 ==undefined?"":data.@.split(":")[1]#" > #=!data.@ || data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</span>'
//            ObjectRelationship: '<a href="javascript:void(0)" class="_viewObjectRelationship k-grid-view decoration-none" title="#=data.@.split(":")[1]                 ==undefined?"":data.@.split(":")[1]#" > #=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</a>',
//            TableRelationship: '<a title="#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#"> #=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</a>',
//            MultiObjectRelationshipField: '<a href="javascript:void(0)" class="_viewObjectRelationship k-grid-view decoration-none" title="#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#" > #=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</a>',
//            GeoData: '<a href="javascript:void(0)" data-lat="#=data.@.split(":")[0]==undefined?"":data.@.split(":")[0]#" data-long="#=data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#" data-add="#=data.@.split(":")[2]==undefined?"":data.@.split(":")[2]#" data-zoom="#=data.@.split(":")[3]==undefined?"":data.@.split(":")[3]#" data-maptype="#=data.@.split(":")[4]==undefined?"":data.@.split(":")[4]#"  class="_viewObjectGeoData k-grid-view decoration-none" title="Karta" > Karta</a>',
//            ObjectRelationshipWithellipses: '<a href="javascript:void(0)" class="_viewObjectRelationship k-grid-view decoration-none withellipsescontent" title="#=!data.@ || data.@.split(":")[1]                 ==undefined?"":data.@.split(":")[1]#" > #=!data.@ || data.@.split(":")[1]==undefined?"":data.@.split(":")[1]#</a>'
        };

        var _ellipsesPropertyDataTypes = [
            'Text', 'TextBox', 'RichTextBox', 'Numeric', 'NumericText',
            'DropDownList', 'SearchableDropDownList', 'MultiSelectList',
            'URL', 'Image', 'AutoText', 'Formula', 'WebServiceIntegration',
            'ParentRelationship', 'ObjectRelationship', 'TableRelationship',
            'MultiObjectRelationshipField', 'Summary'
        ];


        var GridColumnsService = function () {
        };

        /// <summary>
        /// To create a compatible array of columns from $config.Schema json.
        /// this compatible array will be used in Kendo ui grid columns
        /// </summary>
        /// <param name="columnsList">has complete json of schema provided by API</param>
        /// <param name="settings">grid parameters</param>
        GridColumnsService.getSelectedGridColumns = function (columnsList, settings, useVisibilityFlag) {
//            var columnsSettings =
            var gridColumns = [];
            var viewOrder = 1;
            var defaultViewOrder = 5;
            if (settings.showCheckboxForRowSelection == true) {
                gridColumns.push(_getGridCheckBoxColumn());
            }
            if (settings.showSelectButton || settings.showDeleteButton || settings.showEditButton) {
                gridColumns.push(_getGridButtons(settings));
            }
            gridColumns.push(_getRecordFirstImageColumn(settings));
            for (var column in columnsList) { //looping on column list
            if (columnsList[column].PropertyName == SUConstants.RecordFirstImageColumn) {
                    viewOrder = settings.showCheckboxForRowSelection == true ? 2 : 1;
                }
                else if (columnsList[column].PropertyName == SUConstants.ObjectPropertyNameField) {
                    viewOrder = settings.showCheckboxForRowSelection == true ? 3 : 2;
                }
                else {
                    viewOrder = defaultViewOrder ++;
                }
                if (!useVisibilityFlag || (columnsList[column].Visible)) {
                    gridColumns.push(_getGridFieldColumn(columnsList[column], settings, viewOrder));
                }
            }

            gridColumns.sort(function (a, b) {
                return a.viewOrder - b.viewOrder;
            });

            return gridColumns;
        };

        // Checked
        /// <summary>
        /// method will return the true or false to display current cell in edit mode.
        /// <param name="element">has current cell element</param>
        /// </summary>
        GridColumnsService.isCellEditable = function (fieldName, dataType) {
            return !fieldService.isFieldReadOnly(fieldName) &&
                fieldService.isDataTypeEditable(dataType)
        };
        // ^
        // |
        // |
//            // OLD
//            if (fieldName == undefined) {
//                var grid = $($thisGrid).data("kendoGrid"),
//                    model = grid.dataItem($(element).closest("tr"));
//                var columnIndex = $this.cellIndex(element);
//                var fieldName = $this.thead.find("th").eq(columnIndex).data("field");
//                if ($config.IsReadOnlyField(fieldName)) {
//                    return false;
//                }
//                var $td = element;
//                var row = $td.closest("tr");
//                var rowIdx = $("tr", grid.tbody).index(row);
//                var colIdx = $("td", row).index($td);
//                var colName = $($thisGrid).find('th').eq(colIdx).text();
//            }
//            //var fieldName = $($thisGrid).find('th').eq(colIdx).data('field');
//            var objField = $config.GetAllPropertiesOfField(fieldName, $thisGrid.settings.ObjectDefinitionName);
//            var isEditable = true;
//            // making element editable/ineditable as per datatype
//            switch (objField.DataType) {
//                case $.config.DataType.DateTime:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.Date:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.DropDownList:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.MultiSelectList:
//                    isEditable = false;
//                    break;
//                case $.config.DataType.SearchableDropDownList:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.GeoData:
//                    isEditable = false;
//                    break;
//                case $.config.DataType.Image:
//                    isEditable = false;
//                    break;
//                case $.config.DataType.ObjectRelationship:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.TableRelationship:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.MultiObjectRelationshipField:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.ParentRelationship:
//                    isEditable = true;
//                    break;
//                case $.config.DataType.CheckBox:
//                    isEditable = false;
//                    break;;
//                case $.config.DataType.RichTextBox:
//                    isEditable = false;
//                    break;;
//                case $.config.DataType.LinkButton:
//                    isEditable = false;
//                    break;
//                case $.config.DataType.Summary:
//                    isEditable = false;
//                    break;
//                default:
//                    isEditable = true;
//
//            }
//            return isEditable;
//        }

        /// <summary>
        /// Method to create action buttons array
        /// </summary>
        /// <param name="settings">grid parameters</param>
        function _getGridButtons(settings) {
            var gridColumn = {
                title: "",
                field: "",
                width: 75,
                viewOrder: settings.showCheckboxForRowSelection == true ? 1 : 0
            };
            var commands = [];

            if (settings.showSelectButton) {  // for select button

                var selectCommand = {};
                selectCommand.text = localizationService.translate('ColumnNames.Select');
                selectCommand.click = function (e) {
                    var dataItem = this.dataItem($(e.target).closest("tr"));
                    if (settings.onSelect == null) {
                        notificationService.showNotification("On Select function not defined.", true)
                    }
                    else {
                        settings.onSelect(dataItem);
                    }
                    return false;
                };
                commands.push(selectCommand);
            }

            if (settings.showEditButton) { // for edit button
                var editCommand = {
                    name: "Edit",
                    text: ""
                };
                editCommand.click = function (e) {
                    debugger;
                    var dataItem = this.dataItem($(e.target).closest("tr"));
                    if (settings.onEditObject == null) {
                        gridHelper.showFirstRecord(dataItem.ObjectEntry_ID, settings);
                    }
                    else {
                        settings.onEditObject(dataItem);
                    }
                    return false;
                };
                commands.push(editCommand);
            }
            if (settings.showDeleteButton) {// for delete button
                var deleteCommand = {
                    name: "Delete",
                    text: ""
                };
                deleteCommand.click = function (e) {
                    // WHY?
                    // $config.clickedEditButton = true;
                    var dataItem = this.dataItem($(e.target).closest("tr"));
                    var msg = localizationService.translate('Messages.DeleteObject');
                    if (confirm(msg)) {
                        objectService.deleteObject(dataItem.ObjectEntry_ID, settings.odn, true).then(function () {
                            var notificationMsg = localizationService.translate('Messages.RecordDeletedSuccessfully');
                            notificationService.showNotification(notificationMsg, false);
                        });
                    }
                    return false;
                };
                commands.push(deleteCommand);
            }

            gridColumn.command = commands;

            return gridColumn;
        };

        function _getGridCheckBoxColumn() {
            return {
                title: "<input id='checkAll' type='checkbox' class='check-box' />",
                template: "<input type=\"checkbox\" class='_check_row'/>",
                width: 35,
                viewOrder: 0
            };
        }

        function _getRecordFirstImageColumn(settings) {
            var gridColumn = {};
            gridColumn.title = "";//"<input id='checkAll', type='checkbox', class='check-box' />"
            gridColumn.template = '<img style="width:60px;" class="_viewObjectLargeImage" imgsrc="#= data.' + SUConstants.RecordFirstImageColumn + '#"  src=\'#=data.image_h60#\' alt="" />';
            gridColumn.width = 70;
            gridColumn.viewOrder = settings.showCheckboxForRowSelection == true ? 2 : 1;

            return gridColumn;
        }

        /// <summary>
        /// Method is used to bind True/False filter drop-down for columns those are checkBox type in Kendo ui grid.
        /// </summary>
        /// <param name="element">column element of kendo UI grid</param>
        function _getCheckBoxFilter(element) {
            var optionLabelText = localizationService.translate('Options.SelectOne');
            element.kendoDropDownList({
                dataSource: new kendo.data.DataSource({
                    data: [
                        { title: "True", value: 1 },
                        { title: "False", value: 0 }
                    ]
                }),
                dataTextField: "title",
                dataValueField: "value",
                optionLabel: optionLabelText
            });
        }

        function _getGridFieldColumn(column, settings, viewOrder) {
            var gridColumn = {};

            gridColumn.dataType = column.DataType;

            gridColumn.field = column.PropertyName;
            gridColumn.title = "<div class='wraplong' title='" + column.PropertyLabel + "'>" +
                column.PropertyLabel + "</div>";

            if (gridColumn.field == "GeoPosition" || gridColumn.field == "Address" ||
                gridColumn.field == "Picture_Location" || gridColumn.field == "GeoData_Property_Name") {
                gridColumn.width = 50;
            }
            else if (gridColumn.field == "Start_Date" || gridColumn.field == "End_Date" ||
                gridColumn.field == "Date_Property_Name") {
                gridColumn.width = 80;
            }
            else if (gridColumn.field == "Time_Property_Name") {
                gridColumn.width = 50;
            }
            // TODO: What's the hardcode for 'Arbetsorder'?
            else if (gridColumn.field == "Approved_By_WorkLeader" || gridColumn.field == "Approved_By_Employee" ||
                gridColumn.field == "Arbetsorder" || gridColumn.field == "TrueFalse_Property_Name") {
                gridColumn.width = 35;
            }
            else if (gridColumn.field == "DateTime_Property_Name" || gridColumn.field == "CreatedDate" ||
                gridColumn.field == "ChangedDate") {
                gridColumn.width = 140;
            }
            else {
                gridColumn.width = settings.columnWidth;
                gridColumn.maxwidth = settings.columnMaxWidth;
                gridColumn.minwidth = settings.columnMinWidth;
            }
            gridColumn.viewOrder = viewOrder;
            gridColumn.sortable = true;
            if (column.DataType == gConfig.dataTypes.CheckBox) {
                gridColumn.filterable = {
                    extra: false,
                    ui: _getCheckBoxFilter,
                    operators: {
                        string: {
                            eq: "Is equal to",
                            neq: "Is not equal to"
                        }
                    }
                };
            }
            var template = _getGridTemplate(column.DataType, column.PropertyName);
            if (template != '') {
                gridColumn.template = template;
            }
            // bind editor function to field
            if (settings.editable) {
                var editor;
                if (column.PropertyName != SUConstants.ObjectPropertyNameField) {
                    editor = _getFieldEditorFn(column, settings.odn, settings);
                }
                if (editor != '') {
                    gridColumn.editor = editor;
                }
            }
//            // add 'name' field click
//            if (column.PropertyName == SUConstants.ObjectPropertyNameField) {
//                gridColumn.editor = function (cell, options) {
//                    var entryId = options.model.ObjectEntry_ID;
//                    gridHelper.showFirstRecord(entryId, settings);
//                }
//            }

            return gridColumn;
        }

        /// <summary>
        /// method will bind the kendo elements
        /// </summary>
        /// <param name="container">dom element</param>
        /// <param name="options">default parameters of kendo</param>
        function _getFieldEditorFn(dataItem, odn, settings) {

            return function (container, options) {
                // get edited field (we save it in settings object every time edit starts)
                // we clicked on the other cell
                var currentEditField = settings.currentEditField;
                if (container.hasClass('clickedOutside')) {
                    // removing 'dirty' indicator
//                    container.find('.k-dirty').remove();
                    // TODO: add parameters
                    var recordId = options.model.ObjectEntry_ID;
                    var fieldPropertyFk = dataItem.PropertyDefinition_ID;

                    var value = options.model[options.field];
                    if (value) {
                        objectService.saveObjectField(odn, options.field, fieldPropertyFk,
                            value, recordId, false);
                    }
                    // unset 'currently editing' field
                    settings.currentEditField = null;
                    container.find("._grideditBlock").removeClass("_grideditBlock");
                    container.removeClass("clickedOutside");
                    // save
                } else if (currentEditField) {
                    if (currentEditField != container) {
                        // clicked outside
                        // mark edited field.
                        currentEditField.addClass('clickedOutside');
                        // find gridContainer
                        var grid = currentEditField.closest('.dynamicObjectGridContainer').data('kendoGrid');
                        // fire edit() of this cell
                        if (grid) {
                            grid.editCell(currentEditField);
                            // unset editing cell
                            settings.currentEditField = null;
                        }
                    } else {
                        // clicked the same container while editing.
                        // Do nothing
                    }
                } else {
                    // here we just start editing
                    var fieldName = dataItem.PropertyName;
                    var dataType = dataItem.DataType;

                    if (!GridColumnsService.isCellEditable(fieldName, dataType)) {
                        return false;
                    }
                    // is async, binds editors to a inline edited field
                    _startFieldEditing(container, odn, dataItem, options);
                    // set field 'is currently editing'
                    settings.currentEditField = container;
                }
            }
        }

        function _startFieldEditing(container, odn, field, options) {
            // TODO: CHECK THIS VARS
            var dataType = field.DataType;
            var propertyName = field.PropertyName;
            var inputSettings = field.InputSettings;
            var propDefId = field.PropertyDefinition_ID;

            switch (dataType) { /// binding kendo elements as per datatype
                case dataTypes.DropDownList:
                    $(container).addClass("_grideditBlock");
                    listDataLoaderService.GetListsData(inputSettings).then(function (listsData) {
                        $('<input required id="' + propertyName + '" data-text-field="Text" ' +
                            'data-value-field="Value" data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoDropDownList({
                                autoBind: false,
                                dataTextField: "Text",
                                dataValueField: "Value",
                                dataSource: listsData
                            });
                        //// To load the element if it is dependent on others as per Output settings
                        fieldService.loadCurrentElement(odn, propDefId, options.model, dataType, container);
                    }, function (error) {
                        // Do something in case ListValues are unavailable
                    });
                    break;
                case dataTypes.SearchableDropDownList:
                    $(container).addClass("_grideditBlock");
                    listDataLoaderService.GetListsData(inputSettings).then(function (listsData) {
                        $('<input required id="' + propertyName + '" data-text-field="Text" ' +
                            'data-value-field="Value" data-bind="value:' + options.field + '"/>')
                            .appendTo(container)
                            .kendoComboBox({
                                autoBind: false,
                                dataTextField: "Text",
                                dataValueField: "Value",
                                dataSource: listsData
                            });
                        //// To load the element if it is dependent on others as per Output settings
                        fieldService.loadCurrentElement(odn, propDefId, options.model, dataType, container);
                    }, function (error) {
                        // Do something in case ListValues are unavailable
                    });
                    break;
                case dataTypes.DateTime:
                    $(container).addClass("_grideditBlock");
                    $('<input  data-bind="value:' + options.field + '"/>')
                        .appendTo(container).kendoDateTimePicker({
                            format: "yyyy-MM-dd HH:mm:ss",
                            parseFormats: ["yyyy-MM-dd HH:mm:ss"]
                        });
                    break;
                case dataTypes.Date:
                    $(container).addClass("_grideditBlock");
                    $('<input  data-bind="value:' + options.field + '"/>')
                        .appendTo(container).kendoDatePicker({
                            format: "yyyy-MM-dd",
                            parseFormats: ["yyyy-MM-dd"]
                        });
                    break;
                case dataTypes.Time:
                    $(container).addClass("_grideditBlock");
                    $('<input  data-bind="value:' + options.field + '"/>')
                        .appendTo(container).kendoTimePicker({
                            format: "HH:mm",
                            parseFormats: ["HH:mm"],
                            change: function () {
                                options.model[options.field] = kendo.toString(this.value(), "HH:mm")
                            }
                        });
                    break;
                case dataTypes.NumericText:
                    $(container).addClass("_grideditBlock");
                    $('<input  data-bind="value:' + options.field + '"/>')
                        .appendTo(container).kendoNumericTextBox({
                        });
                    break;
                case dataTypes.Numeric:
                    $(container).addClass("_grideditBlock");
                    var settings = inputSettings.split(':');
                    var minVal = settings[0] == "" ? 0 : settings[0];
                    var maxVal = settings[1] == "" ? 0 : settings[1];
                    var incrementStep = settings[2] == "" ? 1 : settings[2];
                    $('<input  data-bind="value:' + options.field + '"/>')
                        .appendTo(container).kendoNumericTextBox({
                            min: minVal,
                            max: maxVal,
                            step: incrementStep
                        });
                    break;
                case dataTypes.ParentRelationship:
                case dataTypes.ObjectRelationship:
                    $(container).addClass("_grideditBlock");
                    var value = options.model[options.field];
                    value = value.split(':')[1] == undefined ? '' : value.split(':')[1];
                    var template = kendo.template('<input id="txt' + options.field + '" value="' + value + '" />');
                    $(template(options)).appendTo(container);
                    var actionButton = $('<div><input type="image" class="_objRelButton" ' +
                        'src=' + filesystemService.getPluginImageUrl("JS/img/search.png") + '  /></div>');
                    actionButton.appendTo(container);
                    actionButton.find('._objRelButton').click(function (e) {
                        e.preventDefault();
                        // TODO: define method
                        gridHelper.showRelationalRecord(dataType, inputSettings, options.field,
                            container, options.model);
                        e.stopPropagation();
                    });
                    break;
                case dataTypes.MultiObjectRelationshipField:
                    $(container).addClass("_grideditBlock");
                    var value = options.model[options.field];
                    value = value.split(':')[1] == undefined ? '' : value.split(':')[1];
                    var tmplate = kendo.template('<input id="txt' + options.field + '" value="' +
                        value + '" />');
                    $(tmplate(options)).appendTo(container);

                    var actionButton = $('<div><select id="ddl' + options.field + '">' +
                        '</select><input type="image" class="_objRelButton" ' +
                        'src=' + filesystemService.getPluginImageUrl("JS/img/search.png") + '  /></div>');
                    actionButton.appendTo(container);
                    var arr = [];
                    // TODO: check here, that field is what we want (former fieldObj)
                    var fieldProperties = field;
                    fieldProperties.PropertyName = options.field;
                    fieldProperties.PropertyValue = null;
                    arr.push(fieldProperties);
                    // TODO: also look here:
                    fieldService.initEditorField(arr, container);
//                    $.config.InitializeEditors(arr, options.field, container);
                    actionButton.find('._objRelButton').click(function (e) {
                        e.preventDefault()
                        gridHelper.showRelationalRecord(dataType, inputSettings, options.field,
                            container, options.model);
                        e.stopPropagation();
                    });
                    var ddlvalue = options.model[options.field];
                    ddlvalue = ddlvalue != undefined ? ddlvalue.split(':')[2] : null;
                    if (ddlvalue != null) {

                        var control = $(container).find("#ddl" + options.field).data("kendoDropDownList");
                        control.value(ddlvalue);
                    }
                    break;
                default:
                    $(container).addClass("_grideditBlock");
                    $('<input  data-bind="value:' + options.field + '"/>').appendTo(container);
            }
        }

        /// <summary>
        /// To get template of Kendo grid column based on datatype.
        /// </summary>
        /// <param name="dataType">dataType of property</param>
        /// <param name="propertyName">to replace @ with propertyname</param>
        function _getGridTemplate(dataType, propertyName) {
            var dataTypes = gConfig.dataTypes;
            var template = '';
            switch (dataType) {
                case dataTypes.DateTime:
                    template = _gridColumnsTemplate.DateTime.replace(/\@/g, propertyName);
                    break;
                case dataTypes.Date:
                    template = _gridColumnsTemplate.Date.replace(/\@/g, propertyName);
                    break;
                case dataTypes.Time:
                    template = _gridColumnsTemplate.Time.replace(/\@/g, propertyName);
                    break;
                case dataTypes.Image:
                    template = _gridColumnsTemplate.Image.replace(/\@/g, propertyName);
                    break;
                case dataTypes.URL:
                    template = _gridColumnsTemplate.URL.replace(/\@/g, propertyName);
                    break;
                case dataTypes.CheckBox:
                    template = _gridColumnsTemplate.Checkbox.replace(/\@/g, propertyName);
                    break;
                case dataTypes.RichTextBox:
                    template = _gridColumnsTemplate.RichTextBox.replace(/\@/g, propertyName);
                    break;
                case dataTypes.Email:
                    template = _gridColumnsTemplate.Email.replace(/\@/g, propertyName);
                    break;
                case dataTypes.MultiSelectList:
                    template = _gridColumnsTemplate.MultiSelectList.replace(/\@/g, propertyName);
                    break;
                case dataTypes.ParentRelationship:
                    template = _gridColumnsTemplate.ParentObjectRelationship.replace(/\@/g, propertyName).replace("$dataType$", dataTypes.ObjectRelationship);
                    break;
                case dataTypes.ObjectRelationship:
                    template = _gridColumnsTemplate.ObjectRelationship.replace(/\@/g, propertyName).replace("$dataType$", dataTypes.ObjectRelationship);
                    break;
                case dataTypes.TableRelationship:
                    template = _gridColumnsTemplate.TableRelationship.replace(/\@/g, propertyName).replace("$dataType$", dataTypes.ObjectRelationship);
                    break;
                case dataTypes.MultiObjectRelationshipField:
                    template = _gridColumnsTemplate.MultiObjectRelationshipField.replace(/\@/g, propertyName).replace("$dataType$", dataTypes.ObjectRelationship);
                    break;
                case dataTypes.GeoData:

                    template = _gridColumnsTemplate.GeoData.replace(/\@/g, propertyName);
                    break;
                default:
                    template = _gridColumnsTemplate.DefaultTemplateForTitle.replace(/\@/g, propertyName);
            }
            if ($.inArray(dataType, _ellipsesPropertyDataTypes) > -1) {
                if (dataType == dataTypes.ParentRelationship || dataType == dataTypes.ObjectRelationship || dataType == dataTypes.TableRelationship || dataType == dataTypes.MultiObjectRelationshipField) {
                    template = _gridColumnsTemplate.ObjectRelationshipWithellipses.replace(/\@/g, propertyName).replace("$dataType$", dataTypes.ObjectRelationship);
                }
                else {
                    template = _gridColumnsTemplate.EllipsesContent.replace(/\@/g, propertyName);
                }
            }

            // add class to recognize 'name' field
            if (propertyName == SUConstants.ObjectPropertyNameField) {
                var clsIndx = template.indexOf('class');
                if (clsIndx > -1) {
                    template = template.substr(0, clsIndx + 7) +
                        'gridNameField ' +
                        template.substr(clsIndx + 7);
                }
            }

            return kendo.template(template, { useWithBlock: false });
        }

        return GridColumnsService;
    }]);
