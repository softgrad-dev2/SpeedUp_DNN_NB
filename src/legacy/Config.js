/**
 * Created by antons on 3/10/15.
 */
var LegacyConfig = function(){

}
LegacyConfig.CancelCreateRecord = function(e){
   var od = e.data.od;
   $(od).data('kendoWindow').close();
};
LegacyConfig.RefreshGrid = function(){
    //try to refresh grid
    if(pageConfig && pageConfig.GridContainer){
        var gridContainer = '#'+pageConfig.GridContainer;
        var grid = $(gridContainer).data("kendoGrid");
        if (grid) {
            // hook not to show excess popups
            window._afterSaveInPopup = true;

            grid.refresh();
            grid.dataSource.read();
        }
    }


};
/// <summary>
/// method will display detail of object.
/// <param name="detailContainer">dom element</param>
/// <param name="recordId">record id of object</param>
/// <param name="objectDefinitionName">object definition name of object</param>
/// <param name="displayType">display type for object</param>
/// <param name="showDefaultPrintToolbar">to show print option (true or false)</param>
/// <param name="InlineEditing">inline editing whether true or false</param>
/// <param name="dataItem">json data if record already exists</param>
/// <param name="$thisGrid">Grid Object</param>
/// </summary>
LegacyConfig.ViewSingleRecordDetail4Existing = function (detailContainer, recordId, objectDefinitionName, displayType, conversionTool, showDefaultPrintToolbar, InlineEditing, dataItem, $thisGrid, appContainer) {
    var od = LegacyConfig._PrepareRecordDetail(detailContainer, recordId, objectDefinitionName, displayType, conversionTool, showDefaultPrintToolbar, InlineEditing, dataItem, $thisGrid, appContainer);

    od.settings.onCreateNewSubobject = od.AddSubobject;
    od.BindDetail(dataItem);
};
// Moved to ObjectService
/// <summary>
/// method will post data on API to save record.
/// </summary>
LegacyConfig.ObjectSaveRequest = function (e, objSchema, action) {
    var od = e.data['od'];
    $.config.JsonFetchData = "";
        var url = $config.URLs.SaveObjectWithResponseURL + "/" + $thisEditObject.settings.ObjectDefinitionName + "/" + $config.Token;
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(objSchema),
            dataType: "json",
            async: true,
            success: function (response) {

                var txt = "Exception";
                if (response.ResponseMessage.indexOf(txt) > -1) {
                    $config.ShowNotification(response, true);
                }
                else {
                    if (action == "Add") {
                        //action
                        $config.AttachmentCounter = 0;
                        if (document.getElementById('hdnTempId') != undefined && document.getElementById('hdnTempId') != null) {
                            var temporaryId = document.getElementById('hdnTempId').value;
                            var saveData = jQuery.parseJSON(response.SavedData);
                            var newRecordId = saveData[0].ObjectEntry_ID;
                            $config.SaveTemporaryAttachements($thisEditObject.settings.ObjectDefinitionName, newRecordId, temporaryId);
                        }
                    }
                    $thisEditObject.settings.ObjectEntryName = response.ObjectEntryName;
                    $thisEditObject.settings.ObjectEntryID = response.ObjectEntryID;
                    //
                    od.settings.RecordID = response.ObjectEntryID;
                    od.settings.ParentRelationshipObjectName = response.ObjectEntryName;
                    od.settings.DisplaySaveRecordButton = false;
                    od.settings.ProhibitSinglePropertyEdition = false;
                    od.settings.RefreshContent = true;
                    od.settings.onCreateNewSubobject = od.AddSubobject;

                    od.BindDetail();
                    $.fn.refreshGrid(false);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                if (respoonseCodeValue == "UnAuthorized")
                    $config.ShowNotification(xhr.getResponseHeader('ResponseCode'), true);
                else
                    $config.ShowNotification($config.URLs.SaveObjectURL + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError, true);
            }
        });

}
// Moved to objectDetailService
/// <summary>
/// method will return the edited record data.
/// </summary>
LegacyConfig.getEditedObjectData = function () {
    //ObjectEntry_ID
    var objSchema = $config.GetEmptySchema($thisEditObject.settings.ObjectDefinitionName);
    var DataType = $config.DataType;
    $('.dynamicObjectDetailContainer').find("._tbldetail ._keycontainer").each(function () {
        var key = $(this).attr("key");
        var type = $(this).attr("dtype");
        var $td = $(this);
        var value = null;
        if (key != undefined && key != null && key != "" && type != null) {
            value = $config.GetElementsValue($td, type, key);
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
    objSchema[0]["ChangedBy"] = $thisEditObject.settings.UserName;

    return objSchema;
};
/// <summary>
/// method will destroy the kendo window on close event.
/// </summary>
function window_close(e) {
    // close animation has finished playing
    $(e.sender.element).data("kendoWindow").destroy();
    $(e.sender.element).removeAttr("data-role").removeAttr("class");
    $config.tmp = null;
    window._afterSaveInPopup = false;
    // a hook to get scheduler refreshed if WY is edited
    if (window._wtEdited) {
        try{
            $.fn.NotifyGridRefresh();
        } catch(e){
            // grid notification maybe not initialized
        }
        window._wtEdited = false;
    }
};
// MOved to ObjectDetailService
LegacyConfig.SaveNewRecord = function(e){
    $thisEditObject = $("#SchedulerPopupHolder").objectEdit({
        TokenId: $.config.Token,
        UserName: $.config.UserName,
        BaseUrl: $.config.URLs.BaseUrl,
        ObjectDefinitionName: "Work_Order"
    });

        var objSchema = LegacyConfig.getEditedObjectData();
        objSchema[0]["ObjectEntry_ID"] = null;
        objSchema[0]["CreatedBy"] = $thisEditObject.settings.UserName;
        objSchema[0]["CreatedDate"] = $config.DateTimeFormat(new Date());
        LegacyConfig.ObjectSaveRequest(e, objSchema, "Add");
//        $config.ObjectRecordWithResponse = "";
//        $thisEditObject.SaveObject(e);
};
LegacyConfig.getSelected4TemplateFields = function(dataTemplate, objectDefinitionName, pageTemplateName){

    var objPage = $.config.GetObjectTemplateSettings(objectDefinitionName, pageTemplateName);
    //var objPage = $config.GetPageTemplateObjByObjectDefinitionName($thisEditObject.settings.ObjectDefinitionName);
    var dataItem = {};
    if (objPage.length > 0) {
        var SelectedColumnsArrayList = objPage[0].SelectedColumnsForTemplate.split(",");
        dataTemplate.forEach(function(value){
            if($.inArray(value["PropertyName"], SelectedColumnsArrayList)){
                dataItem[value["PropertyName"]] = value["PropertyValue"];
            }
        });

        dataItem["ObjectEntry_ID"] = "newEntry";
    };

    return [dataItem];
};
LegacyConfig.GetEmptyDataItem = function(ObjectDefinitionName, PageTemplateName, container){
    var emptyObjectSchema = "";
    emptyObjectSchema = $config.EmptySchema(ObjectDefinitionName);
    var dataArrary = [];
    var filledRelationalProperty = false;
    dataArrary.Maps = new Array();
    dataArrary.Summary = new Array();
    $.each(emptyObjectSchema, function (key1, val1) {  //// loping object schema and empting the values to set default values in it
        // $thisEditObject.currentRecordDetail = val1;
        $.each(val1, function (key, val) {
            var objField = "";
            objField = $config.GetAllPropertiesField(key, ObjectDefinitionName);

            if (objField != null && objField.PropertyLabel != undefined) {
                if (key == "CreatedDate" || key == "ChangedDate") {
                    $(container).find("#txtdateTime" + key).val("");
                }
                else {
                    if (objField.DataType == $config.DataType.Date) {
                        objField.DefaultValue = "";
                    }
                    else if (objField.DataType == $config.DataType.DateTime) {
                        // way of obtaining a start and end-date
                        // for scheduler popup
                        if ($config.tmp && $config.tmp["startDate"]) {
                            var sd = $config.tmp["startDate"]
                            if (key == sd["startKey"]) {
                                objField.DefaultValue = $config.DateTimeFormat(sd["startTime"]);
                                sd["startTime"] = null;
                            } else if (key == sd["endKey"]) {
                                objField.DefaultValue = $config.DateTimeFormat(sd["endTime"]);
                                sd["endTime"] = null;
                            }
                            if (sd["endTime"] == null && sd["startTime"] == null) {
                                $config.tmp = null;
                            }
                        }
                        else{
                            objField.DefaultValue = $config.DateTimeFormat(new Date());
                        }
                        //alert(objField.DefaultValue);
                    }
                    else if (objField.DataType == $config.DataType.Time) {
                        objField.DefaultValue = kendo.toString(new Date(), "HH:mm");
                        //alert(objField.DefaultValue);
                    }
                }

                objField.PropertyValue = objField.DefaultValue;
                if ((objField.DataType == $config.DataType.ParentRelationship || objField.DataType == $config.DataType.ObjectRelationship || objField.DataType == $config.DataType.MultiObjectRelationshipField) && container.settings.ParentRelationshipRecordId != null) {
                    //if (filledRelationalProperty == false) {
                    //    objField.PropertyValue = container.settings.ParentRelationshipRecordId + ":" + container.settings.ParentRelationshipObjectName;
                    //    filledRelationalProperty = true;
                    //    //filledRelationalProperty = false;
                    //}
                    if (objField.InputSettings != "" && objField.InputSettings != null && objField.InputSettings != undefined) {

                        var splitinpursetting = objField.InputSettings.split(":");
                        if (splitinpursetting[0] != "" && splitinpursetting[0] != null && splitinpursetting[0] != undefined) {
                            if (container.settings.ParentObject.currentRecordDetail[0].ObjectDefinition_fk != "") {
                                if (splitinpursetting[0] == container.settings.ParentObject.currentRecordDetail[0].ObjectDefinition_fk) {
                                    objField.PropertyValue = container.settings.ParentRelationshipRecordId + ":" + container.settings.ParentRelationshipObjectName;
                                }
                            }
                        }
                    }
                }

                //default values for controls in case of new record.
                objField.PropertyName = key;
                objField.UniqueKey = container.settings.RecordID;
                objField = $config.SetValuesForElements(objField, key);
                if (objField.DataType == $config.DataType.GeoData) {
                    dataArrary.Maps.push(objField);
                }
                else if (objField.DataType == $config.DataType.Summary) {
                    dataArrary.Summary.push(objField);
                }
                else
                    dataArrary.push(objField);
            }
        });
    });

    dataArrary.ImageUrl = $config.GetPluginImageUrl("JS/img/NoImage.jpg");

    return dataArrary;
};

LegacyConfig._PrepareRecordDetail = function (detailContainer, recordId, objectDefinitionName, displayType, conversionTool, showDefaultPrintToolbar, InlineEditing, dataItem, $thisGrid, appContainer) {

    return $(detailContainer).objectDetail({
        TokenId: $config.Token,
        UserName: $config.UserName,
        BaseUrl: $config.URLs.BaseUrl,
        ObjectDefinitionName: objectDefinitionName,
        RecordID: recordId,
        InlineEditing: InlineEditing,
        PopupMaxHeight: 500,
        DisplayType: displayType,
        ShowDefaultPrintToolBar: showDefaultPrintToolbar,
        ParentObject: $thisGrid,
        PageTitle: $thisGrid.PageTitle,
        PageTemplateName: $thisGrid.settings.PageTemplateName,
        CopiedFromScheduler: true,
        DetailContainer: detailContainer,
        AppContainer: appContainer
    });
}

LegacyConfig.ViewSingleRecordDetail4New = function (detailContainer, recordId, objectDefinitionName, displayType, conversionTool, showDefaultPrintToolbar, InlineEditing, dataItem, $thisGrid, appContainer) {

    var od = LegacyConfig._PrepareRecordDetail(detailContainer, recordId, objectDefinitionName, displayType, conversionTool, showDefaultPrintToolbar, InlineEditing, dataItem, $thisGrid, appContainer);

    od.settings.DisplaySaveRecordButton = true;
    od.settings.ProhibitSinglePropertyEdition = true;

    var dataItemTemplate = LegacyConfig.GetEmptyDataItem(objectDefinitionName, $thisGrid.settings.PageTemplateName, od);
    var dataItemSelected = LegacyConfig.getSelected4TemplateFields(dataItemTemplate, objectDefinitionName, $thisGrid.settings.PageTemplateName)
    // DEBUG
    console.log(JSON.stringify(dataItemTemplate));
    console.log(JSON.stringify(dataItemSelected));
    var bindSaveBtnClick = function(){
        $('._btnCreateRecord').bind('click', { "od":od }, LegacyConfig.SaveNewRecord);
        $('._btnCancelCreateRecord').bind('click', { "od":od }, LegacyConfig.CancelCreateRecord);
    };
    LegacyConfig.BindDetailWOSubobjects(od, dataItemSelected).then(bindSaveBtnClick);

};

LegacyConfig.BindDetailWOSubobjects = function (od, dataItem, callback) {
    var d = $.Deferred();
    var callbackDisplayDetail = $.proxy(LegacyConfig.ObjectDetail, this, od, dataItem, callback);
    $config.GetObjectHeadersDeferred($config.URLs.SchemaURL, od.settings.ObjectDefinitionName).then(callbackDisplayDetail).then(d.resolve());

    return d;
};
// MOVED TO ObjectDetailService (and distributed for parts)
/// <summary>
/// Method will bind the object
/// Whenever an object need to display this method will call
/// Settings will get in this method for the object and as per the settings SubObjects will bind
/// </summary>
LegacyConfig.ObjectDetail = function (od, dataItem) {

    $config.Settings(od.settings.BaseUrl, od.settings.TokenId, od.settings.UserName).Init();

    var dataAlreadyPassed = false;
    $.config.SelectedPageTemplateName = od.settings.PageTemplateName;

    var jsonSettings = od.GetObjectTemplateSettings(od.settings.ObjectDefinitionName, od.settings.PageTemplateName); // fetching settings of object from api

    if (!$(od).hasClass('dynamicObjectDetailContainer')) $(od).addClass('dynamicObjectDetailContainer');
    var $TabStriptemplate = kendo.template($("#TabStriptemplate").html(), { useWithBlock: false });
    var objsubObject = $config.GetSubObjectByObjectDefinitionName(od.settings.ObjectDefinitionName);
    var tabdata = [];
    var tabsarr = [];
    var SubObjectsInTabs = [], SubObjectsUnderMainRecord = [];
    var combinedObjects = [];
    var objtab = new Object();
    if (objsubObject == null || objsubObject.SubObjectsObject == null || objsubObject.SubObjectsObject.length == 0) {
        objtab.IsMoreTabs = false;
        objtab.tabs = [{ "NoSubObjectTabs": "NoSubObjectTabs" }];
        objtab.ShowTabs = true;
    }
    else {
        if (jsonSettings != null && jsonSettings != "") {

            od.RelatedObjectDisplayType = jsonSettings[0].RelatedObjectDisplayType;
            tabsarr = od.GetRelatedObjects(jsonSettings[0].SelectedRelatedObjectsForTemplate);

            /// As per settings returned from api, pushing subobjects in a variable to show objects in tab
            for (var i = 0; i < tabsarr.length; i++) {
                $.each(objsubObject.SubObjectsObject, function () {
                    if (tabsarr[i] == this.ObjectDefinitionName) {
                        SubObjectsInTabs.push(this);
                        combinedObjects.push(this);
                        //SubObjectsUnderMainRecord.push(this);
                    }
                });
            }

            /// As per settings returned from api, pushing subobjects in a variable to show objects under the main record
            var DataMainRecordArr = od.GetRelatedObjects(jsonSettings[0].RelatedObjectUnderMainRecord);
            for (var i = 0; i < DataMainRecordArr.length; i++) {
                $.each(objsubObject.SubObjectsObject, function () {
                    if (DataMainRecordArr[i] == this.ObjectDefinitionName) {
                        SubObjectsUnderMainRecord.push(this);
                        combinedObjects.push(this);
                        var objUTRO = new Object();
                        objUTRO.ObjectDefinitionName = this.ObjectDefinitionName;
                        objUTRO.PropertyName = this.PropertyName;
                        od.UnderTheRecordObjects.push(objUTRO)
                    }
                });
            }
        }

        objtab.IsMoreTabs = true;
        objtab.tabs = SubObjectsInTabs;
        objtab.ShowTabs = true;
    }

    objtab.IsAttachments = false;

    /// Seperately checking of Document & Attachment tabs as per settings retuned from api
    for (var i = 0; i < tabsarr.length; i++) {

        if (tabsarr[i] == "DocumentsAndAttachements") {
            objtab.IsAttachments = true;
        }
    }

    objtab.DisplaySubObjectRecordAddButton = false;
    tabdata.push(objtab);


    var tabstrip = $(kendo.render($TabStriptemplate, tabdata));
    tabstrip.kendoTabStrip({
        select: od.onSelectTab,
        animation: false
    });

    if (od.settings.DisplayType == $config.DetailDisplayType.ShowInPopup) {
        var title = "Details"
        if (od.settings.PageTitle) {
            title = od.settings.PageTitle
        }
        var left = ($(window).width() - od.settings.PopupWidth) / 2 + "px";
        wnd = $(od)
            .kendoWindow({
                title: title,
                modal: true,
                visible: false,
                resizable: false,
                maxHeight: od.settings.PopupMaxHeight,
                minHeight: 300,
                width: od.settings.PopupWidth,
                position: { top: "50px", left: left },
                actions: ["Pin", "Minimize", "Maximize", "Close"]
            }).data("kendoWindow");
        wnd.bind("close", window_close);
        wnd.content(tabstrip);
        wnd.setOptions({
            title: title
        });

        wnd.wrapper.addClass("addeditobjectwindow")
        wnd.open();

        od.DisplayRecordDetail(dataItem, true);

        var $div = $("<div class='_actionscontainer'>");
        var translatedObjName = $config.CreatePageTitle(od.settings.ObjectDefinitionName, "");

        od.prepend("<div class='ContainerHeader'><div class='leftHeader'>" + translatedObjName + "</div></div>");

        od.find(".ContainerHeader").append($div);

        /// Binding Action list on the header of object
        var globalODN = $("input[id$='hfObjectName']").val();
        if(od.settings.ObjectDefinitionName == globalODN){
            var cpFn = od.CopyParentObject;
            var delFn = od.DeleteParentObject;
            var recordContainer = null;
        } else{
            var cpFn = od.CopyChildObject;
            var delFn = od.DeleteSubObject;
            var recordContainer = $div.closest('._subobjectdetailcontainer');
        }

        od.BindObjectsUnderTheMainRecord(SubObjectsUnderMainRecord, jsonSettings);
    }
    var recordName = od.currentRecordDetail[0] == undefined ? "" : od.currentRecordDetail[0].Name;
    od.find("._recordname").text(recordName);
    od.settings.ParentRelationshipObjectName = recordName;

}