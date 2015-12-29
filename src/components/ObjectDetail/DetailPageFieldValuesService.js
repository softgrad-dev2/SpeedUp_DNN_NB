/**
 * Created by antons on 7/1/15.
 */
speedupObjectDetailModule.factory('detailPageFieldValuesService', ['configService', 'dateTimeService', 'schemaService',
    function (configService, dateTimeService, schemaService) {
        var gConfig = configService.getGlobalConfig();

        var DetailPageFieldValuesService = function () {
        };

        /// <summary>
        /// Method will set a different object values based on datatype and will return the object
        /// </summary>
        /// <param name="objField">has array of field properties</param>
        /// <param name="key">has property or field name</param>
        DetailPageFieldValuesService.setValuesForElements = function (objField, key) {
            var DataType = gConfig.dataTypes;
            var latitude = "";
            var longitude = "";
            var address = "";
            var mapzoom = "";
            var mapType = "";
            var objectId = "";
            var objectName = "";
            //objField.LabelValue = objField.PropertyValue != undefined && objField.PropertyValue != null ? $.trim(objField.PropertyValue) : "";
            objField.LabelValue = objField.PropertyValue != undefined && objField.PropertyValue != null ? $.trim(objField.PropertyValue.toString()) : "";
            switch (objField.DataType) {
                case DataType.GeoData:
                    var latlng = objField.PropertyValue != null ? objField.PropertyValue.split(":") : "";
                    if (latlng.length > 0) {
                        latitude = latlng[0] == undefined ? "" : latlng[0];
                        longitude = latlng[1] == undefined ? "" : latlng[1];
                        address = latlng[2] == undefined ? "" : latlng[2];
                        mapzoom = latlng[3] == undefined ? "" : latlng[3];
                        mapType = latlng[4] == undefined ? "" : latlng[4];
                    }
                    objField.Latitude = latitude;
                    objField.Longitude = longitude;
                    objField.Address = address;
                    objField.MapZoom = mapzoom;
                    objField.MapType = mapType;
                    objField.Mapdiv = schemaService.UniqueId("mapdiv" + objField.UniqueKey + key);
                    objField.LatField = "txtLat" + objField.UniqueKey + key;
                    objField.LongField = "txtLong" + objField.UniqueKey + key;
                    objField.AddressField = "txtAdd" + objField.UniqueKey + key;
                    objField.MapTypeField = "hdnMapType" + objField.UniqueKey + key;
                    objField.MapZoomField = "hdnZoom" + objField.UniqueKey + key;
                    objField.LabelValue = address;
                    break;
                case DataType.ObjectRelationship:
                    var objRel = objField.PropertyValue != null ? objField.PropertyValue.split(":") : "";
                    if (objRel.length > 0) {
                        objectId = objRel[0] == undefined ? "" : objRel[0];
                        objectName = objRel[1] == undefined ? "" : objRel[1];
                    }
                    objField.ObjectId = objectId;
                    objField.ObjectName = objectName;
                    objField.LabelValue = objectName;
                    break;
                case DataType.ParentRelationship:
                    var objRel = objField.PropertyValue != null ? objField.PropertyValue.split(":") : "";
                    if (objRel.length > 0) {
                        objectId = objRel[0] == undefined ? "" : objRel[0];
                        objectName = objRel[1] == undefined ? "" : objRel[1];
                    }
                    objField.ObjectId = objectId;
                    objField.ObjectName = objectName;
                    objField.LabelValue = objectName;
                    break;
                case DataType.MultiObjectRelationshipField:
                    var objRel = objField.PropertyValue != null ? objField.PropertyValue.split(":") : "";
                    if (objRel.length > 0) {
                        objectId = objRel[0] == undefined ? "" : objRel[0];
                        objectName = objRel[1] == undefined ? "" : objRel[1];
                    }
                    objField.ObjectId = objectId;
                    objField.ObjectName = objectName;
                    objField.LabelValue = objectName;
                    break;
                case DataType.TableRelationship:
                    var objRel = objField.PropertyValue != null ? objField.PropertyValue.split(":") : "";
                    if (objRel.length > 0) {
                        objectId = objRel[0] == undefined ? "" : objRel[0];
                        objectName = objRel[1] == undefined ? "" : objRel[1];
                    }
                    objField.ObjectId = objectId;
                    objField.ObjectName = objectName;
                    objField.LabelValue = objectName;
                    break;
                default:

            }
            return objField;
        };
        /// <summary>
        /// Method will return a values of elements based on datatype
        /// </summary>
        /// <param name="element">html element</param>
        /// <param name="type">has DataType of field</param>
        /// <param name="key">has property or field name</param>
        DetailPageFieldValuesService.getElementsValue = function (element, type, key) {
            var $td = element;
            var control = null;
            var value = null;
            var DataType = gConfig.dataTypes;
            switch (type) {
                case DataType.DateTime:
                    control = $td.find("#txtdateTime" + key).data("kendoDateTimePicker");
                    value = control == undefined || control == null ? undefined : dateTimeService.DateTimeFormat(control.value());
                    break;
                case DataType.Date:
                    control = $td.find("#txtdate" + key).data("kendoDatePicker");
                    value = control == undefined || control == null ? undefined : dateTimeService.DateFormat(control.value());
                    break;
                case DataType.Time:
                    control = $td.find("#txttime" + key).data("kendoTimePicker");
                    value = control == undefined || control == null ? undefined : kendo.toString(control.value(), "HH:mm");
                    break;
                case DataType.GeoData:
                    var seprator = ":";
                    var latitude, longitude, address, mapZoom, mapType;
                    latitude = $td.find("._maplatfield").val();
                    longitude = $td.find("._maplongfield").val();
                    address = $td.find("._mapaddressfield").val();
                    mapType = $td.find("._maptypefield").val();
                    mapZoom = $td.find("._mapzoomfield").val();
                    if (latitude != undefined && latitude != null) {
                        value = latitude + seprator + longitude + seprator + address + seprator + mapZoom + seprator + mapType;
                    }
                    else {
                        value = undefined;
                    }
                    break;
                //case DataType.Image:
                //    value = null;
                //    break;
                case DataType.URL:
                    value = $td.find("#txt" + key).val();
                    break;
                case DataType.CheckBox:
                    value = $td.find("#chk" + key).is(":checked");
                    value = value == true ? 1 : 0;
                    break;
                case DataType.RichTextBox:
                    control = $td.find("#richtxt" + key).data("kendoEditor");
                    value = control == undefined || control == null ? undefined : control.value();
                    break;
                case DataType.Email:
                    value = $td.find("#txt" + key).val();
                    break;
                case DataType.DropDownList:

                    control = $td.find("#" + key).data("kendoDropDownList");
                    value = control == undefined || control == null ? undefined : control.value();
                    break;
                case DataType.MultiSelectList:
                    control = $td.find("#" + key).data("kendoMultiSelect");
                    value = control == undefined || control == null ? undefined : control.value().join(',');
                    break;
                case DataType.SearchableDropDownList:
                    control = $td.find("#" + key).data("kendoComboBox");
                    value = control == undefined || control == null ? undefined : control.value();
                    break;
                case DataType.NumericText:
                    control = $td.find("#txtNum" + key).data("kendoNumericTextBox");
                    value = control == undefined || control == null ? undefined : control.value();
                    break;
                case DataType.Numeric:
                    control = $td.find("#txtNum" + key).data("kendoNumericTextBox");
                    value = control == undefined || control == null ? undefined : control.value();
                    break;
                case DataType.ObjectRelationship:
                    var id = $td.find("#hdn" + key).val();
                    var text = $td.find("#txt" + key).val();
                    if (id != undefined)
                        value = id + ":" + text;
                    else
                        value = undefined;
                    break;
                case DataType.ParentRelationship:
                    var id = $td.find("#hdn" + key).val();
                    var text = $td.find("#txt" + key).val();
                    if (id != undefined)
                        value = id + ":" + text;
                    else
                        value = undefined;
                    break;
                case DataType.MultiObjectRelationshipField:
                    var id = $td.find("#hdn" + key).val();
                    var text = $td.find("#txt" + key).val();

                    var dropdownList = $td.find("#ddl" + key).data("kendoDropDownList");
                    var objdefId = dropdownList != null ? dropdownList.value() : undefined;
                    var objdef = dropdownList != null ? dropdownList.text() : undefined;
                    if (id != undefined)
                        value = id + ":" + text + ":" + objdefId + ":" + objdef;
                    else
                        value = undefined;
                    break;
                default:
                    value = $td.find("#txt" + key).val();
            }
            return value;
        };


        return DetailPageFieldValuesService;
    }
]);