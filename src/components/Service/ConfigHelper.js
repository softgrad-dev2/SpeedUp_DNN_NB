/*
 * Created by C4off on 24.03.15.
 */
var GCPostData =  {
    ObjectDefinitionName: "",
    RecordID: "",
    PageNumber: "",
    PageSize: "",
    OrderByExpression: "",
    Token: "",
    RequestType: "",
    Clear: function () {
        this.ObjectDefinitionName = undefined;
        this.RecordID = undefined;
        this.PageNumber = undefined;
        this.PageSize = undefined;
        this.OrderByExpression = undefined;
        this.Token = undefined;
        this.RequestType = "";
    }
};

var GCUrls = {
    'batchEdit': 'BatchEdit',
    'getFilters': "ObjectFilterList",
    'getObjectModuleUserSettings': "GetObjectModuleUserSettings",
    'updateObjectModuleUserSettings': "UpdateObjectModuleUserSettings",
    'saveObjectField': "ObjectPropertyValue",
    'getObjectSchema' : "ObjectPropertyDefinition",
    'fetchListData': "ObjectListValues",
    'fetchMultipleObjectListData': 'MultipleObjectListValues',
    'deleteObjectRecord': "DeleteObjectRecord",
    'objectRecordList': "ObjectRecordList",
    'objectPageLayout': "ObjectPageLayout",
    'documentsAndAttachments': "DocumentsAndAttachements",
    'documentsAndAttachementsTemporary': "DocumentsAndAttachementsTemporary",
    'deleteAttachment': "DeleteDocumentsAndAttachements",
    'objectDefinition': "ObjectDefinition",
    'getSubObjects': "ObjectSubObjectList",
    'saveObjectWithResponse': 'ObjectRecordWithResponse',
    'objectRecordsCount': 'ObjectRecordListCount',
    'copyRecordWithChildren': 'CopyRecordWithChildren',
    'repeatedRecordWithChildren': 'RepeatedRecordCopyWithChildren',
    'objectConversionList': 'ObjectConversionList',
    'runObjectConversion': 'RunObjectConversion',
    'objectPrintTemplateList': 'ObjectPrintTemplateList',
    'objectPrintTemplateHTML': 'ObjectPrintTemplateHTML',
    'saveTemporaryAttachments': 'MoveDocumentsAndAttachementsTemporary'
};

var GCCookies = {
    "CookieFilterOpened" : "FilterOpened",
    "CookieAdvancedSearchTabOpened" : "AdvancedSearchTabOpened"
};

var GCFieldDataTypes = {
    "Date" : "Date",
    "DateTime" : "DateTime",
    "Text" : "Text",
    "AutoText" : "AutoText",
    "TextBox" : "TextBox",
    "DropDownList" : "DropDownList",
    "SearchableDropDownList" : "SearchableDropDownList",
    "ParentRelationship" : "ParentRelationship",
    "ObjectRelationship" : "ObjectRelationship",
    "CheckBox" : "TrueFalse",
    // TODO: not checked for advanced search criterias
    Image: "Image",
    LinkButton: "",
    Time: "Time",
    URL: "URL",
    RichTextBox: 'RichTextBox',
    Email: "Email",
    GeoData: "GeoData",
    MultiSelectList: "MultiSelectList",
    NumericText: "NumericText",
    Numeric: "Numeric",
    Formula: "Formula",
    MultilineTextBox: "TextBox",
    Summary: "Summary",
    MultiObjectRelationshipField: "MultiObjectRelationshipField",
    TableRelationship: "TableRelationship"
}