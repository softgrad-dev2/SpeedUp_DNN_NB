/**
 * Created by antons on 6/10/15.
 */
CSVapp.factory('fieldService', [ 'configService', 'listDataLoaderService', 'autocompleteService',
    'schemaService',
    function (configService, listDataLoaderService, autocompleteService, schemaService) {

        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        var _readOnlyFields = ['CreatedBy', 'CreatedDate', 'ChangedDate', 'ChangedBy', 'ChangedName',
            'OrganizationID', 'PortalID', 'OwnerID', 'RecordType'];
        var _nonEditableDataTypes = [
            dataTypes.MultiSelectList,
            dataTypes.GeoData,
            dataTypes.Image,
            dataTypes.CheckBox,
            dataTypes.RichTextBox,
            dataTypes.LinkButton,
            dataTypes.Summary
        ];

        var FieldService = function () {
        };
        // Not CHECKED
        /// <summary>
        /// method will load the current element data as per output settings
        /// <param name="definitionname">object definition name</param>
        /// <param name="propertyid">propertyid of element</param>
        /// <param name="currentrecorddetail">record detail of current object</param>
        /// <param name="datatype">datatype of element</param>
        /// <param name="container">container containing elements ie. dom element</param>
        /// </summary>
        FieldService.loadCurrentElement = function (odn, propertyid, currentrecorddetail, datatype, container) {
            var arrlistrecord = [], arrexpressionlist = [];
            return schemaService.getSchema(odn).then(function (schemaObject) {
                    var columnsList = schemaObject.AllColumnsList;
                    schemaService.getDropDownListOutputSettings().forEach(function (item, key) {
                        if (item.DefinitionName == odn && item.PropertyId == propertyid) {
                            if (this.Data) {
                                $.each(this.Data, function () {
                                    var conditionalPropertyId = this.PropertyId;
                                    var objField = columnList.filter(function (obj) {
                                        if ("{" + obj.PropertyDefinition_ID + "}" == conditionalPropertyId) {
                                            return obj;
                                        }
                                    })[0];
                                    if (objField != undefined && objField != null) {
                                        var propertyValue = "";
                                        $.each(currentrecorddetail, function (k, v) {
                                            if (k == objField.PropertyName) {
                                                propertyValue = v;
                                                return true;
                                            }
                                        });

                                        if (objField.DataType == $.config.DataType.ObjectRelationship) {
                                            var data = propertyValue.split(":");
                                            propertyValue = data[data.length - 1];
                                        }
                                        var validateexpression = $config.FillValuesInExpression(definitionname, this.Expression, conditionalPropertyId, propertyValue, container);
                                        var obj = new Object();
                                        obj.Expression = validateexpression;
                                        obj.PropertyName = item.PropertyName;
                                        obj.List = this.List;
                                        obj.DataType = item.DataType;
                                        arrlistrecord.push(obj);

                                        obj = new Object();
                                        obj.ValidationExpression = validateexpression;
                                        arrexpressionlist.push(obj);

                                    }
                                });
                            }
                        }
                    });
                }
            );
        };

        FieldService.isDataTypeEditable = function (dataType) {
            return $.inArray(dataType, _nonEditableDataTypes) == -1;
        };

        /// <summary>
        /// Method will check if field is 'read only'
        /// </summary>
        /// <param name="field">field name</param>
        FieldService.isFieldReadOnly = function (field) {
            return ($.inArray(field, _readOnlyFields) > -1) ||
                field.DataType == dataTypes.Formula ||
                field.DataType == dataTypes.Summary ;
        };
        // TODO: Move 'new' methods to another service
        // checked
        /// <summary>
        /// Method will initialize all controls based on datatype
        /// </summary>
        /// <param name="fields">has array of properties of selected PropertyName </param>
        /// <param name="container">container for form with input fields ($element of directive)</param>
        FieldService.initializeEditors = function (fields, container) {
            if (fields != undefined) {
                $.each(fields, function (key, field) {
                    FieldService.initEditorField(field, container);
//                    $config.BindFieldEventIfConditional(container, propertyName, val.PropertyDefinition_ID, dataType, inlineEditingKey);
                });
            }
        };
        // CHECKED
        FieldService.initEditorField = function (field, container, acData) {

            var DataTypes = gConfig.dataTypes;
            var dataType = field.DataType;
            var listName = field.InputSettings;
            var propertyName = field.PropertyName;
            var propertyValue = field.PropertyValue;
            var propertyDefinitionId = field.PropertyDefinition_ID;

            switch (dataType) {
                case DataTypes.TextBox:
                    _bindTextArea(container, propertyName);
                    break;
                case DataTypes.ObjectRelationship:
                case DataTypes.ParentRelationship:
                    // get related property name
                    var relatedPropertyName = listName ? listName.split(":")[1] : null;
                    _bindRelatedField(container, propertyName, relatedPropertyName, propertyDefinitionId, acData);
                    break;
                case DataTypes.MultiSelectList:
                    _bindSelectList(container, propertyName, propertyValue, listName);
                    break;
                case DataTypes.SearchableDropDownList:
                    _bindSearchableDDL(container, propertyName, propertyValue, listName);
                    break;
                case DataTypes.DropDownList:
                    _bindDropDown(container, propertyName, propertyValue, listName);
                    break;
                case DataTypes.MultiObjectRelationshipField:
                    _bindMultiObjectRelationshipField(container, propertyName, listName);
                    break;
                case DataTypes.DateTime:
                    _bindDateTimeField(container, propertyName, propertyValue);
                    break;
                case DataTypes.Date:
                    _bindDateField(container, propertyName, propertyValue);
                    break;
                case DataTypes.Time:
                    _bindTimeField(container, propertyName, propertyValue);
                    break;
                case DataTypes.RichTextBox:
                    _bindRichTextBox(container, propertyName, propertyValue);
                    break;
                case DataTypes.NumericText:
                    _bindNumericTextField(container, propertyName, propertyValue);
                    break;
                case DataTypes.Numeric:
                    _bindNumericField(container, propertyName, propertyValue, listName);
                    break;
                default:
            }
        };
        /*PRIVATE METHODS*/

        var _bindTextArea = function(container, propertyName){
            var widget = container.find("#txt" + propertyName);
            widget.text($.trim(widget.text()));
        }
        var _bindMultiObjectRelationshipField = function (container, propertyName, listNamesStr) {
            var list;
            var dataArray = [];
            var lists = listNamesStr.split(';')
            if (lists.length > 0) {
                $.each(lists, function (key, value) {
                    list = value.split(':')
                    if (list.length > 0) {
                        dataArray.push({
                            Value: list[0],
                            Text: list[1]
                        });
                    }
                });
            }

            var control = container.find("#ddl" + propertyName).data("kendoDropDownList");
            if (control == undefined || control == null) {
                container.find("#ddl" + propertyName).kendoDropDownList({
                    dataTextField: "Text",
                    dataValueField: "Value",
                    filter: "contains",
                    ignoreCase: true,
                    dataSource: dataArray
                });
            }
        };

        var _bindDropDown = function (container, propertyName, propertyValue, listName) {
            var control = container.find("#" + propertyName).data("kendoDropDownList");
            if (!control) {
                listDataLoaderService.GetListsData(listName).then(function (data) {
                    var dataWithEmpty = listDataLoaderService.addEmptyListValue(data);
                    var options = {
                        dataTextField: "Text",
                        dataValueField: "Value",
                        ignoreCase: true,
                        dataSource: dataWithEmpty
                    };
                    if(propertyValue){
                        options.value = propertyValue;
                    }
                    if (!gConfig.mobileView) {
                        options.filter = "contains";
                        options.optionLabel = " ";
                    }
                    control = container.find("#" + propertyName).kendoDropDownList(options);

                });
            }
            else {
                control.value(propertyValue || "")
            }
        };

        var _bindSelectList = function (container, propertyName, propertyValue, listName) {
            var control = container.find("#" + propertyName).data("kendoMultiSelect");
            var text = propertyValue ? propertyValue.split(",") : "";
            if (control == undefined || control == null) {
                listDataLoaderService.GetListsData(listName, true).then(function (data) {
                    var options = {
                        dataTextField: "Text",
                        dataValueField: "Value",
                        filter: "contains",
                        ignoreCase: true,
                        dataSource: data
                    };
                    if(text){
                        options.value = text;
                    }
                    control = container.find("#" + propertyName).kendoMultiSelect(options);
                });
            }
            else {
                control.value(text)
            }
        };
        var _bindSearchableDDL = function (container, propertyName, propertyValue, listName) {
            var control = container.find("#" + propertyName).data("kendoComboBox");
            var text = propertyValue || "";
            if (control == undefined || control == null) {
                listDataLoaderService.GetListsData(listName, true).then(function (data) {
                    var options = {
                        dataTextField: "Text",
                        dataValueField: "Value",
                        filter: "contains",
                        ignoreCase: true,
                        dataSource: data,
                        optionLabel: " "
                    };
                    if(text){
                        options.value = text;
                    }
                    control = container.find("#" + propertyName).kendoComboBox(options);
                });
            }
            else {
                control.value(text)
            }
        };
        var _bindRelatedField = function (container, propertyName, relatedObjectName, pid, acData) {
            var field = container.find("#txt" + propertyName);
            autocompleteService.wrapElement(container, field, propertyName, pid, acData, null, function () {
                // save property on selection of value
                // (we do click to save inline value)
                container.click();
            }, false, relatedObjectName);
            //container.find("#txt" + propertyName).css("width", "inherit");
            //container.find("#txt" + propertyName).parent().attr('style', 'padding: 0px !important');
        };
        var _bindDateTimeField = function (container, propertyName, propertyValue) {
            var control = container.find("#txtdateTime" + propertyName).data("kendoDateTimePicker");
            if (control == undefined || control == null) {
                control = container.find("#txtdateTime" + propertyName).kendoDateTimePicker({
                    format: "yyyy-MM-dd HH:mm:ss",
                    parseFormats: ["yyyy-MM-dd HH:mm:ss"]
                });
            }
            else {
                control.value(propertyValue);
            }
        };
        var _bindDateField = function (container, propertyName, propertyValue) {
            var control = container.find("#txtdate" + propertyName).data("kendoDatePicker");
            if (control == undefined || control == null) {
                container.find("#txtdate" + propertyName).kendoDatePicker({
                    format: "yyyy-MM-dd",
                    parseFormats: ["yyyy-MM-dd"]
                });
            }
            else {
                control.value(propertyValue);
            }
        };
        var _bindTimeField = function (container, propertyName, propertyValue) {
            var control = container.find("#txttime" + propertyName).data("kendoTimePicker");
            if (control == undefined || control == null) {
                container.find("#txttime" + propertyName).kendoTimePicker({
                    format: "HH:mm",
                    parseFormats: ["HH:mm"]
                });
            }
            else {
                control.value(propertyValue);
            }
            // control.value = val.PropertyValue;
        };
        var _bindRichTextBox = function (container, propertyName, propertyValue) {
            var control = container.find("#richtxt" + propertyName).data("kendoEditor");
            if (control == undefined || control == null) {
                container.find("#richtxt" + propertyName).kendoEditor({
                    tools: [
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "justifyLeft",
                        "justifyCenter",
                        "justifyRight",
                        "justifyFull",
                        "insertUnorderedList",
                        "insertOrderedList",
                        "indent",
                        "outdent",
                        "createLink",
                        "unlink",
                        "insertImage",
                        "subscript",
                        "superscript",
                        "createTable",
                        "addRowAbove",
                        "addRowBelow",
                        "addColumnLeft",
                        "addColumnRight",
                        "deleteRow",
                        "deleteColumn",
                        "viewHtml",
                        "formatting",
                        "fontName",
                        "fontSize",
                        "foreColor",
                        "backColor"
                    ]
                });
            }
            else {
                control.value(propertyValue);
            }
        };
        var _bindNumericTextField = function (container, propertyName, propertyValue) {
            var control = container.find("#txtNum" + propertyName).data("kendoNumericTextBox");
            if (control == undefined || control == null) {
                container.find("#txtNum" + propertyName).kendoNumericTextBox({
                    value: propertyValue
                });
            }
            else {
                control.value(propertyValue);
            }
        }
        var _bindNumericField = function (container, propertyName, propertyValue, listName) {
            var settings = listName.split(':');
            var minVal = settings[0] == "" ? 0 : settings[0];
            var maxVal = settings[1] == "" ? 0 : settings[1];
            var incrementStep = settings[2] == "" ? 1 : settings[2];
            var control = container.find("#txtNum" + propertyName).data("kendoNumericTextBox");
            if (control == undefined || control == null) {
                container.find("#txtNum" + propertyName).kendoNumericTextBox({
                    min: minVal,
                    max: maxVal,
                    step: incrementStep,
                    value: propertyValue
                });
            }
            else {
                control.value(propertyValue);
            }
        }

        return FieldService;
    }]);
