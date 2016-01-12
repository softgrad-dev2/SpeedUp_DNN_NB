/**
 * Created by C4off on 16.09.15.
 */
var pageConfig = angular.merge({}, pageConfig, {
    modelId: 'ObjectEntry_ID',
    templateVersion: '13',    // increment if you need to reload cached angular templates
    objectDetailPageSize: 5,
    environment: 'local',    // local, test or prod
    gridPageSize: 10,
    inlineSaveMethod: 'local',      // 'local' || 'server' - method of saving inline field
    gridContainer: "#mainGrid",
    AppContainer: "ASTopContainer",
    waitForFilter: true,
    mobile: false,
    enableMobile: true,
    gridEditable: false,
    enableKeyboard: true
});
kendo.culture('sv-SE');

window.mobilecheck = function () {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

if (pageConfig.enableMobile && window.mobilecheck()) {
    //            // TODO: load mobile.css on demand
    //            var app = new kendo.mobile.Application($('.forKendoMobile'));
    pageConfig.mobile = true;
}
/**
 * Created by C4off on 16.09.15.
 */
pageConfig = angular.merge({}, pageConfig, {
    objectDetailDisplayType: {
        type: 'element',
        element: '#RecordDetailContainer'
    },
    showFirstRecord: true,
    batchUpdate:true
//    // todo: remove stub
//    advancedSearchTpl: "Child.Work_Order.Work_Order_Detail.End_Date, Main.Work_Order.Customer, " +
//        "Parent.Work_Order.Customer.Area, " +
//        "Main.Work_Order.Status, Main.Work_Order.Project, " +
//        "Child.Work_Order.Work_Order_Detail.Status," +
//        "Child.Work_Order.Work_Order_Detail.Priority," +
//        "Child.Work_Order.Work_Order_Detail.ActionCategory," +
//        "Child.Work_Order.Work_Order_Detail.Reported_Resource.Resource"
});



/**
 * Created by antons on 5/14/15.
 */
var DateTimeHelper = function(){

}
    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// returns date in yyyy-MM-dd HH:mm:ss format
    /// returns empty if values is undefined, null or empty
    /// </summary>
    /// <param name="value">value to parse into datetime</param>
DateTimeHelper.DateTimeFormat = function (value) {
    if (value != undefined && value != null && value != "" && value != 'null') {
        var date = kendo.parseDate(value, 'yyyy-MM-dd HH:mm:ss');
        date = date == null ? new Date(value) : date;
        date = kendo.parseDate(date, 'yyyy-MM-dd HH:mm:ss');
        if (date == undefined || date == null || date == 'null') {
            return "";
        }

        return kendo.toString(date, "yyyy-MM-dd HH:mm:ss");

    }

    return "";
}
/// <summary>
/// To check whether the passed parameter has any value or not.
/// returns date in yyyy-MM-dd format
/// returns empty if values is undefined, null or empty
/// </summary>
/// <param name="value">value to parse into datetime</param>
DateTimeHelper.DateFormat = function (value) {

    if (value != undefined && value != null && value != "" && value != 'null') {
        var date = kendo.parseDate(value, 'yyyy-MM-dd ');
        date = date == null ? new Date(value) : date;
        date = kendo.parseDate(date, 'yyyy-MM-dd ');
        if (date == undefined || date == null || date == 'null') {
            return "";
        }
        return kendo.toString(date, "yyyy-MM-dd");

    }
    return "";
}
Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};
/**
 * Created by C4off on 17.05.15.
 */
var SUConstants = {
    RecordFirstImageColumn: 'RecordFirstImagePath',
    ObjectPropertyNameField: "Name",
    ParentRelationshipPropertyName: "ParentRelationship_Property_Name",
    ImageSizes: {
        h60: '_t_h60',
        h100: '_t_h100',
        h500: '_t_h500',
        h1024: '_t_h1024'
    },
    MainObjectFieldClass: "mainObjectField",
    NotificationCookieName: "notificationPopupShown_Dec_2015_1",
    PropertyDefinitionID: "PropertyDefinition_ID",
    ObjectId: "ObjectEntry_ID"
};
// Functionality to help with class inheritance
Object.defineProperty(Object.prototype, 'inherit', {
    enumerable: false,
    value: function (base, sub, methods) {
        sub.prototype = Object.create(base.prototype);
        sub.prototype.constructor = sub;
        sub.base = base.prototype;

        // Copy the methods passed in to the prototype
        for (var name in methods) {
            sub.prototype[name] = methods[name];
        }
        // so we can define the constructor inline
        return sub;
    }
});
/*	This work is licensed under Creative Commons GNU LGPL License.

 License: http://creativecommons.org/licenses/LGPL/2.1/
 Version: 0.9
 Author:  Stefan Goessner/2006
 Web:     http://goessner.net/
 */
function json2xml(o, tab) {
    var toXml = function(v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i=0, n=v.length; i<n; i++)
                xml += ind + toXml(v[i], name, ind+"\t") + "\n";
        }
        else if (typeof(v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind+"\t");
                }
                xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
            }
        }
        else {
            xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
        }
        return xml;
    }, xml="";
    for (var m in o)
        xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
/*	This work is licensed under Creative Commons GNU LGPL License.

 License: http://creativecommons.org/licenses/LGPL/2.1/
 Version: 0.9
 Author:  Stefan Goessner/2006
 Web:     http://goessner.net/
 */
function xml2json(xml, tab) {
    var X = {
        toObj: function(xml) {
            var o = {};
            if (xml.nodeType==1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i=0; i<xml.attributes.length; i++)
                        o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild=0, cdataChild=0, hasElementChild=false;
                    for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType==1) hasElementChild = true;
                        else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType==4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n=xml.firstChild; n; n=n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n=xml.firstChild; n; n=n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType==9) { // document.node
                o = X.toObj(xml.documentElement);
            }
            else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function(o, name, ind) {
            var json = name ? ("\""+name+"\"") : "";
            if (o instanceof Array) {
                for (var i=0,n=o.length; i<n; i++)
                    o[i] = X.toJson(o[i], "", ind+"\t");
                json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
            }
            else if (o == null)
                json += (name&&":") + "null";
            else if (typeof(o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind+"\t");
                json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
            }
            else if (typeof(o) == "string")
                json += (name&&":") + "\"" + o.toString() + "\"";
            else
                json += (name&&":") + o.toString();
            return json;
        },
        innerXml: function(node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function(n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i=0; i<n.attributes.length;i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c=n.firstChild; c; c=c.nextSibling)
                                s += asXml(c);
                            s += "</"+n.nodeName+">";
                        }
                        else
                            s += "/>";
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c=node.firstChild; c; c=c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function(txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite: function(e) {
            e.normalize();
            for (var n = e.firstChild; n; ) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    }
                    else
                        n = n.nextSibling;
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                }
                else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}
/**
 * Created by antons on 4/16/15.
 */
// for simple grid control (ViewObjectDataGrid.ascx)
var CSVapp = angular.module('speedup.CSVModule',
        ['kendo.directives', 'ngCookies', 'ngResource', 'speedup.modal',
            'speedup.localization', 'speedup.objectDetail',
            'speedup.exceptionHandling', 'speedup.grid', 'speedup.conversionBar',
            'speedup.printBar'
        ])
    .run(['configService', 'schemaService', 'autocompleteService', 'listDataLoaderService', function (configService, schemaService, autocompleteService, listDataLoaderService) {
        configService.Init();

        var gConfig = configService.getGlobalConfig();
        var objectDefinitionName = gConfig.objectDefinitionName;

        // Init Schema
        schemaService.Init();
        // TODO: cut restore later
//        // Prepare autocomplete data
//        // (here acData is global variable from incoming .js files)
//        if (typeof(acData) != 'undefined') {
//            autocompleteService.prepareACData(acData);
//        }
//        // LOAD list values for both objects
//        listDataLoaderService.fetchMultipleListsData(objectDefinitionName);
    }]);

CSVapp.controller("PageLogicController", ["$scope", "$rootScope", "configService",
    'eventManager', 'animationService', 'popupNotificationService', 'filesystemService',
    function ($scope, $rootScope, configService, eventManager, animationService, popupNotificationService, filesystemService) {
        var filterReady = false;

        var gConfig = configService.getGlobalConfig();
        var objectDefinitionName = gConfig.objectDefinitionName;
        // display notification popup, if any
        popupNotificationService.displayMainPageNotification();

        // disable enter click lead to another page
        $(document).keypress(function (e) {
            if (e.which == 13) {
                debugger;
                if (e.currentTarget && e.currentTarget.activeElement &&
                    e.currentTarget.activeElement.tagName &&
                    typeof(e.currentTarget.activeElement.tagName) == 'string' &&
                    e.currentTarget.activeElement.tagName.toLowerCase() == 'textarea') {

                } else {
                    e.preventDefault();
                }
            }
        });

        // add toolbar to grid
        $scope.gridToolbar = {
            odn: objectDefinitionName,
            showCreateNewButton: true,
            filter: {
                odn: objectDefinitionName
            },
            genericSearch: true,
            batchUpdate: gConfig.batchUpdate
        };
        // advanced search component options
        $scope.asOptions = {
            type: "api",
            odn: objectDefinitionName,
            propertyViewType: "selected"
        };
        // grid 'overriding' fields (fields only for main grid)
        $scope.mainGridOptions = {
            // hack for grid to wait until filter is loaded
            autoBind: !gConfig.waitForFilter
        };
        $scope.batchUpdate = gConfig.batchUpdate;
        $scope.odn = objectDefinitionName;
        $scope.gridElement = $(gConfig.gridContainer);

        // bind keyboard functionality to detail page
        if (gConfig.enableKeyboard) {
            // bind global keyboard events
            $(document).off('keydown');
            $(document).on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    var tabPressEvent = jQuery.Event("detailKeypress");
                    tabPressEvent.which = $rootScope.shiftPressed ? 169 : 9;
                    // currentPageBlock may not have been set yet
                    if ($rootScope.currentPageBlock &&
                        $rootScope.currentPageBlock.contentObject &&
                        $rootScope.currentPageBlock.contentObject.element) {
                        $rootScope.currentPageBlock.contentObject.element.trigger(tabPressEvent);
                    } else {
                        _activateFirstDetailPageBlock();
                    }
                    e.preventDefault();
                } else if (keyCode == 13) {
                    // exclude "search" button click
                    if(e.currentTarget && e.currentTarget.activeElement &&
                        $(e.currentTarget.activeElement).hasClass('_txtObjectSearch')){
                        return false;
                    }
                    var enterPressEvent = jQuery.Event("detailKeypress");
                    enterPressEvent.which = 13;
                    if ($rootScope.currentPageBlock &&
                        $rootScope.currentPageBlock.contentObject &&
                        $rootScope.currentPageBlock.contentObject.element) {
                        $rootScope.currentPageBlock.contentObject.element.trigger(enterPressEvent);
                    } else {
                        _activateFirstDetailPageBlock();
                    }
                } else if (keyCode == 27) {
                    var escPressEvent = jQuery.Event("escPressed");
                    escPressEvent.which = 27;
                    $(document).trigger(escPressEvent);
                } else if (keyCode == 16) {
                    $rootScope.shiftPressed = true;
                }
            });
            $(document).on('keyup', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 16) {
                    $rootScope.shiftPressed = false;
                }
            });
            eventManager.addListener(DisplayerElementClosedEvent, function () {
                _activateFirstDetailPageBlock();
            });
            function _activateFirstDetailPageBlock() {
                // hack to keep batch edit form active
                // on related entry popup close, because when popup closes event to activate
                // first object detail page field is triggered
                if(!$rootScope.currentPageBlock || !$rootScope.currentPageBlock.batchEditBlock){
                    $rootScope.currentPageBlock = null;
                    var actvtEvt = jQuery.Event("activateFirstPageBlock");
                    $(document).trigger(actvtEvt);
                }
            }
        }
        // load mobile styles if needed
        if (gConfig.mobileView) {
            var url = filesystemService.getImageUrl("DesktopModules/src/assets/style/mobile.css");
            var cssLink = $("<link rel='stylesheet' type='text/css' href='" + url + "'>");
            $("head").append(cssLink);
        }

        var _asComponentFilterExpression = null;
        var _filterComponentFilterExpression = null;
        var _customFilters = null;

        function _propagateFilterExpression(filterStr, advancedSearchStr, customASFilters) {
            var filters = [];
            if (advancedSearchStr === null
                && filterStr === null) {
                return;
            }
            if (advancedSearchStr) {
                filters.push(advancedSearchStr);
            }
            if (filterStr) {
                filters.push(filterStr);
            }
            customASFilters = customASFilters || _customFilters;
            var filterExpression = filters.join(" AND ");
            var eventData = {
                odn: gConfig.objectDefinitionName,
                filterExpression: filterExpression
            }
            if(customASFilters){
                eventData.customASFilters = customASFilters
            }
            eventManager.fireEvent(FilterGridByFilterExpressionEvent, eventData);
        }

        // events to animate 'loading' - process
        eventManager.addListener(LoadActionStartEvent, function () {
            animationService.displayGlobalLoader();
        });
        eventManager.addListener(LoadActionEndEvent, function () {
            animationService.hideGlobalLoader();
        });
        // events to expand/collapse grid
        $scope.$on(FilterExpandedEvent, function () {
            $(".GridHolder").css("width", "77%");
        });
        $scope.$on(FilterCollapsedEvent, function () {
            $(".GridHolder").css("width", "100%");
        });

        $scope.$on(GridEventListenReadyEvent, function (e) {
            _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression);
        });
        $scope.$on(AdvancedSearchFilterSetEvent, function (e, filterObject) {
            var filterExpression = filterObject.filters;
            var customFilters = filterObject.customASFilters;
            if (filterExpression || filterExpression === "" ||
                ($.isArray(customFilters) && customFilters.length)) {
                _asComponentFilterExpression = filterExpression;
                _customFilters = filterObject.customASFilters;
                _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression,
                    _customFilters);
            }

        });
        $scope.$on(FilterSetEvent, function (e, filter) {
            if (filter === "") {
                _filterComponentFilterExpression = filter;
                _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression);
            } else if (filter) {
                if (angular.isObject(filter)) {
                    _filterComponentFilterExpression = filter.FitlerExpression;
                } else {
                    _filterComponentFilterExpression = filter;
                }
                _propagateFilterExpression(_filterComponentFilterExpression, _asComponentFilterExpression);
            }
        });

        function operate() {
            if (filterReady) {
                $scope.$broadcast(CheckFilterStateEvent);
            }
        }

        $scope.$on(FilterReadyEvent, function () {
            filterReady = true;
            operate();
        });
    }
]);
angular.module('speedup.localization', [])
    .factory('localizationService', [
        function () {
            var LocalizationService = function () {
            };

            LocalizationService.translate = function(label){
                var parts = label.split('.');
                var object = $.objectLanguage;
                var returnValue = null;

                var hasAllProps = parts.every(function (property) {
                    if (!object.hasOwnProperty(property)) {
                        return false;
                    } else {
                        object = object[property];
                        return true;
                    }
                });

                if (hasAllProps) {
                    returnValue = object;
                } else {
                    returnValue = label;
                }

                return returnValue;
            };

            return LocalizationService;
        }])
    .filter('i18n', ['localizationService', function (localizationService) {
        return function (label) {
            return localizationService.translate(label);
        }
    }]);
$.objectLanguage = {
    DaysOfWeekCap: [
        {key: "Sunday", full: "Söndag", one: "S"},
        {key: "Monday", full: "Måndag", one: "M"},
        {key: "Tuesday", full: "Tisdag", one: "T"},
        {key: "Wednesday", full: "Onsdag", one: "O"},
        {key: "Thursday", full: "Torsdag", one: "T"},
        {key: "Friday", full: "Fredag", one: "F"},
        {key: "Saturday", full: "Lördag", one: "L"}
    ],
    RepeatTypes:  [
        {text: "Dagligen", value: "daily"},
        {text: "Varje vecka", value: "weekly"},
        {text: "Varje månad", value: "monthly"},
        {text: "Varje år", value: "yearly"}
    ],
    Labels: {
        Unassigned: 'Ej tilldelad',
        CheckAll: "Välj alla",
        Days: "dagar",
        Weeks: "veckor",
        Months: "månader",
        Years: "år",
        Occurrences: "gånger"
    },
    Titles: {
        BatchEdit: "Batch uppdatering",
        DeleteObject: "Ta bort",
        RepeatObject: "Upprepa"
    },
    Options: {
        SelectOne: "--Välj en--"
    },
    Messages: {
        SelectAtLeastOneFieldForBatchEdit: "Välj minst ett fält",
        BatchEditSuccess: "Posterna uppdaterades",
        SelectAtLestOneForBatchEdit: "Välj minst en post i listan",
        FailedToBatchEdit: "Misslyckades med att batch uppdatera flera poster",
        FailedToLoadData: "Misslyckades med att ladda data från servern",
        NoRecordsForConversion: "Inga poster valda för konvertering",
        UnableToCreatePrintTemplate: "Misslyckades med att skapa utskriftsmall.",
        UnableToCopyObject: "Misslyckades med att kopiera posten.",
        UnableToSaveRecord: "Misslyckades med att spara posten.",
        UnableToDeleteRecord: "Misslyckades med att ta bort posten.",
        UnableToOpenEditObjectPopup: "Misslyckades med att öppna redigera fönstret.",
        DeleteFile: "Är du säker på att du vill ta bort den här filen?",
        NoContentToDisplay: "Inget innehåll finns att visa.",
        DeleteParentIfNoSubobjects: "Det finns inga underobjekt kvar, vill du ta bort huvudobjektet?",
        RepeatAddedToQueue: "Posten är lagd i en kö och kommer att upprepas så fort det blir dess tur i kön",
        EventRepeatFailed: "Misslyckades med att upprepa händelsen",
        EventRepeatedSuccessfully: "Upprepning av händelsen lyckades",
        RecordCopiedSuccessfully: "Posten kopierad",
        RecordSavedSuccessfully: "Posten sparad",
        RecordUpdatedSuccessfully: "Posten uppdaterad",
        RecordDeletedSuccessfully: "Posten borttagen",
        EditedRecordIdNotFound: "Vald post för redigerings objektpostid hittades inte",
        InvalidJson: "Json är inte giltig",
        ConversionSuccessfully: "Konvertering utförd.",
        ConversionFailed: "Conversion failed.",
        NoRecordFound: "Inga resultat hittades",
        dropfiles: "släpp filer här för att ladda upp",
        DeleteObject: "Vill du verkligen ta bort objektet?"
    },
    Tabs: {
        RepeatBy: "Upprepa efter",
        DayOfWeek: "veckodag",
        DayOfMonth: "dag i månaden",
        Details: "Detaljer",
        DocumentsAndAttachments: "Dokument och bilagor",
        Repeats: "Upprepas",
        RepeatEvery: "Upprepa var",
        RepeatOn: "Upprepa varje",
        StartsOn: "Börjar",
        Ends: "Slutar",
        After: "Efter",
        On: "På"
    },
    Buttons: {
        GotIt: "Jag fattar",
        Send: "Send",
        Done: "Klar",
        Yes: "Ja",
        No: "Nej",
        RepeatObject: "Upprepa",
        CopyObject: "Kopiera",
        Create: "Skapa ny",
        Edit: "Redigera",
        Cancel: "Avbryt",
        Save: "Spara",
        AddNewDocument: "Lägg till nytt dokument eller en bilaga",
        Print: "Skriv ut",
        Conversion: "Konvertera",
        Filter: "Använd filter",
        Search: "Sökning",
        Next: "Nästa",
        Previous: "Föregående",
        Reset: "Återställ",
        Update:"Uppdatera",
        SaveAndAddNew: "Spara och lägg till ny",
        SaveAndCopyNew: "Spara och lägg till ny kopia",
        UpdateAndAddNew: "Uppdatera-Ny",
        UpdateAndCopyNew: "Uppdatera-Kopiera-Ny",
        AddNewRecord: "Ny",
        Remove: "Ta bort",
        SelectFile: "Välj en fil",
        DeleteObject: "Ta bort"
    },
    Headers: {
        PrintRecord: "Skriv ut post.",
        NewDetailTitle: "Skapa ny post.",
        Filters: "Filter",
        AdvancedSearch: "Avancerad sök",
        Lookup: 'lista'
    },
    ColumnNames: {
        FileName: "Filnamn",
        CreatedDate: "Skapad datum",
        Select: "Välj",
        GetAddress: "Hämta adress",
        Getcoordinates: "Hämta koordinater",
        Retrievecurrentposition: "Hämta nuvarande position"
    },
    Filters: {
        NoFilter: "Inga filter",
        Hide: "Dölj",
        Filter: ""
    },
    ActionMenu: {
        Action: "Åtgärder"
    },
    AdvancedSearch: {
        Search: "Sök",
        Clear: "Rensa",
        Before: "Före",
        After: "Efter"
    }
};
/**
 * Created by antons on 5/26/15.
 */
angular.module('speedup.exceptionHandling', ['speedup.CSVModule'])
    .config(['$provide', function($provide) {
        $provide.decorator('$exceptionHandler', ['$log', '$delegate',
            function($log, $delegate) {
                return function(exception, cause) {
                    // Todo:here we can attach custom logging (for example, 'Sentry');
                    $log.error(exception);
                    $delegate(exception, cause);
                };
            }
        ]);
    }]);
/**
 * Created by Мама on 08.06.15.
 */
CSVapp.factory('commonService', ['configService', function (configService) {
//    var gConfig = configService.getGlobalConfig();

    var CommonService = function () {
    }

    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// return true if has any value
    /// return false if doesn't have any value
    /// </summary>
    /// <param name="value">value to check</param>
    CommonService.isNotNullOrUndefinedOrEmpty = function (value) {
        return !(value == undefined || value == null || value == '');
    };

    return CommonService;
}]);
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

/**
 * Created by antons on 6/10/15.
 */
CSVapp.factory('relatedObjectsService', ['$rootScope', '$compile', 'configService',
    'objectDetailDisplayerService', 'filesystemService', 'eventManager',
    'schemaService', 'localizationService',
    function ($rootScope, $compile, configService, objectDetailDisplayerService,
              filesystemService, eventManager, schemaService, localizationService) {
        var gConfig = configService.getGlobalConfig();

        var _popupDefaultSettings = {
            modal: true,
            visible: false,
            resizable: false,
            maxHeight: 500,
            minHeight: 300,
            width: 700,
            actions: ["Pin", "Minimize", "Maximize", "Close"]
        };
        var _defaultGridParameters = {
            selectedPage: 0,
            filterExpression: "",
            genericSearch: "",
            refreshButton: true,
            recordCountFilterExpression: '',
            gridHeight: 400,
            pageSize: gConfig.gridPageSize,
            columnWidth: 100,
            showSelectButton: true,
            columnMinWidth: 150,
            columnMaxWidth: "auto",
            showEditButton: false,
            showDeleteButton: false,
            selectFirstRecord: false,
            showCheckboxForRowSelection: false
        };

        var RelatedObjectsService = function () {};

        /// <summary>
        /// Method will open a search popup in case of object relations
        /// </summary>
        /// <param name="key">has property or field name</param>
        /// <param name="odn">object definition name</param>
        /// <param name="oid">object definition id</param>
        /// <param name="container">container for popup</param>
        /// <param name="value">value of 'search' field</param>
        /// <param name="top">top of the popup</param>
        /// <param name="onSelect">call back method to get selected record Id and Name</param>
        RelatedObjectsService.openRelatedObjectPopup = function(key, odn, oid, container, value, top, onSelect) {
            // open modal window
            var displayer = objectDetailDisplayerService.getDisplayer({
                type: 'popup'
            });

            schemaService.createPageTitle(odn).then(function(objectName){
                var title = objectName + ' ' +localizationService.translate("Headers.Lookup");
                _openRelatedObjectPopup(key, odn, oid, container, value, onSelect, displayer, title, top);
            });


        };

        /// <summary>
        /// Method will open a search popup in case of object relations
        /// </summary>
        /// <param name="key">has property or field name</param>
        /// <param name="odn">object definition name</param>
        /// <param name="oid">object definition id</param>
        /// <param name="container">container for popup</param>
        /// <param name="value">value of 'search' field</param>
        /// <param name="onSelect">call back method to get selected record Id and Name</param>
        /// <param name="displayer">displayer object</param>
        /// <param name="title">title for popup</param>
        /// <param name="top">top of the popup</param>
        function _openRelatedObjectPopup(key, odn, oid, container, value, onSelect, displayer, title, top){
            var gridOptions = _getGridParameters(odn, {
                genericSearch: value,
                onSelect: function(dataItem){
                    displayer.close();
                    _setRelatedValueFromRelatedPopup(container, key, dataItem.ObjectEntry_ID, dataItem.Name);
                    if(angular.isFunction(onSelect)){
                        onSelect(dataItem);
                    }
                }
            });
            // create grid and add it to pageBlock
            var content = _createRelatedObjectsGrid(key, odn, oid, gridOptions, value);
            var contentObject = new ContentObject();
            contentObject.content = content;

            var pageBlock = new DetailPageBlock({});
            pageBlock.contentObject = contentObject;
            var settings = angular.extend({}, _popupDefaultSettings, {top: top});
            displayer.getDetailView(title, pageBlock, settings);
            displayer.onClose(function(){
                // clear element
                pageBlock.element.remove();
                // clear event bindings
                eventManager.disposeListeners(gridOptions);
            });
        }

        /// <summary>
        /// Method to get grid parameters
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="overrides">field to override defaults</param>
        function _getGridParameters(odn, overrides){
            var defaultParams = _defaultGridParameters;
            defaultParams.odn = odn;

            if(angular.isObject(overrides)){
                return angular.extend({}, defaultParams, overrides);
            } else {
                return defaultParams;
            }

        }

        /// <summary>
        /// Method to create grid for related object
        /// </summary>
        /// <param name="fieldName">name of a field for related object</param>
        /// <param name="odn">object definition name</param>
        /// <param name="oid">object definition id</param>
        /// <param name="gridOptions">grid object parameters</param>
        /// <param name="value">selected related value</param>
        function _createRelatedObjectsGrid(fieldName, odn, oid, gridOptions, value){
            var scope = $rootScope.$new();
            scope.fieldName = fieldName;
            scope.imgSrc = filesystemService.getPluginImageUrl("JS/img/search.png");
            scope.gridParameters = gridOptions;
            scope.oid = oid;
            scope.odn = odn;
            scope.fieldValue = value;
            var tpl = angular.element('<div><related-objects></related-objects></div>');
            $compile(tpl)(scope);

            return tpl;
        }

        /// <summary>
        /// Method will display the selected record from grid to in textbox in case of
        //  Object relational popup grid
        /// </summary>
        /// <param name="cell">clicked cell of the object detail</param>
        /// <param name="propertyName">name of the property</param>
        /// <param name="entryId">object id</param>
        /// <param name="value">value of dropdown</param>
        function _setRelatedValueFromRelatedPopup (cell, propertyName, entryId, value){
            cell.find("#txt" + propertyName).val(value);
            cell.find("#hdn" + propertyName).val(entryId);
            // auto-save the value in cell
            cell.closest('.detailPageMainBlock').click();
        }

        return RelatedObjectsService;
    }
]);

/**
 * Created by antons on 6/11/15.
 */
CSVapp.directive('relatedObjects', ['$timeout', 'configService', 'autocompleteService',
    'eventManager',
    function ($timeout, configService, autocompleteService, eventManager) {

        // Emit event to reload grid
        function _emitReloadEvent(odn, genericSearchStr) {
            eventManager.fireEvent(FilterGridByGenericSearchEvent, {
                odn: odn,
                genericSearchStr: genericSearchStr
            });
        }

        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('RelatedObjects/RelatedObjectTemplate.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            link: {
                post: function ($scope, $element) {
                    // values are not interpolated
                    // so we should wait for a moment (hate angular...)
                    $timeout(function () {
                            var input = $element.find("#txt" + $scope.fieldName);
                            input.val($scope.fieldValue);
                            $element.find("._objRelButtonSearch").click(function (e) {
                                _emitReloadEvent($scope.odn, input.val());
//                    $.config.BindObjectListing(listingContainer, objectDefinitionName, onSelect, filterExp, ShowSelectButton, ShowEditButton, ShowDeleteButton, displayType, IsSubObjectGrid, null, getvalueForgenericsearch);
                            });
                            // if we have objectDefinitionId of a
                            // field we can wrap it with autocomplete
                            if ($scope.oid) {
                                autocompleteService.wrapElement($element, input, $scope.fieldName, $scope.oid, null,
                                    {
                                        change: function () {
                                            _emitReloadEvent($scope.odn, this.value());
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        };
    }]
);
/**
 * Created by Мама on 31.05.15.
 */
CSVapp.factory('eventManager', [function () {
    var _listeners = {};

    var EventManager = function () {
    };

    EventManager.fireEvent = function (event, data) {
        if ($.isArray(_listeners[event])) {
            _listeners[event].forEach(function (func) {
                // listener can be already unset (null)
                if (func) {
                    // TODO: maybe, more complicated
                    // functionality will be needed
                    func.call(this, data);
                }
            });
        }
    };
    // holder is the object, that will 'remeber' info about its listeners
    EventManager.addListener = function (event, method, holder) {
        // TODO: check for already bound
        if (typeof(event) == 'string' && $.isFunction(method)) {
            if (!_listeners[event]) {
                _listeners[event] = [];
            }
            var newLength = _listeners[event].push(method);

            // return object to 'remember' the listener,
            // so later the one could be unbound
            if (angular.isObject(holder)) {
                // here lies a hash 'eventName'->'index'
                if (!angular.isObject(holder.listeners)) {
                    holder.listeners = {};
                }
                if (!angular.isArray(holder.listeners[event])) {
                    holder.listeners[event] = [];
                }
                // save the index of a listener
                holder.listeners[event].push(newLength - 1);
            }

            return true;
        }

        return false;
    };

    EventManager.removeListener = function (event, index) {
        if (angular.isArray(_listeners[event]) && _listeners[event][index]) {
            delete _listeners[event][index];

            return true;
        } else {
            return false;
        }
    };

    EventManager.disposeListeners = function (holder) {
        if (angular.isObject(holder) && angular.isObject(holder.listeners)) {
            for (var event in holder.listeners) {
                if (angular.isArray(holder.listeners[event]) && angular.isArray(_listeners[event])) {
                    holder.listeners[event].forEach(function (index) {
                        if (_listeners[event][index]) {
                            delete _listeners[event][index];
                        }
                    });
                }
            }
        }

    };

    return EventManager;
}]);
/**
 * Created by antons on 5/26/15.
 */

// Exception for bad function argument
function BadParameterException(message) {
    this.name = 'BadParameter';
    this.message= message;
}
BadParameterException.prototype = new Error();
BadParameterException.prototype.constructor = BadParameterException;

// Exception for no data from server
function NoDataException(message) {
    this.name = 'NoDataException';
    this.message= message;
}
NoDataException.prototype = new Error();
NoDataException.prototype.constructor = NoDataException;

// Exception for not implemented method
function MethodNotImplementedException(message) {
    this.name = 'MethodNotImplementedException';
    this.message= message;
}
MethodNotImplementedException.prototype = new Error();
MethodNotImplementedException.prototype.constructor = MethodNotImplementedException;
/**
 * Created by antons on 5/14/15.
 */
CSVapp.factory('dateTimeService', ['configService', function (configService) {

    var gConfig = configService.getGlobalConfig();

    var DateTimeService = {

    };

    /// <summary>
    /// method will Format the Date
    /// </summary>
    DateTimeService.FormatDateAmPm = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// returns date in yyyy-MM-dd HH:mm:ss format
    /// returns empty if values is undefined, null or empty
    /// </summary>
    /// <param name="value">value to parse into datetime</param>
    DateTimeService.DateTimeFormat = function (value) {
        return DateTimeHelper.DateTimeFormat(value);
    }
    /// <summary>
    /// To check whether the passed parameter has any value or not.
    /// returns date in yyyy-MM-dd format
    /// returns empty if values is undefined, null or empty
    /// </summary>
    /// <param name="value">value to parse into datetime</param>
    DateTimeService.DateFormat = function (value) {
        return DateTimeHelper.DateFormat(value);
    }

    return DateTimeService;
}]);
/**
 * Created by antons on 5/25/15.
 */
CSVapp.factory('objectDataService', ['$http', '$q', '$log', 'configService', 'localizationService',
    'schemaService',
    function ($http, $q, $log, configService, localizationService, schemaService) {

        var gConfig = configService.getGlobalConfig();

        var ObjectDataService = {

        };

        /// <summary>
        /// Method which will split the comma separated objects returned from api (i.e object settings).
        /// </summary>
        ObjectDataService.getRelatedObjects = function (data) {
            var tabs = data.split(";");
            var arrtabs = [];
            var rettabs = [];
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] != "") {
                    arrtabs = tabs[i].split(":");
                    if (arrtabs.length > 0) {
                        var objName = arrtabs[arrtabs.length - 1];
                        // prevent duplicates
                        if ($.inArray(objName, rettabs) == -1) {
                            rettabs.push(arrtabs[arrtabs.length - 1]);
                        }
                    }
                }
            }
            return rettabs;
        };

        /// <summary>
        /// Method which will return the sub objects for tabStrip (IN PROMISE)
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="selectedRelatedObjects">string with related objects, selected for template</param>
        /// <return>promise</return>
        ObjectDataService.getSubObjects = function (odn, selectedRelatedObjects, allowReturnEmpty) {
            return _fetchSubObjects(odn).then(function (subObjectsArray) {
                var tabs = [];
                if ($.isArray(subObjectsArray) && subObjectsArray.length) {
                    if (selectedRelatedObjects) {
                        var tabsArr = ObjectDataService.getRelatedObjects(selectedRelatedObjects);
                        // As per settings returned from api, pushing subObjects in a variable
                        // to show objects in tab
                        for (var i = 0; i < tabsArr.length; i++) {
                            $.each(subObjectsArray, function () {
                                if (tabsArr[i] == this.ObjectDefinitionName) {
                                    tabs.push(this);
                                }
                            });
                        }
                    }
                    else if(!allowReturnEmpty) {
                        tabs = subObjectsArray;
                    }
                }

                return tabs;
            });
        };

        /// <summary>
        /// Method which will return the sub object object (IN PROMISE)
        /// </summary>
        /// <param name="objectDefinitionName">definition name</param>
        /// <return>promise</return>
        function _fetchSubObjects(objectDefinitionName) {
            var deferred = $q.defer();

            var subObjects = schemaService.getSubObjectByObjectDefinitionName(objectDefinitionName);
            if (subObjects) {
                deferred.resolve(subObjects.SubObjectsObject);
            } else {
                var url = configService.getUrlBase('getSubObjects') + "/" + objectDefinitionName + "/" + gConfig.token;
                $http.get(url).success(function (subObjects) {
                    // check, fix subObjects
                    _addPropertyInSubObjectList(subObjects).then(function (subObjectsRevised) {
                        var obj = {
                            ObjectDefinitionName: objectDefinitionName,
                            SubObjectsObject: subObjectsRevised
                        };
                        // cache subObjects data
                        schemaService.preserveSubObject(obj);

                        deferred.resolve(subObjects);
                    });

                }).error(function (data, status, headers) {
                        // TODO: check here
                        var respoonseCodeValue = headers;
                        if (respoonseCodeValue == "UnAuthorized")
                            deferred.reject("UnAuthorized");
                        else {
                            var obj = {
                                ObjectDefinitionName: objectDefinitionName,
                                SubObjectsObject: null
                            };
                            schemaService.preserveSubObject(obj);

                            deferred.resolve(null);
                        }
                    });
            }

            return deferred.promise;
        };

        /// <summary>
        /// Method to get MULTIPLE objects data, and if the recordId is passe -
        /// then SINGLE object data will be returned
        /// </summary>
        /// <param name="id">object entry id</param>
        /// <param name="odn">object definition name</param>
        /// <return> promise </return>
        ObjectDataService.fetchObjects = function (odn, pageSize, pageIndex, filterExpression, recordId) {
            var deferred = $q.defer();
            filterExpression = filterExpression || "";

            var postData = {
                ObjectDefinitionName: odn,
                Token: gConfig.token,
                RequestType: "Detail",
                FilterExpression: filterExpression
            };

            if (recordId) {
                postData.RecordID = recordId;
            } else {
                postData.PageSize = pageSize;
                postData.PageNumber = pageIndex;
            }

            var url = configService.getUrlBase('objectRecordList') + "/" + gConfig.token;
            $http.post(url, JSON.stringify(postData)).success(function (response) {
                var json = JSON.parse(response);
                if (!$.isArray(json)) {
                    deferred.reject('Unable to get records list. Wrong JSON.');
                } else {
                    if (recordId) {
                        deferred.resolve(json[0]);
                    } else {
                        deferred.resolve(json);
                    }
                }
            }).error(function () {
                    deferred.reject('Unable to get records list.')
                });

            return deferred.promise;
        };

        /// <summary>
        /// Method to get SINGLE object data from API by id
        /// </summary>
        /// <param name="id">object entry id</param>
        /// <param name="odn">object definition name</param>
        // <return> promise </return>
        ObjectDataService.fetchSingleObjectData = function (id, odn) {
            return ObjectDataService.fetchObjects(odn, 0, 0, '', id);
        };

        /// <summary>
        /// Method which will add the property in object
        /// <param name="subObjectList">list of sub objects</param>
        /// </summary>
        function _addPropertyInSubObjectList(subObjectList) {
            var deferred = $q.defer();
            if (!subObjectList) {
                deferred.resolve([]);
            } else {
                // Async get object definitions for subobjects
                var promises = subObjectList.map(function (subObj) {
                    return schemaService.getObjectDefinition(subObj.ObjectDefinitionName);
                });
                // after all async calls resolve subojects list
                $q.all(promises).then(function (subObjects) {
                    subObjectList.forEach(function (subObject, index) {
                        subObject.ObjectLabel = subObjects[index].ObjectLabel;
                    });

                    deferred.resolve(subObjectList);
                });
            }

            return deferred.promise;
        }

        return ObjectDataService;
    }]);
/**
 * Created by antons on 5/26/15.
 */
CSVapp.factory('fieldPropertiesService', ['schemaService',
    function (schemaService) {
        var FieldPropertiesService = {

        };

        //  <summary>
        /// Method will return properties of array of fields
        /// IS ASYNC
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        /// <return> promise </return>
        FieldPropertiesService.getAllPropertiesOfFieldsArrayPromise = function (fieldNamesArray, odn) {
            return schemaService.getSchema(odn).then(function(schema){
                var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

                var fields = _getAllPropertiesOfFieldsArray(fieldNamesArray, columnsList, odn);
                fields.odn = odn;

                return fields;
            });
        };

        //  <summary>
        /// Method will return properties of array of fields
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        FieldPropertiesService.getAllPropertiesOfFieldsArray = function (fieldNamesArray, odn) {
            var schema = null;
            if (odn) {
                schema = schemaService.GetSchemaByObjectDefinitionName(odn);
            }
            var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

            return _getAllPropertiesOfFieldsArray(fieldNamesArray, columnsList, odn);
        };

        //  <summary>
        /// Method will return properties of single field
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        FieldPropertiesService.getAllPropertiesOfSingleFieldPromise = function (fieldName, odn) {
            return schemaService.getSchema(odn).then(function(schema){
                var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

                var fields = _getAllPropertiesOfSingleField(fieldName, odn, columnsList);
                fields.odn = odn;

                return fields;
            });

        };

        //  <summary>
        /// Method will return properties of single field
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        FieldPropertiesService.getAllPropertiesOfSingleField = function (fieldName, odn) {
            var schema = null;
            if (odn) {
                schema = schemaService.GetSchemaByObjectDefinitionName(odn);
            }
            var columnsList = schema != null ? schema.AllColumnsList : schemaService.GetVisibleColumns();

            return _getAllPropertiesOfSingleField(fieldName, odn, columnsList);
        };

        /*Private Methods*/

        //  <summary>
        /// Method will return properties of single field
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        function _getAllPropertiesOfSingleField(fieldName, odn, columnsList) {
            var objField = {};
            // trace all settings fields to find 'fieldName'
            columnsList.some(function (column) {
                var propertyName = column.PropertyName;
                // found it and it's visible
                if (column.Visible && propertyName == fieldName) {
                    objField = _createFieldObjectStub(column);
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 1 : 1;
                    objField.PropertyName = column.PropertyName;
                    _splitOutputSettings(column, odn);

                    return true;
                } else if ((propertyName == "CreatedBy" && propertyName == fieldName) || (propertyName == "ChangedBy" && propertyName == fieldName)) {
                    objField = _createFieldObjectStub(column);
                    objField.PropertyName = column.field;
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 501 : 501;

                    return true;
                } else if (propertyName == fieldName && !column.Visible) {
                    // also, don't trace trailing elements if
                    // we found 'fieldName' and it's invisible
                    return true;
                }

            });

            return objField;
        };

        //  <summary>
        /// Method will return properties of array of fields
        /// </summary>
        /// <param name="fieldName">Grid column name or PropertyName</param>
        /// <param name="objectdefinitionName">name of object</param>
        function _getAllPropertiesOfFieldsArray(fieldNamesArray, columnsList, odn) {
             var objField = {};
            // var for result
            var fieldsWithSettings = [];
            // turn columnsList into hash-table with property name as keys
            var columns = _convertColumnsListToHash(columnsList);

            fieldNamesArray.forEach(function (fieldName) {
                var column = columns[fieldName];
                if (!column) {
                    return;
                }
                var propertyName = column.PropertyName;
                // found it and it's visible
                if (column.Visible && propertyName == fieldName) {
                    objField = _createFieldObjectStub(column);
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 1 : 1;
                    objField.PropertyName = column.PropertyName;
                    _splitOutputSettings(column, odn);

                    fieldsWithSettings.push(objField);
                } else if ((propertyName == "CreatedBy" && propertyName == fieldName) || (propertyName == "ChangedBy" && propertyName == fieldName)) {
                    objField = _createFieldObjectStub(column);
                    objField.PropertyName = column.PropertyName;
                    objField.ViewOrder = column.ViewOrder ? parseInt(column.ViewOrder) + 501 : 501;

                    fieldsWithSettings.push(objField);
                }
            });

            return fieldsWithSettings;
        }

        //  <summary>
        /// Method will turn columnsList array to hash with 'PropertyName' as key
        /// </summary>
        /// <param name="columnsListArray">array of column settings objects</param>
        function _convertColumnsListToHash(columnsListArray) {
            var columnsHash = {};
            var propertyName;
            columnsListArray.forEach(function (element) {
                propertyName = element.PropertyName;
                columnsHash[propertyName] = element;
            });

            return columnsHash;
        }

        //  <summary>
        /// Method will return stub of field Object with common parameters
        /// </summary>
        /// <param name="column">field settings object</param>
        function _createFieldObjectStub(column) {
            return {
                DataType: column.DataType,
                PropertyLabel: column.PropertyLabel,
                InputSettings: column.InputSettings,
                OutputSettings: column.OutputSettings,
                ObjectEntry_fk: column.ObjectEntry_fk,
                PropertyDefinition_ID: column.PropertyDefinition_ID,
                DefaultValue: column.DefaultValue,
                Required: column.Required,
                SystemProperty: column.SystemProperty
            };
        }

        //  <summary>
        /// Method will split output settings of column and preserve
        //  them in schema-cache if needed
        /// </summary>
        /// <param name="column">field settings object</param>
        /// <param name="odn">object definition name</param>
        function _splitOutputSettings(column, odn) {
            var str = column.OutputSettings;
            var data = str.split("[#][@]");
            if (data.length > 2) {
                var data1 = data[data.length - 1].split("[#]");
                var objMain = {
                    DefinitionName: odn,
                    PropertyId: column.PropertyDefinition_ID,
                    PropertyName: column.PropertyName,
                    InputSettings: column.InputSettings,
                    DataType: column.DataType
                }
                var arr = [];
                for (var i = 0; i < data1.length; i++) {
                    if (i > 0) {
                        var subdata = data1[i].split("[&]");
                        for (var j = 0; j < subdata.length; j++) {
                            var subdata1 = subdata[j].split("[$]");
                            if (subdata1.length > 1) {
                                var subdata2 = $.trim(subdata1[0]).split("}");

                                for (var i = 0; i < subdata2.length; i++) {
                                    var data11 = subdata2[i].split("{");
                                    if (data11.length > 1) {
                                        var property_def_id = $.trim(data11[data11.length - 1]);

                                        var objNew = {
                                            PropertyId: "{" + property_def_id + "}",
                                            Value: "",
                                            Expression: $.trim(subdata1[0]),
                                            List: $.trim(subdata1[1])
                                        };
                                        arr.push(objNew);
                                        schemaService.PreserveConditionalFields(objNew, odn);
                                    }
                                }
                            }
                        }
                    }
                }
                objMain.Data = arr;
                schemaService.PreserveConditionalFields(objMain, odn);
            }
        }

        return FieldPropertiesService;
    }]);
/**
 * Created by antons on 5/25/15.
 */
var speedupObjectDetailModule = angular.module('speedup.objectDetail', ['speedup.CSVModule']);
/**
 * Created by antons on 6/1/15.
 */
speedupObjectDetailModule.factory('objectDetailDisplayerService', ['$modal',
    'eventManager',
    function ($modal, eventManager) {
        var ObjectDetailDisplayerService = function () {
        };

        ObjectDetailDisplayerService.getDisplayer = function (settings) {
            switch (settings.type) {
                case 'popup':
                    return new ObjectDisplayerPopup();
                    break;
                case 'element':
                    var element = angular.element(settings.element);
                    return new ObjectDisplayerElement(element);
                    break;
                default:
                    return null;
            }
        };

        var ObjectDisplayer = function () {
        };

        ObjectDisplayer.prototype.close = function () {
        };

        ObjectDisplayer.prototype.setContent = function (pageBlock) {
            this.pageBlock = pageBlock;
//            this.content = pageBlock.element;
        };

        function ObjectDisplayerPopup() {
            this.type = 'popup';

            // Call the parent's constructor without hard coding the parent
            ObjectDisplayerPopup.base.constructor.call(this, arguments);
        }

        ObjectDisplayerPopup.detailPopupDefaultSettings = {
            width: 1000,
            actions: ['close'],
            title: "",
            modal: true
        };
        ObjectDisplayerPopup.detailPopupNewDefaultSettings = {
            width: 1000,
            actions: ['close'],
            title: "",
            modal: true
        };
        // hack not to create detailPage popup not wider than screen
        if(document.body.clientWidth < 1000){
            ObjectDisplayerPopup.detailPopupDefaultSettings.width = document.body.clientWidth - 40;
            ObjectDisplayerPopup.detailPopupNewDefaultSettings.width = document.body.clientWidth - 40;
        }
        Object.inherit(ObjectDisplayer, ObjectDisplayerPopup, {
            /// <summary>
            /// method to open modal window to create new record
            /// </summary>
            /// <param name="title">title of the popup</param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailViewNew: function (title, pageBlock, settings) {
                if (!settings) {
                    settings = ObjectDisplayerPopup.detailPopupNewDefaultSettings;
                } else {
                    settings = angular.extend({}, ObjectDisplayerPopup.detailPopupDefaultSettings, settings);
                }
                return this.getDetailView(title, pageBlock, settings);
            },
            /// <summary>
            /// method to open modal window to display record detail block(s)
            /// </summary>
            /// <param name="title">title of the popup</param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailView: function (title, pageBlock, settings) {
                this.setContent(pageBlock);
                if (!settings) {
                    settings = ObjectDisplayerPopup.detailPopupDefaultSettings;
                } else {
                    settings = angular.extend({}, ObjectDisplayerPopup.detailPopupDefaultSettings, settings);
                }
                settings.title = title;
                this.modalInstance = $modal.open({
                    template: "<div class='modalWindow11'></div>",
                    settings: settings,
                    resolve: {
                        items: function () {
                            return pageBlock.element;
                        }
                    },
                    content: pageBlock
                });
                // set backwards link to displayer
                pageBlock.displayer = this;

                return this.modalInstance;
            },
            close: function () {
                if (this.modalInstance) {
                    this.modalInstance.close();
                }
            },
            onClose: function(closeFn){
                this.modalInstance.result.then(function (result) {
                    closeFn();
                    eventManager.fireEvent(DisplayerElementClosedEvent);
                }, function () {
                    closeFn();
                    eventManager.fireEvent(DisplayerElementClosedEvent);
                });
            }
        });

        function ObjectDisplayerElement(element) {
            this.element = element;
            this.type = 'element';
            // Call the parent's constructor without hard coding the parent
            ObjectDisplayerPopup.base.constructor.call(this, arguments);
        }

        Object.inherit(ObjectDisplayer, ObjectDisplayerElement, {
            /// <summary>
            /// method to create new record
            /// </summary>
            /// <param name="title">title of the </param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailViewNew: function (title, pageBlock) {
//                if (!settings) {
//                    settings = ObjectDisplayerPopup.detailPopupNewDefaultSettings;
//                } else {
//                    settings = angular.extend(settings, ObjectDisplayerPopup.detailPopupDefaultSettings);
//                }
                return this.getDetailView(title, pageBlock);
            },
            /// <summary>
            /// method to open modal window to display record detail block(s)
            /// </summary>
            /// <param name="title">title of the popup</param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailView: function (title, pageBlock) {
                this.setContent(pageBlock);
                this.element.append(pageBlock.element);

                pageBlock.displayer = this;

                return this.element;
            },
            close: function () {
                // page block can be already closed
                if(this.pageBlock){
                    this.pageBlock.removeBlock();
                    delete this.pageBlock;
                }
            },
            onClose: function(closeFn){
                // does nothing.
            }
        });

        return ObjectDetailDisplayerService;
    }]);
/**
 * Created by Мама on 23.05.15.
 */
CSVapp.factory('detailPageMapService', ['$q',
    function ($q) {
        function DetailPageMapService(){
        }

        /// <summary>
        /// method will display the address based on latitude and longitude.
        /// </summary>
        DetailPageMapService.getAddressFromLatLong = function(latField, longField, addressField,
                                                              mapDiv, mapZoomField, mapTypeField) {
            var lat = $("#" + latField).val();
            var long = $("#" + longField).val();
            var zoomLevel = $("#" + mapZoomField).val();
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = true;
            var address = $("#" + addressField).val();
            var mapType = $("#" + mapTypeField).val();
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = true;
            var saveMapType = true;

            _OMJSUNIQUE_GetAddressFromLatLong(latField, longField, addressField);
            DetailPageMapService.initializeMap(lat, long, latField, longField, editable, mapDiv,
                address, addressField, mapZoomField, mapTypeField, zoomLevel, mapType, saveZoomLevel, saveMapType);
        };
        /// <summary>
        /// method will display latitude and longitude based on address.
        /// </summary>
        DetailPageMapService.getLatLongFromAddress = function (latField, longField, addressField,
                                                               mapDiv, mapZoomField, mapTypeField) {
            var lat = $("#" + latField).val();
            var long = $("#" + longField).val();
            var zoomLevel = $("#" + mapZoomField).val();
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = true;
            var address = $("#" + addressField).val();
            var mapType = $("#" + mapTypeField).val();
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = true;
            var saveMapType = true;
            _OMJSUNIQUE_GetLatLongFromAddress(latField, longField, addressField);
            DetailPageMapService.initializeMap(lat, long, latField, longField, editable, mapDiv,
                address, addressField, mapZoomField, mapTypeField, zoomLevel, mapType, saveZoomLevel, saveMapType);
        };
        /// <summary>
        /// method will display the user's current location on map.
        /// </summary>
        DetailPageMapService.getCurrentLocation = function (latField, longField, addressField, mapDiv,
                                                            mapZoomField, mapTypeField) {
            var lat = $("#" + latField).val();
            var long = $("#" + longField).val();
            var zoomLevel = $("#" + mapZoomField).val();
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = true;
            var address = $("#" + addressField).val();
            var mapType = $("#" + mapTypeField).val();
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = true;
            var saveMapType = true;
            _OMJSUNIQUE_getCurrentLocation(latField, longField, addressField);
            DetailPageMapService.initializeMap(lat, long, latField, longField, editable,
                mapDiv, address, addressField, mapZoomField, mapTypeField, zoomLevel, mapType, saveZoomLevel, saveMapType);
        };


//
//        // MOVED to mapservice
//        /// <summary>
//        /// method will display the address based on latitude and longitude.
//        /// </summary>
//        $.GetAddress = function (latField, longField, addressField, mapDiv, mapZoomField, mapTypeField) {
//
//            $config.GetAddressFromLatLong(latField, longField, addressField, mapDiv, mapZoomField, mapTypeField);
//        }
//        // MOVED to mapservice
//        /// <summary>
//        /// method will display latitude and longitude based on address.
//        /// </summary>
//        $.GetLatLongFromAddress = function (latField, longField, addressField, mapDiv, mapZoomField, mapTypeField) {
//
//            $config.GetLatLongFromAddress(latField, longField, addressField, mapDiv, mapZoomField, mapTypeField);
//        }
//        // MOVED to mapservice
//        /// <summary>
//        /// method will display the user's current location on map.
//        /// </summary>
//        $.GetCurrentLocation = function (latField, longField, addressField, mapDiv, mapZoomField, mapTypeField) {
//
//            $config.GetCurrentLocation(latField, longField, addressField, mapDiv, mapZoomField, mapTypeField);
//        }

        /// <summary>
        /// Method to create the maps
        /// </summary>
        DetailPageMapService.createMaps = function (geoDataValues) {
            $.each(geoDataValues, function (i, e) {
                if (e.PropertyValue != undefined && e.PropertyValue != null && e.PropertyValue != "") {
                    var latlng = e.PropertyValue.split(":");
                    if (e.InlineEdit != undefined && e.InlineEdit == false) {
                        DetailPageMapService.initializeMap(e.Latitude, e.Longitude, e.LatField,
                            e.LongField, false, e.Mapdiv, e.Address, e.AddressField,
                            e.MapZoomField, e.MapTypeField, e.MapZoom, 'OPENSTREET', true, false, true);
                    }
                    else {
                        DetailPageMapService.initializeMap(e.Latitude, e.Longitude, e.LatField,
                            e.LongField, true, e.Mapdiv, e.Address, e.AddressField, e.MapZoomField,
                            e.MapTypeField, e.MapZoom, 'OPENSTREET', true, true, true);
                    }
                }
            });
        };

        // checked
        /// <summary>
        /// Method to initialize the map
        /// </summary>
        DetailPageMapService.initializeMap = function (lat, lng, LatField, LongField, editable, MapDiv, Address,
                                                       AddressField, ZoomField, MapTypeField, zoomlevel,
                                                       maptype, SaveZoomLevel, SaveMapType, disableScroll) {
            try {
                _OMJSUNIQUE_loadMap_eor(lat, lng, "Address", LatField, LongField, editable, MapDiv, Address,
                    AddressField, ZoomField, MapTypeField, zoomlevel, maptype, SaveZoomLevel, SaveMapType,
                disableScroll);
            } catch (ex) {
//                debugger;
            }
        };

        return DetailPageMapService;

    }]);
/**
 * Created by antons on 6/16/15.
 */
speedupObjectDetailModule.factory('actionsListService', ['objectEditService', 'eventManager',
    'objectService', 'existingObjectDetailService', 'localizationService', 'notificationService',
    'popupService',
    function (objectEditService, eventManager, objectService, existingObjectDetailService, localizationService, notificationService, popupService) {
        var ActionsListService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to remove object
        /// </summary>
        /// <param name="pageBlock">target page block</param>
        ActionsListService.deleteObject = function (pageBlock) {
            // confirm delete
            var title = localizationService.translate('Titles.DeleteObject');
            var msg = localizationService.translate('Messages.DeleteObject');
            popupService.confirm(title, msg).then(function () {
                // if it's last subobject
                var parent = pageBlock.parentBlock;
                if (parent && parent.getChildrenCount() <= 1) {
                    // i'm the only child...
                    msg = localizationService.translate('Messages.DeleteParentIfNoSubobjects');
                    popupService.confirm(title, msg, {
                        position: {
                            top: pageBlock.element.offset().top + 25 + ""
                        }
                    }).then(function () {
                        _deleteObjectWithPageBlock(parent);
                    }, function () {
                        // delete object
                        _deleteObjectWithPageBlock(pageBlock);
                    });
                } else {
                    // delete object
                    _deleteObjectWithPageBlock(pageBlock);
                }
            })
        };
        /// <summary>
        /// Method to copy object
        /// </summary>
        /// <param name="objectID">record id</param>
        /// <param name="dataItem">object data</param>
        /// <param name="pageBlock">target page block</param>
        /// <param name="odn">object definition name</param>
        ActionsListService.copyObject = function (objectID, dataItem, pageBlock, odn) {
            return objectService.copyObject(objectID, odn, true).then(function (objectMeta) {
                var msg = localizationService.translate('Messages.RecordCopiedSuccessfully');
                notificationService.showNotification(msg);
                // update pageBlock settings
                var pageBlockSettings = angular.merge({}, pageBlock.settings, {
                    currentRecord: {
                        id: objectMeta.ObjectEntry_ID,
                        name: objectMeta.Name
                    },
                    recordId: objectMeta.ObjectEntry_ID,
                    displayMode: {
                        type: 'element',
                        element: '<div></div>'
                    }
                });
                existingObjectDetailService.getObjectsWithSubObjects(pageBlockSettings, false).then(function(displayer){
                    eventManager.fireEvent(LoadActionEndEvent);
                    var newPageBlock = displayer.pageBlock;
                        // if we copy subobject - add it to siblings
                        if (pageBlock.parentBlock) {
                            pageBlock.parentBlock.appendChildBlock(newPageBlock);
                            // scroll to it
                            $("html, body").animate({scrollTop: newPageBlock.element.offset().top}, 1000);
                        } else {
                            // if we copy 'parent' -> show new one instead of old one
                            pageBlock.substituteBlockBy(newPageBlock);
                            // scroll to it
                            $("html, body").animate({scrollTop: newPageBlock.element.offset().top}, 1000);
                        }
                });
            }, function (error) {
                eventManager.fireEvent(LoadActionEndEvent);
                notificationService.showNotification(error, true);
            });
        };
        /// <summary>
        /// Method to create new subObject
        /// </summary>
        /// <param name="$scope">parent scope</param>
        /// <param name="odn">object definition name</param>
        ActionsListService.createNewSubObject = function ($scope, odn) {
            var parentRecord = $scope.settings.currentRecord;
            if (parentRecord) {
                return objectEditService.createNewObject(odn,
                    parentRecord.id,
                    parentRecord.name,
                    parentRecord.fk,
                    $scope.settings.overridenFields
                );
            } else {
                // Warning. if we got here, we will not be able to auto-bind subObject to parent
                return objectEditService.createNewObject(odn);
            }
        };
        /// <summary>
        /// Method to show newly created page block in 'detail' mode
        /// </summary>
        /// <param name="$scope">parent scope</param>
        ActionsListService.addNewObjectPageBlockAfterSave = function (scope) {
            // start listening for 'create new object' event
            var listenerHolder = {};
            eventManager.addListener(ObjectSavedEvent, function (apiResponse) {
                // add subObject to parent on detail page
                var parentPageBlock = scope.pageBlock;
                var pageBlockSettings = angular.merge({}, parentPageBlock.settings);
                pageBlockSettings.odn = apiResponse.ObjectDefinitionName;
                pageBlockSettings.recordId = apiResponse.ObjectEntryID;
                pageBlockSettings.currentRecord = {
                    fk: apiResponse.ObjectDefinitionID,
                    id: apiResponse.ObjectEntryID,
                    name: apiResponse.ObjectEntryName
                };
                var fields = objectService.extractItemFromSaveAPIResponse(apiResponse);
                existingObjectDetailService.createDetailPageBlock(pageBlockSettings, fields).then(
                    function (pageBlock) {
                        parentPageBlock.appendChildBlock(pageBlock);
                    }
                );
                // unbind listener
                eventManager.disposeListeners(listenerHolder);
            }, listenerHolder);
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Method to delete object and its pageBlock
        /// </summary>
        /// <param name="pageBlock">page block</param>
        function _deleteObjectWithPageBlock(pageBlock) {
            // delete parent
            var recordId = pageBlock.settings.currentRecord.id;
            var odn = pageBlock.settings.odn;

            return objectService.deleteObject(recordId, odn, true).then(function () {
                // remove pageBlock
                pageBlock.removeBlock();
                var msg = localizationService.translate('Messages.RecordDeletedSuccessfully');
                notificationService.showNotification(msg);
                // if it's a root pageBlock - we need to close displayer
                if (!pageBlock.parentBlock && pageBlock.displayer) {
                    pageBlock.displayer.close();
                }
            }, function () {
                var msg = localizationService.translate('Messages.UnableToDeleteRecord');
                notificationService.showNotification(msg, true);
            });
        }

        return ActionsListService;
    }]);
/**
 * Created by antons on 5/27/15.
 */
speedupObjectDetailModule.directive('odActionsList', ['$timeout', 'configService',
    'eventManager', 'objectService', 'existingObjectDetailService', 'actionsListService',
    'repeatActionService',
    function ($timeout, configService, eventManager, objectService, existingObjectDetailService,
              actionsListService, repeatActionService) {
        var directiveObject = {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('ActionsList/ActionsList.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            link: function ($scope, $element) {
                // Give time inner ng-repeat to process values
                $timeout(function () {
                    // bind 'delete' button click
                    $element.find('.deleteObjectAction').bind('click', function (e) {
                        var settings = $scope.settings;
                        actionsListService.deleteObject($scope.pageBlock);
                    });
                    // bind 'repeat' button click
                    $element.find('.repeatObjectAction').bind('click',function (e) {
                        var settings = $scope.settings;
                        var startDateStr = settings.overridenFields["Start_Date"];
                        var top = $(this).offset().top;
                        repeatActionService.repeatObject(settings.currentRecord.id,
                            new Date(startDateStr), top);
                    });
                    // bind 'copy' button click
                    $element.find('.copyObjectAction').bind('click',function (e) {
                        var settings = $scope.settings;
                        eventManager.fireEvent(LoadActionStartEvent);
                        actionsListService.copyObject(settings.currentRecord.id, $scope.fields[0],
                            $scope.pageBlock, $scope.settings.odn);
                    });
                    // bind click on 'create new' button with callback
                    $element.find('.subobjectAction').bind('click',function (e) {
                        // TODO: use ODN from scope
                        var odn = $(e.currentTarget).data('objectname');
                        actionsListService.createNewSubObject($scope, odn).
                            then(function () {
                                actionsListService.addNewObjectPageBlockAfterSave($scope);
                            });
                    });
                });
            }
        };


        return directiveObject;
    }]);
/**
 * Created by antons on 5/19/15.
 */
speedupObjectDetailModule.factory('attachmentsService', ['$q', '$http', 'configService', 'dateTimeService', 'filesystemService',
    'localizationService', 'eventManager',
    function ($q, $http, configService, dateTimeService, filesystemService, localizationService, eventManager) {

        var _attachmentImages = {
            'rar': "Archive_RAR.png",
            'zip': "Archive_ZIP.png",
            'mp3': "Audio_MP3.png",
            'bmp': "Image_BMP.png",
            'gif': "Image_GIF.png",
            'jpg': "Image_JPG.png",
            'png': "Image_PNG.png",
            'doc': "Office_DOC.png",
            'docx': "Office_DOC.png",
            'pdf': "Office_PDF.png",
            'txt': "Office_TXT.png",
            'xls': "Office_XLS.png",
            'xlsx': "Office_XLS.png",
            'default': "icon_unknown_32px.gif"
        };

        var _iconsLarge = {
            'rar': 'Large/rar.png',
            'zip': 'Large/rar.png',
            'mp3': 'Large/mp_3.png',
            'doc': 'Large/docx_win.png',
            'docx': 'Large/docx_win.png',
            'pdf': 'Large/pdf.png',
            'txt': 'Large/text.png',
            'xls': 'Large/xlsx_win.png',
            'xlsx': 'Large/xlsx_win.png',
            'jpg': 'Large/jpeg.png',
            'jpeg': 'Large/jpeg.png',
            'default': "Large/default.png"
        };

        var AttachmentsService = function () {
        };
        var gConfig = configService.getGlobalConfig();
        // cached attachments
        var _temporaryAttachments = [];

        /// <summary>
        /// Save Temporary Attachments
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="newRecordId">new record id</param>
        /// <param name="oldTempId">old temporary id</param>
        AttachmentsService.saveTemporaryAttachments = function (odn, newRecordId, oldTempId) {
            var deferred = $q.defer();
            var attachmentIdx = 0;

            _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);

            return deferred.promise;
        };

        // checked
        AttachmentsService.wrapUploader = function (uploaderElement, odn, recordId, attachments, onSuccess) {
            // if element for uploading exist and hasn't been wrapped yet -
            // WRAP IT!!!
            if (uploaderElement.length && !uploaderElement.data('kendoUpload')) {
                uploaderElement.kendoUpload({
                    async: {
                        saveUrl: 'upload',
                        autoUpload: true
                    },
                    multiple: false,
                    localization: {
                        select: localizationService.translate("Buttons.SelectFile"),
                        dropFilesHere: localizationService.translate("Messages.dropfiles"),
                        uploadSelectedFiles: localizationService.translate("Buttons.Send")
                    },
                    // TODO: get params for methods
                    select: function (e) {
                        AttachmentsService.fileUploaderSelect(e, recordId, odn);
                    },
                    success: function (e) {
                        AttachmentsService.fileUploaderSuccess(e, recordId, odn, attachments).then(function (attachments) {
                            // perform additional actions, like bind image to the object detail
                            if (angular.isFunction(onSuccess)) {
                                onSuccess(attachments);
                            }
                        });
                    }
                });
            }
        };

        // checked
        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        AttachmentsService.getIconImages = function (extensionName) {
            var iconName = _attachmentImages[extensionName];
            iconName = iconName || _attachmentImages['default'];

            return filesystemService.getImageIconUrl(iconName);
        };
        // CHECKED
        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        AttachmentsService.getIconImagesLarge = function (extensionName) {
            var iconName = _iconsLarge[extensionName];
            iconName = iconName || _iconsLarge['default'];

            return filesystemService.getImageIconUrl(iconName);
        };
        // NOT CHECKED
        AttachmentsService.fileUploaderSuccess = function (e, recordId, odn, attachmentsPointer) {
            //Add Record To Temporary Object
            if (recordId && recordId.toString().indexOf("Temp_") > -1) {
                if (e.response.FileName != undefined && e.response.FileName != null) {
                    var objTempAttachment = {
                        TemporaryObjectId: recordId,
                        FileName: e.response.FileName,
                        fileExtension: e.response.FileExtension,
                        Status: "Pending",
                        FilePath: e.response.FilePath,
                        CreatedDate: dateTimeService.FormatDateAmPm(new Date())
                    };
                    _temporaryAttachments.push(objTempAttachment);
                    // TODO:
                    var img = _getImageForNewRecord(recordId);
                    eventManager.fireEvent(NewEntryAttachmentUploadedEvent, img);
                }
            }
            // re-obtain attachments from server, because they contain some 'extra' data now
            return AttachmentsService.getAttachments(recordId, odn).then(function (attachments) {
                attachmentsPointer.attachments = attachments.attachments;

                return attachmentsPointer.attachments;
            });

        };
        // CHECKED
        AttachmentsService.fileUploaderSelect = function (e, recordId, odn) {
            var fileName = "";
            var fileExtension = "";
            $.each(e.files, function (index, value) {
                fileName = value.name.substring(0, value.name.lastIndexOf("."));
                console.log("Size: " + value.size + " bytes");
                fileExtension = value.extension;
                fileExtension = fileExtension.substring(1, fileExtension.length);
            });
            var url = "";
            if (recordId && recordId.toString().indexOf("Temp_") > -1) {
                url = configService.getUrlBase('documentsAndAttachementsTemporary') + "/" + odn +
                    "/" + recordId + "/" + fileName + "/" + fileExtension + "/" + gConfig.token + "?RequestType=ud";
            }
            else {
                url = configService.getUrlBase('documentsAndAttachments') + "/" + odn +
                    "/" + recordId + "/" + fileName + "/" + fileExtension + "/" + gConfig.token + "?RequestType=ud";
            }
            e.sender.options.async.saveUrl = url;

        }

        // NOT CHECKED// Uncompleted
        // warning, became async
        /// <summary>
        /// Method will send remove file request to API
        /// </summary>
        /// <param name="fileId">contain file id</param>
        AttachmentsService.removeFile = function (fileId, ObjectDefinitionName, recordId) {
            var deferred = $q.defer();

            // todo. method should return object or index of attachment
            var confirmMessage = localizationService.translate("Messages.DeleteFile");
            if (confirm(confirmMessage)) {
                if (recordId && recordId.toString().indexOf("Temp_") > -1) {
                    _deleteTemporaryAttachments(fileId);
                    deferred.resolve();
                }
                else {
                    return _doRemoveAttachment(fileId, recordId);
                }
            } else {
                deferred.reject('Cancelled by user');
            }

            return deferred.promise;
        }

        // Not checked
        /// <summary>
        /// Method will update image for object if needed
        /// </summary>
        /// <param name="attachmentsObj">attachments object</param>
        AttachmentsService.updateImage = function (attachments) {
            // no attachments yet (or removed)
            var imgUrl = "";
            if (attachments.length) {
                var ext;
                var imageSet = false;
                // search for an image in attachments
                attachments.some(function (elem) {
                        ext = filesystemService.getFileExtension(elem.ImageUrl);
                        // attachment is image
                        if (filesystemService.fileIsImageByExtension(ext)) {
                            imgUrl = filesystemService.changeImageUrl(elem.ImageUrl);
                            imageSet = true;

                            return true;
                        }

                        return false;
                    }
                );
            }

            return imgUrl;
        };

        // USED TO GET ICONS FOR DIFFERENT TYPES OF ATTACHMENTS
        // CAN BE USED LATER
        /// <summary>
        /// Method will update image for object if needed
        /// </summary>
        /// <param name="attachmentsObj">attachments object</param>
        AttachmentsService.updateImage_old = function (attachments) {
            // no attachments yet (or removed)
            if (!attachments.length) {
                imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
            } else {
                var imgUrl = "";

                var ext;
                var iconPath = "";

                var imageSet = false;
                // search for an image in attachments
                attachments.some(function (elem) {
                        ext = filesystemService.getFileExtension(elem.ImageUrl);
                        // attachment is image
                        if (filesystemService.fileIsImageByExtension(ext)) {
                            imgUrl = filesystemService.changeImageUrl(elem.ImageUrl);
                            imageSet = true;

                            return true;
                        } else { // attachment is other file type
                            // find, if there's icon for this type of attachments
                            if (!iconPath) {
                                iconPath = AttachmentsService.getIconImagesLarge(ext);
                            }
                        }

                        return false;
                    }
                );
                // if no image found, but there's an attachment
                if (!imageSet) {
                    if (iconPath) {
                        imgUrl = iconPath;
                    } else {
                        imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
                    }
                }
            }

            return imgUrl;
        };


        // CHECKED
        AttachmentsService.getAttachments = function (recordId, odn) {
            var deferred = $q.defer();

            var attachments;
            var objAttach = {
                addAttachment: true,
                fileUploadId: "FileUpload" + odn + "_" + recordId
            };
            if (recordId.toString().indexOf("Temp") > -1) {
                attachments = _getTemporaryAttachments(recordId);
                if (attachments == undefined || attachments == null || attachments.length == 0) {
                    objAttach.attachments = [];
                }
                else {
                    objAttach.attachments = attachments;
                }

                deferred.resolve(objAttach);
            }
            else {
                _fetchDocumentsAndAttachments(recordId, odn).then(function (attachments) {
                    if (attachments == undefined || attachments == null || attachments.length == 0) {
                        objAttach.attachments = [];
                        deferred.resolve(objAttach);
                    } else {
                        deferred.resolve(attachments);
                    }
                });
            }

            return deferred.promise;
        };

        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        function _getImageForNewRecord(recordId) {
            imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
            var imgUrl = "";
            var iconPath = "";
            var imageSet = false;
            // search for an image in attachments
            _temporaryAttachments.some(function (elem) {
                    if (elem.TemporaryObjectId == recordId && elem.Status == "Pending") {
                        if (filesystemService.fileIsImageByExtension(elem.fileExtension)) {
                            imgUrl = filesystemService.changeTmpImageUrl(elem.FilePath, elem.FileName, elem.fileExtension);
                            imageSet = true;

                            return true;
                        }
                    } else { // attachment is other file type
                        // find, if there's icon for this type of attachments
                        if (!iconPath) {
                            iconPath = AttachmentsService.getIconImagesLarge(ext);
                        }
                    }

                    return false;
                }
            );
            // if no image found, but there's an attachment
            if (!imageSet) {
                if (iconPath) {
                    imgUrl = iconPath;
                } else {
                    imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
                }
            }

            return imgUrl;
        }

        var _doRemoveAttachment = function (fileId, recordId) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('deleteAttachment') + "/" +
                fileId + "/" + recordId + "/" + gConfig.token + "?RequestType=df";
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function (response) {
                    response += "";
                    if (response.indexOf('Success') != -1) {
                        deferred.resolve();
                    } else {
                        deferred.reject('Error deleting the attachment');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (respoonseCodeValue == "UnAuthorized")
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    else
                        deferred.reject(url + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                }
            });

            return deferred.promise;
        };

        // checked
        /// <summary>
        /// Delete Temporary Attachments
        /// </summary>
        var _deleteTemporaryAttachments = function (fileId) {
            for (var i = 0; i < _temporaryAttachments.length; i++) {
                var attachments = _temporaryAttachments[i];

                if (attachments.FileName == fileId) {
                    _temporaryAttachments[i].Status = "Deleted";
                }
            }
        };

        // warning. added params. became async
        // checked
        /// <summary>
        /// method will request to API to get Documents and attachments.
        /// </summary>
        var _fetchDocumentsAndAttachments = function (recordId, odn) {
            var deferred = $q.defer();

            if (recordId) {
                var dataArray = [];
                var obj = {
                    attachments: dataArray,
                    fileUploadId: "FileUpload" + odn + "_" + recordId,
                    addAttachment: true
                };
                var PostData = gConfig.postData;
                PostData.Clear();
                PostData.RequestType = "Attachments";
                var url = configService.getUrlBase('documentsAndAttachments') + "/" + recordId + "/" + gConfig.token;
                $.ajax({
                    type: "GET",
                    url: url,
                    data: PostData,
                    dataType: "json",
                    success: function (attachments) {
                        if (attachments.length > 0) {
                            dataArray = [];
                            $.each(attachments, function (i, e) {
                                if (e.FilePath.indexOf("~/") == 0) {
                                    e.FilePath = e.FilePath.substring(2);
                                }
                                var extension = e.FileName.substring(e.FileName.lastIndexOf(".") + 1, e.FileName.length);
                                var objAttachment = {
                                    ImageUrl: filesystemService.getImageUrl(e.FilePath + e.FileName),
                                    ImageName: e.FileName,
                                    iconPath: AttachmentsService.getIconImages(extension.toLowerCase()),
                                    CreatedDate: e.CreatedDate,
                                    FileId: e.FileId,
                                    ObjectDefinitionName: odn,
                                    recordId: recordId,
                                    Detail: 'detailObject.. Why do we need it?'
                                }
                                dataArray.push(objAttachment);
                            });
                            obj.attachments = dataArray;
                        }

                        deferred.resolve(obj);
                    }, error: function (xhr, ajaxOptions, thrownError) {
                        var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (respoonseCodeValue == "UnAuthorized")
                            deferred.reject(xhr.getResponseHeader('ResponseCode'));
                        else
                            deferred.reject(url + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                    }
                });

            }

            return deferred.promise;
        };

        // CHECKED
        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        var _getTemporaryAttachments = function (recordId) {
            var attachmentsArray = [];
            for (var i = 0; i < _temporaryAttachments.length; i++) {
                var attachments = _temporaryAttachments[i];

                if (attachments.TemporaryObjectId == recordId && attachments.Status == "Pending") {
                    var obj = new Object();
                    obj.Comments = "";
                    obj.ImageName = attachments.FileName + attachments.fileExtension;
                    obj.FileId = attachments.FileName;
                    obj.ObjectRecordId = recordId;
                    obj.ImageUrl = attachments.FilePath;
                    obj.CreatedDate = attachments.CreatedDate;
                    attachmentsArray.push(obj);
                }
            }

            return attachmentsArray;
        };

        /// <summary>
        /// method to save single attachment (calls itself recursively)
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="newRecordId">new record id</param>
        /// <param name="oldTempId">old temporary id</param>
        /// <param name="attachmentIdx">index of attachment in attachments array cache</param>
        function _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx) {
            var length = _temporaryAttachments.length;
            if (length == 0) {
                deferred.resolve();
            } else {
                var attachments = _temporaryAttachments[attachmentIdx];

                if (attachments != undefined && attachments != null && attachments.TemporaryObjectId == oldTempId && attachments.Status == "Pending") {
                    _doSaveTemporaryAttachments(odn, newRecordId, oldTempId, attachments).then(function (response) {
                        if (attachmentIdx != length) {
                            _temporaryAttachments[attachmentIdx].Status = "Finished";
                            attachmentIdx++;
                            // recursively save other attachments
                            _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);
                        }
                    }, function () {
                        attachmentIdx++;
                        // recursively save other attachments
                        _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);
                    });
                } else {
                    attachmentIdx++;
                    if (attachmentIdx < length) {
                        // recursively save other attachments
                        _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);
                    } else {
                        deferred.resolve();
                    }
                }
            }
        }

        /// <summary>
        /// method will actually save attachments
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="newRecordId">new record id</param>
        /// <param name="oldTempId">old temporary id</param>
        /// <param name="attachments">attachments object</param>
        function _doSaveTemporaryAttachments(odn, newRecordId, oldTempId, attachments) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('saveTemporaryAttachments') + "/" + gConfig.token;
            var objPostData = {
                ObjectDefinitionName: odn,
                ObjectRecordId: newRecordId,
                OldTempId: oldTempId,
                fileName: attachments.FileName,
                OldFileName: attachments.FileName,
                FileExtension: attachments.fileExtension,
                token: gConfig.token
            };
            $http.post(url, JSON.stringify(objPostData)).success(function (response) {
                deferred.resolve(response);
            }).error(function () {
                    deferred.reject();
                });

            return deferred.promise;
        }


        return AttachmentsService;
    }
]);
/**
 * Created by antons on 7/9/15.
 */
CSVapp.factory('animationService', ['filesystemService',
    function (filesystemService) {
        var _displayInlineLoaderInProgress = false;
        var _displayGlobaloaderInProgress = false;

        var globalLoader = filesystemService.getPluginImageUrl("js/img/fullpageloader.GIF");
        var inlineLoader = filesystemService.getPluginImageUrl("js/img/loader.gif");

        var AnimationService = function () {
        };

        /// <summary>
        /// Method will display loader (for 'global' events)
        /// </summary>
        AnimationService.displayGlobalLoader = function () {
            if (!_displayGlobaloaderInProgress) {
                var message = $("<div id='globalLoader' class='_messagediv1 messagediv' style='z-index: 20005;'>" +
                    "<img src='" + globalLoader + "' style='left: 45%;top: 50%; z-index: 20005; position: absolute;'/>" +
                    "<div style='position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; '></div>" +
                    "<div class='statusMessage rb-a-4 _status'>" +
                    "<span class='_message'></span>" +
                    "</div>" +
                    "</div>");
                _displayGlobaloaderInProgress = true;
                $(document.body).append(message);
            }
        };
        /// <summary>
        /// Method will hide loader
        /// </summary>
        /// <param name="element">HTML Element</param>
        AnimationService.hideGlobalLoader = function () {
            if (_displayGlobaloaderInProgress) {
                $("#globalLoader").remove();
                _displayGlobaloaderInProgress = false;
            }
        };
        // Checked
        /// <summary>
        /// Method will display loader
        /// </summary>
        /// <param name="element">HTML Element</param>
        AnimationService.displayInlineLoader = function (element) {
            if (!_displayInlineLoaderInProgress) {
                $('<img src="' + inlineLoader + '" class="_inlineLoader" Height="15px" Width="15px">').insertAfter(element);
                _displayInlineLoaderInProgress = true;
            }
        };
        // checked
        /// <summary>
        /// Method will hide loader
        /// </summary>
        /// <param name="element">HTML Element</param>
        AnimationService.hideInlineLoader = function (element) {
            if (_displayInlineLoaderInProgress) {
                $("._inlineLoader").remove();
                _displayInlineLoaderInProgress = false;
            }
        };


        return AnimationService;
    }]);
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
/**
 * Created by C4off on 31.08.15.
 */
speedupObjectDetailModule.factory('inlineFieldValueValidatorService', ['configService',
    function (configService) {

        var gConfig = configService.getGlobalConfig();

        var InlineFieldValueValidatorService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to perform validation of a single field
        /// </summary>
        /// <param name="pageBlock">page block object</param>
        /// <param name="simpleBlock">element 'wrapper' block</param>
        InlineFieldValueValidatorService.performValidation = function (pageBlock, simpleBlock) {
            var validated = true;
            var input = simpleBlock.parent().find('._editBlock').find('input[type!=\'hidden\']');
            var dataType = input.attr('v-type');
            var validator = this.getValidator(pageBlock, dataType);
            if (validator) {
                validated = validator.validateInput(input);
            }

            return validated;
        };

        InlineFieldValueValidatorService.getValidator = function(object, dataType){
            var containerEl;
            if(object instanceof DetailPageBlock){
                containerEl = object.contentObject.element;
            } else{
                containerEl = object;
            }

            return _getValidator(containerEl, dataType);
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// factory to get custom validator by field dataType
        /// </summary>
        /// <param name="element">container</param>
        /// <param name="dataType">data type of a field</param>
        function _getValidator(element, dataType) {
            var validatorObj, validator;
            if (dataType == gConfig.dataTypes.Date) {
                validatorObj = {
                    rules: {
                        dateValidation: function (e) {
                            return !!kendo.parseDate($(e).val());
                        }
                    }
                };
                validator = element.find('.tbldetail').kendoValidator(validatorObj).data("kendoValidator");
            } else if (dataType == gConfig.dataTypes.DateTime) {
                validatorObj = {
                    rules: {
                        dateTimeValidation: function (e) {
                            var regExp = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
                            var test = regExp.test($(e).val());
                            return test ? !!kendo.parseDate($(e).val()) : test;
                        }
                    }
                };
                validator = element.find('.tbldetail').kendoValidator(validatorObj).data("kendoValidator");
            }
            else {
                validator = element.find('.tbldetail').kendoValidator().data("kendoValidator");
            }

            return validator;
        }

        return InlineFieldValueValidatorService;
    }]);
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

/**
 * Created by antons on 5/19/15.
 */
speedupObjectDetailModule.factory('tabStripService', ['attachmentsService', 'existingObjectDetailService',
    'objectDetailService', 'objectDetailDisplayerService', 'tsHeaderSubObjectService',
    function (attachmentsService, existingObjectDetailService,
              objectDetailService, objectDetailDisplayerService, tsHeaderSubObjectService) {
        var TabStripService = function () {

        };

        /*PUBLIC METHODS*/
        TabStripService.onSelectTab = function (tabStripData, element, e, settings, pageBlock) {
            // TODO: maybe, there will be a need to choose only related subobjects
//            var recordId = settings.recordId;
            var recordId = settings.currentRecord.id;
            var odn = settings.odn;
            var selectedTab = $(element).find(e.item);
            var currentTab = e.sender.select();
            if(currentTab.hasClass('_tabDetails')){
                pageBlock.hideChildren();
            } else if(selectedTab.hasClass('_tabDetails')){
                pageBlock.showChildren();
            }
            if (selectedTab.hasClass('_tabAttachments')) {
                // if scope.attachments has elements, then
                // attachments have been already bound
                if (!tabStripData.attachments || !tabStripData.attachments.attachments) {
                    attachmentsService.getAttachments(recordId, odn).then(function (attachments) {
                        tabStripData.attachments = attachments;
                    });
                }
            }
            else if (selectedTab.hasClass("_subObjectTab")) { /// to show the subobject in tab
                var tabData = selectedTab.data().$scope.tab;
                var contentElement = angular.element(e.contentElement);
                var objectDataContainer = contentElement.find('._subObjectContent');
                tsHeaderSubObjectService.createSubObjectPage(objectDataContainer, tabData.ObjectDefinitionName, "Default", recordId,
                    tabData.PropertyName);
            }
        };

        return TabStripService;
    }]);
/**
 * Created by antons on 5/18/15.
 */
speedupObjectDetailModule.directive('tabStrip', [ '$timeout', 'tabStripService', 'configService',
        function ($timeout, tabStripService, configService) {
            var defaultSettings = {
                showAttachments: true,
                addAttachment: true,
                recordId: null,
                odn: null
            };
            return {
                templateUrl: function (tElement, tAttrs) {
                    // TODO: get address of templates from options
                    return tAttrs.templateUrl ||
                        configService.getTemplateUrl('TabStrip/TabStrip.html');
                },
                restrict: "EA",
                transclude: true,
                replace: true,
                controller: ['$scope', function ($scope) {
                    // merge directive settings with default
                    $scope.tabStrip.settings = $scope.tabStrip.settings ?
                        angular.extend(defaultSettings, $scope.tabStrip.settings) :
                        defaultSettings;
                    // if we want to show attachments
                    // tab we need to initialize $scope.attachments
                    if ($scope.tabStrip.settings.showAttachments) {
                        $scope.tabStrip.attachments = $scope.tabStrip.attachments || [];
                    }
                }],
                link: {
                    post: function ($scope, $element) {
                        // timeout is needed, because nested
                        // ng-repeat hasn't been compiled yet
                        $timeout(function () {
                            // wrap tabstrip with kendo
                            $element.kendoTabStrip({
                                select: function (e) {
                                    return tabStripService.onSelectTab(
                                        $scope.tabStrip, $element, e,
                                        $scope.settings, $scope.pageBlock);
                                },
                                animation: false,
                                navigatable : false
                            });
                            // set equal min height to all content panes
                            $element.find(".k-content").css('min-height', $element.find("._detailsContent:first").height());
                            // Bind attachment image change
                            $scope.$on(AttachmentImageChangedEvent, function(scope, imgUrl){
                                $element.find('.ContainerDiv.widen').removeClass('widen');
                                $element.find('.ContainerDiv.hidden').removeClass('hidden');
                                $element.find('._AttachmentImages>img').attr('src', imgUrl);
                            })
                        });
                    }
                }
            };
        }]);


/**
 * Created by antons on 5/20/15.
 */
speedupObjectDetailModule.directive('objectDetailAttachment', ['$timeout', 'attachmentsService',
    'notificationService', 'configService',
    function ($timeout, attachmentsService, notificationService, configService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('TabStrip/ObjectDetailAttachmentTemplate.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            scope: {
                source: '=source',
                settings: '=settings'
            },
            controller: ['$scope', function ($scope) {
                $scope.removeFile = function (fileId, odn, recordId) {
                    attachmentsService.removeFile(fileId, odn, recordId).then(function () {
                        debugger;
                        var refreshedAttachments = [];
                        // delete attachment from scope.attachments to refresh the list
                        $scope.source.attachments.forEach(function (elem) {
                            if (elem.FileId != fileId) {
                                refreshedAttachments.push(elem);
                            }
                        });
                        $scope.source.attachments = refreshedAttachments;
                        // update image if needed
                        var imgUrl = attachmentsService.updateImage($scope.source.attachments);
                        if(imgUrl){
                            $scope.$emit(AttachmentImageChangedEvent, imgUrl);
                        }
                    }, function (message) {
                        notificationService.showNotification(message, true);
                    })
                }
            }],
            link: function ($scope, $element) {
                var odn = $scope.settings.odn;
                var recordId = $scope.settings.recordId;
                // wrap uploader if needed
                $scope.$watch('source', function (src) {
                    if (src.addAttachment) {
                        $timeout(function () {
                            var uploaderElement = $element.find("." + src.fileUploadId);
                            attachmentsService.wrapUploader(uploaderElement, odn, recordId, $scope.source,
                            function(attachments){
                                var imgUrl = attachmentsService.updateImage(attachments);
                                if(imgUrl){
                                    $scope.$emit(AttachmentImageChangedEvent, imgUrl);
                                }
                            });
                        });
                    }
                });
            }
        }
    }
]);

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
/**
 * Created by antons on 5/25/15.
 */
speedupObjectDetailModule.factory('existingObjectDetailService', ['$q', '$rootScope', '$compile', '$http',
    'configService', 'schemaService', 'detailPageFieldValuesService', 'objectDataService',
    'fieldPropertiesService', 'filesystemService', 'attachmentsService', 'objectDetailService',
    'objectDetailDisplayerService', 'eventManager', 'notificationService', 'localizationService',
    'objectTemplateService',
    function ($q, $rootScope, $compile, $http, configService, schemaService, detailPageFieldValuesService,
              objectDataService, fieldPropertiesService, filesystemService, attachmentsService,
              objectDetailService, objectDetailDisplayerService, eventManager, notificationService, localizationService,
              objectTemplateService) {
        var gConfig = configService.getGlobalConfig();

        var ExistingObjectDetailService = function () {
        };

        /*PUBLIC METHODS*/
        // shows detail page for edition/creating the event
        ExistingObjectDetailService.displayObjectDetail = function (eventId, odn, displayMode,
                                                                    overridenFields, skipSubObjects) {
            // create settings block, that'll be passed to inline methods
            var detailPageSettings = {
                odn: odn,
                recordId: eventId,
                fieldEditMode: 'single',
                pageSize: 5,
                displayMode: displayMode,
                editMode: 'detail'
            };
            // fields, where default values would be overriden
            if (overridenFields) {
                detailPageSettings.overridenFields = overridenFields;
            }
            ExistingObjectDetailService.getObjectsWithSubObjects(detailPageSettings, skipSubObjects);
        };

        ExistingObjectDetailService.getObjectsWithSubObjects = function (detailPageSettings, skipSubObjects) {
            // create page block for main object
            return ExistingObjectDetailService.createDetailPageBlock(detailPageSettings).then(function (parentDetailPageBlock) {
                return schemaService.createPageTitle(detailPageSettings.odn).then(function (title) {
                    // open popup and set page block as content
                    var displayer = objectDetailDisplayerService.getDisplayer(detailPageSettings.displayMode);
                    displayer.getDetailView(title, parentDetailPageBlock);
                    // get subobjects
                    if (!skipSubObjects){
                        ExistingObjectDetailService.appendSubObjects(parentDetailPageBlock);
                    }

                    return displayer;
                })
            }, function(){
                // in case of no data exception
                eventManager.fireEvent(LoadActionEndEvent);
                var msg = localizationService.translate("Messages.FailedToLoadData");
                notificationService.showNotification(msg, true);
            });
        };


        ExistingObjectDetailService.appendSubObjects = function (parentDetailPageBlock) {
            var settings = parentDetailPageBlock.settings;
            var parentOdn = settings.odn;
            var pageSize = settings.pageSize;
            var parentRecordId = settings.recordId;
            var subObjTypeStr = settings.subObjectsField;

            return _getSubObjectsUnderMainRecordMeta(parentOdn, subObjTypeStr).then(function (subObjectsArray) {
                // just skip if we have no info on subObjects
                if (!$.isArray(subObjectsArray) || !subObjectsArray.length) {
                    return $q.when('noObj');
                }
                subObjectsArray.forEach(function (subObj) {
                    var odn = subObj.ObjectDefinitionName;
                    var propertyName = subObj.PropertyName;
                    // We need it to fetch several pages of objects from API
                    var pageIndex = 0;
                    // get N subObjects from API
                    _getNSubObjectsRecursive(odn, propertyName, parentRecordId,
                        pageSize, pageIndex, parentDetailPageBlock);
                });
            });
        };

        function _getNSubObjectsRecursive(odn, propertyName, parentRecordId, pageSize, pageIndex, parentDetailPageBlock) {
            _getNSubObjects(odn, propertyName, parentRecordId,
                pageSize, pageIndex, parentDetailPageBlock).then(function (qty) {
                    if (!qty || qty < pageSize) {
                        return null
                    } else {
                        pageIndex++;
                    }
                    _getNSubObjectsRecursive(odn, propertyName, parentRecordId,
                        pageSize, pageIndex, parentDetailPageBlock)
                });
        }

        function _getNSubObjects(odn, propertyName, parentRecordId, pageSize, pageIndex, parentDetailPageBlock) {
            return _fetchSubObjects(odn, propertyName, parentRecordId, pageSize, pageIndex).then(function (objects) {
                if (!objects) {
                    return null
                }
                // We need to pass some parameters through with these settings
                var detailPageSettings = parentDetailPageBlock.settings;
                var queue = _createObjectQueue(objects, odn, pageSize, detailPageSettings);
                // queue is empty, don't process subobjects
                if (!queue.length) {
//                    console.log('No queue length');
                    return null;
                }
                return _processSubObjectsQueue(queue, parentDetailPageBlock).then(function () {
                    return objects.length;
                });
            }, function () {
                // API failed, no need to fetch more objects
            });
        }

        function _createObjectQueue(objects, odn, pageSize, settings) {
            // every  subObject render promise will
            // be put here to preserve original ordering, because subObjects with
            // children will render faster, than ones without
            var queue = [];
            objects.forEach(function (object) {
                // TODO: legacy code 'inherited' pageTemplateName for subobjects
                var recordId = object.ObjectEntry_ID;
                // create DetailPageBlock
                var detailPageBlockSettings = {
                    odn: odn,
                    recordId: recordId,
                    fieldEditMode: 'single',
                    displayMode: {
                        type: 'popup'
                    },
                    editMode: 'detail',
                    pageSize: pageSize,
                    currentRecord: {
                        id: object.ObjectEntry_ID,
                        name: object.Name,
                        fk: object.ObjectDefinition_fk
                    }
                };
                if (settings.overridenFields) {
                    detailPageBlockSettings.overridenFields = settings.overridenFields;
                }
                // every child block is in promise
                queue.push(
                    ExistingObjectDetailService.createDetailPageBlock(detailPageBlockSettings, object).then(function (pageBlock) {
                        return ExistingObjectDetailService.appendSubObjects(pageBlock)
                            .then(function () {
//                                console.log('Page block id: ' + pageBlock.id + ' ready');
                                return pageBlock;
                            });
                    })
                );
            });

            return queue;
        }

        function _processSubObjectsQueue(queue, parentPageBlock) {
            // append them only after all of them rendered
            var currentPromise = queue.shift();

            queue.forEach(function (promise) {
                currentPromise = currentPromise.then(function (childBlock) {
                    if (childBlock) {
                        parentPageBlock.appendChildBlock(childBlock);
                    }

                    return promise;
                });
            });
            return currentPromise.then(function (childBlock) {
                if (childBlock) {
                    parentPageBlock.appendChildBlock(childBlock);
                }
                // Maybe, time to finish showing 'loading' icon
                eventManager.fireEvent(LoadActionEndEvent);

                // At last return parent page block
                return parentPageBlock;
            });
        }

        /// <summary>
        /// Method will create new DetailPageBlock for particular dataItem
        /// </summary>
        /// <param name="dataItem">object data</param>
        /// <param name="settings">detail page settings</param>
        /// <param name="fields">optional. May be passed fields data of event</param>
        /// <return>promise</return>
        ExistingObjectDetailService.createDetailPageBlock = function (settings, fields) {
            // fire event that 'loading' begins
            eventManager.fireEvent(LoadActionStartEvent);

            // sometimes schema service cannot provide 'field properties' and 'template'
            // info yet, so not to cause several simultanious API request for same data by 'sibling'
            // objects we proceed only when we're sure, that we
            // already have 'field properties' and 'template' data
            return schemaService.getSchema(settings.odn).then(function(){
                return objectTemplateService.getObjectTemplate(settings.odn).then(function(){
                    var odn = settings.odn;
                    var recordId = settings.recordId;

                    // create new PageBlock
                    var pageBlock = new DetailPageBlock(settings);
                    // get Fields, menu, tabStrip, template promises and title
                    var promises = [
                        ExistingObjectDetailService.getActionsListPromise(odn),
                        ExistingObjectDetailService.getTabStripTabsPromise(odn, recordId),
                        ExistingObjectDetailService.getDetailPageTemplate(),
                        schemaService.createPageTitle(odn),
                        ExistingObjectDetailService.getFieldsPromise(odn, recordId, settings, fields)
                        // todo: get maps and summary, now they're in getFieldsPromise
                    ];
                    return $q.all(promises).then(function (resolvedPromises) {
                        // create scope and set values
                        var scope = $rootScope.$new();
//                        scope.fields = resolvedPromises[3];
                        scope.fields = resolvedPromises[4];
                        scope.actions = resolvedPromises[0];
//                        scope.tabStrip = {};
//                        var tpl = resolvedPromises[1];
//                        scope.objectType = resolvedPromises[2];
                        scope.tabStrip = resolvedPromises[1];
                        var tpl = resolvedPromises[2];
                        scope.objectType = resolvedPromises[3];

                        // also bind settings of the whole PageBlock
                        scope.settings = settings;
                        scope.pageBlock = pageBlock;
                        var contentObject = new ContentObject();
                        // $compile template
                        $compile(tpl)(scope);
                        // set scope and content of pageBlock
                        contentObject.content = tpl;

                        pageBlock.contentObject = contentObject;

                        // fire 'stopped loading'
                        eventManager.fireEvent(LoadActionEndEvent);

                        return pageBlock;
                    });
                });
            });
        };
        /// <summary>
        /// Method will get promise, resolving with data for fields of object Detail Page
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        /// <return>promise</return>
        ExistingObjectDetailService.getFieldsPromise = function (odn, recordId, settings, fields) {
            // get item data
            if (fields) {
                return _getFieldPromiseByObjectData(odn, recordId, fields);
            } else {
                return objectDataService.fetchSingleObjectData(recordId, odn).then(function (data) {
                    if(!data){
                        throw new NoDataException('Failed to get data from server');
                    }
                    // put current record data in detailPageBlock settings.
                    // It's not a good place, but the only,
                    // since we don't have access to this data elsewhere
                    settings.currentRecord = {
                            id: data.ObjectEntry_ID,
                            name: data.Name,
                            fk: data.ObjectDefinition_fk
                        };
                    // here we have event data
                    // we need template data
                    return _getFieldPromiseByObjectData(odn, recordId, data);
                });
            }
        };
        function _getFieldPromiseByObjectData(odn, recordId, data) {
            return  objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // get fields selected for template
                var selectedFieldsString = "";
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedColumnsForTemplate) {
                    selectedFieldsString = jsonSettings[0].SelectedColumnsForTemplate;
                }
                var selectedFields = [];
                // getting selected fields array from string
                selectedFieldsString.split(",").forEach(function (fieldName) {
                    if (fieldName != "") {
                        selectedFields.push(fieldName.replace(/[[\]]/g, ''));
                    }
                });
                // get properties for that fields
                var fieldsWithProperties = fieldPropertiesService.getAllPropertiesOfFieldsArray(selectedFields, odn);
                // Filter API fields. Not all of the 'selected 4 template' fields are present in API data
                // set values for the fields (+ Maps and Summary)
                var fieldValuesCombined = _setFieldValues(fieldsWithProperties, data, recordId);

                var fields = [fieldValuesCombined.data];
                fields[0].Maps = fieldValuesCombined.maps || [];
                fields[0].Summary = fieldValuesCombined.summary || [];
                var img = ExistingObjectDetailService.getAttachmentImage(data);
                if(img){
                    fields[0].ImageUrl = img;
                }

                return fields;
            });
        }

        /// <summary>
        /// Method will get url for attachments image from object settings
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        ExistingObjectDetailService.getAttachmentImage = function (objectSettings) {
            var attachmentUrl = "";
            if (objectSettings && objectSettings[SUConstants.RecordFirstImageColumn]) {
                attachmentUrl = objectSettings[SUConstants.RecordFirstImageColumn];
            }
            var image;
            // if we have already passed absolute src for image
            if(filesystemService.isImageUrlAbsolute(attachmentUrl)){
                image = attachmentUrl;
            } else if (attachmentUrl) { // here we have first attachment file
                var fileExtension = filesystemService.getFileExtension(attachmentUrl);
                // check if it's an image
                if (filesystemService.fileIsImageByExtension(fileExtension)) {
                    image = filesystemService.changeImageUrl(attachmentUrl);
                }
            }

            return image;
        };
        // THIS METHOD WAS USED TO GET ICON FOR DIFFERENT
        // TYPES OF ATTACHMENTS. MAY BE NEEDED LATER
        /// <summary>
        /// Method will get url for attachments image from object settings
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        ExistingObjectDetailService.getAttachmentImage_old = function (objectSettings) {
            var attachmentUrl = "";
            if (objectSettings && objectSettings[SUConstants.RecordFirstImageColumn]) {
                attachmentUrl = objectSettings[SUConstants.RecordFirstImageColumn];
            }
            var icon;
            // if we have already passed absolute src for image
            if(filesystemService.isImageUrlAbsolute(attachmentUrl)){
                icon = attachmentUrl;
            } else if (attachmentUrl) { // here we have first attachment file
                var fileExtension = filesystemService.getFileExtension(attachmentUrl);
                // check if it's an image
                if (filesystemService.fileIsImageByExtension(fileExtension)) {
                    icon = filesystemService.changeImageUrl(attachmentUrl);
                } else {
                    // try to find an icon for that type of file
                    icon = attachmentsService.getIconImagesLarge(fileExtension);
                    if (!icon) {
                        icon = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
                    }
                }
            }
            // or nothing...
            else {
                icon = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
            }

            return icon;
        };
        /// <summary>
        /// Method will get data for 'actions' menu
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        ExistingObjectDetailService.getActionsListPromise = function (odn) {
            return objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // Get subobjects
                var selectedRelatedObjects;
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedRelatedObjectsForTemplate) {
                    selectedRelatedObjects = jsonSettings[0].SelectedRelatedObjectsForTemplate;
                    if (jsonSettings[0].RelatedObjectUnderMainRecord) {
                        selectedRelatedObjects += jsonSettings[0].RelatedObjectUnderMainRecord;
                    }
                } else {
                    selectedRelatedObjects = null;
                }
                return objectDataService.getSubObjects(odn, selectedRelatedObjects).then(function (subObjects) {
                    // TODO: remove hard-code (move repeatable sign to API response)
                    var meta = {subObjects: subObjects};
                    if (odn == "Work_Order_Detail") {
                        meta.objectRepeatable = true;
                    }

                    return meta;
                });
            });
        };
        /// <summary>
        /// Method will get promise, resolving with data for tabStrip
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="recordId">record id</param>
        /// <return>promise</return>
        ExistingObjectDetailService.getTabStripTabsPromise = function (odn, recordId) {
            return _getTabStripTabs(odn).then(function (tabs) {
                return {
                    settings: {
                        showAttachments: true,
                        addAttachment: true,
                        recordId: recordId,
                        displaySubObjectRecordAddButton: true,
                        attachmentId: "attachmentContent" + odn + "_" + recordId,
                        odn: odn
                    },
                    tabs: tabs,
                    // 'real' attachments are bound when selected for the first time
                    attachments: []
                }
            });

        };
        /// <summary>
        /// Method will return template for 'ObjectDetail' block
        /// </summary>
        // <return>promise</return>
        ExistingObjectDetailService.getDetailPageTemplate = function () {
            var deferred = $q.defer();

            var templateUrl = configService.getTemplateUrl('ObjectDetail/ExistingObjectDetail.html');
            $http.get(templateUrl).success(function (result) {
                deferred.resolve(angular.element(result));
            }).error(function () {
                    deferred.reject('Error loading template ' + templateUrl);
                });

            return deferred.promise;
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Method will fetch subObject data
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propertyName">object property, containing parent object ODN</param>
        /// <param name="parentRecordId">id of a parent record</param>
        /// <param name="pageSize">how many objects to fetch</param>
        /// <param name="pageIndex">index of current page(if pageSize<records total)</param>
        /// <return>promise</return>
        function _fetchSubObjects(odn, propertyName, parentRecordId, pageSize, pageIndex) {
            var filterExpression = propertyName ? " [" + propertyName + "] Like '" + parentRecordId + ":%' " : ""

            return objectDataService.fetchObjects(odn, pageSize, pageIndex, filterExpression);
        }

        /// <summary>
        /// get ODN's of object's subObjects, selected to be viewed under main record
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="subObjTypeStr">type of subObjects (for tabStrip or to
        //  display under main record)</param>
        /// <return>promise</return>
        function _getSubObjectsUnderMainRecordMeta(odn, subObjTypeStr) {
            return objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // Get subobjects
                var selectedRelatedObjects;
                subObjTypeStr = subObjTypeStr || "RelatedObjectUnderMainRecord";
                if (jsonSettings && jsonSettings[0] && jsonSettings[0][subObjTypeStr]) {
                    selectedRelatedObjects = jsonSettings[0][subObjTypeStr];
                } else {
                    selectedRelatedObjects = null;
                }
                return objectDataService.getSubObjects(odn, selectedRelatedObjects, true);
            });
        }

        /// <summary>
        /// get tabs data fro tabStrip
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <return>promise</return>
        function _getTabStripTabs(odn) {
            return objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // Get subobjects
                var selectedRelatedObjects;
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedRelatedObjectsForTemplate) {
                    selectedRelatedObjects = jsonSettings[0].SelectedRelatedObjectsForTemplate;
                } else {
                    selectedRelatedObjects = null;
                }
                return objectDataService.getSubObjects(odn, selectedRelatedObjects);
            });
        }

        /// <summary>
        /// Method will set a values for array of fields with settings
        /// </summary>
        /// <param name="fields">fields with properties array</param>
        /// <param name="values">hash (propertyName->value)</param>
        /// <param name="recordId">id of a record</param>
        function _setFieldValues(fields, values, recordId) {
            var returnObject = {
                maps: [],
                summary: [],
                data: []
            };

            var propertyName, value;

            fields.forEach(function (fieldObj) {
                propertyName = fieldObj.PropertyName;
                value = values[propertyName];

                if (fieldObj && fieldObj.PropertyLabel && value != undefined) {
                    // Trying to fix date if broken
                    if (fieldObj.DataType == gConfig.dataTypes.DateTime) {
                        // validating the date
                        var date = kendo.parseDate(value);
                        if (date) {
                            value = kendo.toString(date, "yyyy-MM-dd HH:mm:ss");
                        }
                    }
                    fieldObj.PropertyValue = value;
                    fieldObj.ObjectEntry_fk = "";
                    fieldObj.InlineEdit = false;
                    fieldObj.UniqueKey = recordId;
                    fieldObj = detailPageFieldValuesService.setValuesForElements(fieldObj, propertyName);

                    if (fieldObj.DataType == gConfig.dataTypes.GeoData) {
                        returnObject.maps.push(fieldObj);
                    }
                    else if (fieldObj.DataType == gConfig.dataTypes.Summary) {
                        returnObject.summary.push(fieldObj);
                    } else {
                        returnObject.data.push(fieldObj);
                    }
                }

            });

            return returnObject;
        }

        return ExistingObjectDetailService;
    }]);
speedupObjectDetailModule.directive('odDetailsBlock', ['configService', 'dateTimeService', 'filesystemService', 'objectDetailService',
        'detailPageFieldService', 'eventManager', 'notificationService', 'localizationService',
        'fieldService', 'detailPageMapService', 'fieldInlineEditService', 'fieldPropertiesService',
        function (configService, dateTimeService, filesystemService, objectDetailService, detailPageFieldService, eventManager, notificationService, localizationService, fieldService, detailPageMapService, fieldInlineEditService, fieldPropertiesService) {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl || configService.getTemplateUrl('ObjectDetail/DetailsBlock.html');
                },
                restrict: "EA",
                transclude: true,
                replace: true,
                controller: function ($scope, $element, $attrs, $transclude) {
                    if ($scope.fields && $scope.fields.length) {
                        // hack to use kendo template in angular
                        // wrap <script> in div
                        var contentTpl = angular.element('#odDetailsBlock', $element);
                        var tpl = kendo.template(contentTpl.html());
                        // add helpers to template
                        $scope.fields[0].helpers = {
                            'dateTimeFormat': dateTimeService.DateTimeFormat,
                            'dateFormat': dateTimeService.DateFormat,
                            'getPluginImageUrl': filesystemService.getPluginImageUrl
                        };
                        var rendered = kendo.render(tpl, $scope.fields);
                        $element.html(rendered);
                    }
                },
                link: function ($scope, $element) {
                    if ($scope.fields && $scope.fields.length) {
                        var gConfig = configService.getGlobalConfig();
                        var dataTypes = gConfig.dataTypes;

                        var odn = $scope.settings.odn;
                        var recordId = $scope.settings.recordId;
                        var editMode = $scope.settings.fieldEditMode;
                        var pageBlock = $scope.pageBlock;
                        var detailBlockContainer = pageBlock.contentObject.element;
                        // set this pageBlock as current (with second param == true
                        // only first pagBlock will be set as current)
                        setTimeout(function () {
                            pageBlock.setRootAwareOfCurrent(pageBlock, true);
                            var rootBlock = pageBlock.getRootBlock(pageBlock);
                            // activate page block if it's current
                            if (pageBlock.id == rootBlock.currentPageBlock.id) {
                                fieldInlineEditService.activateCurrentPageBlock(pageBlock, $scope, allBlocks, false);
                                // bind 'activateFirstPagBlock' event
                                $(document).on('activateFirstPageBlock', function (evt) {
                                    var rootBlock = pageBlock.getRootBlock(pageBlock);
                                    // activate page block if it's current
                                    fieldInlineEditService.activateCurrentPageBlock(pageBlock, $scope, allBlocks, false);
                                });
                            }
                        }, 1000);
//                        pageBlock.setRootAwareOfCurrent(pageBlock, true);
                        // skip 'read-only fields' from tabbing
                        var allBlocks = detailBlockContainer.find('.simpleBlock').filter(function (idx, block) {
                            var container = $(block).closest("._keycontainer");
                            var fieldName = $(container).attr("key");
                            if(fieldName && fieldName.indexOf('empty') != -1){
                                return false;
                            }
                            var fieldProperties = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, odn);
                            // skip some fields, like map
                            if (angular.isObject(fieldProperties) && fieldProperties.DataType) {
                                if (fieldProperties.DataType == dataTypes.GeoData) {
                                    return false;
                                }
                            }
                            return !fieldService.isFieldReadOnly(fieldName);
                        });
                        // init editors fields
                        fieldService.initializeEditors($scope.fields[0], $element);
                        // disable editors
                        var isNewEntry = $scope.settings.isNewEntry || false;
                        detailPageFieldService.disableEditors($scope.fields[0], isNewEntry, $element);
                        // init maps
                        if($scope.fields[0].Maps){
                            setTimeout(function () {
                                detailPageMapService.createMaps($scope.fields[0].Maps);
                            }, 2000);
                        }
                        // bind 'click' handler
                        detailBlockContainer.find('.detailPageMainBlock').click(function (e) {
                            var target = $element.find(e.target);
                            fieldInlineEditService.checkBlockIsCurrent(pageBlock);
                            fieldInlineEditService.inlineClick(target, pageBlock, odn, recordId, editMode, $scope);
                        });
                        // bind 'tab' and 'enter' press
                        detailBlockContainer.on('detailKeypress', function (e) {
                            var keyCode = e.keyCode || e.which;
                            if (keyCode == 9) {
                                e.preventDefault();
                                $scope.selectedBlock = fieldInlineEditService.tabPressed(
                                    $scope.selectedBlock, allBlocks, odn, pageBlock,
                                    recordId, editMode, $scope);
                            } else if (keyCode == 13) {
                                var target = $element.find(e.target);
                                fieldInlineEditService.enterPressed(target, $scope,
                                    pageBlock, odn, recordId, editMode, allBlocks);
                            } else if (keyCode == 169) {
                                e.preventDefault();
                                $scope.selectedBlock = fieldInlineEditService.tabPressed(
                                    $scope.selectedBlock, allBlocks, odn, pageBlock,
                                    recordId, editMode, $scope, true);
                            }
                        });
                        // bind 'activatePagBlock' event
                        detailBlockContainer.on('activatePageBlock', function (evt) {
                            var rootBlock = pageBlock.getRootBlock(pageBlock);
                            // activate page block if it's current
                            if (pageBlock.id == rootBlock.currentPageBlock.id) {
                                fieldInlineEditService.activateCurrentPageBlock(pageBlock, $scope, allBlocks,
                                    evt.reverse);
                            }
                        });
                        if ($scope.fields[0].DisplaySaveRecordButton) {
                            detailBlockContainer.find('._btnCreateRecord').one('click', function (e) {
                                eventManager.fireEvent(LoadActionStartEvent);
                                return objectDetailService.saveNewRecord(detailBlockContainer, odn).then(function (response) {
                                    eventManager.fireEvent(LoadActionStartEvent);
                                    objectDetailService.afterCreateNewRecord($element, odn, response);
                                }, function (error) {
                                    eventManager.fireEvent(LoadActionStartEvent);
                                    notificationService.showNotification(error, true);
                                });
                            });
                            detailBlockContainer.find('._btnCancelCreateRecord').bind('click', function () {
                                eventManager.fireEvent(NewODActionButtonClicked);
                            });
                        }
                        // bind related object search click
                        detailBlockContainer.find('._objRelButton').click(function (e) {
                            var target = angular.element(e.currentTarget);
                            var container = target.closest('._editBlock');
                            var value = container.find('input[id^="txt"]').val();
                            var popupTop = pageBlock.element.offset().top + 50 + 'px';
                            objectDetailService.openRelationalRecordPopup(target, $scope.fields[0], value, popupTop);
                            // Not returning false caused page reloading
                            return false;
                        });
                        // bind 'get address' map button
                        detailBlockContainer.find('.getAddressLink').click(function () {
                            var geoData = $scope.fields[0].Maps[0];
                            detailPageMapService.getAddressFromLatLong(geoData.LatField, geoData.LongField,
                                geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                        });
                        // bind 'get coordinates' map button
                        detailBlockContainer.find('.getLatLongLink').click(function () {
                            var geoData = $scope.fields[0].Maps[0];
                            detailPageMapService.getLatLongFromAddress(geoData.LatField, geoData.LongField,
                                geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                        });
                        // bind 'get current location' map button
                        detailBlockContainer.find('.getCurrentLocationLink').click(function () {
                            var geoData = $scope.fields[0].Maps[0];
                            detailPageMapService.getCurrentLocation(geoData.LatField, geoData.LongField,
                                geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                        });
                        // Bind dependant field update on autocomplete
                        eventManager.addListener(ObjectDetailFieldUpdatedEvent, function (data) {
                            detailPageFieldService.updateRelatedField(data.container, data.value,
                                data.propertyId, data.propertyFk, data.propertyName);
                        }, pageBlock.settings);
                        // Bind update attachment image (for new entries)
                        eventManager.addListener(NewEntryAttachmentUploadedEvent, function (imgUrl) {
                            if (imgUrl) {
                                $element.find('.attachmentImages img').attr('src', imgUrl);
                            }
                        }, pageBlock.settings);

                    }
                }
            };
        }])
    .directive('newObjectDetail', ['$timeout', 'configService', 'attachmentsService', 'objectDetailService',
        function ($timeout, configService, attachmentsService, objectDetailService) {
            return {
                templateUrl: configService.getTemplateUrl('ObjectDetail/CreateNewObjectDetail.html'),
                restrict: "EA",
                replace: true,
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    $timeout(function () {
                        // wrap 'add attachment' control
                        var attachmentCtrl = $element.find('._recordAttachment');
                        if (attachmentCtrl.length) {
                            var odn = $scope.settings.odn;
                            //Add Attchment Template For Save And Copy New
                            var recordIdTmp = objectDetailService.generateTmpId(odn);
                            $element.find("#hdnTempId").val(recordIdTmp);
                            attachmentsService.wrapUploader(attachmentCtrl, odn, recordIdTmp, []);
                        }
                    }, 500);
                }
            };
        }]);
/**
 * Created by C4off on 17.06.15.
 */
speedupObjectDetailModule.factory('repeatActionService', ['$q', '$rootScope', '$compile', '$modal',
    'localizationService', 'objectService', 'notificationService', 'popupService',
    function ($q, $rootScope, $compile, $modal, localizationService, objectService, notificationService,
              popupService) {
        var RepeatActionService = function () {
        };

        RepeatActionService.repeatObject = function (objectID, startDate, top) {
            var tpl = "<event-recurrence></event-recurrence>";
            var endDate = new Date(startDate);
            endDate.addMonths(1);
            var repeatTypes = localizationService.translate("RepeatTypes");
            // get days of week
            var daysOfWeek = [];
            if (kendo.culture().calendar.firstDay == 1) {
                for (var i = 1; i <= 6; i++) {
                    // TODO: move to localizationService
                    daysOfWeek.push($.objectLanguage.DaysOfWeekCap[i].one);
                }
                daysOfWeek.push($.objectLanguage.DaysOfWeekCap[0].one);
            } else {
                for (var i = 0; i <= 6; i++) {
                    // TODO: move to localizationService
                    daysOfWeek.push($.objectLanguage.DaysOfWeekCap[i].one);
                }
            }
            // prepare data for template
            var scope = $rootScope.$new();
            scope.defaultRepeatType = "weekly";
            scope.day = startDate.getDay();
            scope.startDate = startDate;
            scope.endDate = endDate;
            scope.repeatTypes = repeatTypes;
            scope.daysOfWeek = daysOfWeek;
            // compile tpl and bind scope
            var cnt = $compile(tpl)(scope);
                popupService.confirmWithContent(localizationService.translate("Titles.RepeatObject"), cnt, {
                    top: top
                }).then(function(){
                    _processRepeat(cnt, objectID, startDate).then(function(){
                        var msg = localizationService.translate('Messages.RepeatAddedToQueue');
                        notificationService.showNotification(msg);
                    }, function(){
                        var msg = localizationService.translate('Messages.EventRepeatFailed');
                        notificationService.showNotification(msg, true);
                    });
                });


            // hide menu after copying
//                e.stopPropagation();
//                var container = $(".actionsNav");
//                if (container.has(e.target).length === 0) {
//                    $(".actionsNav").find("ul").css("left", "-9999px");
//                }
        };

        RepeatActionService.initFields = function (element, repeatTypes, startFrom, endDate, defaultRepeatType) {
            // header
            element.find("#repeatType").kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: localizationService.translate("RepeatTypes"),
                index: 0,
                change: function (e) {
                    if (e.sender.value() != e.sender.old) {
                        element.find('.repetableSettingsBlock').hide();
                        element.find('#' + e.sender.value() + 'Block').show();
                    }
                }
            });
            repeatTypes.forEach(function (value) {
                // repeat every part
                element.find("#" + value.value + "RepeatEveryNumeric").kendoNumericTextBox({
                    format: "n0",
                    value: 1,
                    min: 1,
                    max: 30,
                    step: 1
                });
                // starts on part
                element.find("#" + value.value + "StartOnDatePicker").kendoDatePicker({
                    value: startFrom,
                    min: startFrom,
                    parseFormats: ["MM-dd-yyyy"],
                    change: function () {
                        var _self = this;
                        var date = _self.value();
                        var elem;
                        // sync other start-date datepickers
                        element.find("input[id$='StartOnDatePicker']").each(function (key, value) {
                            elem = element.find(value).data("kendoDatePicker");
                            if (elem != _self) {
                                elem.value(date);
                            };
                        });
                    }
                });
                // ends on part
                element.find("#" + value.value + "EndOnDatePicker").kendoDatePicker({
                    value: endDate,
                    min: startFrom,
                    parseFormats: ["MM-dd-yyyy"],
                    change: function () {
                        var _self = this;
                        var date = _self.value();
                        var elem;
                        // sync other end-date datepickers
                        element.find("input[id$='EndOnDatePicker']").each(function (key, value) {
                            elem = element.find(value).data("kendoDatePicker");
                            if (elem != _self) {
                                elem.value(date);
                            };
                        });
                    }
                });
                // Ends after part
                element.find("#" + value.value + "RepeatEndAfterNumeric").kendoNumericTextBox({
                    format: "n0",
                    value: 1,
                    min: 1,
                    max: 30,
                    step: 1
                });
            });
            //open a default "view"
            element.find('#' + defaultRepeatType + 'Block').show();
        };



        function _processRepeat(element, objectId, startFrom) {
            var postData = {};
            postData.ObjectEntry_ID = objectId;
            var repType = element.find('#repeatType').val();
            // repeat type
            postData.RepeatType = repType;
            // repeat frequency
            postData.RepeatFrequency = element.find('#' + repType + 'RepeatEveryNumeric').val();
            // add repeat on for "weekly" and repeatBy for "monthly"
            if (repType == "weekly") {
                var repeatDays = new Array();
                element.find("input[name='weeklyRepeatOn[]']:checked").each(function (index, value) {
                    repeatDays.push($.objectLanguage.DaysOfWeekCap[$(value).val()]["key"]);
                });
                if (repeatDays.length) {
                    postData.RepeatOn = repeatDays.join(",");
                }
                ;
            } else if (repType == "monthly") {
                var repeatEndBy = element.find("input:radio[name ='monthlyRepeatBy']:checked").val();
                // TODO: ask Mojeeb for API values
                if (repeatEndBy == "dayOfWeek") {
                    postData.RepeatBy = "dayOfWeek";
                } else if (repeatEndBy == "dayOfMonth") {
                    postData.RepeatBy = "dayOfMonth";
                }
            }
            // starts on
            postData.StartsOn = element.find('#weeklyStartOnDatePicker').val();
            // user changed start date
            if (postData.StartsOn != kendo.toString(startFrom, "yyyy-MM-dd")) {
                postData.UseStartDateInWeekly = "true";
            } else {
                postData.UseStartDateInWeekly = "false";
            }
            // ends
            var repeatEndInput = element.find("input:radio[name ='" + repType + "RepeatEnd']:checked").val();
            if (repeatEndInput == "After") {
                postData.RepeatCount = element.find('#' + repType + 'RepeatEndAfterNumeric').val();
            } else if (repeatEndInput == "On") {
                postData.RepeatEndDate = element.find('#' + repType + 'EndOnDatePicker').val();
            }
            // TODO: remove hard-code
            postData.FieldsToUpdate = "Start_Date";
            postData["FieldsToCalculate"] = [
                "End_Date:Start_Date"
            ];
            // Turn on event firing by passing true as second param
            return objectService.repeatObject(postData);
        }

//        var successClbkParams = { "ObjectEntry_ID": objectId };
////        var buttons = {yes: $.objectLanguage.Buttons.Done, no: $.objectLanguage.Buttons.Cancel}
//        $config.showModalPopup($.objectLanguage.Titles.RepeatObject, tplWData, buttons, initCallback, successCallback, successClbkParams);




        return RepeatActionService;
    }]);
/**
 * Created by C4off on 17.06.15.
 */
speedupObjectDetailModule.directive('eventRecurrence', ['$timeout', 'configService', 'repeatActionService',
    function ($timeout, configService, repeatActionService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('ObjectRecurrence/ObjectRecurrence.html');
            },
            restrict: "EA",
            replace: true,
            link: function ($scope, $element) {
                // wait for ng-repeat to wrap elements
                $timeout(function(){
                    // wrap fields
                    repeatActionService.initFields($element, $scope.repeatTypes, $scope.startDate,
                        $scope.endDate, $scope.defaultRepeatType)
                });
            }
        };
    }]);

/**
 * Created by antons on 6/1/15.
 */
speedupObjectDetailModule.directive('oeDetailsBlock', ['$rootScope', 'configService', 'localizationService',
    'filesystemService', 'objectDetailService', 'detailPageMapService', 'eventManager',
    'fieldService', 'objectEditService', 'fieldInlineEditService', 'fieldPropertiesService',
    function ($rootScope, configService, localizationService, filesystemService, objectDetailService, detailPageMapService,
        eventManager, fieldService, objectEditService, fieldInlineEditService, fieldPropertiesService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('ObjectEdit/ObjectEdit.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                if ($scope.fields && $scope.fields.length) {
                    // hack to use kendo template in angular
                    // wrap <script> in div
                    var contentTpl = angular.element('#oeDetailsBlock', $element);
                    var tpl = kendo.template(contentTpl.html());
                    // add helpers to template
                    $scope.fields[0].helpers = {
                        'getPluginImageUrl': filesystemService.getPluginImageUrl
                    };
                    var rendered = kendo.render(tpl, $scope.fields);
                    $element.html(rendered);
                }
            },
            link: function ($scope, $element) {
                if ($scope.fields && $scope.fields.length) {

                    var gConfig = configService.getGlobalConfig();
                    var dataTypes = gConfig.dataTypes;

                    var odn = $scope.settings.odn;
                    var pageBlock = $scope.pageBlock;
                    var detailBlockContainer = pageBlock.contentObject.element;

                    // skip 'read-only fields' from tabbing
                    var allBlocks = detailBlockContainer.find('._keycontainer').filter(function (idx, block) {
                        var fieldName = $(block).attr("key");
                        var fieldProperties = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, odn);
                        // skip some fields, like map
                        if (angular.isObject(fieldProperties) && fieldProperties.DataType) {
                            if (fieldProperties.DataType == dataTypes.GeoData ||
                                fieldProperties.DataType == dataTypes.AutoText) {
                                return false;
                            }
                        }
                        return !fieldService.isFieldReadOnly(fieldName);
                    });

                    objectEditService.activateSimpleBlock(allBlocks.first());
                    $scope.selectedBlock = allBlocks.first();
                    $rootScope.currentPageBlock = pageBlock;

                    // bind 'click' handler
                    detailBlockContainer.click(function (e) {
                        objectEditService.deactivateAllSimpleBlocks($(this));
                        var target = $element.find(e.target);
                        var container = target.closest('._keycontainer');
                        if(container.length){
                            $scope.selectedBlock = container;
                        }
                    });
                    // bind 'tab' and 'enter' press
                    detailBlockContainer.on('detailKeypress', function (e) {
                        var keyCode = e.keyCode || e.which;
                        if (keyCode == 9 ) {
                            e.preventDefault();
                            $scope.selectedBlock = objectEditService.tabPressed(
                                $scope.selectedBlock, pageBlock, allBlocks);
                        }  else if(keyCode == 13){
                            $scope.selectedBlock = objectEditService.enterPressed(
                                $scope.selectedBlock, pageBlock, allBlocks);
                        }else if (keyCode == 169) {
                            e.preventDefault();
                            $scope.selectedBlock = objectEditService.tabPressed(
                                $scope.selectedBlock, pageBlock, allBlocks, true);
                        }
                    });


                    setTimeout(function () {
                        detailPageMapService.createMaps($scope.fields[0].Maps);
                    }, 2000);

                    // init editors fields
                    fieldService.initializeEditors($scope.fields[0], $element);
                    // disable editors
                    var isNewEntry = $scope.settings.isNewEntry || false;
                    objectEditService.disableEditors($scope.fields[0], isNewEntry, $element);
                    // bind buttons click
                    // bind related object search click
                    detailBlockContainer.find('._objRelButton').click(function (e) {
                        var target = angular.element(e.currentTarget);
                        var value = target.parent().find('input[id^="txt"]').val();
                        objectDetailService.openRelationalRecordPopup(target, $scope.fields[0], value);
                        // Not returning false caused page reloading
                        return false;
                    });
                    // bind save button click
                    detailBlockContainer.find('._saveObjectButton').bind('click', function (e) {
                        var validator = $element.find(".tbldetail").kendoValidator().data("kendoValidator");
                        if (validator.validate()) {
                            $(this).unbind('click');
                            objectEditService.saveObject($element, odn, detailBlockContainer);
                        }
                        else {
                            //Apply Validation Style for Control
//                            $.fn.ControlValidation({}).ValidateControlStyle();
                        }

                    });
                    // bind cancel button click
                    detailBlockContainer.find('._cancelObjectButton').bind('click', function(){
                        eventManager.fireEvent(NewOEActionButtonClicked);
                    });
                    // bind 'get address' map button
                    detailBlockContainer.find('.getAddressLink').click(function(){
                        var geoData = $scope.fields[0].Maps[0];
                        detailPageMapService.getAddressFromLatLong(geoData.LatField, geoData.LongField,
                            geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                    });
                    // bind 'get coordinates' map button
                    detailBlockContainer.find('.getLatLongLink').click(function(){
                        var geoData = $scope.fields[0].Maps[0];
                        detailPageMapService.getLatLongFromAddress(geoData.LatField, geoData.LongField,
                            geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                    });
                    // bind 'get current location' map button
                    detailBlockContainer.find('.getCurrentLocationLink').click(function(){
                        var geoData = $scope.fields[0].Maps[0];
                        detailPageMapService.getCurrentLocation(geoData.LatField, geoData.LongField,
                            geoData.AddressField, geoData.Mapdiv, geoData.MapZoomField, geoData.mapTypeField);
                    });
                    // Bind update attachment image (for new entries)
                    eventManager.addListener(NewEntryAttachmentUploadedEvent, function (imgUrl) {
                        if(imgUrl){
                            // show image container
                            $element.find('.imageContainer').removeClass('hidden');
                            // update image
                            $element.find('.attachmentImages img').attr('src', imgUrl);
                        }
                    }, $scope.pageBlock.settings);
                }
            }
        };
    }])
    .directive('newObjectEdit', ['$timeout', 'configService', 'attachmentsService', 'objectDetailService',
        function ($timeout, configService, attachmentsService, objectDetailService) {
        return {
            templateUrl: configService.getTemplateUrl('ObjectEdit/CreateNewObjectEdit.html'),
            restrict: "EA",
            replace: true,
            link: function ($scope, $element, $attrs, controller, $transclude) {
                $timeout(function () {
                    // wrap 'add attachment' control
                    var attachmentCtrl = $element.find('._recordAttachment');
                    if (attachmentCtrl.length) {
                        var odn = $scope.settings.odn;
                        //Add Attchment Template For Save And Copy New
                        var recordIdTmp = objectDetailService.generateTmpId(odn);
                        $element.find("#hdnTempId").val(recordIdTmp);

                        //Add Attachment Hidden Field During Save and Copy
//                            var id = "recordAttachment_" + $thisEditObject.settings.ObjectDefinitionName + "_" + document.getElementById("hdnTempId").value;
//                            $($thisEditObject).find("._recordAttachment").attr("id", id);
//                            $($thisEditObject).find("._recordAttachment").html('');
//                            $($thisEditObject).find("._recordAttachment").append('<input class="_kendoFileUploader" type="file" name="_kendoFileUploader" id="_kendoFileUploader" />');
//                            $thisEditObject.FileUpload();
                        attachmentsService.wrapUploader(attachmentCtrl, odn, recordIdTmp, []);
                    }
                }, 100);
            }
        };
    }]);
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
angular.module('speedup.modal', [])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
    .factory('$$stackedMap', function () {
        return {
            createNew: function () {
                var stack = [];

                return {
                    add: function (key, value) {
                        stack.push({
                            key: key,
                            value: value
                        });
                    },
                    get: function (key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                return stack[i];
                            }
                        }
                    },
                    keys: function () {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++) {
                            keys.push(stack[i].key);
                        }
                        return keys;
                    },
                    top: function () {
                        return stack[stack.length - 1];
                    },
                    remove: function (key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                idx = i;
                                break;
                            }
                        }
                        return stack.splice(idx, 1)[0];
                    },
                    removeTop: function () {
                        return stack.splice(stack.length - 1, 1)[0];
                    },
                    length: function () {
                        return stack.length;
                    }
                };
            }
        };
    })
    // directive for the window itself
    .directive('modalWindow', ['$modalStack', '$q', function ($modalStack, $q) {
        return {
            restrict: 'EA',
            scope: {
                index: '@'
            },
            replace: true,
            transclude: true,
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'modal.window.html';
            },
            link: function (scope, element, attrs) {
                element.addClass(attrs.windowClass || '');

                // This property is only added to the scope for the purpose of detecting when this directive is rendered.
                // We can detect that by using this property in the template associated with this directive and then use
                // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
                scope.$isRendered = true;

                // Deferred object that will be resolved when this modal is rendered.
                var modalRenderDeferObj = $q.defer();
                // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
                // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
                attrs.$observe('modalRender', function (value) {
                    if (value == 'true') {
                        modalRenderDeferObj.resolve();
                    }
                });

                modalRenderDeferObj.promise.then(function () {

                    var inputsWithAutofocus = element[0].querySelectorAll('[autofocus]');
                    /**
                     * Auto-focusing of a freshly-opened modal element causes any child elements
                     * with the autofocus attribute to lose focus. This is an issue on touch
                     * based devices which will show and then hide the onscreen keyboard.
                     * Attempts to refocus the autofocus element via JavaScript will not reopen
                     * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                     * the modal element if the modal does not contain an autofocus element.
                     */
                    if (inputsWithAutofocus.length) {
                        inputsWithAutofocus[0].focus();
                    } else {
                        element[0].focus();
                    }

                    // Notify {@link $modalStack} that modal is rendered.
                    var modal = $modalStack.getTop();
                    if (modal) {
                        $modalStack.modalRendered(modal.key);
                    }
                });
            }
        };
    }])

    .directive('modalTransclude', function () {
        return {
            link: function ($scope, $element, $attrs, controller, $transclude) {
                $transclude($scope.$parent, function (clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        };
    })

    .factory('$modalStack', ['$document', '$compile', '$rootScope', '$$stackedMap',
        function ($document, $compile, $rootScope, $$stackedMap) {

            var OPENED_MODAL_CLASS = 'modal-open';

            var openedWindows = $$stackedMap.createNew();
            var $modalStack = {};

            function removeModalWindow(modalInstance, alreadyClosed) {
                var body = $document.find('body').eq(0);
                var modalWindow = openedWindows.get(modalInstance).value;
                //clean up the stack
                openedWindows.remove(modalInstance);
                // close the window
                if(!alreadyClosed){
                    modalWindow.windowObj.close();
                }
                // remove OPEN_MODAL_CLASS
                body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
            }

//            // bind escape click
//            $document.bind('keydown', function (evt) {
//                var modal;
//
//                if (evt.which === 27) {
//                    modal = openedWindows.top();
//                    if (modal && modal.value.keyboard) {
//                        evt.preventDefault();
//                        $rootScope.$apply(function () {
//                            $modalStack.dismiss(modal.key, 'escape key press');
//                        });
//                    }
//                }
//            });

            $modalStack.open = function (modalInstance, modal) {
                var modalOpener = $document[0].activeElement;

                var body = $document.find('body').eq(0);
                var content = modal.content;

                var angularDomEl = angular.element(modal.template);
                var contentElement = angularDomEl.find('.content');
                if (contentElement.length) {
                    contentElement.append(content);
                } else {
                    angularDomEl.append(content);
                }

                body.append(angularDomEl);
                body.addClass(OPENED_MODAL_CLASS);

                // center window horizontally
                var left = ($(window).width() - parseInt(modal.settings.width)) / 2 + "px";
                var top = modal.settings.top || window.pageYOffset + 25 +"px";
                var windowSettings = angular.extend({}, modal.settings, {
                    position: {
                        top: top,
                        left: left
                    },
                    autoFocus: false
                });
                angularDomEl.kendoWindow(windowSettings);
                var windowObj = angularDomEl.data('kendoWindow');
                if(windowSettings.doCenterVert){
                    windowObj.center();
                }

                var windowObj = angularDomEl.data('kendoWindow');
                // bind [x]-button close to closing function
                var closeFn = function () {
                    return $modalStack.dismiss(modalInstance, 'closed by user [x]', true);
                }
                windowObj.bind("close", closeFn);
                // unbind ESC click close the popup
                kendo.ui.Window.fn._keydown = function (originalFn) {
                    var KEY_ESC = 27;
                    return function (e) {
                        if (e.which !== KEY_ESC) {
                            originalFn.call(this, e);
                        }
                    };
                }(kendo.ui.Window.fn._keydown);

                windowObj.open();

                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    renderDeferred: modal.renderDeferred,
                    modalScope: modal.scope,
                    keyboard: modal.keyboard,
                    element: angularDomEl,
                    windowObj: windowObj
                });
                openedWindows.top().value.modalDomEl = angularDomEl;
                openedWindows.top().value.modalOpener = modalOpener;

            };

            function broadcastClosing(modalWindow, resultOrReason, closing) {
                return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
            }

            $modalStack.close = function (modalInstance, result) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow && broadcastClosing(modalWindow, result, true)) {
                    modalWindow.value.deferred.resolve(result);
                    removeModalWindow(modalInstance);
                    modalWindow.value.modalOpener.focus();
                    return true;
                }
                return !modalWindow;
            };

            $modalStack.dismiss = function (modalInstance, reason, alreadyClosed) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
                    modalWindow.value.deferred.reject(reason);
                    removeModalWindow(modalInstance, alreadyClosed);
                    modalWindow.value.modalOpener.focus();
                    return true;
                }
                return !modalWindow;
            };

            $modalStack.dismissAll = function (reason) {
                var topModal = this.getTop();
                while (topModal && this.dismiss(topModal.key, reason)) {
                    topModal = this.getTop();
                }
            };

            $modalStack.getTop = function () {
                return openedWindows.top();
            };

            $modalStack.modalRendered = function (modalInstance) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.renderDeferred.resolve();
                }
            };

            return $modalStack;
        }])

    .provider('$modal', function () {

        var $modalProvider = {
            options: {
                keyboard: true,
                templateType: 'angular'
            },
            $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
                function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

                    var $modal = {};
                    // get template (may be async)
                    function getTemplatePromise(options) {
                        return options.template ? $q.when(options.template) :
                            $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                                {cache: $templateCache}).then(function (result) {
                                    return result.data;
                                });
                    }

                    // get data (may be async)
                    function getResolvePromises(resolves) {
                        var promisesArr = [];
                        angular.forEach(resolves, function (value) {
                            if (angular.isFunction(value) || angular.isArray(value)) {
                                promisesArr.push($q.when($injector.invoke(value)));
                            }
                        });
                        return promisesArr;
                    }

                    $modal.open = function (modalOptions) {

                        var modalResultDeferred = $q.defer();
                        var modalOpenedDeferred = $q.defer();
                        var modalRenderDeferred = $q.defer();

                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            rendered: modalRenderDeferred.promise,
                            close: function (result) {
                                return $modalStack.close(modalInstance, result);
                            },
                            dismiss: function (reason) {
                                return $modalStack.dismiss(modalInstance, reason);
                            }
                        };

                        //merge and clean up options
                        modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                        modalOptions.resolve = modalOptions.resolve || {};

                        //verify options
                        if (!modalOptions.template && !modalOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        //get template and data for it
                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

                        //got template and data
                        templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                            var modalScope = (modalOptions.scope || $rootScope).$new();
                            modalScope.$close = modalInstance.close;
                            modalScope.$dismiss = modalInstance.dismiss;

                            var ctrlInstance, ctrlLocals = {};
                            var resolveIter = 1;

                            //controllers
                            if (modalOptions.controller) {
                                ctrlLocals.$scope = modalScope;
                                ctrlLocals.$modalInstance = modalInstance;
                                angular.forEach(modalOptions.resolve, function (value, key) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                });

                                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                if (modalOptions.controllerAs) {
                                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                                }
                            }

                            $modalStack.open(modalInstance, {
                                scope: modalScope,
                                settings: modalOptions.settings,
                                deferred: modalResultDeferred,
                                renderDeferred: modalRenderDeferred,
                                template: tplAndVars[0],
                                content: tplAndVars[1],
                                keyboard: modalOptions.keyboard,
                                templateType: modalOptions.templateType,
                                windowClass: modalOptions.windowClass,
                                windowTemplateUrl: modalOptions.windowTemplateUrl
                            });

                        }, function resolveError(reason) {
                            modalResultDeferred.reject(reason);
                        });

                        templateAndResolvePromise.then(function () {
                            modalOpenedDeferred.resolve(true);
                        }, function (reason) {
                            modalOpenedDeferred.reject(reason);
                        });

                        return modalInstance;
                    };

                    return $modal;
                }]
        };

        return $modalProvider;
    });

/**
 * Created by antons on 3/30/15.
 */
CSVapp.factory('objectService', ['$q', "$http", '$rootScope', 'configService',
    'eventManager', 'localizationService', 'fieldPropertiesService',
    'objectPropertySaverFactory',
    function ($q, $http, $rootScope, configService, eventManager, localizationService, fieldPropertiesService, objectPropertySaverFactory) {
        var gConfig = configService.getGlobalConfig();

        var ObjectService = {};

        /*PUBLIC METHODS*/

        /// <summary>
        /// method will post data on API to batch edit array of records.
        /// </summary>
        /// <param name="postData">holds params for request</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.batchEdit = function (postData, odn, fireEvent) {
            var deferred = $q.defer();
            if(!postData ||
                !(postData.entries && postData.entries.length)||
                !(postData.data && postData.data.length)){
                deferred.reject('Empty input params');

                return deferred.promise;
            }

            var propertyData = [], tmpStr = "";
            postData.data.forEach(function(dataObject){
                if(dataObject.fk && dataObject.value){
                    tmpStr = dataObject.fk + ":" + dataObject.value;
                    propertyData.push(tmpStr);
                }
            });

            var apiData = {
                "ObjectEntryIds": postData.entries.join(','),
                "PropertyIDPropertyValue": propertyData
            };

            var url = configService.getUrlBase('batchEdit') + '/' + gConfig.token;

            $http.post(url, apiData).then(function (result) {
                if(!result || !result.data || !result.data["BatchEditMessage"]){
                    deferred.reject(result);
                } else if (result.data["BatchEditMessage"].indexOf('Success') != -1) {
                    if (fireEvent) {
                        eventManager.fireEvent(ObjectsBatchUpdatedEvent, {
                            data: postData,
                            odn: odn
                        });
                    }
                    var countIdx = result.data["BatchEditMessage"].indexOf('Count');
                    var recordsCount = countIdx ?
                        parseInt(result.data["BatchEditMessage"].substr(countIdx + 6)) : 0;

                    deferred.resolve(recordsCount);
                } else{
                    deferred.reject(result);
                }
            }, deferred.reject);

            return deferred.promise;
        };
        /// <summary>
        /// method will post data on API to repeat object with all subObjects.
        /// </summary>
        /// <param name="postData">holds params for request</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.repeatObject = function (postData, fireEvent) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('repeatedRecordWithChildren') + "/" + gConfig.token;
            $http.post(url, JSON.stringify(postData))
                .success(function (response) {
                    if (angular.isObject(response) && response.Message.indexOf("Que")) {
                        deferred.resolve();
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectRepeatedEvent)
                        }
                    } else {
                        deferred.reject();
                    }
                })
                .error(function () {
                    deferred.reject();
                });

            return deferred.promise;
        };
        /// <summary>
        /// method will post data on API to copy object with all subObjects.
        /// </summary>
        /// <param name="objectID">object id</param>
        /// <param name="odn">object definition name</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.copyObject = function (objectID, odn, fireEvent) {
            var deferred = $q.defer();
            var url = configService.getUrlBase('copyRecordWithChildren') + "/" + objectID + "/" + gConfig.token;
            $http.get(url)
                .success(function (parsedResponse) {
                    if (angular.isObject(parsedResponse) &&
                        parsedResponse.Message &&
                        parsedResponse.Message.indexOf('Successfully')) {
                        var recordData = {
                            ObjectEntry_ID: parsedResponse.NewObjectEntry_ID,
                            Name: parsedResponse.NewObjectEntry_Name,
                            ObjectDefinitionName: odn
                        };
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectCopiedEvent, recordData);
                        }
                        deferred.resolve(recordData);
                    } else {
                        var msg = localizationService.translate('Messages.UnableToCopyObject') +
                            localizationService.translate('Messages.InvalidJson');
                        deferred.reject(msg)
                    }
                })
                .error(function () {
                    var msg = localizationService.translate('Messages.UnableToCopyObject');
                    deferred.reject(msg);
                });

            return deferred.promise;
        };

        /// <summary>
        /// method will post data on API to remove record.
        /// </summary>
        /// <param name="recordId">object id</param>
        /// <param name="odn">object definition name</param>
        /// <param name="fireEvent">need to fire event</param>
        ObjectService.deleteObject = function (recordId, odn, fireEvent) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('deleteObjectRecord') + "/" + odn + "/" + recordId + "/" +
                gConfig.token + "?RequestType=do";
            $http.get(url)
                .success(function (response) {
                    debugger;
                    deferred.resolve(response);
                    if (fireEvent) {
                        eventManager.fireEvent(ObjectDeletedEvent, {
                            odn: odn,
                            recordId: recordId
                        })
                    }
                })
                .error(function () {
                    deferred.reject('Unable to delete object "' + odn + '" with id: ' + recordId);
                });

            return deferred.promise;
        };
        /// <summary>
        /// method will post data on API to save record.
        /// </summary>
        ObjectService.saveObject = function (objSchema, odn, fireEvent) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('saveObjectWithResponse') + "/" + odn + '/' + gConfig.token;
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(objSchema),
                dataType: "json",
                success: function (response) {
                    var txt = "Exception";
                    if (response.ResponseMessage.indexOf(txt) > -1) {
                        deferred.reject(response);
                    }
                    else {
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectSavedEvent, response);
                        }
                        deferred.resolve(response);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (respoonseCodeValue == "UnAuthorized") {
                        deferred.reject(respoonseCodeValue);
                    }
                    else {
                        var msg = localizationService.translate('Messages.UnableToSaveRecord');
                        deferred.reject(msg);
                    }
                }
            });

            return deferred.promise;
        };

        /// <summary>
        /// Method to extract data item from save object API response
        /// </summary>
        /// <param name="response">API response</param>
        ObjectService.extractItemFromSaveAPIResponse = function (response) {
            if (angular.isObject(response)) {
                var dataItems = JSON.parse(response.SavedData);
                if ($.isArray(dataItems)) {
                    return dataItems[0];
                }
            }

            return {};
        };

        /// <summary>
        /// Method to save object field value
        /// </summary>
        /// <param name="fieldName">object field name</param>
        /// <param name="fieldName">object field value</param>
        /// <param name="oid">object entry id</param>
        /// <param name="odn">object definition name</param>
        /// <return>promise</return>
        ObjectService.getSettingsAndSaveObjectField = function (fieldName, fieldValue, oid, odn, fireEvent) {
            var fieldDefinition = fieldPropertiesService.getAllPropertiesOfSingleField(fieldName, odn);
            return ObjectService.saveObjectField(odn, fieldName, fieldDefinition.PropertyDefinition_ID,
                fieldValue, oid, fireEvent);
        };
        /// <summary>
        /// Performs actual object field save API call
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propertyFk">object property id</param>
        /// <param name="fieldValue">value of the field</param>
        /// <param name="objectEntryFK">object entry id</param>
        /// <param name="fireEvent">need to fire an event</param>
        /// <return>promise</return>
        ObjectService.saveObjectField = function (odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent) {
            var saver = objectPropertySaverFactory.getSaver(gConfig.inlineSaveMethod);
            return saver.saveObjectField(odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent);
        };

        return ObjectService;
    }]);
/**
 * Created by C4off on 20.08.15.
 */
CSVapp.factory('objectPropertySaverFactory', ['$q', 'configService', 'eventManager',
    function ($q, configService, eventManager) {
        var gConfig = configService.getGlobalConfig();

        var ObjectPropertySaverFactory = {};

        /// <summary>
        /// Factory method to get object property saver,
        /// depending on settings
        /// </summary>
        /// <param name="type">save method(server|local)</param>
        ObjectPropertySaverFactory.getSaver = function (type) {
            switch (type) {
                case 'local':
                    return new ObjectPropertySaverLocal();
                    break;
                case 'server':
                    return new ObjectPropertySaverServer();
                    break;
                default:
                    throw new BadParameterException('Wrong type of ObjectPropertySaver: ' + type);
            }
        };

        function ObjectPropertySaver(){
        }
        // used to 'virtually' save the property and release interface
        function ObjectPropertySaverLocal(){
            this.type = 'local';
            // Call the parent's constructor without hard coding the parent
            ObjectPropertySaverLocal.base.constructor.call(this, arguments);
        }

        Object.inherit(ObjectPropertySaver, ObjectPropertySaverLocal, {
            /// <summary>
            /// Method will save value for edited field with
            /// 'background' API call. DOESN'T wait until response to
            /// 'release' user interface
            /// </summary>
            /// <param name="odn">object definition name</param>
            /// <param name="fieldName">field name</param>
            /// <param name="propertyFk">field id</param>
            /// <param name="fieldValue">field value</param>
            /// <param name="objectEntryFK">record id</param>
            /// <param name="fireEvent">fire event? (true/false)</param>
            saveObjectField: function (odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent) {
                var deferred = $q.defer();

                // fire event to update data sources of widgets (e.g. Scheduler or Grid)
                if(fireEvent){
                    eventManager.fireEvent(ObjectPropertySavedEvent, {
                        fieldName: fieldName,
                        fieldValue: fieldValue,
                        recordId: objectEntryFK,
                        odn: odn
                    });
                }
                deferred.resolve("Update Successfull.");
                // make API call to perform 'background' saving
                _saveObjectFieldAPI(odn, fieldName, propertyFk, fieldValue, objectEntryFK, false);

                return deferred.promise;
            }
        });
        // used to save the property and wait for
        // response before releasing interface
        function ObjectPropertySaverServer(){
            this.type = 'server';
            // Call the parent's constructor without hard coding the parent
            ObjectPropertySaverServer.base.constructor.call(this, arguments);
        }
        Object.inherit(ObjectPropertySaver, ObjectPropertySaverServer, {
            /// <summary>
            /// Method will save value for edited field with API call. Waits until response
            /// </summary>
            /// <param name="odn">object definition name</param>
            /// <param name="fieldName">field name</param>
            /// <param name="propertyFk">field id</param>
            /// <param name="fieldValue">field value</param>
            /// <param name="objectEntryFK">record id</param>
            /// <param name="fireEvent">fire event? (true/false)</param>
            saveObjectField: function (odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent) {
                return _saveObjectFieldAPI(odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent);
            }
        });
        /// <summary>
        /// method performs actual API call to save the edited value
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="fieldName">field name</param>
        /// <param name="propertyFk">field id</param>
        /// <param name="fieldValue">field value</param>
        /// <param name="objectEntryFK">record id</param>
        /// <param name="fireEvent">fire event? (true/false)</param>
        /// <return>promise</return>
        function _saveObjectFieldAPI(odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent){
            var deferred = $q.defer();
            // TODO: handle emptyFieldDefinition
            var objInlineEditData = {
                PropertyValue: fieldValue,
                ObjectEntry_fk: objectEntryFK,
                PropertyDefinition_fk: propertyFk,
                RequestType: "sio"
            };

            var url = configService.getUrlBase('saveObjectField') + "/" + gConfig.token;
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(objInlineEditData),
                dataType: "json",
                success: function (response) {
                    var txt = "Exception";
                    if (response.ResponseMessage && response.ResponseMessage.indexOf(txt) > -1) {
                        deferred.reject(response.ResponseMessage);
                    } else {
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectPropertySavedEvent, {
                                fieldName: fieldName,
                                fieldValue: fieldValue,
                                recordId: objectEntryFK,
                                odn: odn
                            });
                        }
                        deferred.resolve(response);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    deferred.reject(xhr.getResponseHeader('ResponseCode'));
                }
            });

            return deferred.promise;
        }

        return ObjectPropertySaverFactory;
    }]);
/**
 * Created by C4off on 10.05.15.
 */
function DetailPageBlockIdGenerator() {

}
// Static variable to generate new Id for new DetailPageBlock
DetailPageBlockIdGenerator.currentId = 0;
DetailPageBlockIdGenerator.generateId = function () {
    return ++DetailPageBlockIdGenerator.currentId;
};

function DetailPageBlock(settings) {
    // generate new id
    this.id = DetailPageBlockIdGenerator.generateId();
    this.parentBlock = null;
    this.element = angular.element('<div blockId="' + this.id + '"></div>');
    this._contentObject = null;
    this.childBlocks = [];
    this.childContainer = null;
    this.settings = settings || {};
    this.fieldInEditMode = null;
    this.currentPageBlock = null;

    Object.defineProperty(this, 'contentObject', {
        get: function () {
            // console.log('getting content of DetailPageBlock');
            return this._contentObject;
        },
        set: function (value) {
//            console.log('setting content 4 detailPage block' + value);
            if (value instanceof ContentObject) {
                value.pageBlock = this;
                this._contentObject = value;
                this.element.empty();
                this.element.append(value.generateContent());
            } else {
                this._contentObject = null;
            }
        }
    });
}
DetailPageBlock.prototype.getRootBlock = function (pageBlock) {
    return pageBlock.parentBlock ? this.getRootBlock(pageBlock.parentBlock) : pageBlock;
};
DetailPageBlock.prototype.getVeryLastChildBlock = function(block){
    if(!block){
        block = this.getRootBlock(this);
    }
    if(!block){
        return null;
    }
    var lastChild = block.getLastChildBlock();

    return (!lastChild || !lastChild.getChildrenCount()) ? lastChild
        : this.getVeryLastChildBlock(lastChild);
};
DetailPageBlock.prototype.getLastChildBlock = function(idx){
    if(!this.childBlocks || idx < 0){
        return null;
    }
    if(!(idx || idx === 0)){
        idx = this.childBlocks.length - 1;
    }
    var block = this.childBlocks[idx];
    if(!block){
        block = this.getLastChildBlock(idx - 1);
    }

    return block;
};
DetailPageBlock.prototype.getNextBlock = function () {
    // try to get first child
    var nextBlock = this.getNextChildBlock();
    if (!nextBlock) {
        // try to get next sibling
        nextBlock = this.getNextSiblingBlock()
    }
    if (!nextBlock) {
        return this.getRootBlock(this);
    }

    return nextBlock;
};
DetailPageBlock.prototype.getPrevBlock = function () {
    // try to get next sibling
    var nextBlock = this.getPrevSiblingBlock();
    if (!nextBlock) {
        if(this.parentBlock){
            return this.parentBlock
        } else{
            return this.getVeryLastChildBlock();
        }
    }

    return nextBlock;
};
DetailPageBlock.prototype.getNextSiblingBlock = function () {
    var nextSibling = null;
    var parentBlock = this.parentBlock;
    if (parentBlock) {
        nextSibling = parentBlock.getNextChildBlock(this);
        if (!nextSibling) {
            return parentBlock.getNextSiblingBlock();
        }
    }

    return nextSibling;
};
DetailPageBlock.prototype.getPrevSiblingBlock = function () {
    var prevSibling = null;
    var parentBlock = this.parentBlock;
    if (parentBlock) {
        prevSibling = parentBlock.getPrevChildBlock(this);
        if (!prevSibling) {
            return parentBlock.getPrevSiblingBlock();
        }
    }

    return prevSibling;
};
DetailPageBlock.prototype.getNextChildBlock = function (childBlock) {
    var nextChild = null;
    var afterMe = false;
    this.childBlocks.some(function (block) {
        if (block) {
            if (!childBlock) { // if we need first child
                nextChild = block;
                return true;
            } else {  // if we need child after it
                if (block.id == childBlock.id) {
                    afterMe = true;
                    return false;
                } else if (afterMe) {
                    nextChild = block;
                    return true;
                }
                return false;
            }
        }
    });

    return nextChild;
};
DetailPageBlock.prototype.getPrevChildBlock = function (childBlock) {
    var potentialPrevChild = null;
    var found = false;
    this.childBlocks.some(function (block) {
        if (block) {
            if (!childBlock) { // if we need last child
                potentialPrevChild = block;
                found = true;
                return true;
            } else if (block.id == childBlock.id) {  // if we need child before it
                if (potentialPrevChild) {
                    found = true;
                }
                return true;
            } else {
                potentialPrevChild = block;
                return false;
            }
        }
    });

    return found ? potentialPrevChild : null;
};
// Method to set 'current' page block (it's needed for keyboard functionality)
DetailPageBlock.prototype.setRootAwareOfCurrent = function (pageBlock, check) {
    var parentBlock = this.getRootBlock(pageBlock);
    if (!check || (check && !parentBlock.currentPageBlock)) {
        parentBlock.currentPageBlock = pageBlock;
    }
}
DetailPageBlock.prototype.showChildren = function () {
    if (this.childContainer && this.childContainer.length) {
        this.childContainer.show();
    }
}
DetailPageBlock.prototype.hideChildren = function () {
    if (this.childContainer && this.childContainer.length) {
        this.childContainer.hide();
    }
}
DetailPageBlock.prototype.substituteBlockBy = function (pageBlock) {
    this.clearBlock();
    this.element.append(pageBlock.element);
    pageBlock.displayer = this.displayer;

    return pageBlock;
}
DetailPageBlock.prototype.getChildrenCount = function () {
    var count = 0;
    this.childBlocks.forEach(function (elem) {
        if (elem) {
            count++;
        }
    });

    return count;
}
DetailPageBlock.prototype.clearBlock = function () {
    // disconnect events
    if(this.contentObject && this.contentObject.element){
        this.contentObject.element.off();
    }
    this.element.empty();
    this.childContainer = null;
    this._contentObject = null;
    this.childBlocks.forEach(function (block) {
        if (block) {
            block.clearBlock();
        }
    });
    this.childBlocks = [];
};
DetailPageBlock.prototype.appendChildBlock = function (childBlock) {
//    console.log('child block id: ' + childBlock.id + ' appended to block id: ' + this.id);
    var content = childBlock.element;
    childBlock.parentBlock = this;

    if (!this.childContainer) {
        this.childContainer = angular.element("<div class=\"childContainer\"></div>");
        this.element.append(this.childContainer);
        // find container to append after.
        this.childContainer.append(content);
    } else { // find a child to append after
        // find minimum id > than current
        var srchBlock = null;
        this.childBlocks.forEach(function (block) {
            if (block.id < childBlock.id) {
                if (!srchBlock || (block.id > srchBlock.id)) {
                    srchBlock = block;
                }
            }
        });
        if (srchBlock) {
            srchBlock.element.after(content);
        } else {
            this.childContainer.prepend(content);

        }
    }

    this.childBlocks['' + childBlock.id] = childBlock;
};
DetailPageBlock.prototype.removeBlock = function () {
    //root block
    if (!this.parentBlock) {
        this.clearBlock();
        this.element.remove();
        delete this;
    } else { // child block
        this.parentBlock.removeChildBlockById(this.id);
    }
}
DetailPageBlock.prototype.removeChildBlockById = function (blockId) {
    blockId = '' + blockId;
    if (this.childBlocks[blockId]) {
        this.childBlocks[blockId].clearBlock();
        this.childBlocks[blockId] = null;
        return true;
    } else {
        return false;
    }
};

function ContentObject() {
    this._content = null;
    this.element = angular.element("<div class=\"ContentObject\"></div>");
    this.pageBlock = null;

    Object.defineProperty(this, 'content', {
        get: function () {
//            console.log('getting content of content object');
            return this.element;
        },
        set: function (value) {
//            console.log('setting content for content object' + value);
            this.element.empty();
            if (angular.isObject(value)) {
                this.element.append(angular.element(value));
            } else {
                this.element.innerHTML(value);
            }
        }
    });
}
ContentObject.prototype.generateContent = function () {
    // TODO: generate content if content is empty, otherwise return content
    return this.content;
};

function DetailObject() {
    // Call the parent's constructor without hard coding the parent
    DetailObject.base.constructor.call(this, arguments);
    this.header = '';
    this._tabStrip = null;
    this._menu = null;
    this._fields = [];

    this._promiseBlocks = [];

    Object.defineProperty(this, 'fields', {
        get: function () {
            return this._fields;
        },
        set: function (value) {
            // if this is promise - put it for later resolving
            if (value && angular.isFunction(value.then)) {
                this._promiseBlocks.push(value.then(function (content) {
                    this._fields = content;
                }));
            } else {
                this._fields = value;
            }
        }
    });
    Object.defineProperty(this, 'tabStrip', {
        get: function () {
            return this._tabStrip;
        },
        set: function (value) {
            // if this is promise - put it for later resolving
            if (value && angular.isFunction(value.then)) {
                this._promiseBlocks.push(value.then(function (content) {
                    this._tabStrip = content;
                }));
            } else {
                this._tabStrip = value;
            }
        }
    });
    Object.defineProperty(this, 'menu', {
        get: function () {
            return this._menu;
        },
        set: function (value) {
            // if this is promise - put it for later resolving
            if (value && angular.isFunction(value.then)) {
                this._promiseBlocks.push(value.then(function (content) {
                    this._menu = content;
                }));
            } else {
                this._menu = value;
            }
        }
    });

    this.pageBlock = null;
}

// Inheriting from ContentObject
Object.inherit(ContentObject, DetailObject, {
    generateContent: function () {
        var _self = this;
        return $q.all(detailObject._promiseBlocks).then(function () {
            _self._promiseBlocks = [];
            var headerBlock = angular.element(_self._header);
            var menuBlock = angular.element(_self._menu);
            var tabStripBlock = angular.element(_self._tabStrip);
            var contentBlock = angular.element(_self._fields);
            _self.content = angular.element('<div></div>').
                append(headerBlock).
                append(menuBlock).
                append(tabStripBlock).
                append(contentBlock);

            return _self.content;
        });
    }
});
/**
 * Created by C4off on 24.03.15.
 */
// Animation
var LoadActionStartEvent = "LoadActionStart";
var LoadActionEndEvent = "LoadActionEndEvent";
// Grid component events
var GridFilterSetEvent = "GridFilterSetEvent";
var GridEventListenReadyEvent = "GridEventListenReadyEvent";
var FilterGridByGenericSearchEvent = 'FilterGridByGenericSearch';
var FilterGridByFilterExpressionEvent = 'FilterGridByFilterExpression';
// Fired on object CRUD operations
var ObjectsBatchUpdatedEvent = "ObjectsBatchUpdated";
var ObjectDetailFieldUpdatedEvent = "ObjectDetailFieldUpdated";
var ObjectRepeatedEvent = 'ObjectRepeated';
var ObjectCopiedEvent = 'ObjectCopied';
var ObjectPropertySavedEvent = 'ObjectPropertySaved';
var ObjectSavedEvent = "ObjectSaved";
var ObjectDeletedEvent = "ObjectDeleted";
var NewODCreated = "NewObjectDetailCreated";
var NewODActionButtonClicked = "NewObjectDetailActionButtonClicked";
var NewOEActionButtonClicked = "NewObjectEditActionButtonClicked";
var NewEntryAttachmentUploadedEvent = "NewEntryAttachmentUploadedEvent";
//Filter component events
var FilterSetEvent = "FilterSet";
var FilterTabButtonExpandedEvent = "FilterTabButtonExpanded";
var FilterTabButtonCollapsedEvent = "FilterTabButtonCollapsed";
var FilterExpandedEvent = "FilterExpanded";
var FilterCollapsedEvent = "FilterCollapsed";
var FilterReadyEvent = "FilterReady";
var CheckFilterStateEvent = "CheckFilterStateEvent";
// Scheduler component events
var SchedulerReadyEvent = "SchedulerReady";
var SchedulerResourceButtonClickedEvent = "SchedulerResourceButtonClicked";
var SchedulerResourcePanelToggleEvent = "SchedulerResourcePanelToggleEvent";
var SchedulerChangeWidthEvent = "SchedulerChangeWidth";
var ResourcePanelFilterChangedEvent = "ResourcePanelFilterChanged";
var SchedulerResourcesLoadedEvent = "SchedulerResourcesLoaded";
// Advanced search component events
var AdvancedSearchFilterSetEvent = "AdvancedSearchFilterSet";
var AdvancedSearchTabButtonExpandedEvent = "AdvancedSearchTabButtonExpanded";
var AdvancedSearchTabButtonCollapsedEvent = "AdvancedSearchTabButtonCollapsed";
var ASTabChangeWidthEvent = "ASTabChangeWidth";
// TabStrip events
var AttachmentImageChangedEvent = "AttachmentImageChanged";
// Displayer
var DisplayerElementClosedEvent = "DisplayerElementClosed";
// Batch Edit Grid
var BatchFormOpenedEvent = "BatchFormOpened";
var BatchFormClosedEvent = "BatchFormClosed";
var BatchEditBtnClickedEvent = "BatchEditBtnClicked";
/**
 * Created by antons on 2/26/15.
 */
CSVapp.factory('notificationService', [function () {

    var NotificationService = {};
    /// <summary>
    /// Method will show the notification
    /// </summary>
    /// <param name="msg">message to display</param>
    /// <param name="iserror">error if any</param>
    NotificationService.showNotification = function (msg, isError) {
        if ($("._pluginnotificationmsg").length == 0) {
            var message = $("<div class='pluginNotificationMsg _pluginnotificationmsg '><h3>" + msg + "</h3></div>");
            $(document.body).prepend(message);
        }
        if (isError) {
            $("._pluginnotificationmsg").removeClass("pluginsuccessmsg").addClass("pluginerrormsg");
        }
        else {
            $("._pluginnotificationmsg").removeClass("pluginerrormsg").addClass("pluginsuccessmsg");
        }

        $('._pluginnotificationmsg').css('left', "40%").fadeIn(500).delay(200).fadeOut(500);
        $('._pluginnotificationmsg').bind("click", function () {
            $(this).fadeOut().remove();
        })
        var timeout = 2000;
        if (isError) {
            timeout = 4000;
        }
        setTimeout(function () {
            $('._pluginnotificationmsg').fadeOut().remove();
        }, timeout);
    };

    return NotificationService;
}]);
/**
 * Created by antons on 7/21/15.
 */
CSVapp.factory('popupNotificationService', ['$cookies', '$modal', 'localizationService',
    'filesystemService',
    function ($cookies, $modal, localizationService, filesystemService) {

        var _notificationPopupDefaultSettings = {
            modal: true,
            visible: false,
            maxHeight: 1000,
            minHeight: 300,
            width: 750,
            resizable: false,
            actions: ["Close"]
        };

        var PopupNotificationService = {};

        PopupNotificationService.displayMainPageNotification = function(){
            // display notification popup if needed
            var notificationCookieName = SUConstants.NotificationCookieName;
            if (!$cookies.get(notificationCookieName) && $("#notificationBlock").length) {
                PopupNotificationService.displayNotificationPopup($("#notificationBlock"));
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 100);
                $cookies.put(notificationCookieName, "1", {expires: expireDate});
            }
        };

        PopupNotificationService.displayNotificationPopup = function (element) {
            element.show();
            var pages = element.find('li');
            if (pages.length) {
                var notificationList = element.find('.notificationsList');

                // create images full paths
                element.find('img').each(function(index, img){
                    $(img).attr('src', filesystemService.getImageUrl($(img).data('addr')));
                });

                var slider = notificationList.anythingSlider({
                    buildArrows: true,
                    buildNavigation: false,
                    buildStartStop: false
                });

                var modalInstance = _openPopup(element);
                modalInstance.opened.then(function () {
                    // show dispose button on last slide
                    var gotItBtn = angular.element('#popupYesButton');
                    if(pages.length == 1){
                        gotItBtn.css('visibility', 'visible');
                    }
                    slider.bind('slide_complete', function (event, slider) {
                        if (slider.currentPage == pages.length) {
                            gotItBtn.css('visibility', 'visible');
                        }
                    });
                    gotItBtn.click(function () {
                        modalInstance.dismiss();
                    });
                });
            }
        };

        /// <summary>
        /// Method to open simple popup
        /// </summary>
        /// <param name="settings">settings of popup</param>
        /// <param name="content">content of the popup</param>
        function _openPopup(content) {
            var tpl = '<div>' +
                '<div class="content"></div>' +
                '<button class="k-button k-primary" id="popupYesButton"' +
                '">' +
                localizationService.translate("Buttons.GotIt") +
                '</button>' +
                '</div>';
            return $modal.open({
                template: tpl,
                settings: _notificationPopupDefaultSettings,
                resolve: {
                    items: function () {
                        return content;
                    }
                },
                content: content
            });
        }

        return PopupNotificationService;
    }
]);
/**
 * Created by C4off on 18.09.15.
 */
CSVapp.factory('objectTemplateService', ['$q', '$http', 'pageTemplateObjectService', 'schemaService',
    'objectDataService',
    function ($q, $http, pageTemplateObjectService, schemaService, objectDataService) {


        var ObjectTemplateService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to get template object (creates Fake template, containing all
        //  visible fields and all subObjects, if nothing can be retrieved)
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        ObjectTemplateService.getObjectTemplate = function (odn) {
            return pageTemplateObjectService.getObjectTemplateSettings(odn).then(function (tplObj) {
                if (!tplObj) {
                    tplObj = _createFakePageTemplateObject(odn);
                }

                return tplObj;
            })
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Creates fake template, containing all visible fields and all subObjects
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        function _createFakePageTemplateObject(odn) {
            var promises = [
                schemaService.getSchema(odn),
                objectDataService.getSubObjects(odn)
            ];

            return $q.all(promises).then(function (results) {
                return [
                    {
                        Name: "FakeTemplate",
                        PageTemplateLabel: "User Template",
                        RecordFirstImagePath: "",
                        RelatedObjectDisplayType: "Grid",
                        RelatedObjectUnderMainRecord: _getSubObjectNamesString(results[1]),
                        SelectedColumnsForTemplate: _getFieldsNamesString(results[0].SelectedColumnsList),
                        SelectedRelatedObjectsForTemplate: _getSubObjectNamesString(results[1])
                    }
                ]
            });

        }

        /// <summary>
        /// Creates subObjects string from subObjects object
        /// </summary>
        /// <param name="subObjectsObject">subObjects object</param>
        function _getSubObjectNamesString(subObjectsObject) {
            var subObjectsStr = "";
            if(angular.isArray(subObjectsObject)){
                subObjectsObject.forEach(function(subObj){
                    subObjectsStr += subObj.ObjectDefinitionID +":"+
                        "dummyOrgId:"+ subObj.ObjectDefinitionName +";";
                });
            }

            return subObjectsStr;
        }

        /// <summary>
        /// Creates visible fields string from fields object
        /// </summary>
        /// <param name="fields">fields object</param>
        function _getFieldsNamesString(fields) {
            var fieldNamesStr = "";
            if(angular.isArray(fields)){
                fields.forEach(function(field){
                    fieldNamesStr += "[" + field.PropertyName + "],";
                })
            }

            return fieldNamesStr;
        }


        return ObjectTemplateService;
    }]);
/**
 * Created by C4off on 18.09.15.
 */
CSVapp.factory('pageTemplateObjectCacheService', [
    function () {
        var _pageTemplateList = {};

        var PageTemplateObjectCacheService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to get template object from cache
        /// </summary>
        /// <param name="ObjectDefinitionName">Object Definition Name</param>
        /// <param name="templateName">optional. template name</param>
        PageTemplateObjectCacheService.getCachedPageTemplateObject = function (ObjectDefinitionName, templateName) {
            var tplObjects = _pageTemplateList[ObjectDefinitionName];
            if (!tplObjects) {
                return null;
            }
            var tplObj;
            if (templateName) {
                tplObj = tplObjects[templateName];
            } else {
                var props = Object.getOwnPropertyNames(tplObjects);
                tplObj = tplObjects[props[0]];
            }

            return tplObj || null;
        };


        /// <summary>
        /// Method to preserve template object in cache
        /// </summary>
        /// <param name="ObjectDefinitionName">Object Definition Name</param>
        /// <param name="templateName">optional. template name</param>
        PageTemplateObjectCacheService.preservePageTemplate = function (pageTemplateObject) {
            var odn = pageTemplateObject.ObjectDefinitionName;
            var pageTemplates = pageTemplateObject.PageTemplate;
            if (angular.isArray(pageTemplates) && angular.isObject(pageTemplates[0])) {
                var pageTemplateName = pageTemplateObject.PageTemplate[0].Name;
                var tplObjects = _pageTemplateList[odn];

                var tplObj;
                if (!tplObjects) {
                    tplObj = {};
                    tplObj[pageTemplateName] = pageTemplateObject;
                    _pageTemplateList[odn] = tplObj
                } else {
                    tplObj = tplObjects[pageTemplateName];
                    if (!tplObj) {
                        tplObjects[pageTemplateName] = pageTemplateObject;
                    }
                    // if we have object with same odn and
                    // template name - we just ignore new one
                }
            }
        };

        return PageTemplateObjectCacheService;
    }]);
/**
 * Created by C4off on 18.09.15.
 */
CSVapp.factory('pageTemplateObjectService', ['$q', '$http', 'configService',
    'pageTemplateObjectCacheService',
    function ($q, $http, configService, pageTemplateObjectCacheService) {

        var gConfig = configService.getGlobalConfig();

        var PageTemplateObjectService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to get template object either from cache or from API
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        /// <return>promise</return>
        PageTemplateObjectService.getObjectTemplateSettings = function (odn) {
            var deferred = $q.defer();
            var jsonSettings = [];

            var tplName;
            // First - check perspective;
            if (gConfig.perspectivePageTemplate && gConfig.perspectivePageTemplate[odn]) {
                tplName = gConfig.perspectivePageTemplate[odn];
            } else if (gConfig.objectDefinitionName == odn && gConfig.pageTemplateName) { // then if main object and we have a template name set in config
                tplName = gConfig.pageTemplateName;
            } else { // try to find default template
                tplName = "Default";
            }
            var objPage = pageTemplateObjectCacheService.getCachedPageTemplateObject(odn, tplName);
            if (!objPage || !$.isArray(objPage.PageTemplate) || !objPage.PageTemplate.length) {
                var url = configService.getUrlBase('objectPageLayout') + "/" + odn + "/" + tplName + "/" + gConfig.token;
                $http.get(url).success(function (response) {
                    jsonSettings = jQuery.parseJSON(response);
                    if(!jsonSettings || ($.isArray(jsonSettings) && !jsonSettings.length)){
                        deferred.resolve("");
                    } else {
                        pageTemplateObjectCacheService.preservePageTemplate({
                            ObjectDefinitionName: odn,
                            PageTemplate: jsonSettings
                        });
                        deferred.resolve(jsonSettings || "");
                    }
                }).
                    error(function () {
                        deferred.resolve("");
                    });
            }
            else {
                jsonSettings = objPage.PageTemplate;
                deferred.resolve((jsonSettings == null || jsonSettings == "") ? "" : jsonSettings)
            }

            return deferred.promise;
        };

        return PageTemplateObjectService;
    }
]);
/**
 * Created by antons on 2/10/2015.
 */
CSVapp.factory('schemaService', ['$q', '$http', 'configService', 'conversionCacheService',
    'printTemplateCacheService', 'pageTemplateObjectService', 'pageTemplateObjectCacheService',
    function ($q, $http, configService, conversionCacheService, printTemplateCacheService, pageTemplateObjectService, pageTemplateObjectCacheService) {

        var gConfig = configService.getGlobalConfig();
        var odn = gConfig.objectDefinitionName;
        // cached properties
        var _objectDefinitionProperties = [];
        var _schema = [];
        var _subObjectsData = [];
        var _visibleColumns = [];
        var _conditionalFields = [];
        var _dropDownListOutputSettings = [];
        var _uniqueId = 0;

        // TODO: перенести методы 'preserve' в SchemaPreserver

        var SchemaService = function () {
        }

        /// <summary>
        /// method will translate the page title
        /// <param name="objectDefinitionName">object definition name</param>
        /// <param name="parentrecordName">parent record name</param>
        /// </summary>
        SchemaService.createPageTitle = function (objectDefinitionName, parentRecordName) {
            var separator = " >> ";
            var name = "";
            if (!objectDefinitionName || !parentRecordName) {
                separator = ""
            }

            return SchemaService.getObjectDefinition(objectDefinitionName).then(function (translatedName) {
                if (translatedName) {
                    name = translatedName.ObjectLabel;
                }
                name = parentRecordName ? name + separator + parentRecordName : name;

                return name;
            });

        };

        SchemaService.getDropDownListOutputSettings = function () {
            return _dropDownListOutputSettings;
        };

        // CHECKED
        SchemaService.preserveSubObject = function (subObject) {
            var objsub = _subObjectsData.filter(function (obj) {
                if (subObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (objsub == null || objsub == undefined) {
                _subObjectsData.push(subObject);
            }
        }

        SchemaService.getSubObjectByObjectDefinitionName = function (ObjectDefinitionName) {
            return _subObjectsData.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        }
        // Saves field to conditional fields cache
        SchemaService.PreserveConditionalFields = function (objToPreserve, odn) {
            var isExistObject = _conditionalFields.filter(function (obj) {
                if (obj.DefinitionName == odn && obj.PropertyId == objToPreserve.PropertyId) {
                    return obj;
                }
            })[0];
            if (isExistObject == undefined) {
                objToPreserve.DefinitionName = odn;
                _conditionalFields.push(objToPreserve);
            }
        };

        // Saves _dropDownListOutputSettings  cache
        SchemaService.PreserveConditionalFields = function (objToPreserve, odn) {
            var isObjExist = _dropDownListOutputSettings.filter(function (obj) {

                if (obj.DefinitionName == odn && obj.PropertyName == objToPreserve.PropertyName) {
                    return obj;
                }
            })[0];

            if (isObjExist == undefined) {
                _dropDownListOutputSettings.push(objToPreserve);
            }
        };

        // Method to get cached 'visible columns'
        SchemaService.GetVisibleColumns = function () {
            return _visibleColumns;
        }

        // CHECKED
        // became async
        /// <summary>
        /// Method which will return the object definition properties
        /// <param name="objectDefinitionName">definition name</param>
        /// </summary>
        SchemaService.getObjectDefinition = function (objectDefinitionName) {
            var deferred = $q.defer();

            if (!objectDefinitionName) {
                deferred.reject('No object definition name');
            }

            var obj = _getObjectDefinitionProperties(objectDefinitionName);
            if (!obj) {
                var objectDef = null;
                var url = configService.getUrlBase('objectDefinition') +
                    "/" + objectDefinitionName + "/" + gConfig.token;
                $http.get(url).success(function (objectDefinition) {
                    objectDef = objectDefinition;
                    _objectDefinitionProperties.push({
                        ObjectDefinitionName: objectDefinitionName,
                        ObjectDefinitionProperties: objectDefinition
                    });

                    deferred.resolve(objectDefinition);
                }).error(function () {
                        deferred.reject('Error loading page template object for \'' + objectDefinitionName + '\'');
                    });
            }
            else {
                deferred.resolve(obj.ObjectDefinitionProperties);
            }

            return deferred.promise;
        }
        // Checked
        /// <summary>
        /// Method calls API to get Schema json
        /// </summary>
        /// <param name="objectDefinitionname">objectDefinitionname</param>
        SchemaService.getSchema = function (objectDefinitionname) {
            var deferred = $q.defer();
            var objSchema = SchemaService.GetSchemaByObjectDefinitionName(objectDefinitionname);
            if (objSchema == null || objSchema == undefined) {
                _fetchSchemaXML(objectDefinitionname).then(function (schemaObject) {
                    deferred.resolve(schemaObject);
                }, deferred.reject)
            }
            else {
                deferred.resolve(objSchema);
            }

            return deferred.promise;
        };

        SchemaService.UniqueId = function (prefix) {
            var id = '' + ++_uniqueId;
            return prefix ? prefix + id : id;
        }
        /// <summary>
        /// Method to check if schema is in cache, otherwise fetch it from API
        /// for "Main" object on page
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propViewType">type that selects what properties to be listed in result (all, visible, selected etc)</param>
        SchemaService.GetVisibleFieldsDetails = function (odn, propViewType) {
            var deferred = $q.defer();

            _getFieldProperties(odn, propViewType).then(function (selectedFields) {
                deferred.resolve(selectedFields);
            });

            return deferred.promise;
        }
        // CHECKED
        /// <summary>
        /// Method to check if schema is in cache, otherwise fetch it from API
        /// for "Main" object on page
        /// </summary>
        SchemaService.Init = function () {
            var jsonStructure = gConfig.jsonStructure;
            _preserveSchemaJsonStructure(jsonStructure);
            if (!SchemaService.GetSchemaByObjectDefinitionName(odn)) {
                _fetchSchemaXML(odn);
            }
        };

        // checked
        var _getObjectDefinitionProperties = function (objectDefinitionName) {
            return _objectDefinitionProperties.filter(function (obj) {
                if (obj.ObjectDefinitionName == objectDefinitionName) {
                    return obj
                }
            })[0];
        }
        // CHECKED
        SchemaService.EmptySchema = function (objectDefinitionName) {
            var deferred = $q.defer();
            var objSchema = SchemaService.GetSchemaByObjectDefinitionName(objectDefinitionName);
            var emptySchema = [];
            var emptyObject = {};
            if (objSchema == undefined || objSchema == null || objSchema.AllColumnsList.length == 0) {
                _fetchSchemaXML(objectDefinitionName).then(function (schemaObj) {
                    var columnsList = schemaObj.AllColumnsList;
                    for (var column in columnsList) {
                        if (columnsList[column].Visible != undefined || columnsList[column].Visible != null || columnsList[column].Visible == true || columnsList[column].Visible == undefined) {
                            emptyObject[columnsList[column].PropertyName] = null;
                        }
                    }
                    emptySchema.push(emptyObject);
                    deferred.resolve(emptySchema);
                }, function (error) { // in case of API call error
                    // log error and return empty schema
                    deferred.resolve(emptySchema);
                });
            } else {
                var columnsList = objSchema.AllColumnsList;
                for (var column in columnsList) {
                    if (columnsList[column].Visible != undefined || columnsList[column].Visible != null || columnsList[column].Visible == true || columnsList[column].Visible == undefined) {
                        emptyObject[columnsList[column].PropertyName] = null;
                    }
                }
                emptySchema.push(emptyObject);
                deferred.resolve(emptySchema);
            }

            return deferred.promise;
        };

        // CHECKED
        /// <summary>
        /// Method to get existing config().Schema object (if exists).
        /// </summary>
        /// <param name="ObjectDefinitionName">ObjectDefinitionName to check if exists</param>
        /// <param name="schemaArray">has all the existing objects of schemas</param>
        SchemaService.GetSchemaByObjectDefinitionName = function (ObjectDefinitionName) {
            return _schema.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        };
        // CHECKED
        /// <summary>
        /// method will return model object for grid's datasource .
        /// this model object contains configured columns.
        /// </summary>
        /// <param name="columnsList">has array of visible columns</param>
        SchemaService.CreateModelSchema = function (columnsList) {
            var model = new Object();
            var strfields = "{";
            for (var column in columnsList) {
                switch (columnsList[column].DataType) {
                    case gConfig.dataTypes.DateTime:
                        strfields += '"' + columnsList[column].PropertyName + '": {"type":"date"},';
                    case gConfig.dataTypes.Date:
                        strfields += '"' + columnsList[column].PropertyName + '": {"type":"date"},';
                        break;
                }
            }
            strfields = strfields.substring(0, strfields.length - 1) + "}";
            model.id = gConfig.modelId;
            model.fields = JSON.parse(strfields);
            return model;
        };

        SchemaService.FilterFieldsSelected4Template = function (fields, selectedColumns) {
            // in case of absent 'selectedColumns' string - use one from gConfig.
            // But be careful, because it's taken for 'main' objectDefinitionName
            selectedColumns = selectedColumns || gConfig.selectedColumns;
            var selectedFields = [];
            var indecesObj = _getFieldsValuesIndeces(fields);

            var index;
            var SelectedColumnsArrayList = selectedColumns.split(",");
            SelectedColumnsArrayList.forEach(function (column) {
                if (column != "") {
                    var trimmedColumn = column.replace(/[[\]]/g, '');
                    index = indecesObj[trimmedColumn];
                    if (index != null && index != undefined) {
                        // find a property in field list and push it
                        selectedFields.push(fields[index]);
                    }
                }
            });

            return selectedFields;
        };
        // CHECKED
        /// <summary>
        /// Method to get selected fields by an option (used for advanced search now)
        /// </summary>
        /// <param name="fields">array of object properties</param>
        /// <param name="jsonSettings">json settings for that object</param>
        /// <param name="propViewType">checks what properties to use (all|selected|visible|jsonSelected)</param>
        function _getVisibleFields(fields, jsonSettings, propViewType, selectedFieldsString) {
            var fieldsSelected4Template = [];
            if (!angular.isArray(fields)) {
                return [];
            }
            switch (propViewType) {
                case "all":
                    fieldsSelected4Template = fields;
                    break;
                case "selected":
                    fieldsSelected4Template = SchemaService.FilterFieldsSelected4Template(fields, selectedFieldsString);
                    break;
                case "jsonSelected":
                    if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedColumnsForTemplate) {
                        fieldsSelected4Template = SchemaService.FilterFieldsSelected4Template(fields, jsonSettings[0].SelectedColumnsForTemplate)
                    }
                    break;
                case "visible":
                    fieldsSelected4Template = fields.filter(function (elem) {
                        return elem.Visible;
                    });
                    break;
            }

            return fieldsSelected4Template;
        }

        // CHECKED
        function _getFieldsValuesIndeces(fields) {
            var fieldsIndecesObj = {};
            fields.forEach(function (elem, key) {
                fieldsIndecesObj[elem.PropertyName] = key;
            })

            return fieldsIndecesObj;
        }

        // CHECKED
        /// <summary>
        /// Method to get schema from cache or fetch it from API
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propViewType">checks what properties to use (all|visible|selected4template)</param>
        function _getFieldProperties(odn, propViewType) {
            var deferred = $q.defer();

            var schema = null;
            var columnsList = null;
            var fieldsSelected4Template = [];
            var jsonSettings;
            var pageTemplateName = gConfig.pageTemplateName;
            // try to get field info from schema cache
            if (odn != undefined && odn != null) {
                schema = _schema.filter(function (obj) {
                    if (odn == obj.ObjectDefinitionName) {
                        return obj
                    }
                })[0];
            }
            // if schema is in cache
            if (schema) {
                columnsList = schema.AllColumnsList;
                // get object settings from cache or make API call
                pageTemplateObjectService.getObjectTemplateSettings(odn).then(function (jsonSettings) {
                    // get fields selected for template
                    fieldsSelected4Template = _getVisibleFields(columnsList, jsonSettings, propViewType);

                    deferred.resolve(fieldsSelected4Template);
                });
            }
            else { // need to fetch schema from API
                pageTemplateObjectService.getObjectTemplateSettings(odn).then(function (jsonSettings) {
                    var errorClbk = function () {
                        fieldsSelected4Template = _getVisibleFields(gConfig.visibleColumns, jsonSettings, propViewType);
                        deferred.resolve(fieldsSelected4Template);
                    }
                    var successClbk = function (schemaObj) {
                        var fields = schemaObj.AllColumnsList;
                        fieldsSelected4Template = _getVisibleFields(fields, jsonSettings, propViewType);
                        deferred.resolve(fieldsSelected4Template);
                    }
                    _fetchSchemaXML(odn).then(successClbk, errorClbk);
                });
            }

            return deferred.promise;
        }

        function _fetchSchemaXML(odn){
                var deferred = $q.defer();

                var url = configService.getUrlBase('getObjectSchema');
                    var PostData = '<Context   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'+
                        '<TypeName>Order</TypeName>'+
                        '<OperationName>GetObjectMetaData</OperationName>'+
                        '</Context>';
            debugger;
            $.ajax({
                type: 'post',
                dataType: 'xml',
                data: PostData,
                url: url
            }).success(function (response) {
                    var columnslist = parseXMLResponse(response);
                    _fillSchema(columnslist, odn);
                    var schemaObject = SchemaService.GetSchemaByObjectDefinitionName(odn);
                    deferred.resolve(schemaObject);
                }).error(function (xhr, ajaxOptions, thrownError) {
                    var responseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (responseCodeValue == "UnAuthorized") {
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    }
                    else {
                        deferred.reject(url + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                    }
                });

            return deferred.promise;
        }
        function _parseXMLResponse(response){
            debugger;
        }
        // CHECKED
        /// <summary>
        /// Method to fetch schema from API
        /// </summary>
        /// <param name="odn">object definition name</param>
        function _fetchSchema(odn) {
            var deferred = $q.defer();

            var urlBase = configService.getUrlBase('getObjectSchema');
            if (urlBase) {
                var url = urlBase + "/" + odn + "/" + gConfig.token;
                var PostData = gConfig.postData;
                PostData.Clear();
                PostData.RequestType = "Heads";

                $http.get(url).success(function (columnslist) {
                    _fillSchema(columnslist, odn);
                    var schemaObject = SchemaService.GetSchemaByObjectDefinitionName(odn);
                    deferred.resolve(schemaObject);
                }).error(function (xhr, ajaxOptions, thrownError) {
                        var responseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (responseCodeValue == "UnAuthorized") {
                            deferred.reject(xhr.getResponseHeader('ResponseCode'));
                        }
                        else {
                            deferred.reject(urlBase + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                        }
                    }
                );
            }
//                $.ajax({
//                    type: "GET",
//                    url: url,
//                    data: PostData,
//                    dataType: "json",
//                    success: ,
//                    error: );
//            }
            else {
                deferred.reject("Wrong url 'getObjectSchema' in _fetchSchema method");
            }

            return deferred.promise;
        }

        // CHECKED
        /// <summary>
        /// To get template of Kendo grid column based on datatype.
        /// </summary>
        /// <param name="dataType">dataType of property</param>
        /// <param name="propertyName">to replace @ with propertyname</param>
        function _fillSchema(columnsList, objectDefinitionName) {
            var schemaObject = new Object;
            schemaObject.ObjectDefinitionName = objectDefinitionName;
            schemaObject.AllColumnsList = columnsList;
            schemaObject.SelectedColumnsList = new Array();
            for (var columnNo in columnsList) {
                var column = new Object();
                if (columnsList[columnNo].Visible != undefined && columnsList[columnNo].Visible != null && columnsList[columnNo].Visible == true) {
                    column = columnsList[columnNo];
                    schemaObject.SelectedColumnsList.push(column);
                }
            }
            schemaObject.Model = SchemaService.CreateModelSchema(columnsList);
            _preserveSchema(schemaObject);

            return schemaObject
        }

        // CHECKED
        /// <summary>
        /// method will return presaved schema .
        /// this model object contains configured columns.
        /// </summary>
        /// <param name="schemaObject">has array of visible columns</param>
        function _preserveSchema(schemaObject) {
            var schema = _schema.filter(function (obj) {
                if (schemaObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (schema == null || schema == undefined) {
                _schema.push(schemaObject);
            }
        };
        // NOT CHECKED
        /// <summary>
        /// method will preserve all object from Json Structure
        /// </summary>
        function _preserveSchemaJsonStructure(jsonStructure) {
            if (jsonStructure != '') {
                jsonStructure = JSON.parse(jsonStructure);

                var objects = Object.keys(jsonStructure);
                if (objects != null && objects.length > 0) {

                    for (k = 0; k < objects.length; k++) {
                        var objectDefinitionName = objects[k];

                        //Preserve Object Definition
                        var objectDefinition = _getObjectDefinitionFromJsonStructure(objectDefinitionName, jsonStructure);
                        if (objectDefinition != null) {
                            var obj = new Object();
                            obj.ObjectDefinitionName = objectDefinitionName;
                            obj.ObjectDefinitionProperties = objectDefinition;
                            _objectDefinitionProperties.push(obj);
                        }

                        //Preserve Property Schema
                        var columnslist = _getPropertiesColumnFromJsonStructure(objectDefinitionName, jsonStructure);
                        if (columnslist != null)
                            _fillSchema(columnslist, objectDefinitionName);

                        ////Preserve SubObjects
                        var subObjects = _getSubObjectFromJsonStructure(objectDefinitionName, jsonStructure);

                        var obj = new Object();
                        obj.ObjectDefinitionName = objectDefinitionName;
                        obj.SubObjectsObject = subObjects != null ? subObjects : null;
                        SchemaService.preserveSubObject(obj);

                        ////Preserve PageTemplate
                        var pageTemplateSettings = _getPageTemplateFromJsonStructure(objectDefinitionName, jsonStructure);

                        var pageobj = new Object();
                        pageobj.ObjectDefinitionName = objectDefinitionName;
                        if (pageTemplateSettings != null && pageTemplateSettings.length != undefined) {
                            pageobj.PageTemplate = pageTemplateSettings;
                        }
                        else {
                            pageobj.PageTemplate = [];
                        }
                        pageTemplateObjectCacheService.preservePageTemplate(pageobj);

                        ////Preserve ConversionList
                        var response = _getConversionListFromJsonStructure(objectDefinitionName, jsonStructure);
                        if (response != null) {
                            var objConversion = new Object();
                            objConversion.ObjectDefinitionName = objectDefinitionName;
                            objConversion.ConversionList = response;
                            conversionCacheService.preserveConversionObject(objConversion);
                        }
                        ////Preserve Print Object
                        var responsePrint = _getPrintTemplateFromJsonStructure(objectDefinitionName, jsonStructure);

                        var objPrint = new Object();
                        objPrint.ObjectDefinitionName = objectDefinitionName;
                        objPrint.PrintTemplateList = responsePrint != null ? responsePrint : null;
                        printTemplateCacheService.preservePrintTemplateObject(objPrint);
                    }
                }
            }
        }

        // CHECKED
        /// <summary>
        /// method will get Print Template from JsonStructure With ObjectName
        /// </summary>
        function _getPrintTemplateFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].PrintTemplate;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get ConversionList from JsonStructure With ObjectName
        /// </summary>
        function _getConversionListFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].ConversionList;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get PageLayout from JsonStructure With ObjectName
        /// </summary>
        function _getPageTemplateFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].PageTemplate;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get Subobject from JsonStructure With ObjectName
        /// </summary>
        function _getSubObjectFromJsonStructure(objectDefinitionName, json) {
            var filterObject = $.grep(Object.keys(json), function (k) {
                if (json[k].ParentObjectName === objectDefinitionName) {
                    return Object.keys(json);
                }
            })

            var subObjectList = [];

            if (filterObject != null && filterObject.length > 0) {
                for (i = 0; i < filterObject.length; i++) {
                    var objectDefinition = _getObjectDefinitionFromJsonStructure(filterObject[i], json);
                    if (objectDefinition) {
                        var subObject = new Object();
                        subObject.ObjectDefinitionID = objectDefinition["ObjectDefinition_ID"];
                        subObject.ObjectDefinitionName = objectDefinition["ObjectName"];

                        subObject.PropertyDefinitionID = json[filterObject[i]].PropertyDefinitionID; //filterObject[i]; //PropertyId of Parent Object
                        subObject.PropertyName = json[filterObject[i]].ParentPropertyName;
                        subObject.ObjectLabel = objectDefinition.ObjectLabel;
                        subObjectList.push(subObject);
                    }
                }
                return subObjectList;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get ObjectDefinition from JsonStructure With ObjectName
        /// </summary>
        function _getObjectDefinitionFromJsonStructure(objectDefinitionName, json) {
            if (json[objectDefinitionName] != null) {
                return json[objectDefinitionName].ObjectDefinition;
            }
            else {
                return null;
            }
        }

        // CHECKED
        /// <summary>
        /// method will get Properties from JsonStructure With ObjectName
        /// </summary>
        function _getPropertiesColumnFromJsonStructure(objectDefinationName, json) {
            if (json[objectDefinationName] != null) {
                return json[objectDefinationName].PropertyDefinition;
            }
            else {
                return null;
            }

        }

        return SchemaService;
    }
]);
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
/**
 * Created by antons on 2/13/15.
 */
CSVapp.factory('configService', ['filesystemService', function (filesystemService) {

    var _throwException = true;

    var ConfigService = function () {
    };

    ConfigService.Init = function () {
        _setEnvParams(globalConfig.environment);

        return ConfigService.getGlobalConfig();
    };

    /// <summary>
    /// Method to get relative address for template and add version to bust cache
    /// </summary>
    /// <param name="tplName">name of template</param>
    ConfigService.getTemplateUrl = function (tplName) {
        var version = globalConfig.version || "";

        return filesystemService.getTemplateUrl(tplName, version);
    };

    ConfigService.getUrlBase = function (string) {
        var url = globalConfig.urls[string];
        if (url) {
            url = globalConfig.baseUrl + '/' + url;
        }

        return url;
    };

    // TODO: OLD. Remove after CSVPageLogicController refatcor
    ConfigService.init = function () {
        legacyConfig.Settings(globalConfig.baseUrl, globalConfig.token, globalConfig.userName).Init();

        return legacyConfig;
    };
    // TODO: OLD. get rid of legacy config
    ConfigService.getConfig = function () {
        if (typeof $config != "undefined") {
            {
                return $config;
            }
        } else {
            return $.config;
        }
    };
    ConfigService.getSchedulerConfig = function () {
        // TODO: extend default params with incoming and check them
        return SchedulerConfig;
    };
    ConfigService.getPageConfig = function () {
        return pageConfig;
    };
    ConfigService.getGlobalConfig = function () {
        return globalConfig;
    };
    // Private methods
    // Method to set all environmental variables
    function _setEnvParams(env) {
        // do not throw exceptions for prod
        _throwException = env != 'prod';
        filesystemService.InitPathsByEnv(env);
    }

    var lPageConfig = ConfigService.getPageConfig();

    var globalConfig = {
        baseUrl: lPageConfig.baseUrl,
        token: lPageConfig.token,
        userName: lPageConfig.userName,
        objectDefinitionName: lPageConfig.objectDefinitionName,
        pageTemplateName: lPageConfig.pageTemplateName,
        perspectiveFilter: lPageConfig.hfPerspectiveFilter,
        perspectivePageTemplate: lPageConfig.perspectivePageTemplate,
//        perspectiveFilter: JSON.parse(lPageConfig.hfPerspectiveFilter),
        selectedColumns: lPageConfig.selectedColumns,
        urls: GCUrls,
        postData: GCPostData,
        cookies: GCCookies,
        dataTypes: GCFieldDataTypes,
        jsonStructure: lPageConfig.JSONStructure,
        modelId: lPageConfig.modelId || 'ObjectEntry_ID',
        environment: lPageConfig.environment,
        version: lPageConfig.templateVersion,
        objectDetailDisplayType: lPageConfig.objectDetailDisplayType,
        objectDetailPageSize: lPageConfig.objectDetailPageSize,
        inlineSaveMethod: lPageConfig.inlineSaveMethod || 'server',
        mobileView: lPageConfig.mobile,
        // Grid things
        gridEditable: lPageConfig.gridEditable || false,
        gridContainer: lPageConfig.gridContainer,
        defaultSortOrder: lPageConfig.defaultSortOrder,
        gridPageSize: lPageConfig.gridPageSize,
        waitForFilter: lPageConfig.waitForFilter,
        showFirstRecord: lPageConfig.showFirstRecord,
        mobile: lPageConfig.mobile,
        batchUpdate: lPageConfig.batchUpdate,
        // Detail Page
        enableKeyboard: lPageConfig.enableKeyboard,
        // DEBUG
        advancedSearchTpl: lPageConfig.advancedSearchTpl
    };

    return ConfigService;
}]);
/**
 * Created by antons on 5/20/15.
 */
CSVapp.factory('filesystemService', [ function () {

    var _pluginFilesInitPath = "";
    var _imagesBaseUrl = "";
    var _imageIconUrl = "";
    var _templateBaseUrl = "DesktopModules/src/components";

    var _imageSizes = {
        h60: '_t_h60',
        h100: '_t_h100',
        h500: '_t_h500',
        h1024: '_t_h1024'
    };

    var _imageExtensions = [
        'jpg',
        'jpeg',
        'gif',
        'png'
    ];

    var FilesystemService = function () {
    };

    /*PUBLIC METHODS*/

    /// <summary>
    /// Method to understand, that image url is absolute
    /// </summary>
    /// <param name="url">url of an image</param>
    FilesystemService.isImageUrlAbsolute = function(url){

        return ('' + url).indexOf('http://') != -1;
    };

    /// <summary>
    /// Method to get relative address for template and add version to bust cache
    /// </summary>
    /// <param name="tplName">name of template, relative to '_templateBaseUrl'</param>
    /// <param name="version">hash to add to name</param>
    FilesystemService.getTemplateUrl = function(tplName, version){
        version = version ? "?v" + version : "";

        return _templateBaseUrl + '/' + tplName + version;
    };

    // TODO: introduce baseUrl prop to get relative addresses
    FilesystemService.InitPathsByEnv = function (env, throwException) {
        switch (env) {
            case 'local':
                _imagesBaseUrl = "http://localhost/Speedup_dnn/";
                _imageIconUrl = "http://localhost/Speedup_dnn/images/SU_images/FileExtensionImages/";
                _pluginFilesInitPath = "/speedup_dnn/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                break;
            case 'test':
                _pluginFilesInitPath = "/speedupcustomers/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                _imagesBaseUrl = "http://test-srv1.speeduperp.com/speedupcustomers/";
                _imageIconUrl = "http://test-srv1.speeduperp.com/speedupcustomers/images/SU_images/FileExtensionImages/";
                break;
            case 'stage':
                _pluginFilesInitPath = "/speedupcustomers/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                _imagesBaseUrl = "http://staging-srv1.speeduperp.com/speedupcustomers/";
                _imageIconUrl = "http://staging-srv1.speeduperp.com/speedupcustomers/images/SU_images/FileExtensionImages/";
                break;
            case 'prod':
                _pluginFilesInitPath = "/speedupcustomers/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                _imageIconUrl = "http://speeduperp.com/Speedupcustomers/images/SU_images/FileExtensionImages/";
                _imagesBaseUrl = "http://speeduperp.com/speedupcustomers/";
                break;
            default:
                if (throwException) {
                    throw "wrong environment variable: '" + env + "'";
                }
        }
        _templateBaseUrl = _imagesBaseUrl + _templateBaseUrl;
    };

    // checked
    FilesystemService.getImageIconUrl = function (imageUrl) {
        return FilesystemService.createCompletePath(imageUrl, 'icon');
    };
    // CHECKED
    FilesystemService.getImageUrl = function (imageUrl) {
        return imageUrl ? FilesystemService.createCompletePath(imageUrl, 'image') : "";
    };
    // CHECKED
    FilesystemService.getPluginImageUrl = function (imageUrl) {
        return FilesystemService.createCompletePath(imageUrl, 'plugin');
    };
    // CHECKED
    FilesystemService.getCompletePluginFilePath = function (filePath) {
        return FilesystemService.createCompletePath(filePath, 'plugin');
    };
    // CHECKED
    FilesystemService.createCompletePath = function (appendPath, type) {
        var constPath;
        switch (type) {
            case 'image':
                constPath = _imagesBaseUrl;
                break;
            case 'plugin':
                constPath = _pluginFilesInitPath;
                break;
            case 'icon':
                constPath = _imageIconUrl;
                break;
        }
        var completePath = "";

        if (constPath == null || constPath == "") {
            completePath = appendPath;
        }
        else {
            var lastChar = constPath.slice(-1);
            if (lastChar == "/") {
                completePath = constPath + appendPath;
            }
            else {
                completePath = constPath + "/" + appendPath;
            }
        }

        return completePath;
    };
    //checked
    FilesystemService.fileIsImageByExtension = function (fileExtension) {
        return $.inArray(fileExtension, _imageExtensions) != -1;
    };
    // checked
    /// <summary>
    /// Method to get file extension
    /// </summary>
    /// <param name="url">filename</param>
    FilesystemService.getFileExtension = function (url) {
        var extension = "";
        var extIndex = url.lastIndexOf('.');
        if (extIndex != -1) {
            extension = url.substr(extIndex + 1).toLowerCase();
        }

        return extension;
    };
    /// <summary>
    /// Method to get url for temporary attachment
    /// </summary>
    /// <param name="url">filename</param>
    FilesystemService.changeTmpImageUrl = function(filePath, fileName, fileExt){
        if (!filePath) {
            return "";
        }
        return _imagesBaseUrl + "/Upload/" + filePath.substring(filePath.lastIndexOf("Temp_OM_Uploads"), filePath.length) + "/"
            + fileName + "." + fileExt;

    };
    //  TODO: now h500 is hardcoded
    FilesystemService.changeImageUrl = function (url) {
        if (url == null || url == '') return "";
        url = FilesystemService.imageUrlFromRelative(url);
        var index = url.lastIndexOf(".");
        var first = url.substring(0, index);
        var last = url.substring(index);
        var img500Size = SUConstants.ImageSizes.h500;

        return first + img500Size + last;
    };
    // checked
    FilesystemService.imageUrlFromRelative = function (url) {
        return url.replace("~", _imagesBaseUrl)
    };
    // checked
    FilesystemService.changeImageUrlAndSize = function (url, size) {
        if (url == null || url == '') {
            url = FilesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
        }
        else {
            url = FilesystemService.imageUrlFromRelative(url);
            var index = url.lastIndexOf(".");
            var first = url.substring(0, index);
            var last = url.substring(index);
            url = first + size + last;
        }

        return url;
    };

    return FilesystemService;
}
]);
/**
 * Created by antons on 4/10/15.
 */
CSVapp.factory('autocompleteService', ['configService', 'eventManager',
    function (configService, eventManager) {
        var gConfig = configService.getGlobalConfig();

        // cached ac data
        var _autocompleteData = [];
        // cached fields, wrapped with ac functionality
        var _autocompleteFields = {};
        var _uniqueId = 0;

        var AutocompleteService = function () {};
        /*PUBLIC METHODS*/

        AutocompleteService.getValuesWithIds =function(fieldId){
            var valuesObj = [];
            if (fieldId && _autocompleteData['Values'] && _autocompleteData['Values'][fieldId]){
                var acValues = _autocompleteData['Values'][fieldId]['Values'];
                for (var elementId in acValues){
                    if(!acValues.hasOwnProperty(elementId)){
                        return false;
                    }
                    valuesObj.push({
                        id: elementId,
                        text: acValues[elementId]
                    })
                }
            }

            return valuesObj;
        };

        /// <summary>
        /// Method to wrap input with autocomplete
        /// </summary>
        /// <param name="container">container of a form with fields (e.g. Detail Page container)</param>
        /// <param name="element">input to be wrapped</param>
        /// <param name="propertyName">name of the property (object definition name)</param>
        /// <param name="objectDefinitionID">property id</param>
        /// <param name="acData">array of values (optional)</param>
        /// <param name="options">array of widget options to override defaults</param>
        /// <param name="onChange">function to be called in widget 'onChange' handler</param>
        /// <param name="dontUpdateDeps">if true - dependencies won't be updated</param>
        /// <param name="relatedPropertyName">name of related object</param>
        AutocompleteService.wrapElement = function (container, element, propertyName, objectDefinitionID,
                                                    acData, options, onChange, dontUpdateDeps, relatedObjectName) {
            var fieldId = $.data(element[0], 'jqacuid');
            if (!fieldId) {
                $.data(element[0], 'jqacuid', _getUniqueAcId());
            }
            // if we have already wrapped the element and
            // only need to modify data source
            if (fieldId && _autocompleteFields[fieldId] &&
                _autocompleteFields[fieldId].element) {
                // if we pass data - set it as data source
                if ($.isArray(acData)) {
                    var acFieldWidget = _autocompleteFields[fieldId].element.data("kendoAutoComplete");
                    if (acFieldWidget) {
                        acFieldWidget.dataSource.data(acData);
                    }
                } else {
                    // do nothing. Maybe we just clicked 'inline edit' for property,
                    // that has been already updated by _updateDependencies
                }
            } else {
                // if no acData passed - find it in cache
                if (!$.isArray(acData)) {
                    if (_autocompleteData["Values"] && _autocompleteData["Values"][objectDefinitionID])
                        acData = _getDataSource(_autocompleteData["Values"], objectDefinitionID);
                    // Sometimes if id-bindings are wrong we may try
                    // to find acData by propertyName
                    if (!acData) {
                        acData = _getDataByODN(propertyName);
                        // try to find by related object name
                        if (!acData.length && relatedObjectName) {
                            acData = _getDataByODN(relatedObjectName);
                        }
                    }
                    acData = acData || [];
                }
                var newFieldId = $.data(element[0], 'jqacuid', _getUniqueAcId());
                var defaultSettings = {
                    dataSource: acData,
                    filter: "contains",
                    placeholder: "",
                    separator: "",
                    animation: false,
                    select: function (e) {
                        if (e.item && e.item.text()) {
                            var value = e.item.text();
                            //put object_ID into hidden field
                            var propertyID = _getPropertyIdByName(_autocompleteData["Values"], objectDefinitionID, value);
                            if(!propertyID && relatedObjectName){
                                propertyID = _getValueIDByObjectName(relatedObjectName ,value);
                            }
                            if (propertyID) {
                                container.find("#hdn" + propertyName).val(propertyID);
                                container.find("#txt" + propertyName).val(value);
                            }
                            // find all autocomplete fields in container
                            var currentContainerACFields = _findAutocompleteFieldsInContainer(container);
                            if (currentContainerACFields.length && !dontUpdateDeps) {
                                _updateDependencies(_autocompleteFields, _autocompleteData, container,
                                    currentContainerACFields, objectDefinitionID, value, relatedObjectName);
                            }
                            if ($.isFunction(onChange)) {
                                onChange(e);
                            }
                        }
                    }
                };
                // apply additional options
                var acObj = angular.isObject(options) ?
                    angular.extend({}, defaultSettings, options) :
                    defaultSettings;

                _autocompleteFields["" + newFieldId] = {
                    element: element.kendoAutoComplete(acObj),
                    propertyName: propertyName,
                    oid: objectDefinitionID
                };
            }
        };

        /// <summary>
        /// Method to get autocomplete data by object definition name
        /// </summary>
        /// <param name="odn">object definition name</param>
        AutocompleteService.getValuesByODN = function (odn) {
            var data = [];
            if (!_autocompleteData) {
                AutocompleteService.prepareACData(acData);
            }
            if (_autocompleteData) {
                data = _getDataByODN(odn);
            }

            return data;
        };
        /// <summary>
        /// brings the autocomplete data to a needed format
        /// </summary>
        /// <param name="acData">array of unformatted autocomplete data</param>
        AutocompleteService.prepareACData = function (acData) {
            var acDataMerged = _mergeACData(acData);
            var preparedData = {};
            if (!acDataMerged["Values"]) {
                return null;
            }
            preparedData["Values"] = acDataMerged["Values"];
            //adds reversed dependencies, so if "child" value changes "parent" also filters
            preparedData["Values"] = _addInvertedValues(preparedData["Values"]);
            if (acDataMerged["Dependencies"]) {
                preparedData["Dependencies"] = acDataMerged["Dependencies"];
                _fixDependencies(preparedData["Dependencies"]);
                // adds inversed relations for field "id"->"field_value" to increase search
                _addInversedRelations(preparedData["Dependencies"]);
            }

            _autocompleteData = preparedData;
        };

        /*PRIVATE  METHODS*/

        /// <summary>
        /// returns data for particular object by its name
        /// </summary>
        /// <param name="objectDefinitionName">object definition name</param>
        function _getDataByODN(objectDefinitionName) {
            if (_autocompleteData && _autocompleteData["Values"]) {
                var acData = _autocompleteData["Values"];
                for (var acKey in acData) {
                    if (acKey === 'length' || !acData.hasOwnProperty(acKey)) continue;
                    if (acData[acKey]["Name"] == objectDefinitionName || acData[acKey]["RelatedEntityName"] == objectDefinitionName) {
                        return _getDataSource(acData, acKey);
                    }
                }
            }

            return [];
        }
        /// <summary>
        /// returns data source for a particular field
        /// </summary>
        /// <param name="autocompleteData">autocomplete data</param>
        /// <param name="propertyDefinitionID">property id</param>
        function _getDataSource(autocompleteData, propertyDefinitionID) {
            try {
                var acData = autocompleteData[propertyDefinitionID]["Values"] || [];
                var dataSource = [];
                for (var acKey in acData) {
                    if (acKey === 'length' || !acData.hasOwnProperty(acKey)) continue;
                    dataSource.push(acData[acKey]);
                }

                return dataSource;
            } catch (e) {
                return [];
            }
        }
        // <summary>
        /// returns array of _acFields id-s of autocomplete fields in that container
        /// </summary>
        /// <param name="container">fields container</param>
        function _findAutocompleteFieldsInContainer(container) {
            var dataTypes = gConfig.dataTypes;
            var acFields = [];
            if (!container) {
                return acFields;
            }
            container.find('._keycontainer').each(function (key, element) {
                var dataType = angular.element(element).attr('dtype');
                if (dataType === dataTypes.ParentRelationship ||
                    dataType === dataTypes.ObjectRelationship) {
                    var key = angular.element(element).attr('key');
                    var acElement = $(element).find('#txt' + key);
                    if (acElement.length) {
                        var jqacFieldId = $.data(acElement[0], 'jqacuid');
                        if (jqacFieldId) {
                            acFields.push(jqacFieldId)
                        }
                    }
                }
            });

            return acFields;
        }
        // <summary>
        /// updates values of all dependant fields
        /// </summary>
        /// <param name="acFields">all fields wrapped with ac</param>
        /// <param name="acData">ac values</param>
        /// <param name="container">fields container</param>
        /// <param name="containerACFields">id-s of ac fields in particular container</param>
        /// <param name="objectId">property id</param>
        /// <param name="value">value</param>
        function _updateDependencies(acFields, acData, container, containerACFields, objectId, value, relatedObjectName) {
            if (!acData) {
                return
            }
            var acValues = acData["Values"];
            var acDeps = acData["Dependencies"];
            if (!acValues || !acDeps) {
                return
            }
            var updatedFields = [];
            var valueId = _getPropertyIdByName(acValues, objectId, value);
            if(!valueId && relatedObjectName){
                valueId = _getValueIDByObjectName(relatedObjectName ,value);
            }
            // main logic comes there. And available for recursion
            _doUpdateDependencies(acFields, acDeps, acValues, container,
                containerACFields, objectId, valueId, updatedFields, relatedObjectName);
        }

        // <summary>
        /// recursive function to do actual dependencies update
        /// </summary>
        /// <param name="acFields">all fields wrapped with ac</param>
        /// <param name="acDeps">fields dependencies</param>
        /// <param name="acValues">values for ac fields</param>
        /// <param name="container">fields container</param>
        /// <param name="containerACFields">id-s of ac fields in particular container</param>
        /// <param name="objectId">property id</param>
        /// <param name="valueId">id of a value</param>
        /// <param name="updatedFields">list of already updated fields</param>
        /// <param name="relatedObjectName">related object name</param>
        function _doUpdateDependencies(acFields, acDeps, acValues, container, containerACFields,
                                       objectId, valueId, updatedFields, relatedObjectName) {
            //if field has a related field
            objectId = "" + objectId;
            updatedFields.push(objectId);
            // find dependant fields in current container
            var allDependentFieldsInfo = acDeps[objectId];
            var acFieldsKey;
            for (key in allDependentFieldsInfo) {
                if (key === 'length' || !allDependentFieldsInfo.hasOwnProperty(key)) {continue;};
                // loop through all ac-fields in current container
                // to find ones to be updated
                for (key1 in containerACFields) {
                    if (key1 === 'length' || !containerACFields.hasOwnProperty(key1)) {continue;};
                    // get key for acFields array. It holds input,
                    // "wrapped"  with ac functionality
                    acFieldsKey = containerACFields[key1];
                    // if there's no acField by this key - skip
                    var acField = acFields[acFieldsKey];
                    if (!acField) {continue;};

                    if (acField.oid == key && $.inArray("" + acField.oid, updatedFields) == -1) {
                        if (!allDependentFieldsInfo[key]) {continue};
                        var deps = allDependentFieldsInfo[key][valueId];
                        // if something is wrong with dependencies or there are no values
                        // set empty data source for particular field
                        if (!deps || !deps.length) {
                            _updateDataSource(container, acField.element, acField.propertyName, [],
                                _autocompleteData["Values"], key, relatedObjectName);
                        } else {
                            var values = [];
                            //get field values by ids
                            deps.forEach(function (element) {
                                if (acValues[key]["Values"][element]) {
                                    values.push(acValues[key]["Values"][element]);
                                }
                            });
                            var valueSetId = _updateDataSource(container, acField.element, acField.propertyName, values,
                                _autocompleteData["Values"], key, relatedObjectName);
                        }
                        // if we set the only value to subfield -
                        // update dependant values
                        if(valueSetId){
                            // recursively update subfields
                            _doUpdateDependencies(acFields, acDeps, acValues, container, containerACFields,
                                key, valueSetId, updatedFields, relatedObjectName)
                        }
                    }
                }
            }
        }
        // <summary>
        /// updates autocomplete input with new data
        /// </summary>
        /// <param name="container">fields container</param>
        /// <param name="acInput">input with ac functionality</param>
        /// <param name="elementName">object definition name</param>
        /// <param name="dataSource">data source object for widget</param>
        /// <param name="acValues">values for ac fields</param>
        /// <param name="objectDefinitionID">object definition id</param>
        /// <param name="relatedObjectName">related object name</param>
        function _updateDataSource(container, acInput, elementName, dataSource, acValues, objectDefinitionID, relatedObjectName) {
            var acWidget = acInput.data('kendoAutoComplete');
            // create new DataSource
            var dataSourceObj = new kendo.data.DataSource({data: dataSource});
            acWidget.setDataSource(dataSourceObj);
            // if there's the only value - set it
            var value, propertyID;
            if (dataSource.length == 1) {
                value = dataSource[0];
                propertyID = _getPropertyIdByName(acValues, objectDefinitionID, value);
                if(!propertyID && relatedObjectName){
                    propertyID = _getValueIDByObjectName(relatedObjectName ,value);
                }

                _updateInlineProperty(value, propertyID, container, objectDefinitionID, elementName, acWidget);
            } else if (dataSource.length == 0) {
                value = "";
                propertyID = "";
                _updateInlineProperty(value, propertyID, container, objectDefinitionID, elementName, acWidget);
            }
            acWidget.value(value);
            // return property id that was set to related field
            return propertyID;
        }
        // <summary>
        /// method to update dependant property
        /// </summary>
        /// <param name="value">value</param>
        /// <param name="propertyID">property id</param>
        /// <param name="container">fields container</param>
        /// <param name="objectDefinitionID">object definition id</param>
        /// <param name="propertyName">object definition name</param>
        /// <param name="acWidget">ac widget</param>
        function _updateInlineProperty(value, propertyID, container, objectDefinitionID, propertyName, acWidget) {
            // update hidden value
            var field = container.find("#txt" + propertyName);
            if (field && field.val() != value) {
                container.find("#hdn" + propertyName).val(propertyID);
                // fire event to set value for dependant field and save it
                eventManager.fireEvent(ObjectDetailFieldUpdatedEvent, {
                    container: container,
                    value: value,
                    propertyId: propertyID,
                    propertyFk: objectDefinitionID,
                    propertyName: propertyName
                });
                // update value for related autocomplete widget
                acWidget.value(value);
            }
        }
        // <summary>
        /// method to get property id of a field by its name
        /// </summary>
        /// <param name="dataObject">ac data</param>
        /// <param name="objectDefinitionID">object definition id</param>
        /// <param name="objectName">object definition name</param>
        function _getPropertyIdByName(dataObject, objectDefinitionID, objectName) {
            try {
                var propertyId = dataObject[objectDefinitionID]["InvertedValues"][objectName];
            } catch (e) {
                propertyId = undefined;
            }

            return propertyId;
        }
        /// <summary>
        /// returns data for particular object by its name
        /// </summary>
        /// <param name="objectDefinitionName">object definition name</param>
        function _getValueIDByObjectName(objectName, value) {
            if (_autocompleteData && _autocompleteData["Values"]) {
                var acData = _autocompleteData["Values"];
                for (var acKey in acData) {
                    if (acKey === 'length' || !acData.hasOwnProperty(acKey)) continue;
                    if (acData[acKey]["Name"] == objectName || acData[acKey]["RelatedEntityName"] == objectName) {
                        return acData[acKey]["InvertedValues"][value];
                    }
                }
            }

            return null;
        }
        // <summary>
        /// Adds "backward" realations, so that updating dependant
        // fields cause update of parent
        /// </summary>
        /// <param name="asDepData">dependencies data</param>
        function _addInversedRelations(asDepData) {
            var parentObject, childObject;
            var newParentDependency, currentValues;
            for (var parentKey in asDepData) {
                if (parentKey === 'length' || !asDepData.hasOwnProperty(parentKey)) continue;
                parentObject = asDepData[parentKey];
                for (var childKey in parentObject) {
                    newParentDependency = asDepData[childKey] || {};
                    if (childKey === 'length' || !parentObject.hasOwnProperty(childKey)) continue;
                    childObject = parentObject[childKey];
                    for (var childProperty in childObject) {
                        if (childProperty === 'length' || !childObject.hasOwnProperty(childProperty)) continue;
                        // here we swap keys and values ti invert relations
                        currentValues = childObject[childProperty];
                        if (currentValues && currentValues.length) {
                            currentValues.forEach(function (elem) {
                                if (!newParentDependency[parentKey]) {
                                    newParentDependency[parentKey] = {};
                                }
                                if (!newParentDependency[parentKey][elem]) {
                                    newParentDependency[parentKey][elem] = [childProperty];
                                }
                                else {
                                    if ($.inArray(childProperty, newParentDependency[parentKey][elem]) === -1) {
                                        newParentDependency[parentKey][elem].push(childProperty);
                                    }
                                }
                            });
                        }
                    }
                    asDepData[childKey] = newParentDependency;
                }
            }
        }
        // <summary>
        /// Method to do some fixes on incoming ac data
        /// </summary>
        /// <param name="depValues">dependencies data</param>
        function _fixDependencies(depValues) {
            for (var depKey1 in depValues) {
                if (depKey1 === 'length' || !depValues.hasOwnProperty(depKey1)) continue;
                //dependant fieldsIDs
                for (var depKey2 in depValues[depKey1]) {
                    if (depKey2 === 'length' || !depValues[depKey1].hasOwnProperty(depKey2)) continue;
                    //dependent field values ids
                    if ($.isArray(depValues[depKey1][depKey2])) {
                        var newValues = {};
                        depValues[depKey1][depKey2].forEach(function (elem) {
                            for (var depKey3 in elem) {
                                if (depKey3 === 'length' || !elem.hasOwnProperty(depKey3)) continue;
                                newValues[depKey3] = elem[depKey3];
                            }
                        });
                        depValues[depKey1][depKey2] = newValues;
                    }
                }
            }
        }
        // <summary>
        /// adds inverted values speed up the search
        /// </summary>
        /// <param name="dataObject">ac data</param>
        function _addInvertedValues(dataObject) {
            var invertedValues;
            Object.keys(dataObject).forEach(function (key1) {
                invertedValues = {};
                var fieldObject = dataObject[key1]["Values"];
                Object.keys(fieldObject).forEach(function (key2) {
                    invertedValues[fieldObject[key2]] = key2;
                });
                dataObject[key1]["InvertedValues"] = invertedValues;
            });

            return dataObject;
        }
        // <summary>
        // merges data from several included js-files
        // containing autocomplete data
        /// </summary>
        /// <param name="acData">ac data</param>
        function _mergeACData(acData) {
            var merged = {};
            if ($.isArray(acData) && acData.length > 0) {
                merged = acData.reduce(function (a, b) {
                    _mergeACValues(a["Values"], b["Values"]);
                    _mergeACValues(a["Dependencies"], b["Dependencies"]);

                    return a;
                })
            }

            return merged;
        }
        // <summary>
        // helps merging values from different sources, because
        // data for subentities comes in different js-files
        /// </summary>
        /// <param name="oldData">old ac data</param>
        /// <param name="newData">new ac data</param>
        function _mergeACValues(oldData, newData) {
            if (!newData) return oldData;
            if (!oldData) return newData;

            for (var acKey in newData) {
                if (acKey === 'length' || !newData.hasOwnProperty(acKey)) continue;
                if (!oldData.hasOwnProperty(acKey)) {
                    oldData[acKey] = newData[acKey];
                }
            }

            return oldData;
        }
        /// <summary>
        /// Method to generate unique id for autocomplete fields
        /// </summary>
        function _getUniqueAcId() {
            return ++_uniqueId;
        }

        return AutocompleteService;
    }]);
/**
 * Created by C4off on 17.06.15.
 */
CSVapp.factory('popupService', ['$q', '$modal', 'localizationService',
    function ($q, $modal, localizationService) {

        var _confirmDefaultSettings = {
            width: "250px",
            modal: true,
            visible: false,
            doCenterVert: true
        };

        var _confirmWithContentDefaultSettings = {
            width: "405px",
            modal: true,
            visible: false,
            doCenterVert: true
        };

        var _printTemplateDefaultSettings = {
            modal: true,
            visible: false,
            resizable: true,
            maxHeight: 650,
            minHeight: 300,
            width: 700,
            actions: ["Pin", "Minimize", "Maximize", "Close"]
        };

        var PopupService = function () {
        };

        PopupService.displayPrintTemplatePopup = function(title, content){
            return _openStandardPopup(_printTemplateDefaultSettings, content);
        };

        PopupService.displayMapPopup = function(title, content){
            return _openStandardPopup(_printTemplateDefaultSettings, content);
        };

        /// <summary>
        /// Method to show "Yes/No" modal popup with message
        /// </summary>
        /// <param name="title">title of popup</param>
        /// <param name="message">message of the popup</param>
        PopupService.confirm = function (title, message, settings) {
            var yesBtnText = localizationService.translate("Buttons.Yes");
            var noBtnText = localizationService.translate("Buttons.No");
            var html =
                '<div id="okCancelWindow"> ' +
                    ' <div style="text-align: center; width:100%"> ' +
                    '   <div style="margin:10px 0 15px 0">' + message + '</div> ' +
                    '   <button class="k-button k-primary" id="yesButton" style="z-index=20000">' + yesBtnText + '</button> ' +
                    '   <button class="k-button" id="noButton" style="z-index=20000">' + noBtnText + '</button> ' +
                    '   </div> ' +
                    '</div> ';
            // settings
            var modalSettings;
            if (settings) {
                modalSettings = angular.extend({}, _confirmDefaultSettings, settings);
            } else {
                modalSettings = _confirmDefaultSettings;
            }
            // content
            var content = angular.element(html);

            return _openPopup(modalSettings, content);
        };

        /// <summary>
        /// Method to show "Yes/No" modal popup with content
        /// </summary>
        /// <param name="title">title of popup</param>
        /// <param name="message">message of the popup</param>
        PopupService.confirmWithContent = function (title, contentHTML, settings) {
            var yesBtnText = localizationService.translate("Buttons.Done");
            var noBtnText = localizationService.translate("Buttons.Cancel");
            var html =
                '<div id="confirmPopup"> ' +
                    ' <div style="text-align: center; width:100%">' +
                '   <div id="ModalPopupContent"></div>' +
                '   <button class="k-button k-primary" id="yesButton" style="z-index:20001">' + yesBtnText + '</button> ' +
                '   <button class="k-button" id="noButton" style="z-index:20001">' + noBtnText + '</button> ' +
                '   </div> ' +
            '</div> ';
            var content = angular.element(html);
            content.find('#ModalPopupContent').append(angular.element(contentHTML));
            // settings
            var modalSettings;
            if (settings) {
                modalSettings = angular.extend({}, _confirmWithContentDefaultSettings, settings);
            } else {
                modalSettings = _confirmWithContentDefaultSettings;
            }
            modalSettings.title = title;

            return _openPopup(modalSettings, content);
        };

        /// <summary>
        /// Method to open simple popup
        /// </summary>
        /// <param name="settings">settings of popup</param>
        /// <param name="content">content of the popup</param>
        function _openStandardPopup(settings, content) {
            var modalInstance = $modal.open({
                template: "<div></div>",
                settings: settings,
                resolve: {
                    items: function () {
                        return content;
                    }
                },
                content: content
            });

            return modalInstance;
        }

        /// <summary>
        /// Method to open simple popup
        /// </summary>
        /// <param name="settings">settings of popup</param>
        /// <param name="content">content of the popup</param>
        function _openPopup(settings, content) {
            var deferred = $q.defer();

            var modalInstance = $modal.open({
                template: "<div></div>",
                settings: settings,
                resolve: {
                    items: function () {
                        return content;
                    }
                },
                content: content
            });
            content.find('#yesButton').one('click',function (e) {
                modalInstance.close();
                deferred.resolve();
            });

            content.find('#noButton').one('click',function (e) {
                modalInstance.close();
                deferred.reject()
            });

            return deferred.promise;
        }

        return PopupService;
    }]);
/**
 * Created by antons on 4/9/15.
 */
CSVapp.factory('listDataService', ['$resource', 'configService',
    function ($resource, configService) {
        var gConfig = configService.getGlobalConfig();
        var token = gConfig.token;

        var urlBase = configService.getUrlBase('fetchListData');
        var url = urlBase + "/:list/" + token + "?RequestType=ListValues";

        return $resource(url);
    }]);
CSVapp.factory('listDataLoaderService', ['$q', '$http', 'configService', 'schemaService',
    function ($q, $http, configService, schemaService) {
        var gConfig = configService.getGlobalConfig();
        // cached data
        var _listsData = [];

        var ListDataLoaderService = function () {

        };

        ListDataLoaderService.addEmptyListValue = function (listValues) {
            return listValues;
            if ($.isArray(listValues) && listValues.length) {
                var hasEmpty = false;
                var lastSortOrder = 1, listName;
                listValues.some(function (listValue) {
                    listName = listName || listValue["ListName"];
                    lastSortOrder = lastSortOrder < listValue["SortOrder"] ? listValue["SortOrder"] : lastSortOrder;
                    if (listValue["Value"] == "") {
                        hasEmpty = true;
                    }
                });
                if (!hasEmpty) {
                    listValues.push({
                        ListName: listName,
                        SortOrder: lastSortOrder + 1,
                        Text: "",
                        Value: "",
                        Description: ""
                    });
                }

            }

            return listValues;
        }

        /// <summary>
        /// Method to fetch all lists data for particular object
        /// </summary>
        /// <param name="objectDefinitionName">Object definition name</param>
        /// <return>promise</return>
        ListDataLoaderService.fetchMultipleListsData = function (objectDefinitionName) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('fetchMultipleObjectListData') + "/" + gConfig.token + "?RequestType=mlv";
            var dataType = gConfig.dataTypes;
            var listNames = [];
            schemaService.getSchema(objectDefinitionName).then(function (schemaObj) {
                if (!schemaObj) {
                    deferred.reject('Failed to fetch multiple lists data.' +
                        'No schema for object: ' + objectDefinitionName)
                } else {
                    $.each(schemaObj.AllColumnsList, function (key, val) {
                        if (dataType.DropDownList == val.DataType ||
                            dataType.SearchableDropDownList == val.DataType ||
                            dataType.MultiSelectList == val.DataType) {
                            var listName = new Object();
                            listName.ListName = val.InputSettings;
                            listNames.push(listName);
                        }
                    });
                    if (!listNames || !listNames.length) {
                        deferred.resolve([]);
                    } else {
                        $http.post(url, JSON.stringify(listNames)).
                            success(function (response) {
                                var lists = {};
                                // Filter values by list name
                                response.forEach(function (listObj) {
                                    if (!lists[listObj["ListName"]]) {
                                        lists[listObj["ListName"]] = {
                                            ListName: listObj.ListName,
                                            ListValues: []
                                        };
                                    }
                                    lists[listObj["ListName"]]["ListValues"].push(listObj);
                                });
                                // Save actual list data
                                for (listKey in lists) {
                                    if (!lists.hasOwnProperty(listKey)) {
                                        continue;
                                    }
                                    _preserveLists(lists[listKey]);
                                }

                                deferred.resolve(lists);
                            }).
                            error(function () {
                                // TODO:  better error handling
                                deferred.reject('Failed to fetch multiple lists data');
                            });
                    }
                }
            });

            return deferred.promise;
        };

        // CHECKED
        ListDataLoaderService.GetListObject = function (listName, addEmptyValues) {
            return ListDataLoaderService.GetListsData(listName).then(function (listObjects) {
                if (addEmptyValues) {
                    listObjects = ListDataLoaderService.addEmptyListValue(listObjects);
                }

                return listObjects;
            });
        };
        /// <summary>
        /// Method to get existing config().ListsData object (if exists).
        /// </summary>
        /// <param name="listName">listName to check if exists</param>
        /// <param name="ListsData">has all the existing objects of lists</param>
        ListDataLoaderService.GetListsDataByListName = function (listName) {
            return _listsData.filter(function (obj) {
                if (obj.ListName == listName) {
                    return obj
                }
            })[0];
        };
        // CHECKED
        // warning, now async
        /// <summary>
        /// Method will request to API to get lists data
        /// </summary>
        /// <param name="listName">name of the requested list</param>
        /// <param name="url">url to hit API</param>
        ListDataLoaderService.GetListsData = function (listName) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('fetchListData') + "/" + listName + "/" + gConfig.token + "?RequestType=ListValues";
            var data = null;
            var listObj = ListDataLoaderService.GetListsDataByListName(listName);
            if (listObj != null) {
                data = listObj.ListValues;

                deferred.resolve(data);
            }
            else {
                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "json",
                    success: function (response) {
                        if (response != null) {
                            response.unshift({ Text: "", Value: "" });
                        }

                        listObj = new Object();
                        listObj.ListName = listName;
                        listObj.ListValues = response;
                        _preserveLists(listObj);
                        data = response;

                        deferred.resolve(data);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    }
                });
            }

            return deferred.promise;
        }
        // CHECKED
        /// <summary>
        /// method will return presaved list .
        /// this model object contains lists values for select boxes.
        /// </summary>
        /// <param name="listsObject">has array of list</param>
        function _preserveLists(listsObject) {
            var list = _listsData.filter(function (obj) {
                if (listsObject.ListName == obj.ListName) {
                    return obj
                }
            })[0];
            if (list == null || list == undefined) {
                _listsData.push(listsObject);
            }
        }


// TODO: For Later use
//    ListDataLoaderService.Get = function (listName) {
//        var delay = $q.defer();
//        listDataService.get({list: listName}, function (listObj) {
//            delay.resolve(listObj);
//        }, function () {
//            delay.reject('Unable to fetch list values for ' + listName);
//        });
//
//        return delay.promise;
//    };

        return ListDataLoaderService;
    }]);
/**
 * Created by C4off on 20.10.15.
 */
CSVapp.factory('advancedSearchFilterExpressionService', ['configService',
    function (configService) {
        // private fields
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        var AdvancedSearchFilterExpressionService = function () {
        };

        /*PUBLIC METHODS*/

        AdvancedSearchFilterExpressionService.filterIsEmpty = function(filterObj, type){
            var handler = _getFilterObjectHandler(type);

            return handler.filterIsEmpty(filterObj);
        };

        AdvancedSearchFilterExpressionService.processFilters = function (filters, type, parentalType) {
            var handler = _getFilterObjectHandler(type, parentalType);

            return handler.processFilters(filters);
        };

        /// <summary>
        /// method to get filter object
        /// </summary>
        /// <param name="elem">field object</param>
        /// <param name="value">object with values of selected fields</param>
        /// <param name="parentialType">is current, parent or child filter</param>
        /// <param name="propertyName">property name</param>
        /// <param name="currentProperty">current field meta value</param>
        AdvancedSearchFilterExpressionService.getFilterObject = function (elem, value, parentialType,
                                                                          propertyName, currentProperty, type) {
            var handler = _getFilterObjectHandler(type, parentialType);
            return {
                filterObject: handler.getFilterObject(elem, value, propertyName, currentProperty),
                type: parentialType,
                propertyName: propertyName
            }
        };

        AdvancedSearchFilterExpressionService.appendFilterObject = function (filterObject, elem, filters,
                                                                             customFilters, propertyName,
                                                                             tplObjects, type, parentalType) {
            var handler = _getFilterObjectHandler(type, parentalType);

            return handler.appendFilterObject(filterObject, elem, filters, customFilters, propertyName,
                tplObjects);
        };

        /*PRIVATE METHODS*/

        function _getFilterObjectHandler(type, parentalType) {
            // if we want API filters or 'custom' filters in local,
            // that should be also treated as API ones
            return type == 'api' ||
                (parentalType && parentalType.toLowerCase() != 'main')
                ? new FilterObjectHandlerAPI(type)
                : new FilterObjectHandlerLocal(type);
        }

        var FilterObjectHandlerAPI = function (type) {
            this.type = type;
        };
        FilterObjectHandlerAPI.prototype.filterIsEmpty = function(filterObj){
            // here filterObj is object
            return (!filterObj.filters &&
                (!filterObj.customASFilters || !filterObj.customASFilters.length));
        };
        FilterObjectHandlerAPI.prototype.processFilters = function (filters) {
            var filtersCombined = "";

            filters.forEach(function (filter) {
                if(filtersCombined != ""){
                    filtersCombined += " AND ";
                }
                filtersCombined += filter.filterObject;
            });

            return filtersCombined;
        };
        FilterObjectHandlerAPI.prototype.appendFilterObject = function (filterObject, elem, filters, customFilters, propertyName, tplObjects) {
            // here filterObject.filterObject is string (filter expression)
            if (filterObject.filterObject.trim()) {
                if (filterObject.type.toLowerCase() == 'main') {
                    filters.push(filterObject);
                } else {
                    var customFilterWrapped = _wrapCustomFilterObject(filterObject,
                        tplObjects[elem.odn], propertyName);
                    if (customFilterWrapped) {
                        customFilters.push(customFilterWrapped);
                    }
                }
            }
        };

        FilterObjectHandlerAPI.prototype.getFilterObject = function (elem, value, propertyName, currentProperty) {
            var filterExpression = "";
            // Collect filter info
            switch (elem.DataType) {
                case dataTypes.Date:
                case dataTypes.DateTime:
                    if (currentProperty.type == "before") {
                        filterExpression = "CONVERT(DATETIME2, [" + propertyName + "]) <= CONVERT(DATETIME2, '" + value + "')";
                    } else {
                        filterExpression = "CONVERT(DATETIME2, [" + propertyName + "]) >= CONVERT(DATETIME2, '" + value + "')"
                    }
                    break;
                case dataTypes.Text:
                case dataTypes.AutoText:
                case dataTypes.TextBox:
                case dataTypes.ParentRelationship:
                case dataTypes.ObjectRelationship:
                    filterExpression = "[" + propertyName + "] like '%" + value + "%'";
                    break;
                case dataTypes.DropDownList:
                case dataTypes.SearchableDropDownList:
                    filterExpression = "[" + propertyName + "] = '" + value + "'";
                    break;
                case dataTypes.CheckBox:
                    filterExpression = "[" + propertyName + "] = '1'";
                    break;
            }

            return filterExpression;
        };

        var FilterObjectHandlerLocal = function (type) {
            this.type = type;
        };
        // todo: do me
        FilterObjectHandlerLocal.prototype.filterIsEmpty = function(filterObj){
            // here filterObj is string
//            return !filterObj.filterObject;
        };
        FilterObjectHandlerLocal.prototype.processFilters = function (filters) {
            return filters;
        };
        FilterObjectHandlerLocal.prototype.appendFilterObject = function (filterObject, elem, filters, customFilters, propertyName, tplObjects) {
            // here filterObject.filterObject is object
            if (filterObject.filterObject) {
                if (filterObject.type.toLowerCase() == 'main') {
                    filters.push(filterObject);
                } else {
                    var customFilterWrapped = _wrapCustomFilterObject(filterObject,
                        tplObjects[elem.odn], propertyName);
                    if (customFilterWrapped) {
                        customFilters.push(customFilterWrapped);
                    }
                }
            }
        };

        FilterObjectHandlerLocal.prototype.getFilterObject = function (elem, value, propertyName, currentProperty) {
            var filter = {
                'type': elem.DataType,
                'name': propertyName,
                'value': value
            };

            switch (elem.DataType) {
                case dataTypes.Date:
                case dataTypes.DateTime:
                    if (currentProperty.type == "before") {
                        filter.operator = '<=';
                    } else {
                        filter.operator = '>=';
                    }
                    break;
                case dataTypes.Text:
                case dataTypes.AutoText:
                case dataTypes.TextBox:
                case dataTypes.ParentRelationship:
                case dataTypes.ObjectRelationship:
                    filter.operator = 'like';
                    break;
                case dataTypes.DropDownList:
                case dataTypes.SearchableDropDownList:
                    filter.operator = '==';
                    break;
                case dataTypes.CheckBox:
                    filter.operator = '==';
                    filter.value = '1';
                    break;
                default:
                    filter = null;
            }

            return filter;
        };

        /// <summary>
        /// Method will create custom as filter object, that'll be passed to API
        /// </summary>
        /// <param name="elements">elements info array</param>
        function _wrapCustomFilterObject(filterObject, tplObjectArr, propertyName) {
            var wrappedFilter = null;
            tplObjectArr.properties.some(function (tplObj) {
                if (tplObj.propertyName == propertyName) {
                    wrappedFilter = {
                        key: tplObj.string,
                        value: filterObject.filterObject
                    };
                    return true;
                } else {
                    return false;
                }
            });

            return wrappedFilter;
        }


        return AdvancedSearchFilterExpressionService;
    }
]);
/**
 * Created by antons on 4/8/15.
 */
CSVapp.factory('advancedSearchService', [
    '$rootScope', '$q', 'schemaService', 'configService', 'autocompleteService',
    'listDataLoaderService', 'fieldPropertiesService', 'advancedSearchFilterExpressionService',
    function ($rootScope, $q, schemaService, configService, autocompleteService, listDataLoaderService, fieldPropertiesService, advancedSearchFilterExpressionService) {
        // private fields
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;
        var propertyID = SUConstants.PropertyDefinitionID;


        var AdvancedSearchService = function () {

        };

        /*PUBLIC METHODS SECTION*/

        AdvancedSearchService.filterIsEmpty = function(filterObj, type){
            return advancedSearchFilterExpressionService.filterIsEmpty(filterObj, type);
        };
        /// <summary>
        /// method to set default values to advanced search fields
        /// </summary>
        /// <param name="propertyList">array of all field objects</param>
        /// <param name="elementParams">object with values of selected fields</param>
        AdvancedSearchService.setDefaultValues = function (propertyList, elementParams) {
            propertyList.forEach(function (elem) {
                switch (elem.DataType) {
                    case dataTypes.Date:
                    case dataTypes.DateTime:
                        // default value for Date fields before/after is "before"
                        elementParams[elem[propertyID]] = {
                            'type': 'before',
                            'valid': true
                        };
                }
            });
        };
        /// <summary>
        /// method to get all fields objects
        /// </summary>
        /// <param name="templateObjectsArray">template object</param>
        AdvancedSearchService.getFieldsObjects = function (templateObjectsArray) {
            var deferred = $q.defer();

            // get properties by Object Name
            var fieldsArr = [];
            var objectFieldsPromises = [];
            for (var odn in templateObjectsArray) {
                if (!templateObjectsArray.hasOwnProperty(odn)) {
                    return;
                }
                var fieldNames = templateObjectsArray[odn].properties.map(function (field) {
                    return field.propertyName;
                });
                objectFieldsPromises.push(
                    fieldPropertiesService.getAllPropertiesOfFieldsArrayPromise(fieldNames, odn)
                );
            }
            var resolvedPromisesCount = 0;
            // we could use $q.all(), but if one promise fails -
            // we'll have no data at all
            objectFieldsPromises.forEach(function (promise) {
                promise.then(function (objectFields) {
                    resolvedPromisesCount++;
                    objectFields.forEach(function (field) {
                        field.odn = objectFields.odn;
                        fieldsArr.push(field);
                    });
                    if (resolvedPromisesCount == objectFieldsPromises.length) {
                        deferred.resolve(fieldsArr);
                    }
                }, function () {
                    resolvedPromisesCount++;
                    if (resolvedPromisesCount == objectFieldsPromises.length) {
                        deferred.resolve(fieldsArr);
                    }
                })
            });

            return deferred.promise;
        };
        /// <summary>
        /// method to check, whether components options are set in right way
        /// </summary>
        /// <param name="options">options object</param>
        AdvancedSearchService.CheckOptions = function (options) {
            if (!options.odn || !options.propertyID || !options.propertyViewType) {
                return false;
            }
            return true;
        };
        /// <summary>
        /// Method creates object, having "filter" and "error" properties
        /// "filters" will be passed to other components, "customASFilters" will hold filters for parent or
        /// child objects,"errors" will be handled by validator
        /// depending on type will be used to filter "clientside" dataSource
        /// filter via API call
        /// </summary>
        /// <param name="elementParams">array with elements metadata</param>
        /// <param name="elements">elements array</param>
        /// <param name="tplObjects">array of as templates (fields meta)</param>
        AdvancedSearchService.createFilterObject = function(elementParams, elements, tplObjects, type) {
            var value, currentProperty, propertyName, currentPropertyIndex,
                propertyParentalFilterType, filterObject;
            var filters = [];
            var errors = [];
            var customFilters = [];

            elements.forEach(function (elem) {

                currentPropertyIndex = elem[propertyID];
                currentProperty = elementParams[currentPropertyIndex];
                value = currentProperty ? currentProperty.value : null;
                // extract values from dropDowns
                if (elem.DataType == dataTypes.DropDownList ||
                    elem.DataType == dataTypes.SearchableDropDownList) {
                    var elementKey = elem[propertyID];
                    var elementContainer = angular.element('#ddl_' + elementKey);
                    if (!elementContainer.length) {
                        debugger;
                    }
                    // sometimes element just won't wrap... So not to have a exception
                    var wrappedElement = elementContainer.data("kendoDropDownList");
                    if (wrappedElement) {
                        value = wrappedElement.value();
                    }
                }
                // Don't include empty fields
                if (!value) {
                    return;
                }
                propertyName = elem.PropertyName;
                propertyParentalFilterType = tplObjects[elem.odn].type;
                // if some fields have invalid values search won't be performed
                // instead "errors" property of returned object would contain error elements
                if (!_validateField(value, elem.DataType)) {
                    errors.push({
                        'type': elem.DataType,
                        'name': propertyName,
                        'value': value,
                        'index': elem[propertyID]
                    });
                } else {
                    filterObject = advancedSearchFilterExpressionService.getFilterObject(
                        elem, value, propertyParentalFilterType, propertyName, currentProperty, type);
                    advancedSearchFilterExpressionService.appendFilterObject(filterObject, elem, filters,
                        customFilters, propertyName, tplObjects, type, propertyParentalFilterType)
                }
            });

            var filtersProcessed = advancedSearchFilterExpressionService.processFilters(filters, type);

            return {
                filters: filtersProcessed,
                errors: errors,
                customASFilters: customFilters
            };
        };
        /// <summary>
        /// Method to wrap DropDown's and autocompletable fields
        /// </summary>
        /// <param name="propertyList">elements array</param>
        AdvancedSearchService.WrapElements = function (propertyList, elementParams) {
            _getPropertyPossibleValues(propertyList).then(function (dataObj) {
                var elementKey, elementContainer;
                // wrap dropDowns
                var listValues = $.isArray(dataObj.listObjects) ? dataObj.listObjects : [];
                listValues.forEach(function (list) {
                    elementKey = list["propertyId"];
                    elementContainer = angular.element('#ddl_' + elementKey);
                    elementContainer.kendoDropDownList({
                        dataSource: new kendo.data.DataSource({
                            data: list
                        }),
                        dataTextField: "Text",
                        dataValueField: "Value",
                        optionLabel: " "
                    });
//                    elementContainer.data("kendoDropDownList").value("");
                });
                // wrap parentRelationship fields
                var acValues = $.isArray(dataObj.acValues) ? dataObj.acValues : [];
                acValues.forEach(function (acObj) {
                    elementKey = acObj["propertyId"];
                    elementContainer = angular.element('#rel_' + elementKey);
                    var key = elementKey;
                    autocompleteService.wrapElement(null, elementContainer, acObj.odn, acObj.oid, acObj.values, {
                        width: 200
                    }, function (e) {
                        var item = e.item;
                        if (item) {
                            var value = item.text();
                            if (!elementParams[key]) {
                                elementParams[key] = { 'value': value };
                            } else {
                                elementParams[key].value = value;
                            }
                        }
                    }, true);
                });

            });
        };
        /// <summary>
        /// Method to set invalid fields valid
        /// </summary>
        /// <param name="elements">elements info array</param>
        AdvancedSearchService.ClearInvalidFields = function (elements) {
            for (elem in elements) {
                if (!elements.hasOwnProperty(elem)) {
                    continue;
                }
                elements[elem].valid = true;
            }
        };
        /// <summary>
        /// Method to set invalid fields valid
        /// </summary>
        /// <param name="elements">elements info array</param>
        AdvancedSearchService.ClearParamsValues = function (elementParams, fieldValues) {
            var ddlIds = _getDDLFieldsIds(fieldValues);
            for (param in elementParams) {
                if (!elementParams.hasOwnProperty(param)) {
                    continue;
                }
                if ($.inArray(param, ddlIds) != -1) {
                    var elementContainer = angular.element('#ddl_' + param);
                    var ddl = elementContainer.data("kendoDropDownList");
                    if (ddl) {
                        ddl.value("");
                    }
                } else {
                    elementParams[param].value = '';
                }

            }
        };

        /*PRIVATE METHODS SECTION*/

        /// <summary>
        /// Method to get possible field values
        // (autocomplete data for relational objects, list data for dropdowns ...)
        /// </summary>
        /// <param name="elements">elements array</param>
        function _getPropertyPossibleValues(elements) {
            var deferred = $q.defer();
            // list objects can come asynchronously
            var listObjectPromises = [];
            var listObjects = [];
            var acObjects = [];

            var listName;
            var acObj;

            elements.forEach(function (element) {
                switch (element.DataType) {
                    case dataTypes.DropDownList:
                    case dataTypes.SearchableDropDownList:
                        listName = element.InputSettings;
                        listObjectPromises.push(listDataLoaderService.GetListObject(listName, true).then(function (listObject) {
                            listObject.propertyId = element[propertyID];

                            return listObject;
                        }));
                        break;
                    case dataTypes.ParentRelationship:
                    case dataTypes.ObjectRelationship:
                        acObj = {};
                        var settings = element.InputSettings.split(':');
                        var relatedOID = settings[0];
                        var relatedODN = settings[1];
                        if (relatedOID && relatedODN) {
                            acObj.values = autocompleteService.getValuesByODN(relatedODN);
                            acObj.propertyId = element[propertyID];
                            acObj.oid = relatedOID;
                            acObj.odn = relatedODN;
                            acObjects.push(acObj);
                        }
                        break;
                }
            });
            // walk all listObject promises and resolve caller with results
            if (listObjectPromises.length) {
                $q.all(listObjectPromises).then(function (listObjects) {
                    deferred.resolve({'listObjects': listObjects, 'acValues': acObjects});
                })
            } else {
                deferred.resolve({'listObjects': listObjects, 'acValues': acObjects});
            }

            return deferred.promise;
        }

        /// <summary>
        /// Method to get id's of DropDown fields
        /// </summary>
        /// <param name="fieldValues">elements array</param>
        function _getDDLFieldsIds(fieldValues) {
            var ddlIds = [];
            fieldValues.forEach(function (elem) {
                if (elem.DataType == dataTypes.DropDownList ||
                    elem.DataType == dataTypes.SearchableDropDownList) {
                    ddlIds.push('' + elem[propertyID]);
                }
            });

            return ddlIds;
        }

        /// <summary>
        /// Method to validate a value of a filter
        /// </summary>
        /// <param name="value">filter value</param>
        /// <param name="type">element type</param>
        var _validateField = function (value, type) {
            switch (type) {
                case dataTypes.DateTime:
                case dataTypes.Date:
                    if (value) {
                        var date = kendo.parseDate(value);
                        if (date && !isNaN(date.getDate())) {
                            return true;
                        }
                    }
                    return false;
            }

            return true;
        }

        return AdvancedSearchService;
    }
]);
/**
 * Created by C4off on 16.10.15.
 */
CSVapp.factory('advancedSearchTemplateService', ['$q', '$http', 'configService', 'schemaService',
    function ($q, $http, configService, schemaService) {

        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;
        var cache = null;
        var _dataTypesAllowed = [
            dataTypes.Date,
            dataTypes.DateTime,
            dataTypes.Text,
            dataTypes.AutoText,
            dataTypes.TextBox,
            dataTypes.DropDownList,
            dataTypes.SearchableDropDownList,
            dataTypes.ParentRelationship,
            dataTypes.ObjectRelationship,
            dataTypes.CheckBox
        ];

        var AdvancedSearchTemplateService = function () {
        };

        /*PUBLIC METHODS*/

        AdvancedSearchTemplateService.getFieldParentalType = function(fieldName, fieldOdn, tplObjects){
            return tplObjects[fieldOdn].type;
        };

        /// <summary>
        /// Method to get advanced search template object (creates Fake template, containing all
        //  visible fields for 'main' object, if nothing can be retrieved)
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        AdvancedSearchTemplateService.getAdvancedSearchTemplate = function (odn, propertyViewType) {
            return _getTemplateSettings(odn).then(function (tplFieldsArr) {
                if (!tplFieldsArr) {
                    return _createFakePageTemplateObject(odn, propertyViewType).then(function (tplFieldsArr) {
                        return tplFieldsArr;
                    });
                }

                return tplFieldsArr;
            })
        };

        /*PRIVATE METHODS*/
        function _getTemplateSettings(odn) {
            var deferred = $q.defer();
            // search in _cache
            if (cache) {
                deferred.resolve(cache);
            } else if (gConfig.advancedSearchTpl) { // search in config
                var tplStr = gConfig.advancedSearchTpl;
                cache = _getTemplateFromString(tplStr);
                deferred.resolve(cache);
            } else { // call API
                _fetchTemplateSettings(odn).then(function (tplArr) {
                    cache = tplArr;
                    deferred.resolve(cache);
                }, deferred.resolve(null));
            }

            return deferred.promise;
        }

        function _getTemplateFromString(tplStr) {
            if (!tplStr) {
                return null;
            }
            var fieldsStrArray = tplStr.split(',');
            if (!fieldsStrArray.length) {
                return null;
            }
            var fieldsObj = [];
            fieldsStrArray.forEach(function (fieldStr) {
                if(typeof fieldStr != 'string'){
                    return false;
                }
                var fieldsParts = fieldStr.trim().split('.');
                if (fieldsParts.length < 3) {
                    return;
                }
                fieldsObj = _pushValues(fieldsObj, fieldsParts, fieldStr);
            });

            return fieldsObj;
        }

        function _pushValues(fieldsObj, fieldsParts, fieldStr){
            var lastIdx = fieldsParts.length - 1;
            if (typeof fieldsParts[0] == 'string' ||
                typeof fieldsParts[lastIdx] == 'string' ||
                typeof fieldsParts[lastIdx - 1] == 'string') {
                var odn = fieldsParts[lastIdx - 1].trim();
                // save string without trailing property name
                var type = fieldsParts[0].trim();
                var propertyName = fieldsParts[lastIdx].trim();
                fieldsParts.pop();
                var string = fieldsParts.join('.');
                var propertyObj = {
                    propertyName: propertyName,
                    string: string
                };
                if(!fieldsObj.hasOwnProperty(odn)){
                    fieldsObj[odn] = {
                        type: type,
                        properties : [propertyObj]
                    }
                } else{
                    fieldsObj[odn].properties.push(propertyObj);
                }
            }

            return fieldsObj;
        }

        function _fetchTemplateSettings(odn) {
            var deferred = $q.defer();

            // todo: remove
            deferred.resolve(null);

            return deferred.promise;

            var url = configService.getUrlBase('getAdvancedSearchTemplate') + "/" +
                odn + "/" + gConfig.token;
            $http.get(url)
                .success(function (response) {
                    deferred.resolve(_getTemplateFromString(response))
                })
                .error(function () {
                    deferred.resolve(null);
                });

            return deferred.promise;
        }

        /// <summary>
        /// Creates fake template, containing all visible fields
        /// </summary>
        /// <param name="odn">Object Definition Name</param>
        function _createFakePageTemplateObject(odn, propertyViewType) {
            // get "visible" properties
            return schemaService.GetVisibleFieldsDetails(odn, propertyViewType).then(function (fieldDetails) {
                var propertyList = _getFilteredFieldsList(fieldDetails);
                var searchFieldsArray = [];
                searchFieldsArray[odn] = {
                    type: "Main",
                    properties: []
                };
                propertyList.forEach(function (property) {
                    searchFieldsArray[odn].properties.push({
                        propertyName: property.PropertyName,
                        string: "Main." + odn + "." + property.PropertyName
                    })
                });

                return searchFieldsArray;
            });
            // get all fields
            // create `fields` array for them
//            var promises = [
//                schemaService.getSchema(odn),
//                objectDataService.getSubObjects(odn)
//            ];
//
//            return $q.all(promises).then(function (results) {
//                return [
//                    {
//                        Name: "FakeTemplate",
//                        PageTemplateLabel: "User Template",
//                        RecordFirstImagePath: "",
//                        RelatedObjectDisplayType: "Grid",
//                        RelatedObjectUnderMainRecord: _getSubObjectNamesString(results[1]),
//                        SelectedColumnsForTemplate: _getFieldsNamesString(results[0].SelectedColumnsList),
//                        SelectedRelatedObjectsForTemplate: _getSubObjectNamesString(results[1])
//                    }
//                ]
//            });

        }

        /// <summary>
        /// Method returns array of possible search fields for this object
        /// And also initializes some metadata
        /// </summary>
        /// <param name="fieldDetails">elements array</param>
        function _getFilteredFieldsList(fieldDetails) {
            return fieldDetails.filter(function (elem) {
                return $.inArray(elem.DataType, _dataTypesAllowed) != -1;
            });
        }


        return AdvancedSearchTemplateService;
    }]);
/**
 * Created by antons on 4/7/15.
 */
// Directive for tab, containing filters
CSVapp.directive('advancedsearchtab', [
    '$rootScope', 'configService', 'localizationService',
    function ($rootScope, configService, localizationService) {
        var defaultOptions = {
            type: "local",
            propertyID: "PropertyDefinition_ID",
            propertyViewType: "selected"
        };

        // Collapsing and expanding filterTab fire event for "neighbour"
        // to expand/collapse respectively
        var _showHide = function (isShown, $scope, $element) {
            isShown ? $element.show() :
                $element.hide();

            var elemWidth = $element.width();
            // for grid
            if (!isShown) {
                $scope.$emit(FilterCollapsedEvent, elemWidth);
            } else {
                $scope.$emit(FilterExpandedEvent, elemWidth);
            }
            // for scheduler
            var width = isShown ? -elemWidth : elemWidth;
            $scope.$emit(ASTabChangeWidthEvent, width)
        };


        return {
            restrict: 'EA',
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('AdvancedSearch/AdvancedSearchToolbarTemplate.html');
            },
            replace: true,
            scope: true,
            controller: ["$scope", "$element", "$rootScope", "$timeout", "$attrs", "schemaService", "configService",
                "advancedSearchService", "notificationService", "advancedSearchTemplateService",
                function ($scope, $element, $rootScope, $timeout, $attrs, schemaService, configService,
                          advancedSearchService, notificationService, advancedSearchTemplateService) {
                    $timeout(function () {
                        // get component options
                        // if no options provided - use defaults
                        var options;
                        if ($attrs.asOptions && angular.isObject($scope[$attrs.asOptions])) {
                            options = angular.extend(defaultOptions, $scope[$attrs.asOptions]);
                        } else {
                            options = defaultOptions;
                        }
                        if (!advancedSearchService.CheckOptions(options)) {
                            notificationService.showNotification('Advanced search component options are invalid', true);
                            return;
                        }

                        // get fields template
                        advancedSearchTemplateService.getAdvancedSearchTemplate(options.odn, options.propertyViewType).
                            then(function (fieldsTplObjArr) {
                                // get fields objects
                                advancedSearchService.getFieldsObjects(fieldsTplObjArr).then(function(fields){
                                    $scope.propertyList = fields;
                                    $scope.asTemplateObjects = fieldsTplObjArr;
                                });
                            });

                        $scope.odn = options.odn;
                        $scope.options = options;
                        $scope.dateTimePickerOptions = {
                            format: "G"
                        };
                        $scope.tr = {
                            search: localizationService.translate('AdvancedSearch.Search'),
                            clear: localizationService.translate('AdvancedSearch.Clear'),
                            before: localizationService.translate('AdvancedSearch.Before'),
                            after: localizationService.translate('AdvancedSearch.After')
                        };

                        $scope.filter = "";
                        $scope.propertyList = [];
                        $scope.elementParams = [];
                        $scope.propertyID = options.propertyID;

                        $scope.search = function () {
                            var filterObj = advancedSearchService.createFilterObject(
                                $scope.elementParams, $scope.propertyList,
                                $scope.asTemplateObjects, $scope.options.type
                            );
                            var errors = filterObj.errors;
                            advancedSearchService.ClearInvalidFields($scope.elementParams);
                            if (angular.isArray(errors) && errors.length > 0) {
                                errors.forEach(function (error) {
                                    $scope.elementParams[error.index]['valid'] = false;
                                })
                            } else if(!advancedSearchService.filterIsEmpty(filterObj, $scope.options.type)){
                                $rootScope.$broadcast(AdvancedSearchFilterSetEvent, {
                                    filters: filterObj.filters,
                                    customASFilters: filterObj.customASFilters
                                });
                            }

                            return false;
                        };

                        $scope.clear = function () {
                            if ($scope.type == 'local') {
                                $scope.filter = [];
                            } else {
                                $scope.filter = "";
                            }
                            advancedSearchService.ClearParamsValues($scope.elementParams, $scope.propertyList);
                            advancedSearchService.ClearInvalidFields($scope.elementParams);
                            $rootScope.$broadcast(AdvancedSearchFilterSetEvent, {
                                filters: $scope.filter,
                                customASFilters: []
                            });
                        };
                        // Events to show/hide filter tab (comes from operating
                        // control, e.g. 'advanced search' button)
                        $rootScope.$on(AdvancedSearchTabButtonCollapsedEvent, function () {
                            $scope.showMe = false;
                            _showHide($scope.showMe, $scope, $element);
                        });
                        $rootScope.$on(AdvancedSearchTabButtonExpandedEvent, function () {
                            $scope.showMe = true;
                            _showHide($scope.showMe, $scope, $element);
                        });
                    });
                }
            ]
        };
    }
])
;
// Directive for "catching" event of painting all the filters in list
// and adding some kendo functionality
CSVapp.directive("onRepeatDoneAs", ['$timeout', 'advancedSearchService',
    function ($timeout, advancedSearchService) {

        return {
            restriction: 'A',
            link: function ($scope, element, attributes) {
                $timeout(function () {
                    if ($scope.$last) {
                        advancedSearchService.WrapElements($scope.propertyList, $scope.elementParams);
                        advancedSearchService.setDefaultValues($scope.propertyList, $scope.elementParams);
                    }
                }, 500);
            }
        }
    }]);
// Operating control. 'Advanced search' button
CSVapp.directive('advancedsearchtabbutton', ['$rootScope', '$cookieStore', 'configService',
    'localizationService',
    function ($rootScope, $cookieStore, configService, localizationService) {

        var gConfig = configService.getGlobalConfig();
        var cookieName = gConfig["cookies"]["CookieAdvancedSearchTabOpened"];
        // click on a control causes event emitting for "child" object (advanced search tab)
        // to show/hide, saving a setting to a cookie
        var _showHide = function (isShown) {
            if (!isShown) {
                $rootScope.$broadcast(AdvancedSearchTabButtonCollapsedEvent);
                $cookieStore.remove(cookieName);
            } else {
                $rootScope.$broadcast(AdvancedSearchTabButtonExpandedEvent);
                $cookieStore.put(cookieName, '1');
            }
        };
        return {
            restrict: 'EA',
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || configService.getTemplateUrl('AdvancedSearch/ButtonTemplate.html');
            },
            replace: true,
            scope: true,
            priority: 120,
            controller: ["$scope",
                function ($scope) {
                    $scope.showMe = $cookieStore.get(cookieName) ? true : false;
                    _showHide($scope.showMe);

                    $scope.title = localizationService.translate('Headers.AdvancedSearch');
                    $scope.labelHide = localizationService.translate('Filters.Hide');
                    $scope.showMe = false;
                    $scope.toggle = function toggle() {
                        $scope.showMe = !$scope.showMe;
                        _showHide($scope.showMe);
                    };
                }
            ]
        };
    }]);
// Advanced search pane element
CSVapp.directive('advancedsearchelement', ['configService', function (configService) {
    return {
        restrict: 'E',
        templateUrl: function (tElement, tAttrs) {
            return tAttrs.templateUrl || configService.getTemplateUrl('AdvancedSearch/ElementTemplate.html');
        },
        replace: true
    };
}]);
/**
 * Created by antons on 3/23/15.
 */
CSVapp.factory('filterService', [
    '$rootScope', '$q', 'schemaService', 'configService', 'notificationService',
    function ($rootScope, $q, schemaService, configService, notificationService) {
        var filterListData = [];
        var userSettingKeyPrefix = "SavedFilter_";
        var savedFilterSettings = [];

        var gConfig = configService.getGlobalConfig();

        var FilterService = function () {
        };

        FilterService.CheckOptions = function (options) {
            if (!options.odn) {
                return false;
            }
            return true;
        };
        /// <summary>
        /// Method to save selected filter
        /// </summary>
        /// <param name="filterObj">filter object</param>
        /// <param name="objectDefinitionName">object definition name</param>
        FilterService.AddFilterSetting = function (filterObj, objectDefinitionName) {
            var settings = [];
            var settingKey = userSettingKeyPrefix + objectDefinitionName;
            var setting = {
                SettingKey: settingKey,
                SettingValue: filterObj.FilterID,
                SettingGroup: objectDefinitionName,
                UserName: gConfig.userName
            };
            settings.push(setting);
            _removeByAttr(savedFilterSettings, 'SettingKey', settingKey);
            savedFilterSettings.push(setting);
            _updateObjectModuleUserSettings(settings);
        };
        /// <summary>
        /// Method to get filters list
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="scope">controller scope</param>
        FilterService.getFiltersList = function (odn, scope) {
            var filterList = _getFilterList(odn);

            if (filterList == undefined || filterList == null) {
                return _fetchFilterList(odn, scope, FilterService.SetSelectedFilter)
            }
            else {
                scope.filterList = filterList.FilterList;
            }
        };
        /// <summary>
        /// Method to set previously selected filter
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="scope">controller scope</param>
        /// <param name="filter list">array of filter objects</param>
        /// <param name="fireEvent">if there's need in firing an event</param>
        FilterService.SetSelectedFilter = function (odn, scope, filterList, fireEvent) {
            // if call to GetObjectModuleUserSettings API is successful
            // find selected filter and apply it
            var successCallback = function (settingsList) {
                var filterSelected = null;
                if (settingsList != undefined)
                    var objsetting = _getSettingValue(settingsList, odn);
                if (objsetting != undefined && objsetting != null) {
                    var settingKey = userSettingKeyPrefix + odn;
                    _removeByAttr(savedFilterSettings, 'SettingKey', settingKey);
                    savedFilterSettings.push(objsetting);
                    filterList.some(function (filterObj) {
                        var filterId = filterObj["FilterID"];
                        if (objsetting.SettingValue == filterId) {
                            filterSelected = filterObj;
                            filterObj["Checked"] = true;

                            return true;
                        }

                        return false;
                    });
                    // set default filter if none selected
                    if (filterList.length && !filterSelected) {
                        filterList[0].Checked = true;
                    }
                }

                if (fireEvent) {
                    // send empty string instead of undefined
                    // to show grid/scheduler to start reading content
                    filterSelected = filterSelected || "";
                    $rootScope["appliedFilter"] = filterSelected;
                    $rootScope.$broadcast(FilterSetEvent, filterSelected);
                }
                scope.filterList = filterList;
            };
            // if api request to GetObjectModuleUserSettings failed
            // Simply set filter list to scope and select first filter as default
            var errorCallback = function (message) {
                // set default filter if none selected
                if (filterList.length) {
                    filterList[0].Checked = true;
                }
                if (message == "UnAuthorized") {
                    notificationService.showNotification(message);
                }
                if (fireEvent) {
                    $rootScope["appliedFilter"] = null;
                    $rootScope.$broadcast(FilterSetEvent, "");
                }
                scope.filterList = filterList;
            };
            _getObjectModuleUserSettings(odn).then(successCallback, errorCallback);
        };

        /// <summary>
        ///function to remove the attribute
        /// </summary>
        function _removeByAttr(arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }

        /// <summary>
        /// Method will get the setting value
        /// </summary>
        /// <param name="settingsList">settings</param>
        /// <param name="odn">object definition name</param>
        function _getSettingValue(settingsList, odn) {
            var settingKey = userSettingKeyPrefix + odn;
            return settingsList.filter(function (obj) {
                if (obj.SettingKey == settingKey) {
                    return obj
                }
            })[0];
        }

        /// <summary>
        /// Method will get the object module user settings
        /// </summary>
        /// <param name="objectDefinitionName">Object Definition Name</param>
        /// <return>promise object</>
        function _getObjectModuleUserSettings(objectDefinitionName) {
            var deferred = $q.defer();

            var presavedFilterSettings = _getPreserveSavedFilter(objectDefinitionName);
            var urlBase = configService.getUrlBase('getObjectModuleUserSettings');
            if (presavedFilterSettings == null && urlBase) {
                var url = urlBase + "/" + gConfig.token + "?RequestType=us";
                var userSetting = new Object();
                userSetting.SettingKey = "SavedFilter_" + objectDefinitionName;
                userSetting.SettingGroup = objectDefinitionName;
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(userSetting),
                    dataType: "json",
                    success: function (response) {
                        deferred.resolve(response);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    }
                });
            }
            else {
                deferred.resolve([presavedFilterSettings]);
            }

            return deferred.promise;
        }

        /// <summary>
        /// Method will update the object module user settings
        /// </summary>
        /// <param name="dataToPost">data</param>
        function _updateObjectModuleUserSettings(dataToPost) {
            var urlBase = configService.getUrlBase('updateObjectModuleUserSettings');
            if (urlBase) {
                var url = urlBase + "/" + gConfig.token + "?RequestType=uus"; // to get user settings
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(dataToPost),
                    dataType: "json",
                    success: function (response) {
                        //
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (respoonseCodeValue == "UnAuthorized")
                            alert(xhr.getResponseHeader('ResponseCode'));
                        else
                            alert($config.URLs.UpdateObjectModuleUserSettingsURL + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                    }
                });
            }

        };
        /// <summary>
        ///function to get the preserved filter
        /// </summary>
        ///  param name="objectDefinitionName">Object Definition Name</param>
        function _getPreserveSavedFilter(ObjectDefinitionName) {
            return savedFilterSettings.filter(function (obj) {
                if (obj.SettingGroup == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        }

        /// <summary>
        ///function to get the preserved filter list
        /// </summary>
        ///  param name="objectDefinitionName">Object Definition Name</param>
        function _getFilterList(ObjectDefinitionName) {
            return filterListData.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        }

        /// <summary>
        ///function to cache filter list
        /// </summary>
        ///  param name="filterObject">filter object</param>
        function _preserveFilterList(filterObject) {
            var objFilter = _getFilterList(filterObject.ObjectDefinitionName);
            if (objFilter == null || objFilter == undefined) {
                filterListData.push(filterObject);
            }
        }

        /// <summary>
        ///function to fetch filter list from API
        /// </summary>
        ///  param name="objectDefinitionName">Object Definition Name</param>
        function _fetchFilterList(objectDefinitionName, scope, callback) {
            var PostData = gConfig.postData;
            var postdata = new Object();
            if (PostData.RequestType != undefined)
                postdata.RequestType = "ofl";
            var urlBase = configService.getUrlBase('getFilters');
            if (urlBase) {
                var url = urlBase + "/" + objectDefinitionName + "/" + gConfig.token;
                $.ajax({
                    type: "GET",
                    url: url,
                    data: postdata,
                    dataType: "json",
                    cache: false,
                    async: false,
                    success: function (filters) {
                        console.log('get filters success');
                        var obj = new Object();
                        obj.ObjectDefinitionName = objectDefinitionName;
                        if (filters != null) {
                            var objNoneFilter = new Object();
                            objNoneFilter.FilterID = 'nonefilter';
                            objNoneFilter.FitlerLabel = $.objectLanguage.Filters.NoFilter;
                            objNoneFilter.FitlerName = $.objectLanguage.Filters.NoFilter;
                            objNoneFilter.FitlerExpression = '';
                            objNoneFilter.SettingGroup = objectDefinitionName;
                            filters.unshift(objNoneFilter);
                        }
                        obj.FilterList = filters;
                        $.each(obj.FilterList, function (key, val) {
                            if (val.FitlerLabel == "" || val.FitlerLabel == null) {
                                val.FitlerLabel = val.FitlerName;
                            }
                        });
                        _preserveFilterList(obj);
                        if (typeof(callback) == "function") {
                            callback(objectDefinitionName, scope, filters, true);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log('get filters error');
                        var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (respoonseCodeValue == "UnAuthorized") {
                            notificationService.showNotification(xhr.getResponseHeader('ResponseCode'), true);
                        }
                        else {
                            callback(objectDefinitionName, scope, [], true);
                        }
                    }
                });
            }
        }

        return FilterService;
    }]);
/**
 * Created by antons on 3/20/15.
 */
// Operating control. 'Filter' button
CSVapp.directive('filterDropdownScheduler', ['$rootScope', 'filterService', 'notificationService',
    function ($rootScope, filterService, notificationService) {
        // kendo dropdown object (jqlite)
        var dropDown;

        function _onChange(e, odn) {
            var item = e.sender.dataItem();
            // Fire event
            $rootScope.$broadcast(FilterSetEvent, item);
            filterService.AddFilterSetting(item, odn);
        }

        return {
            restrict: 'E',
            template: "<li class=\"filterDropdownContainer\"><div id=\"filterDropDown\"></div></li>",
            replace: true,
            scope: true,
            priority: 120,
            link: function ($scope, $element, attributes) {
                dropDown = $element.find('#filterDropDown').kendoDropDownList({
                    dataTextField: "FitlerLabel",
                    dataValueField: "FitlerID",
                    dataSource: $scope.filterList,
                    index: 0,
                    change: function(e){
                        _onChange(e, $scope.odn);
                    }
                });
                // when filterList changes bind it to dropdown data source
                $scope.$watch('filterList', function (filters) {
                    var selectedIndex = null;
                    // set data source
                    dropDown.data("kendoDropDownList").dataSource.data(filters);
                    if (filters.length) {
                        // find selected filter
                        filters.some(function (val, index) {
                            if (val["Checked"]) {
                                selectedIndex = index;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        // set selected filter
                        if (selectedIndex !== null) {
                            dropDown.data("kendoDropDownList").select(selectedIndex);
                        }
                        // inform filters are loaded and component is up and ready
                        $scope.$emit(FilterReadyEvent);
                    }
                });
            },
            controller: ["$scope", "$attrs",
                function ($scope, $attrs) {
                    var defaultOptions = {};
                    // get component options
                    // if no options provided - use defaults
                    var options;
                    if($attrs.filterOptions && angular.isObject($scope[$attrs.filterOptions])){
                        options = angular.extend(defaultOptions, $scope[$attrs.filterOptions]);
                    } else{
                        options = defaultOptions;
                    }
                    if(!filterService.CheckOptions(options)){
                        notificationService.showNotification('Filter component options are invalid', true);
                        return;
                    }
                    $scope.odn = options.odn;

                    $scope.filterList = [];
                    // Send a scheduled request to obtain filter list
                    // after API return them, they're bound to $scope.filterList
                    filterService.getFiltersList($scope.odn, $scope);
                }
            ]
        };
    }]);
// Operating control. 'Filter' button
CSVapp.directive('filterdropdown', ['$rootScope', 'filterService', 'notificationService',
    function ($rootScope, filterService, notificationService) {
        // kendo dropdown object (jqlite)
        var dropDown;

        function _onChange(e, odn) {
            var item = e.sender.dataItem();
            // Fire event
            $rootScope.$broadcast(FilterSetEvent, item);
            filterService.AddFilterSetting(item, odn);
        }

        return {
            restrict: 'E',
            template: "<span class=\"filterDropdownContainer\"><div id=\"filterDropDown\"></div></span>",
            replace: true,
            scope: true,
            priority: 120,
            link: function ($scope, $element, attributes) {
                dropDown = $element.find('#filterDropDown').kendoDropDownList({
                    dataTextField: "FitlerLabel",
                    dataValueField: "FitlerID",
                    dataSource: $scope.filterList,
                    index: 0,
                    change: function(e){
                        _onChange(e, $scope.odn);
                    }
                });
                // when filterList changes bind it to dropdown data source
                $scope.$watch('filterList', function (filters) {
                    var selectedIndex = null;
                    // set data source
                    dropDown.data("kendoDropDownList").dataSource.data(filters);
                    if (filters.length) {
                        // find selected filter
                        filters.some(function (val, index) {
                            if (val["Checked"]) {
                                selectedIndex = index;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        // set selected filter
                        if (selectedIndex !== null) {
                            dropDown.data("kendoDropDownList").select(selectedIndex);
                        }
                        // inform filters are loaded and component is up and ready
                        $scope.$emit(FilterReadyEvent);
                    }
                });
            },
            controller: ["$scope", "$attrs",
                function ($scope, $attrs) {
                    var defaultOptions = {};
                    // get component options
                    // if no options provided - use defaults
                    var options;
                    if($attrs.filterOptions && angular.isObject($scope[$attrs.filterOptions])){
                        options = angular.extend(defaultOptions, $scope[$attrs.filterOptions]);
                    } else{
                        options = defaultOptions;
                    }
                    if(!filterService.CheckOptions(options)){
                        notificationService.showNotification('Filter component options are invalid', true);
                        return;
                    }
                    $scope.odn = options.odn;

                    $scope.filterList = [];
                    // Send a scheduled request to obtain filter list
                    // after API return them, they're bound to $scope.filterList
                    filterService.getFiltersList($scope.odn, $scope);
                }
            ]
        };
    }]);
// Directive for tab, containing filters
CSVapp.directive('filtertab', ['$rootScope', function ($rootScope) {
    var tpl = $("#ObjectFilterToolbarTemplate").html();
    // Collapsing and expanding filterTab fire event for "neighbour"
    // to expand/collapse respectively
    var _showHide = function (isShown) {
        if (!isShown) {
            $rootScope.$broadcast(FilterCollapsedEvent);
        } else {
            $rootScope.$broadcast(FilterExpandedEvent);
        }
    };
    return {
        restrict: 'EA',
        template: tpl,
        replace: true,
        scope: true,
        priority: 110,
        controller: ["$scope", "$element", "$attrs", "$timeout", "$rootScope", "filterService", "notificationService",
            function ($scope, $element, $attrs, $timeout, $rootScope, filterService, notificationService) {
                var defaultOptions = {};
                // get component options
                // if no options provided - use defaults
                var options;
                if($attrs.filterOptions && angular.isObject($scope[$attrs.filterOptions])){
                    options = angular.extend(defaultOptions, $scope[$attrs.asOptions]);
                } else{
                    options = defaultOptions;
                }
                if(!filterService.CheckOptions(options)){
                    notificationService.showNotification('Filter component options are invalid', true);
                    return;
                }
                var odn = options.odn;
                $scope.filterList = [];
                // Send a scheduled request to obtain filter list
                // after API return them, they're bound to $scope.filterList and
                // ng-repeat inside template will repaint filter tab
                filterService.getFiltersList(odn, $scope);
                // Hidden by default
                $scope.showMe = false;
                // last filter has been bound by ng-repeat, time to beautify the container
                $scope.$on(CheckFilterStateEvent, function () {
                    console.log('FilterEvent');
                    $timeout(function () {
                        $('._filterContainer', $element).buttonset();
                    }, 0);
                });
                // Events to show/hide filter tab (comes from operating
                // control, e.g. 'filter' button)
                $rootScope.$on(FilterTabButtonCollapsedEvent, function () {
                    $scope.showMe = false;
                    _showHide($scope.showMe);
                });
                $rootScope.$on(FilterTabButtonExpandedEvent, function () {
                    $scope.showMe = true;
                    _showHide($scope.showMe);
                });
                $scope.toggle = function toggle() {
                    $scope.showMe = !$scope.showMe;
                };
                // Handler for filter selection
                $scope.selected = function (index) {
                    var selectedList = $scope.filterList[index];
                    if (selectedList && !selectedList["Checked"]) {
                        $scope.filterList.forEach(function (elem, key) {
                            elem["Checked"] = key == index ? true : false;
                        });
                        // Fire event
                        $rootScope.$broadcast(FilterSetEvent, selectedList);
                        filterService.AddFilterSetting(selectedList, odn);
                    }
                }
            }
        ]
    };
}]);
// Directive for "catching" event of painting all the filters in list
// and adding some JQuery-iu to it
CSVapp.directive("onRepeatDone", function () {
    return {
        restriction: 'A',
        link: function ($scope, element, attributes) {
            if ($scope.$last) {
                $scope.$emit(FilterReadyEvent);
            }
        }
    }
});
// Operating control. 'Filter' button
CSVapp.directive('filtertabbutton', ['$rootScope', '$cookieStore', 'configService',
    function ($rootScope, $cookieStore, configService) {

        var gConfig = configService.getGlobalConfig();
        var cookieName = gConfig["cookies"]["CookieFilterOpened"];

        var tpl = $("#ObjectFilterToolbarButtonTemplate").html();
        // click on a control causes event emitting for "child" object (filter tab)
        // to show/hide, saving a setting to a cookie
        var _showHide = function (isShown) {
            if (!isShown) {
                $rootScope.$broadcast(FilterTabButtonCollapsedEvent);
                $cookieStore.remove(cookieName);
            } else {
                $rootScope.$broadcast(FilterTabButtonExpandedEvent);
                $cookieStore.put(cookieName, '1');
            }
        };
        return {
            restrict: 'EA',
            template: tpl,
            replace: true,
            scope: true,
            priority: 120,
            controller: ["$scope",
                function ($scope) {
                    // Event tells all components are loaded
                    // and can be operated
                    $scope.$on(CheckFilterStateEvent, function () {
                        console.log(CheckFilterStateEvent + " catched")
                        $scope.showMe = $cookieStore.get(cookieName) ? true : false;
                        _showHide($scope.showMe);
                    });
                    $scope.title = $.objectLanguage.Headers.Filters;
                    $scope.labelHide = $.objectLanguage.Filters.Hide;
                    $scope.showMe = false;
                    $scope.toggle = function toggle() {
                        $scope.showMe = !$scope.showMe;
                        _showHide($scope.showMe);
                    };
                }
            ]
        };
    }]);

/**
 * Created by Мама on 07.06.15.
 */
var speedupGridModule = angular.module('speedup.grid', ['speedup.CSVModule']);
/**
 * Created by Мама on 07.06.15.
 */
speedupGridModule.controller("GridController", ['$scope', 'configService',
    function ($scope, configService) {
        var gConfig = configService.getGlobalConfig();
        var odn = gConfig.objectDefinitionName;

        $scope.gridParameters = {
            odn: odn,
            selectedPage: 0,
            perspectiveFilter: gConfig.perspectiveFilter,
            filterExpression: "",
            genericSearch: "",
            refreshButton: true,
            recordCountFilterExpression: '',
            gridHeight: 400,
            pageSize: gConfig.gridPageSize,
            columnWidth: "auto",
            columnMinWidth: 150,
            columnMaxWidth: "auto",
            showEditButton: true,
            showSelectButton: false,
            showDeleteButton: true,
//            SelectedColumns: GetSelectedColumnsArray(pageConfig.selectedColumns), //["Name","Text_Property_Name","TextBox_Property_Name","RichTextBox_Property_Name","Date_Property_Name"]
            selectFirstRecord: false,
            showCheckboxForRowSelection: true,
            toolbar: $scope.gridToolbar || false,
            displayMode: gConfig.objectDetailDisplayType,
            pageTemplateName: gConfig.pageTemplateName,
            odPageSize: gConfig.objectDetailPageSize,
            showFirstRecord: gConfig.showFirstRecord,
            batchUpdate: gConfig.batchUpdate
        };
    }]);
/**
 * Created by Мама on 13.06.15.
 */
speedupGridModule.factory('gridRefreshService', ['fieldPropertiesService', 'configService',
    function (fieldPropertiesService, configService) {
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        var GridRefreshService = function () {
        };
        // Not chekced
        GridRefreshService.removeObjectFromDS = function (data, odn, gridWidget) {
            // TODO: implement local refresh
            var eventOdn = data.odn;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }
            // DEBUG - remove (it's temp)
            gridWidget.dataSource.read();
//            gridWidget.refresh();
        };

        GridRefreshService.refreshObjectDS = function (data, odn, gridWidget) {
            // TODO: implement local refresh
            var eventOdn = data.ObjectDefinitionName;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }
            // DEBUG - remove (it's temp)
            gridWidget.dataSource.read();
//            gridWidget.refresh();

        };

        /// <summary>
        /// Method will update single field in grid data source
        /// </summary>
        /// <param name="data">params object</param>
        /// <param name="odn">grid odn</param>
        /// <param name="gridWidget">grid widget object</param>
        GridRefreshService.refreshSinglePropertyDS = function (data, odn, gridWidget) {
            var eventOdn = data.odn;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }

            // find refreshed property and change it in ds
            gridWidget.dataSource.data().some(function (element) {
                if (element.ObjectEntry_ID === data.recordId) {
                    element[data.fieldName] = data.fieldValue;

                    return true;
                } else {
                    return false;
                }
            });
            // Mark grid refreshed without API call
            // (do there's no need to refresh detail page, for example)
            gridWidget.refreshedWithoutAPICall = true;
            // refresh grid without reloading
            gridWidget.refresh();
        };
        /// <summary>
        /// Method will update multiple fields for multiple objects in grid data source
        /// </summary>
        /// <param name="data">params object</param>
        /// <param name="odn">grid odn</param>
        /// <param name="gridWidget">grid widget object</param>
        GridRefreshService.refreshMultiple = function (response, odn, gridWidget) {
            var eventOdn = response.odn;
            var data = response.data;
            // if we caugth 'wrong' object
            if (odn != eventOdn) {
                return;
            }
            if (!gridWidget) {
                return;
            }

            // find refreshed property and change it in ds
            gridWidget.dataSource.data().forEach(function (element) {
                var elementIdx = $.inArray(element.ObjectEntry_ID, data.entries);
                // element is found in list of edited
                if (elementIdx != -1) {
                    // update values
                    data.data.forEach(function(property){
                        // get data type for property
                        var fieldProperties =
                            fieldPropertiesService.getAllPropertiesOfSingleField(property.name,odn);
                        var fieldType = fieldProperties.DataType;
                        if(fieldType == dataTypes.MultiObjectRelationshipField){
                            var fieldValues = property.value.split(":");
                            var valueForGrid;
                            // if we have 'full' value, trim it
                            if(fieldValues.length == 4){
                                valueForGrid = fieldValues[0] + ":" + fieldValues[1];
                            } else{
                                valueForGrid = property.value;
                            }
                            element[property.name] = valueForGrid;
                        } else{
                            element[property.name] = property.value;
                        }
                    });
                }
            });
            // Mark grid refreshed without API call
            // (do there's no need to refresh detail page, for example)
            gridWidget.refreshedWithoutAPICall = true;
            // refresh grid without reloading
            gridWidget.refresh();
        };

        GridRefreshService.refreshByGenericSearch = function (gridWidget, gridParameters, searchStr) {
            gridParameters.genericSearch = searchStr;

            gridWidget.dataSource.read();
//            gridWidget.refresh();
        };

        GridRefreshService.refreshByFilterExpression = function (gridWidget, gridParameters,
                                                                 searchStr, customASFilters) {
            gridParameters.filterExpression = searchStr;
            gridParameters.customASFilters = customASFilters;

            gridWidget.dataSource.read();
//            gridWidget.refresh();
        };

        return GridRefreshService;
    }]);
/**
 * Created by Мама on 07.06.15.
 */
speedupGridModule.factory('gridHelper', ['$rootScope', '$compile', 'filesystemService',
    'gridFilterExpressionService', 'configService', 'notificationService', 'localizationService',
    'gridDataService', 'commonService', 'existingObjectDetailService', 'relatedObjectsService',
    'detailPageMapService', 'popupService', 'eventManager',
    function ($rootScope, $compile, filesystemService, gridFilterExpressionService, configService, notificationService, localizationService, gridDataService, commonService, existingObjectDetailService, relatedObjectsService, detailPageMapService, popupService, eventManager) {

        var gConfig = configService.getGlobalConfig();

        var GridHelper = function () {
        };
        /// <summary>
        /// method will show popup with map
        /// </summary>
        /// <param name="e">event</param>
        /// <param name="target">click target element</param>
        GridHelper.openMapPopup = function (e, target) {
            var $geoDataLink = $(target);
            var lat = $geoDataLink.data("lat");
            var long = $geoDataLink.data("long");
            var address = $geoDataLink.data("add");
            var zoomLevel = $geoDataLink.data("zoom");
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = false;
            var mapType = $geoDataLink.data("maptype");
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = false;
            var saveMapType = false;

            var html = "<div id='ObjectGeoDataPopUp' style='height:350px;width:500px'></div>"
            var mapDiv = "ObjectGeoDataPopUp";
            var modalInstance = popupService.displayMapPopup('Map', html);
            modalInstance.result.then(function (result) {
                $('#ObjectGeoDataPopUp').remove();
            }, function () {
                $('#ObjectGeoDataPopUp').remove();
            });

            setTimeout(function () {
                    detailPageMapService.initializeMap(lat, long, null, null, editable, mapDiv,
                        address, null, null, null, zoomLevel, mapType, saveZoomLevel, saveMapType,
                        false)
                }
                , 1000);
        };
        /// <summary>
        /// method will construct 'options' object fro grid
        /// </summary>
        /// <param name="parameters">parameters from callee</param>
        GridHelper.getGridOptions = function (parameters) {
            return {
                mobile: gConfig.mobileView,
                objectParameters: parameters,
                dataSource: {
//                    autoSync: true,
                    requestStart: _showLoading,
                    requestEnd: _hideLoading,
                    pageSize: gConfig.gridPageSize,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    isAfterSave: false,
                    selectedItem: [],
                    //serverGrouping: true,
                    //group: { field: "Text_Property_Name", dir: "desc" },
                    transport: {
                        read: {
                            cache: false,
                            url: 'http://185.31.160.22/shop',
//                            url: configService.getUrlBase('objectRecordList') + "/" + gConfig.token,
                            type: "POST",
                            dataType: "xml"
                        },
                        parameterMap: function (options) {
                            return GridHelper.parameterMap(options, parameters);
                        }
                    },
                    schema: null
                },
                height: parameters.gridHeight,
                scrollable: true,
                filterable: {
                    extra: true,
                    operators: {
                        string: {
                            startswith: "Starts with",
                            endswith: "Ends With",
                            eq: "Is equal to",
                            neq: "Is not equal to",
                            contains: "Contains"
                        },
                        date: {
                            eq: "Is equal to",
                            neq: "Is not equal to",
                            gte: "Is after or equal to",
                            lte: "Is before or equal to"

                        }
                    }
                }, sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "multiple, row",
                reorderable: true,
                columnMenu: true,
                pageable: {
                    refresh: parameters.showEditButton
                },
                resizable: false,
                editable: gConfig.gridEditable,
//                TODO: deal
//                edit: GridHelper.edit,
                // THIS FILLS IN LATER
                columns: [],
                dataBound: function (e) {
                    GridHelper.dataBound(e, parameters);
                },
                change: function (e) {
                    GridHelper.selectRow(e, parameters);
                },
                toolbar: '<div class="gridToolbar"></div>'
            }
        };
        /// <summary>
        /// method will select the row by click on row checkbox
        /// </summary>
        /// <param name="e">click event</param>
        /// <param name="grid">grid widget</param>
        /// <param name="parameters">grid parameters</param>
        /// <param name="self">event 'this' link</param>
        GridHelper.selectRowByCheckbox = function (e, grid, parameters, self) {
            var rowsChecked = grid.element.find("tr.k-state-selected");

            var row = $(e.currentTarget).closest('tr');
            var selectedRowItem = grid.dataItem(row);

            var checked = self.checked;
            if (checked) {
                // no selected rows - select one
                if (!rowsChecked.length) {
                    GridHelper.showFirstRecord(selectedRowItem.ObjectEntry_ID, parameters);
                } else {
                    _hidePreviousDisplayer(parameters);
                }
                //-select the row
                row.addClass("k-state-selected");
            } else {
                //-remove selection
                row.removeClass("k-state-selected");
//                row.find('td').removeClass("k-state-selected");
                if (rowsChecked.length == 2) {
                    // get selected record, that's left
                    var selectedRowLeft = grid.element.find("tr.k-state-selected");
                    var selectedDataItemLeft = grid.dataItem(selectedRowLeft);
                    GridHelper.showFirstRecord(selectedDataItemLeft.ObjectEntry_ID, parameters);
                } else {
                    _hidePreviousDisplayer(parameters);
                }
            }
        };

        // TODO:
        /// <summary>
        /// method will select the row on click to the cell
        /// </summary>
        /// <param name="e">onChange event</param>
        /// <param name="parameters">grid parameters</param>
        GridHelper.selectRowsByIds = function (widget, ids) {
            debugger;
            if (!$.isArray(ids) && !ids.length) {
                return false;
            }
            var objectIdKey = SUConstants.ObjectId;
            //  for each row find data item
            $.each(widget.tbody.find('tr'), function () {
                var model = widget.dataItem(this);
                if ($.inArray(model[objectIdKey], ids) != -1) {
                    // select row in grid
                    $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                    // set checkbox
                    $(this).find('._check_row').prop('checked', true);
                }
            });
        }


        /// <summary>
        /// method will select the row on click to the cell
        /// </summary>
        /// <param name="e">onChange event</param>
        /// <param name="parameters">grid parameters</param>
        GridHelper.selectRow = function (e, parameters) {
            var grid = e.sender;
            var selectedCell = grid.select();
//            var checkBoxCellsClicked = selectedCell.find('._check_row');
//            if (checkBoxCellsClicked.length) {
//                checkBoxCellsClicked.click();
//            } else {
//                var selectedRow = selectedCell.closest('tr');
            var selectedRow = grid.select();
            // deselect all rows
            grid.element.find('._check_row').prop('checked', false);
//                grid.element.find('tr').removeClass("k-state-selected");
//            grid.element.find('td').removeClass("k-state-selected");
            // mark row as selected
            selectedRow.find('._check_row').prop('checked', true);
//                selectedRow.addClass("k-state-selected");
            // select records for conversion/print
            if (selectedRow.length > 1) {
                // hide previous object detail
                _hidePreviousDisplayer(parameters);
            } else {
                var currentDataItem = grid.dataItem(selectedRow);
                GridHelper.showFirstRecord(currentDataItem.ObjectEntry_ID, parameters);
            }
        };

        /// <summary>
        /// method will show the selected record in inline editing mode
        /// </summary>
        /// <param name="obj">current edited object</param>
        /// <param name="objField">object field</param>
        /// <param name="key">property name</param>
        /// <param name="cell">dom element</param>
        GridHelper.showRelationalRecord = function (dataType, inputSettings, fieldName, container, model) {
            var dataTypes = gConfig.dataTypes;
            // TODO: do me!!!
            var dropdownList = null;
            //var $container = $($thisDetail).find(obj).closest("._grideditBlock");
            //var key = $container.attr("key");
//            var dataType = objField.DataType;
            // var objField = $config.GetAllPropertiesOfField(key, $thisDetail.settings.ObjectDefinitionName);
            var inputValue = "";
            var objectDefId;
            if (dataType == dataTypes.MultiObjectRelationshipField) {
                dropdownList = $(container).find("#ddl" + fieldName).data("kendoDropDownList");
                inputValue = dropdownList.text();
            }
            else {
                inputSettings = inputSettings.split(':');
                if (inputSettings.length > 0) {
                    objectDefId = inputSettings[0];
                    inputValue = inputSettings[1];
                }
            }
            var odn = inputValue;
            return relatedObjectsService.openRelatedObjectPopup(fieldName, odn, objectDefId, container,
                function (EventData) {
                    var itemId = EventData.ObjectEntry_ID;
                    var name = EventData.Name
                    var value = itemId + ':' + name;
                    if (dataType.MultiObjectRelationshipField == dataType) {
                        if (dropdownList != null) {
                            value = value + ":" + dropdownList.value() + ":" + dropdownList.text();
                        }
                    }
                    if (model != undefined && model != null) {
                        $(container).find('#txt' + fieldName).val(name);
                        model.set(fieldName, value);
                    }
                });
        };
        /// <summary>
        /// method will be called on grid 'destroy'
        /// </summary>
        /// <param name="gridContainer">container of the grid</param>
        GridHelper.gridDestroy = function (gridContainer) {
            gridContainer.data("kendoGrid").destroy(); // destroy the Grid
            gridContainer.empty(); // empty the Grid content (inner HTML)
        };
        /// <summary>
        /// method will be called on grid dataBound event
        /// </summary>
        /// <param name="e">grid event</param>
        /// <param name="parameters">grid parameters object</param>
        GridHelper.dataBound = function (e, parameters) {

            var gridWidget = e.sender;
            // bind 'karta' field click
            gridWidget.element.find("._viewObjectGeoData").off('click');
            gridWidget.element.find("._viewObjectGeoData").on('click', function (e) {
                GridHelper.openMapPopup(e, this);
            });

            // Show first record
            if (parameters.showFirstRecord && !gridWidget.refreshedWithoutAPICall) {
                var data = gridWidget.dataSource.data();
                if (data && data.length) {
                    var entryId = data[0].ObjectEntry_ID;
                    GridHelper.showFirstRecord(entryId, parameters);
                    // Find checkbox and select the row
                    var firstRow = gridWidget.tbody.find(">tr:first");
                    firstRow.find('._check_row').prop('checked', true);
                    firstRow.addClass("k-state-selected");
                }
            }
            // grid was refreshed without API call,
            // reset this flag
            if (gridWidget.refreshedWithoutAPICall) {
                gridWidget.refreshedWithoutAPICall = false;
            }
        };
        /// <summary>
        /// method to parse response from API
        /// </summary>
        /// <param name="response">API response</param>
        GridHelper.parse = function (response) {
            try {
                response = _parseXMLResponse(response);
//                if (response != null && response.length > 0)
//                    response = _parseXMLResponse(response);
////                    response = $.parseJSON(response);
                response.forEach(function (entry) {
                    _updateImage(entry);
                });
            }
            catch (ex) {
                var msg = localizationService.translate('Messages.InvalidJson');
                notificationService.showNotification(msg, true);
            }

            return response || "";
        };
        function _parseXMLResponse(response){
            debugger;
            var entries = [];
            $(response).find('EntityItem').each(function(k, entry){
                var object = {};
                for(var attrKey in entry.attributes){
                    if(entry.attributes.hasOwnProperty(attrKey)){
                        var attrName = entry.attributes[attrKey]['name'];
                        object[attrName] = entry.attributes[attrKey]['value'];
                    }
                }
                $(entry).find('Attributes').children().each(function(i, attr){
                    var attrName = attr['tagName'];
                    object[attrName] = attr['textContent'];
                });
                entries.push(object);
            });

            return entries;
        }
        /// <summary>
        /// method called before API call to form parameters string for API call
        /// </summary>
        /// <param name="options">grid 'options' object(comes from event)</param>
        /// <param name="gridParameters">grid parameters object</param>
        GridHelper.parameterMap = function (options, gridParameters) {
            gridParameters.selectedPage = options.page - 1;
            var customFilter = "";
            // use perspective filter, if present
            var perspectiveFilter = angular.isObject(gConfig.perspectiveFilter) &&
                gConfig.perspectiveFilter[gridParameters.odn] ? gConfig.perspectiveFilter[gridParameters.odn] : "";
            if (perspectiveFilter && gridParameters.filterExpression) {
                customFilter = perspectiveFilter + " AND " + gridParameters.filterExpression;
            } else if (perspectiveFilter) {
                customFilter = perspectiveFilter;
            } else {
                customFilter = gridParameters.filterExpression;
            }

            var recordCountFilterExpression = (options.filter ? (' ' +
                gridFilterExpressionService.getFilterExpression(options.filter, options.filter.logic)) : '');
            if (recordCountFilterExpression == null || $.trim(recordCountFilterExpression) == "") {
                recordCountFilterExpression = customFilter;
            }
            else {
                customFilter = (customFilter == null || $.trim(customFilter)) == "" ? "" : customFilter + " AND ";
                recordCountFilterExpression = customFilter + recordCountFilterExpression;
            }
            // cache recordCountFilterExpression
            gridParameters.recordCountFilterExpression = recordCountFilterExpression;
            var parameters = {
                PageSize: options.pageSize,
                PageNumber: options.page - 1,
                Token: gConfig.token,
                RequestType: "Detail",
                ObjectDefinitionName: gridParameters.odn,
                OrderByExpression: options.sort ?
                    gridFilterExpressionService.getSortExpression(options.sort) :
                    gConfig.defaultSortOrder,
                FilterExpression: recordCountFilterExpression,
                SelectedGridColumns: "*",
                GenericSearch: gridParameters.genericSearch
            };
            // add advanced search custom filters, if present
            if (gridParameters.customASFilters) {
                parameters.customASFilters = gridParameters.customASFilters;
            }

            // todo: revert
            var str = JSON.stringify(parameters);
            var xml = json2xml(str);
            debugger;

            var xml = '<?xml version="1.0" encoding="utf-8" ?>'+
            '<Context ID="Shop" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'+
            '<TypeName>Issue</TypeName>'+
            '<OperationName>SearchObject</OperationName>'+
            ' <Filters>'+
            '    <Filter>'+
            '           <String>lorem</String>'+
            '       </Filter>'+
            '   </Filters>'+
            '   <ResultSet>'+
            '       <Sorting TypeSort="Asc">'+
            '           <Column>Description</Column>'+
            '       </Sorting>'+
            '       <Pager>'+
            '           <Page>1</Page>'+
            '           <Count>100</Count>'+
            '       </Pager>'+
            '   </ResultSet>'+
            '</Context>';

            return xml;
        };

        /// <summary>
        /// method that will show first record of the grid
        /// </summary>
        /// <param name="recordId">id of record</param>
        /// <param name="gridSettings">grid parameters object</param>
        // returns promise
        GridHelper.showFirstRecord = function (recordId, gridSettings) {
            // if grid is already displaying detail page
            // close it
            _hidePreviousDisplayer(gridSettings);

            var detailPageSettings = {
                odn: gridSettings.odn,
                pageTemplateName: gridSettings.pageTemplateName,
                // TODO: remove recordId, use currentRecord.id instead
                recordId: recordId,
                fieldEditMode: 'single',
                pageSize: gridSettings.pageSize,
                displayMode: gridSettings.displayMode,
                editMode: 'detail',
                currentRecord: {
                    id: recordId
                }
            };
            existingObjectDetailService.getObjectsWithSubObjects(detailPageSettings)
                .then(function (displayer) {
                    gridSettings.objectDetailDisplayer = displayer;
                });
        };
        /// <summary>
        /// method will hide previously opened detail page
        /// </summary>
        /// <param name="parameters">grid object parameters</param>
        function _hidePreviousDisplayer(parameters) {
            if (parameters.objectDetailDisplayer) {
                parameters.objectDetailDisplayer.close();
                parameters.objectDetailDisplayer = null;
            }
        }

        /// <summary>
        /// add new image icon field
        /// </summary>
        /// <param name="entry">object entry</param>
        function _updateImage(entry) {
            var iamgeName, img60Size;

            iamgeName = entry[SUConstants.RecordFirstImageColumn];
            img60Size = SUConstants.ImageSizes.h60;
            entry.image_h60 = filesystemService.changeImageUrlAndSize(iamgeName, img60Size);
        }

        /// <summary>
        /// method will show the loader bar.
        /// </summary>
        function _showLoading() {
            eventManager.fireEvent(LoadActionStartEvent);
        }

        /// <summary>
        /// method will hide the loader bar.
        /// </summary>
        function _hideLoading() {
            eventManager.fireEvent(LoadActionEndEvent);
        }

        return GridHelper;
    }]);
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

/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.factory('gridDataService', ['$http', '$q', 'configService',
    'notificationService', 'objectService',
    function ($http, $q, configService, notificationService, objectService) {
        var GridDataService = function () {

        };

        var gConfig = configService.getGlobalConfig();

        var PostData = {
            ObjectDefinitionName: "",
            RecordID: "",
            PageNumber: "",
            PageSize: "",
            OrderByExpression: "",
            Token: "",
            RequestType: "",
            Clear: function () {
                this.ObjectDefinitionName = "";
                this.RecordID = "";
                this.PageNumber = "";
                this.PageSize = "";
                this.OrderByExpression = "";
                this.Token = "";
                this.RequestType = "";
            }
        };
//
//        // NOT CHECKED
//        /// <summary>
//        /// method will save the value of inline edited element.
//        /// <param name="element">has edited element</param>
//        /// </summary>
//        GridDataService.saveInlineRecord = function (odn, fieldName, fieldPropertyFk, recordId ,container) {
//            alert('Saving inline grid field...');
//            if(! fieldName || ! dataItem || !container){
//                return;
//            }
//            var propertyFk = dataItem.PropertyDefinition_ID;
//            var entryId = dataItem.ObjectEntry_ID;
//            var  value = container.val();
//            // TODO: maybe, get value from model.ObjectEntry_ID
////            odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent
//            debugger;
//            objectService.saveObjectField(odn, fieldName, propertyFk, value, entryId, false);
////            objInlineEditData["ObjectEntry_fk"] = model.ObjectEntry_ID;
////                objInlineEditData["PropertyDefinition_fk"] = objField.PropertyDefinition_ID;
////                objInlineEditData["PropertyValue"] = value;
//            // get value
//            // TODO: do me
////            objectService.getSettingsAndSaveObjectField(fieldName, value,
////                dataItem.ObjectEntry_ID, odn, true).then(function(response){
////                    // TODO: deal with it
//////                    if ($thisGrid.SelectedRecordId == model.ObjectEntry_ID) {
//////                        $thisGrid.bindRecordDetail(model);
//////                    }
//////                    $config.ShowNotification($.objectLanguage.Messages.RecordUpdatedSuccessfully, false);
////
////                });
//
//            // TODO: remove
//            // OLD
////            var input = $(element);
////            if ($($thisGrid).find("td").hasClass("_grideditBlock")) {
////
////                var $td = $($thisGrid).find("._grideditBlock");
////                var grid = $($thisGrid).data("kendoGrid"),
////                    model = grid.dataItem($($td).closest("tr"));
////                var row = $($td).closest("tr");
////                var rowIdx = $("tr", grid.tbody).index(row);
////                var colIdx = $("td", row).index($($td));
////                var colName = $($thisGrid).find('th').eq(colIdx).text();
////                var fieldName = $($thisGrid).find('th').eq(colIdx).data('field');
////                var objField = $config.GetAllPropertiesOfField(fieldName, $thisGrid.settings.ObjectDefinitionName);
////
////                var value = dropdownvalue == undefined ? model[fieldName] : dropdownvalue;
////                var objInlineEditData = new Object();
////                objInlineEditData["ObjectEntry_fk"] = model.ObjectEntry_ID;
////                objInlineEditData["PropertyDefinition_fk"] = objField.PropertyDefinition_ID;
////                objInlineEditData["PropertyValue"] = value;
////
////
////                $($thisGrid).find("._grideditBlock").removeClass("_grideditBlock");
////                if (PostData.RequestType != undefined)
////                    objInlineEditData.RequestType = "sio";
////                var url = $config.URLs.SaveInlineObjectURL + "/" + $config.Token;
////
////                if (objInlineEditData.PropertyValue != undefined) {
////                    //If Record Exist in Temporary Array then Update Temporary Array
////                    var responseData = $.fn.objectSave({}).CheckRecordExistsinTempRecordById(model.ObjectEntry_ID, $thisGrid.settings.ObjectDefinitionName);
////                    if (responseData != null && responseData.length > 0) {
////                        var json = jQuery.parseJSON(responseData[0].JsonData);
////                        json[fieldName] = value;
////                        var jsonData = [];
////                        jsonData.push(json);
////                        $.fn.objectSave({}).CreateTempSaveObject(JSON.stringify(jsonData), $thisGrid.settings.ObjectDefinitionName, "Edit", null, true);
////                    }
////                    else {
////                        $.ajax({
////                            type: "POST",
////                            url: url,
////                            data: JSON.stringify(objInlineEditData),
////                            dataType: "json",
////                            async: true,
////                            success: function (response) {
//                                // $.RebindDetail($thisGrid, dataType, "SAVE");
////                                if ($thisGrid.SelectedRecordId == model.ObjectEntry_ID) {
////                                    $thisGrid.bindRecordDetail(model);
////                                }
////                                $config.ShowNotification($.objectLanguage.Messages.RecordUpdatedSuccessfully, false);
////                            },
////                            error: function (xhr, ajaxOptions, thrownError) {
////                                var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
////                                if (respoonseCodeValue == "UnAuthorized")
////                                    $config.ShowNotification(xhr.getResponseHeader('ResponseCode'), true);
////                                else
////                                    $config.ShowNotification($config.URLs.SaveInlineObjectURL + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError, true);
////                            }
////                        });
////                    }
////                }
////            }
//        };

        // checked
        /// <summary>
        /// Function calls API to get total number of records.
        /// Returns totalRecords for passed ObjectDefinitionName as per filter Expression.
        /// </summary>
        /// <param name="objsettings">has ObjectDefinationName, token</param>
        /// <param name="filterExpression">has filterExpression applied by user</param>
        GridDataService.getTotalRecords = function (gridParameters) {
            var filterExpression = gridParameters.filterExpression;
            var totalRecords = 0;
            PostData.Clear();
            PostData.ObjectDefinitionName = gridParameters.odn;
            PostData.FilterExpression = filterExpression ? filterExpression : '';
            PostData.GenericSearch = gridParameters.genericSearch;
            PostData.RequestType = "CountRecord";
            var url = configService.getUrlBase('objectRecordsCount') + '/' + gConfig.token;

            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(PostData),
                dataType: "json",
                async: false,
                cache: false,
                success: function (response) {
                    totalRecords = response;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (respoonseCodeValue == "UnAuthorized") {
                        notificationService.showNotification(respoonseCodeValue, true);
                    }
                    else {
                        var msg = "Unable to get total records for object" + gridParameters.odn;
                        notificationService.showNotification(msg, true);
                    }
                }
            });

            return totalRecords;
        };

        return GridDataService;
    }]);

/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.directive('speedupGrid', ['$compile', 'configService', 'gridHelper',
    'gridSchemaService', 'eventManager', 'gridRefreshService', 'gridDataService',
    function ($compile, configService, gridHelper, gridSchemaService, eventManager, gridRefreshService,
              gridDataService) {

        return {
            template: '<div class="dynamicObjectGridContainer"></div>',
            restrict: "EA",
            replace: true,
            scope: {
                parameters: "=parameters",
                overridingOptions: "=overridingOptions"
            },
            controller: ['$scope', function ($scope) {
                // hook for default parameters
                if(!$scope.parameters.displayMode){
                    $scope.parameters.displayMode = {type: "popup"};
                }
                if(!$scope.parameters.pageTemplateName){
                    $scope.parameters.pageTemplateName = "Default";
                }
                if($scope.overridingOptions){
                    $scope.gridOptions = angular.merge(gridHelper.getGridOptions($scope.parameters),
                        $scope.overridingOptions);
                } else {
                    $scope.gridOptions = gridHelper.getGridOptions($scope.parameters);
                }
                gridSchemaService.getGridSchema($scope.parameters).then(function (gridSchema) {
                    $scope.gridOptions.dataSource.schema = {
                        model: gridSchema,
                        parse: gridHelper.parse,
                        total: function () {
                            return gridDataService.getTotalRecords($scope.parameters);
                        }
                    };
                    $scope.gridOptions.columns = gridSchema.GridSelectedColumnsList;
                    // hack to have columns in parameters object as well
                    $scope.parameters.columns = gridSchema.GridSelectedColumnsList;
                });
            }],
            link: function ($scope, $element, $attrs, controller, $transclude) {
                $scope.$watch('gridOptions.dataSource.schema', function (schema) {
                    if (schema) {
                        var gridOptions = $scope.gridOptions;
                        var parameters = gridOptions.objectParameters;

                        // process grid wrap
                        var gridWidget = $element.kendoGrid(gridOptions).data('kendoGrid');
                        gridWidget.table.on("click", "._check_row" , function(e){
                            gridHelper.selectRowByCheckbox(e, gridWidget, parameters, this);
                        });
                        if($scope.gridOptions.objectParameters.toolbar){
                            var tpl = angular.element('<grid-toolbar></grid-toolbar>');

                            var scope = $scope.$new();
                            scope = angular.extend(scope, $scope.gridOptions.objectParameters.toolbar);

                            $compile(tpl)(scope);

                            $element.find('.gridToolbar').append(tpl);
                        }
                        $element.find('#checkAll').on('change', function(e){
                            var selected = this.checked;
                            if(selected) {
                                gridWidget.element.find('tr').addClass("k-state-selected");
                                gridWidget.element.find('._check_row').prop('checked', true);
                            } else{
                                gridWidget.element.find('tr').removeClass("k-state-selected");
                                gridWidget.element.find('td').removeClass("k-state-selected");
                                gridWidget.element.find('._check_row').prop('checked', false);
                            }
                        });
                        // filter by generic search
                        eventManager.addListener(FilterGridByGenericSearchEvent,
                            function (data) {
                                var gridWidget = $element.data('kendoGrid');
                                var gridParameters = gridOptions.objectParameters;
                                var sourceOdn = gridParameters.odn;
                                var targetOdn = data.odn;
                                var searchStr = data.genericSearchStr
                                if (sourceOdn == targetOdn){
                                    gridRefreshService.refreshByGenericSearch(gridWidget, gridParameters, searchStr);
                                }
                            }, parameters);
                        // filter by generic search
                        eventManager.addListener(FilterGridByFilterExpressionEvent,
                            function (data) {
                                var gridWidget = $element.data('kendoGrid');
                                var gridParameters = gridOptions.objectParameters;
                                var sourceOdn = gridParameters.odn;
                                var targetOdn = data.odn;
                                var searchStr = data.filterExpression;
                                var customASFilters = data.customASFilters;
                                if (sourceOdn == targetOdn){
                                    gridRefreshService.refreshByFilterExpression(gridWidget, gridParameters,
                                        searchStr, customASFilters);
                                }
                            }, parameters);
                        // catch 'propertySaved' event to refresh data source
                        eventManager.addListener(ObjectPropertySavedEvent, function (data) {
                            gridRefreshService.refreshSinglePropertyDS(data, parameters.odn,
                                $element.data('kendoGrid'));
                            // trying to find particular entry in data source
                        });
                        // catch 'object created' event to refresh data source
                        eventManager.addListener(ObjectSavedEvent, function (data) {
                            gridRefreshService.refreshObjectDS(data, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                        // catch 'object copied' event to refresh data source
                        eventManager.addListener(ObjectCopiedEvent, function (data) {
                            gridRefreshService.refreshObjectDS(data, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                        // catch 'batch edit' event to refresh data source
                        eventManager.addListener(ObjectsBatchUpdatedEvent, function (data) {
                            gridRefreshService.refreshMultiple(data, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                        // catch 'object deleted' event to refresh data source
                        eventManager.addListener(ObjectDeletedEvent, function(data){
                            gridRefreshService.refreshObjectDS({
                                    ObjectDefinitionName: data.odn
                                }, parameters.odn,
                                $element.data('kendoGrid'));
                        });
                    }
                });
            }
        }
    }
]);
/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.factory('gridFilterExpressionService', ['configService',
    function (configService) {

        var gConfig = configService.getGlobalConfig();
        var _filterDateParamFormat = "yyyy-MM-dd";
        var _defaultSortOrder = "";

        var SqlOperator = {
            NotLikeOperator: ' NOT LIKE ',
            LikeOperator: ' LIKE ',
            NotOperator: ' NOT',
            NotEqualTo: " <>",
            EqualTo: " =",
            LeftPerc: "'%",
            RightPerc: "%'",
            GreaterThanOrEqualTo: " >= ",
            LessThanOrEqualTo: " <= "
        };
        var GridOperator = {
            EqualTo: "eq",
            NotEqualTo: "neq",
            GreaterThanOrEqualTo: "gte",
            LessThanOrEqualTo: "lte",
            Contains: "contains",
            StartsWith: "startswith",
            EndsWith: "endswith"
        };

        var GridFilterExpressionService = function () {
        };

        // CHECKED
        /// <summary>
        /// will return string of sorting expression of selected column.
        /// example: [fieldName] asc
        /// </summary>
        /// <param name="sort">for creation of sort expression</param>
        GridFilterExpressionService.getSortExpression = function(sort) {
            var sortExpression = '';
            var fieldName = '';
            var sortdirection = '';
            if (sort != undefined && sort != null) {

                $.each(sort, function (key, value) {

                    fieldName = '[' + value.field + ']';
                    sortdirection = value.dir;
                    if (sortExpression == '') {
                        sortExpression = fieldName + ' ' + sortdirection
                    }
                    else {
                        sortExpression += ', ' + fieldName + ' ' + sortdirection;
                    }

                });
            }
            return sortExpression == "" ? _defaultSortOrder : sortExpression;
        };

        // CHECKED
        /// <summary>
        /// will return filter expression to filter data based on selected kendo Grid Column.
        /// will further call two methods for return string or date filter expression.
        /// </summary>
        /// <param name="filter">for creation of filter expression</param>
        /// <param name="logic">for adding a logic like and, or etc</param>
        /// <param name="columnsList">array of columns object</param>
        GridFilterExpressionService.getFilterExpression = function (filter, logic, columnsList) {
            var filterExpression = '';
            var fieldName = '';
            var operator = '';
            var fieldValue = '';
            if (filter != undefined && filter != null) {
                $.each(filter.filters, function (key, value) {

                    operator = value.operator;
                    if (value.field != undefined) {
                        fieldName = '[' + value.field + ']';
                        fieldValue = value.value;
                        if (_isDateField(value.field, columnsList)) {
                            filterExpression = _getDateFilterExpression(operator, logic, fieldName, fieldValue, filterExpression);
                        } else if (_isRelationalColumn(value.field, columnsList)){
                            filterExpression = _getRelatedFilterExpression(operator, logic, fieldName, fieldValue, filterExpression);
                        }
                        else {
                            filterExpression = _getStringFilterExpression(operator, logic, fieldName, fieldValue, filterExpression);
                        }
                    }
                });
            }
            return filterExpression;
        };

        /// <summary>
        /// To check if field name of column's header is of date type
        /// </summary>
        /// <param name="fieldName">property name of grid</param>
        /// <param name="gridColumnsList">list of grid column objects</param>
        function _isDateField(fieldName, gridColumnsList) {
            var dataTypes = gConfig.dataTypes;
            for (var column in gridColumnsList) {
                if (gridColumnsList[column].field == fieldName) {
                    if (gridColumnsList[column].dataType == dataTypes.DateTime ||
                        gridColumnsList[column].dataType == dataTypes.Date) {

                        return true;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// To check if field name of column's header is of relational type
        /// </summary>
        /// <param name="fieldName">property name of grid</param>
        /// <param name="gridColumnsList">list of grid column objects</param>
        function _isRelationalColumn(fieldName, gridColumnsList){
            var dataTypes = gConfig.dataTypes;
            for (var column in gridColumnsList) {
                if (gridColumnsList[column].field == fieldName) {
                    if (gridColumnsList[column].dataType == dataTypes.ParentRelationship ||
                        gridColumnsList[column].dataType == dataTypes.ObjectRelationship) {

                        return true;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// will return filter expression for date data type.
        /// example: Convert(datetime,[fieldName]) > Convert(datetime,'fieldvalue')
        /// </summary>
        /// <param name="operator">grid operators</param>
        /// <param name="logicOperator">for adding a logic like and, or etc</param>
        /// <param name="fieldName">Property/header name</param>
        /// <param name="fieldValue">value of property</param>
        /// <param name="OldExpression">any previously applied filter expression</param>
        function _getDateFilterExpression(operator, logicOperator, fieldName, fieldValue, OldExpression) {
            var newExpression;
            var space = " ";
//            fieldValue = kendo.toString(new Date(fieldValue), _filterDateParamFormat);
            switch (operator) {
                case GridOperator.StartsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + "'" + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.EndsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + "'";
                    break;
                case GridOperator.NotEqualTo:
                    newExpression = fieldName + SqlOperator.NotLikeOperator + SqlOperator.LeftPerc + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.EqualTo:
                case GridOperator.Contains:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.GreaterThanOrEqualTo:
                    newExpression = "Convert(datetime," + fieldName + ")" +
                        SqlOperator.GreaterThanOrEqualTo + "Convert(datetime,'" + fieldValue + "')";
                    break;
                case GridOperator.LessThanOrEqualTo:
                    newExpression = "Convert(datetime," + fieldName + ")" +
                        SqlOperator.LessThanOrEqualTo + "Convert(datetime,'" + fieldValue + "')";
                    break;
                default:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc + fieldValue +
                        SqlOperator.RightPerc;
            }
            if (logicOperator != undefined && logicOperator != null) {
                if (OldExpression != '') {
                    OldExpression = OldExpression + space + logicOperator + space + newExpression;
                }
                else {
                    OldExpression = newExpression;
                }
            }
            else {
                OldExpression = OldExpression + space + newExpression;
            }

            return OldExpression;
        }
        /// <summary>
        /// will return filter expression for string data type.
        /// example: [fieldName] <> 'fieldvalue'
        /// </summary>
        /// <param name="operator">grid operators</param>
        /// <param name="logicOperator">for adding a logic like and, or etc</param>
        /// <param name="fieldName">Property/header name</param>
        /// <param name="fieldValue">value of property</param>
        /// <param name="OldExpression">any previously applied filter expression</param>
        function _getStringFilterExpression(operator, logicOperator, fieldName, fieldValue, OldExpression) {

            var newExpression;
            var space = " ";
            switch (operator) {
                case GridOperator.StartsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + "'" + fieldValue +
                        SqlOperator.RightPerc;
                    break;
                case GridOperator.EndsWith:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + "'";
                    break;
                case GridOperator.NotEqualTo:
                    newExpression = fieldName + SqlOperator.NotEqualTo + "'" + fieldValue + "'";
                    break;
                case GridOperator.EqualTo:
                    newExpression = fieldName + SqlOperator.EqualTo + "'" + fieldValue + "'";
                    break;
                case GridOperator.Contains:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + SqlOperator.RightPerc;
                    break;
            }
            if (logicOperator != undefined && logicOperator != null) {
                if (OldExpression != '') {
                    OldExpression = OldExpression + space + logicOperator +
                        space + newExpression;
                }
                else {
                    OldExpression = newExpression;
                }
            }
            else {
                OldExpression = OldExpression + space + newExpression;
            }

            return OldExpression;
        }

        /// <summary>
        /// will return filter expression for related data type.
        /// </summary>
        /// <param name="operator">grid operators</param>
        /// <param name="logicOperator">for adding a logic like and, or etc</param>
        /// <param name="fieldName">Property/header name</param>
        /// <param name="fieldValue">value of property</param>
        /// <param name="OldExpression">any previously applied filter expression</param>
        function _getRelatedFilterExpression(operator, logicOperator, fieldName, fieldValue, OldExpression) {

            var newExpression;
            var space = " ";
            switch (operator) {
                case GridOperator.StartsWith:
                    /* '%:VALUE%' */
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        ":" + fieldValue + SqlOperator.RightPerc;
                    break;
                case GridOperator.EndsWith:
                    /* '%:%VALUE' */
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        ":%" + fieldValue + "'";
                    break;
                case GridOperator.NotEqualTo:
                    newExpression = fieldName + SqlOperator.NotLikeOperator + SqlOperator.LeftPerc +
                        fieldValue + SqlOperator.RightPerc;
                    break;
                case GridOperator.Contains:
                case GridOperator.EqualTo:
                    newExpression = fieldName + SqlOperator.LikeOperator + SqlOperator.LeftPerc +
                        fieldValue + SqlOperator.RightPerc;
                    break;
            }
            if (logicOperator != undefined && logicOperator != null) {
                if (OldExpression != '') {
                    OldExpression = OldExpression + space + logicOperator +
                        space + newExpression;
                }
                else {
                    OldExpression = newExpression;
                }
            }
            else {
                OldExpression = OldExpression + space + newExpression;
            }

            return OldExpression;
        }


        return GridFilterExpressionService;
    }]);
/**
 * Created by Мама on 08.06.15.
 */
speedupGridModule.factory('gridSchemaService', ['$q', 'configService', 'schemaService',
    'gridColumnsService', 'gridDataService',
    function ($q, configService, schemaService, gridColumnsService, gridDataService) {
        var GridSchemaService = function () {
        };

        /// <summary>
        /// Method calls API to get object schema for grid
        /// </summary>
        /// <param name="gridParameters">grid parameters object</param>
        GridSchemaService.getGridSchema = function (gridParameters) {
            return schemaService.getSchema(gridParameters.odn).then(function (schemaObj) {
                    if (!schemaObj) {
                        return null;
                    }
                    var selectedFields = [], columnsList = [];
                    var gConfig = configService.getGlobalConfig();
                    // for 'main' grid object also add fields from pageConfig.selectedFields
                    if (gridParameters.odn == gConfig.objectDefinitionName) {
                        selectedFields = _getVisibleFieldsByConfig(gConfig.selectedColumns, schemaObj.AllColumnsList);
                    } else {
                        selectedFields = schemaObj.SelectedColumnsList;
                    }
                    // if selected fields string contains fields -
                    // show all of them in order they appear
                    if (selectedFields.length) {
                        columnsList = gridColumnsService.getSelectedGridColumns(selectedFields, gridParameters, false);
                    } else {
                        columnsList = gridColumnsService.getSelectedGridColumns(schemaObj.AllColumnsList, gridParameters, true);
                    }

                    return {
                        GridSelectedColumnsList: columnsList,
                        TotalRecords: gridDataService.getTotalRecords(gridParameters),
                        Model: schemaObj.Model,
                        GridColumnsList: schemaObj.AllColumnsList
                    };
                }
            );
        };
        /// <summary>
        /// Method will get selected fields data by list of field names
        /// </summary>
        /// <param name="fieldsListStr">field names string</param>
        /// <param name="allFieldsArr">array of fields objects</param>
        function _getVisibleFieldsByConfig(fieldsListStr, allFieldsArr) {
            var cfgFields = fieldsListStr.split(',');
            var selectedFields = [];

            // index array of fields to get field by name
            var fieldsIndeces = {};
            allFieldsArr.forEach(function (field, idx) {
                fieldsIndeces[field.PropertyName] = idx;
            });

            var fieldIdx;
            cfgFields.forEach(function (fieldName) {
                fieldIdx = fieldsIndeces[fieldName];
                if (fieldIdx && allFieldsArr[fieldIdx]) {
                    selectedFields.push(allFieldsArr[fieldIdx]);
                }
            });

            return selectedFields;
        }

        // NOT USED NOW
        /// <summary>
        /// Method will get selected fields by merging array of selected
        // fields with array of fields passsed by names
        /// </summary>
        /// <param name="fieldsListStr">Selected fields string(from config)</param>
        /// <param name="selectedFields">Selected fields array to merge with</param>
        /// <param name="allFields">all fields array</param>
        function _mergeVisibleFieldsFromConfig(fieldsListStr, selectedFields, allFields) {
            // get field names from config str
            var cfgFields = fieldsListStr.split(',');
            // get field names from selected fields
            var selectedFieldsNames = selectedFields.map(function (field) {
                return field.PropertyName;
            });
            // get index:FieldName array from allFields
            var allFieldsIndeces = {};
            allFields.forEach(function (field, index) {
                allFieldsIndeces[field.PropertyName] = index;
            });
            // find all fields from cfgFields that are not listed in selectedFieldsName
            cfgFields.forEach(function (fieldName) {
                if (fieldName != "" && $.inArray(fieldName, selectedFieldsNames) == -1) {
                    var idx = allFieldsIndeces[fieldName];
                    // merge fields to result array
                    if (idx && allFields[idx]) {
                        var mergedField = allFields[idx];
                        mergedField.Visible = true;
                        selectedFields.push(mergedField);
                    }
                }
            });

            return selectedFields;
        }

        return GridSchemaService;
    }])
;

/**
 * Created by C4off on 07.10.15.
 */
speedupGridModule.factory('batchEditService', ['$q', '$rootScope', 'objectDetailService',
    'objectEditService', 'gridWidgetService', 'objectService', 'inlineFieldValueValidatorService',
    'detailPageFieldValuesService', 'configService', 'localizationService', 'notificationService',
    'popupService', 'objectTemplateService', 'fieldPropertiesService',
    'gridHelper',
    function ($q, $rootScope, objectDetailService, objectEditService,
              gridWidgetService, objectService, inlineFieldValueValidatorService,
              detailPageFieldValuesService, configService, localizationService,
              notificationService, popupService, objectTemplateService, fieldPropertiesService,
              gridHelper) {
        var BatchEditService = function () {
        };

        var gConfig = configService.getGlobalConfig();

        /*PUBLIC METHODS*/

        BatchEditService.getTargetSimpleBlock = function (target) {
            if (target.hasClass('_keycontainer')) {
                return target;
            }
            var closestParent = target.closest('._keycontainer');
            if (closestParent.length) {
                return closestParent;
            }

            return null;
        };

        BatchEditService.getEmptyDataItem = function (odn) {
            return  objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // get fields selected for template
                var selectedFieldsString = "";
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedColumnsForTemplate) {
                    selectedFieldsString = jsonSettings[0].SelectedColumnsForTemplate;
                }
                var selectedFields = [];
                // getting selected fields array from string
                selectedFieldsString.split(",").forEach(function (fieldName) {
                    if (fieldName != "") {
                        selectedFields.push(fieldName.replace(/[[\]]/g, ''));
                    }
                });
                // get properties for that fields
                var fieldsWithProperties = fieldPropertiesService.getAllPropertiesOfFieldsArray(selectedFields, odn);

                var fields = [];
                $.each(fieldsWithProperties, function (index, objField) {
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

                        //default values for controls in case of new record.
                        objField.PropertyName = key;

                        objField = detailPageFieldValuesService.setValuesForElements(objField, key);
                        fields.push(objField);
                    }
                });

                return fields;
            });
        };

        /// <summary>
        /// This method will be called on 'ENTER' button
        /// </summary>
        /// <param name="selectedBlock">selected element</param>
        /// <param name="pageBlock">current page block</param>
        /// <param name="allBlocks">other element blocks on page</param>
        BatchEditService.enterPressed = function (selectedBlock, pageBlock, allBlocks) {
            var dataTypes = gConfig.dataTypes;
            var fieldType = selectedBlock.attr('dtype');
            // enter pressed over edited checkbox
            if (fieldType == dataTypes.CheckBox) {
                _toggleCheckbox(selectedBlock);
                // if we try to save value for relational property - just navigate to next
                // saving is performed in inlineEdit method
            }
            else if (fieldType == dataTypes.TextBox) {
                // do nothing. Otherwise break to new line will not work
            } else {
                return this.tabPressed(selectedBlock, pageBlock, allBlocks, false);
            }

            return selectedBlock;
        };

        /// <summary>
        /// This method will be called on 'TAB' button
        /// </summary>
        /// <param name="selectedBlock">selected element</param>
        /// <param name="pageBlock">current page block</param>
        /// <param name="otherBlocks">other element blocks on page</param>
        /// <param name="isReverse">go to previous element (if not set will go to next)</param>
        BatchEditService.tabPressed = function (selectedBlock, pageBlock, otherBlocks, isReverse) {
            objectEditService.deactivateAllSimpleBlocks(pageBlock.contentObject.element);
            if (selectedBlock) {
                // get dataType and property name of a field
                var dataType = selectedBlock.attr('dtype');
                var fieldName = selectedBlock.attr('key');
                var value = detailPageFieldValuesService.getElementsValue(selectedBlock,
                    dataType, fieldName);
                // try to save the value if it was edited
                if (value != "" && value != undefined && value != null && value != ":" && objectEditService.performValidation(pageBlock.contentObject.element, selectedBlock)) {
                    selectedBlock.parent().find('.checkbox input').prop('checked', true);
                }
                selectedBlock = objectEditService.setNextBlockEdited(selectedBlock, otherBlocks, isReverse);
            }

            return selectedBlock;
        };

        BatchEditService.bindKeyboardKeyPressEvt = function (e, $element, $scope, allBlocks) {
            var keyCode = e.keyCode || e.which;
            var pageBlock = {
                contentObject: { element: $element },
                batchEditBlock: true
            };
            switch (keyCode) {
                case 169:
                    e.preventDefault();
                    $scope.selectedBlock = this.tabPressed(
                        $scope.selectedBlock, pageBlock, allBlocks, true);
                    break;
                case 9:
                    e.preventDefault();
                    $scope.selectedBlock = this.tabPressed(
                        $scope.selectedBlock, pageBlock, allBlocks);
                    break;
                case 13:
                    $scope.selectedBlock = this.enterPressed(
                        $scope.selectedBlock, pageBlock, allBlocks);
                    break;
                case 16:
                    e.preventDefault();
                    $scope.shiftPressed = true;
                    break;
            }
        };

        BatchEditService.activateWidget = function (batchFormEl, $scope, target) {
            // if we clicked input and currently
            // already are editing this form
            if (target == null) {
                objectEditService.deactivateAllSimpleBlocks($(this));
                $scope.selectedBlock = batchFormEl.find('._keycontainer').first();
                objectEditService.activateSimpleBlock($scope.selectedBlock);
                // make pageBlock active
                $rootScope.currentPageBlock = {
                    contentObject: {
                        element: batchFormEl
                    },
                    batchEditBlock: true
                };

                return $scope.selectedBlock;
            }
            var container = target.closest('._keycontainer');
            // on 'tab' press on some widgets we have wrong target
            if (!container.length) {
                return $scope.selectedBlock;
            }
            if (_isCurrentPageBlock($rootScope.currentPageBlock, batchFormEl)) {
                if (!_sameContainer(container, $scope.selectedBlock)) {
                    // make active
                    objectEditService.deactivateAllSimpleBlocks($(this));
                    objectEditService.activateSimpleBlock(container);
                    $scope.selectedBlock = container;
                }
            } else {
                // make pageBlock active
                $rootScope.currentPageBlock = {
                    contentObject: {
                        element: batchFormEl
                    },
                    batchEditBlock: true
                };
                if (container.length) {
                    // activate this block
                    $scope.selectedBlock = container;
                } else {
                    // activate 1-st block
                    $scope.selectedBlock = batchFormEl.find('._keycontainer').first();
                }
                objectEditService.activateSimpleBlock(container);
            }

            return $scope.selectedBlock;
        };

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

        function _isCurrentPageBlock(currentPageBlock, batchFormEl) {
            return currentPageBlock && currentPageBlock.contentObject &&
                currentPageBlock.contentObject.element &&
                batchFormEl.is(currentPageBlock.contentObject.element);
        }

        function _sameContainer(container, selectedBlock) {
            if (!container || !container.length || !selectedBlock || !selectedBlock.length) {
                return false;
            }

            return container.is(selectedBlock);
        }

        /// <summary>
        /// Method to get values of batch edit form
        /// </summary>
        /// <param name="container">form container</param>
        /// <param name="fields">field objects array</param>
        /// <param name="odn">grid odn</param>
        /// <param name="userName">user name</param>
        BatchEditService.getFieldsValues = function (container, fields, odn, userName) {
            return objectDetailService.getEditedObjectData(container, odn, userName).then(function (data) {
                var fieldsValues = [];
                if (!(angular.isArray(data) && angular.isObject(data[0]))) {
                    return fieldsValues;
                }

                var fieldContainers = container.find('.inputContainer');
                var valuesObj = data[0];
                var fieldsHash = BatchEditService.fieldsArrayToHash(fields);

                fieldContainers.each(function (key, field) {
                    // if field is selected
                    if (!$(field).find('.checkbox input').prop('checked')) {
                        return;
                    }
                    // get field type
                    var fieldName = $(field).find('.b-field-label').attr('key');
                    if (!fieldName) {
                        return;
                    }
                    var value = valuesObj[fieldName] || "";
                    var fieldPropsObj = fieldsHash[fieldName];
                    if (!angular.isObject(fieldPropsObj)) {
                        return;
                    }
                    fieldsValues.push({
                        name: fieldPropsObj.PropertyName,
                        fk: fieldPropsObj.PropertyDefinition_ID,
                        value: value
                    });
                });

                return fieldsValues;
            });
        };

        BatchEditService.sendSaveRequest = function (fieldValuesArray, $scope) {
            var selectedEntries = [];
            gridWidgetService.getSelectedRows($scope.gridElement).forEach(function (row) {
                var entryId = row.ObjectEntry_ID;
                if (entryId) {
                    selectedEntries.push(entryId);
                }
            });
            if (!fieldValuesArray.length) {
                var msg = localizationService.translate('Messages.SelectAtLeastOneFieldForBatchEdit');
                notificationService.showNotification(msg, true);
                var deferred = $q.defer();
                deferred.reject();

                return deferred;
            }
            if (selectedEntries.length) {
                return objectService.batchEdit({
                    entries: selectedEntries,
                    data: fieldValuesArray
                }, $scope.odn, true).then(function (recordsCount) {
                    var widget =  $scope.gridElement.data("kendoGrid");
                        setTimeout(gridHelper.selectRowsByIds(widget, selectedEntries), 200);
                        var msg = localizationService.translate('Messages.BatchEditSuccess');
                        notificationService.showNotification(msg, false);
                    }, function () {
                        var msg = localizationService.translate('Messages.FailedToBatchEdit');
                        notificationService.showNotification(msg, true);
                    });
            } else {
                var msg = localizationService.translate('Messages.SelectAtLestOneForBatchEdit');
                notificationService.showNotification(msg, true);

                return false;
            }
        };

        /// <summary>
        /// Convert array to hash
        /// </summary>
        /// <param name="fields">field objects array</param>
        BatchEditService.fieldsArrayToHash = function (fields) {
            var hash = {};
            fields.forEach(function (fieldObj) {
                hash[fieldObj.PropertyName] = fieldObj;
            });

            return hash;
        };

        /*PRIVATE METHODS*/

        return BatchEditService;
    }]);
/**
 * Created by C4off on 06.10.15.
 */
speedupGridModule.directive('gridBatchEditForm', ['$compile', 'configService', 'batchEditService',
        'fieldService', 'objectDetailService', 'eventManager', 'localizationService',
        function ($compile, configService, batchEditService, fieldService, objectDetailService,
                  eventManager, localizationService) {

            var gConfig = configService.getGlobalConfig();

            return {
                templateUrl: configService.getTemplateUrl('Grid/BatchEdit/BatchEditTemplate.html'),
                restrict: "EA",
                replace: true,
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    batchEditService.getEmptyDataItem($scope.odn).then(function(fields){
                        fields.forEach(function(field){
                            field.PropertyValue = "";
                        });
                        var dataTypes = gConfig.dataTypes;
                        // filter fields
                        // skip 'read-only fields' from tabbing
                        var filteredFields = fields.filter(function (field) {
                            // skip some fields, like map
                            if (field.DataType == dataTypes.GeoData ||
                                field.DataType == dataTypes.AutoText) {
                                return false;
                            }
                            return !fieldService.isFieldReadOnly(field.PropertyName);
                        });

                        $scope.fields = [filteredFields];

                        // translations
                        $scope.tr = {
                            title: localizationService.translate('Titles.BatchEdit')
                        };

                        var tpl = angular.element('<grid-batch-edit-blocks></grid-batch-edit-blocks>');

                        $compile(tpl)($scope);

                        $element.find('.contentBlock').append(tpl);

                        var editFormEl = $element.find('.batchEditForm');
                        // bind events
                        // bind 'open' button click
                        $scope.$on(BatchEditBtnClickedEvent, function(){
                            if (editFormEl.css('display') == 'none') {
                                eventManager.fireEvent(BatchFormOpenedEvent);
                                editFormEl.css('display', 'block');
                            } else {
                                eventManager.fireEvent(BatchFormClosedEvent);
                                editFormEl.css('display', 'none');
                            }
                        });

                        $scope.containerElement = $element;
                    });
                }
            }
        }
    ]).directive('gridBatchEditBlocks', ['$compile', '$rootScope', 'configService', 'filesystemService',
        'fieldService', 'objectDetailService', 'batchEditService', 'gridWidgetService',
        'objectService', 'objectEditService', 'eventManager', 'localizationService',
        'detailPageFieldValuesService',
        function ($compile, $rootScope, configService, filesystemService, fieldService,
                  objectDetailService, batchEditService, gridWidgetService, objectService,
                  objectEditService, eventManager, localizationService,
                  detailPageFieldValuesService) {

            var gConfig = configService.getGlobalConfig();

            return {
                templateUrl: configService.getTemplateUrl('Grid/BatchEdit/BatchForm.html'),
                restrict: "EA",
                replace: true,
                controller: function ($scope, $element, $attrs, $transclude) {
                    if ($scope.fields && $scope.fields.length) {
                        // hack to use kendo template in angular
                        // wrap <script> in div
                        var contentTpl = angular.element('#oeDetailsBlock', $element);
                        var tpl = kendo.template(contentTpl.html());
                        // add helpers to template
                        $scope.fields[0].helpers = {
                            'getPluginImageUrl': filesystemService.getPluginImageUrl
                        };
                        // translations
                        $scope.fields[0].editBtnTitle = localizationService.translate('Buttons.Update');
                        var rendered = kendo.render(tpl, $scope.fields);
                        $element.html(rendered);
                    }
                },
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    // init editors fields
                    fieldService.initializeEditors($scope.fields[0], $element);
                    // bind related object search click
                    $element.find('._objRelButton').click(function (e) {
                        var target = angular.element(e.currentTarget);
                        var value = target.parent().find('input[id^="txt"]').val();
                        objectDetailService.openRelationalRecordPopup(target, $scope.fields[0], value);
                        // Not returning false caused page reloading
                        return false;
                    });
                    // filter fields for keyboard
                    var fieldsHash = batchEditService.fieldsArrayToHash($scope.fields[0]);
                    var dataTypes = gConfig.dataTypes;
                    // skip 'read-only fields' from tabbing
                    var allBlocks = $element.find('._keycontainer').filter(function (idx, block) {
                        var fieldName = $(block).attr("key");
                        var fieldProperties = fieldsHash[fieldName];
                        // skip some fields, like map
                        if (angular.isObject(fieldProperties) && fieldProperties.DataType) {
                            if (fieldProperties.DataType == dataTypes.GeoData ||
                                fieldProperties.DataType == dataTypes.AutoText) {
                                return false;
                            }
                        }
                        return !fieldService.isFieldReadOnly(fieldName);
                    });
                    var batchFormEl = $scope.containerElement.find('.batchEditForm');
                    // bind 'batch form open' handler
                    eventManager.addListener(BatchFormOpenedEvent, function () {
                        batchEditService.activateWidget(batchFormEl, $scope, null);
                    });
                    // bind 'batch form close' handler
                    eventManager.addListener(BatchFormClosedEvent, function () {
                        $rootScope.currentPageBlock = null;
                    });
                    // bind 'click' handler
                    batchFormEl.on('mousedown', function (e) {
                        var targetSimpleBlock = batchEditService.getTargetSimpleBlock($(e.target));
                        // check if click was 'outside' of edited input
                        if(targetSimpleBlock && !targetSimpleBlock.is($scope.selectedBlock)){
                            // if currently edited field has value
                            if(targetSimpleBlock){
                                // get dataType and property name of a field
                                var dataType = $scope.selectedBlock.attr('dtype');
                                var fieldName = $scope.selectedBlock.attr('key');
                                var value = detailPageFieldValuesService.getElementsValue($scope.selectedBlock,
                                    dataType, fieldName);
                                if (value != "" && value != undefined && value != null && value != ":" &&
                                    objectEditService.performValidation(batchFormEl, $scope.selectedBlock)) {
                                    $scope.selectedBlock.parent().find('.checkbox input').prop('checked', true);
                                }
                            }
                        }
                        batchEditService.activateWidget(batchFormEl, $scope, batchFormEl.find(e.target));
                    });
                    // bind 'tab' and 'enter' press
//                    $scope.containerElement.off('keydown');
                    $scope.containerElement.on('detailKeypress', function (e) {
                        batchEditService.bindKeyboardKeyPressEvt(e, $element, $scope, allBlocks);
                    });
                    // bind 'filter' btn
                    $element.find('._batchEditBtn').on('click', function (e) {
                        var userName = gConfig.userName;
                        batchEditService.getFieldsValues($element, $scope.fields[0], $scope.odn, userName).
                            then(function (fieldValuesObj) {
                                batchEditService.sendSaveRequest(fieldValuesObj, $scope)
                            });
                        return false;
                    });
                }
            }
        }
    ]).directive('gridBatchEditBtn', ['$rootScope', 'configService',
        function ($rootScope, configService) {
            return {
                templateUrl: configService.getTemplateUrl('Grid/BatchEdit/BatchEditBtnTemplate.html'),
                restrict: "EA",
                replace: true,
                controller: function ($scope) {
                    $scope.click = function () {
                        $rootScope.$broadcast(BatchEditBtnClickedEvent);
                    }
                }
            }
        }
    ]);
/**
 * Created by antons on 6/23/15.
 */
speedupGridModule.directive('gridToolbar', ['$timeout', 'configService', 'objectEditService', 'eventManager',
    function ($timeout, configService, objectEditService, eventManager) {

        return {
            templateUrl: function (tElement, tAttrs) {
                // TODO: get address of templates from options
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('Grid/Toolbar/GridToolbar.html');
            },
            restrict: "EA",
            replace: true,
            link: function ($scope, $element) {
                // give inner directives time to generate DOM
                $timeout(function () {
                    // bind 'create new' button click
                    $element.find('._btnAddNewRecord').click(function () {
                        if ($scope.odn) {
                            objectEditService.createNewObject($scope.odn);
                        }
                    });
                    // bind 'generic search' button click
                    $element.find('._objectSearchButton').click(function () {
                        var genericSearchStr = $element.find('._txtObjectSearch').val();
                        eventManager.fireEvent(FilterGridByGenericSearchEvent, {
                            odn: $scope.odn,
                            genericSearchStr: genericSearchStr
                        });
                    });
                    // bind 'generic search' enter click
                    $element.find('._txtObjectSearch').on('keydown', function (e) {
                        if (e.which == 13) {
                            var genericSearchInput = $element.find('._txtObjectSearch');
                            eventManager.fireEvent(FilterGridByGenericSearchEvent, {
                                odn: $scope.odn,
                                genericSearchStr: genericSearchInput.val()
                            });
                            genericSearchInput.select();
                        }
                    });
                });
            }
        }
    }
]);
/**
 * Created by C4off on 05.07.15.
 */
speedupGridModule.factory('gridWidgetService', [
    function () {
        var GridWidgetService = function () {
        };

        /// <summary>
        /// Method to get selected rows
        /// </summary
        GridWidgetService.getSelectedRows = function (gridElement) {
            var selectedRecords = [];
            var entityGrid = gridElement.data("kendoGrid");
            if (entityGrid) {
                gridElement.find(".k-grid-content tbody tr").each(function () {
                    var $row = $(this);

                    if ($row.find("._check_row").is(':checked')) {
                        selectedRecords.push(entityGrid.dataItem(this));
                    }
                });
            }

            return selectedRecords;
        };

        return GridWidgetService;
    }
]);
/**
 * Created by antons on 7/2/15.
 */
speedupObjectDetailModule.directive('tsHeaderSubObject', ['$timeout', 'configService',
    function ($timeout, configService) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('TabStrip/SubObject/TabStripHeaderSubObject.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            link: function ($scope, $element) {

            }
        }
    }
]);

/**
 * Created by antons on 7/2/15.
 */
speedupObjectDetailModule.factory('tsHeaderSubObjectService', ['$rootScope', '$compile',
    'configService',
    function ($rootScope, $compile, configService) {
        var gConfig = configService.getGlobalConfig();
        var _defaultGridParameters = {
            selectedPage: 0,
            filterExpression: "",
            genericSearch: "",
            refreshButton: true,
            recordCountFilterExpression: '',
            gridHeight: 400,
            pageSize: gConfig.gridPageSize,
            columnWidth: 100,
            columnMinWidth: 150,
            columnMaxWidth: "auto",
            showEditButton: false,
            showSelectButton: false,
            showDeleteButton: false,
            showFirstRecord: true,
            showCheckboxForRowSelection: false
        };

        var TsHeaderSubObjectService = function () {};

        /// <summary>
        /// Method to create a subobject page in tabstrip tab
        /// </summary>
        /// <param name="container">tabstrip container for new tab</param>
        /// <param name="odn">object definition name</param>
        /// <param name="pageTemplateName">name of the page template</param>
        /// <param name="mainRecordId">id of main record</param>
        /// <param name="propertyName">name of the sub-object</param>
        TsHeaderSubObjectService.createSubObjectPage = function (container, odn, pageTemplateName, mainRecordId, propertyName) {
            // do not re-create the grid if we have already opened this tab once
            if(container.find('.tabStripHeaderRelatedObjectContainer').length){
                return;
            }
            var tpl = angular.element('<ts-header-sub-object></ts-header-sub-object>');

            container.prepend(tpl);
            var scope = $rootScope.$new();
            // get grid options
            scope.gridParameters = _defaultGridParameters;
            // add filter expression
            scope.gridParameters.filterExpression = " [" + propertyName + "] Like '" + mainRecordId + ":%' ";
            scope.gridParameters.odn = odn;
            scope.gridParameters.displayMode = {
                type: 'element',
                element: container.find('.tabStripRelatedPropertyDetailContainer')
            };
            $compile(tpl)(scope);
        };

        return TsHeaderSubObjectService;
    }
]);
/**
 * Created by Мама on 07.06.15.
 */
var speedupConversionBar = angular.module('speedup.conversionBar', ['speedup.CSVModule']);
/**
 * Created by antons on 7/3/15.
 */
speedupConversionBar.factory('conversionBarService', ['$q', '$http', 'configService',
    'conversionCacheService',
    function ($q, $http, configService, conversionCacheService) {
        var gConfig = configService.getGlobalConfig();
//        var dataTypes = gConfig.dataTypes;
        // Cached properties
//        var _conversionListData = [];

        var ConversionBarService = function () {
        };

        ConversionBarService.bindConversionBar = function (container, odn) {
            ConversionBarService.getObjectConversionList(odn).then(function (list) {
                ConversionBarService.bindConversionList(container, list);
            });
        };
        // TODO: edit comments
        /// <summary>
        /// Method which will bind the conversion list in dropdown
        /// <param name="list">list of items</param>
        /// </summary>
        ConversionBarService.bindConversionList = function (container, list) {
            container.find("input._selectConversionType").kendoDropDownList({
                dataTextField: "RecordName",
                dataValueField: "RecordID",
                filter: "contains",
                ignoreCase: true,
                dataSource: list
            });
        };
        // TODO: edit comments
        /// <summary>
        /// Method which will get the object conversion list
        /// <param name="objectDefinitionName">definition name</param>
        /// <param name="callbackFnk">function to be executed</param>
        /// </summary>
        ConversionBarService.getObjectConversionList = function (odn) {
            var deferred = $q.defer();

            var objConversion = conversionCacheService.getConversionObject(odn);
            if (objConversion) {
                deferred.resolve(objConversion.ConversionList);
            } else {
                var url = configService.getUrlBase('objectConversionList') + '/' + odn + '/' + gConfig.token;
                $http.get(url).success(function (response) {
                    conversionCacheService.preserveConversionObject({
                        ObjectDefinitionName: odn,
                        ConversionList: response
                    });

                    deferred.resolve(response);
                }).error(function () {
                        // previously it was here, I don't like it
//                        conversionCacheService.preserveConversionObject({
//                        ObjectDefinitionName: odn,
//                        ConversionList: null
//                    });

                        deferred.reject('Error loading conversion list for object \'' + odn + '\'');
                    });

            }

            return deferred.promise;
        };
//        // TODO: do me
//        /// <summary>
//        /// method will show detail of conversion object.
//        /// <param name="recordId">record id of object</param>
//        /// <param name="objectDefinitionName">definition name of object</param>
//        /// <param name="currentObject">dom element</param>
//        /// </summary>
//        ConversionBarService.viewConversionRecordDetail = function (recordId, objectDefinitionName, currentObject) {
//
//            //  $.config.IsPopUp = true;
//            if ($(document).find("#objectConversionRecordWnd").length == 0) {
//                $(currentObject).parent().append('<div id="objectConversionRecordWnd"/>');
//            }
//            var contianer = $(document).find("#objectConversionRecordWnd");
//            var displayType = $.config.DetailDisplayType.ShowInPopup;
//            var conversionTool = false,
//                InlineEditing = false, dataItem = null, showDefaultPrintToolbar = false;
//            currentObject.PageTitle = $.config.CreatePageTitle(currentObject.settings.ObjectDefinitionName, recordId);
//
//            $.config.ViewSingleRecordDetail(contianer, recordId, objectDefinitionName, displayType, conversionTool, showDefaultPrintToolbar, InlineEditing, dataItem, currentObject);
//        }
        // todo: edit doc
        /// <summary>
        /// Method which will get print template html
        /// <param name="printTemplateID">Print template Id for which html we get</param>
        /// <param name="callBack">function to be executed</param>
        /// </summary>
        ConversionBarService.runObjectConversion = function (conversionId, odn, recordsIds) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('runObjectConversion') + '/' + odn +
                "/" + conversionId + "/" + gConfig.token;

            var dataToSend = [];
            recordsIds.forEach(function (recordId) {
                dataToSend.push({
                    "ObjectRecordID": recordId,
                    "RequestType": "roc"
                });
            });

            if (dataToSend.length > 0)
                $http.post(url, JSON.stringify(dataToSend))
                    .success(function (response) {
                        // if we have id in response - resolve it
                        if (response && response.NewRecordID) {
                            deferred.resolve(response);
                        }
                        else if (response && response.ConversionMessage) {
                            // if we have error message - reject
                            if (response.ConversionMessage.indexOf("ERROR") > -1 || response.ConversionMessage.indexOf("EXCEPTION") > -1) {
                                deferred.reject(response.ConversionMessage);
                            }
                            else {
                                // if we have no id and no error message - resolve,
                                // maybe everything is ok (put in queue or smth.)
                                deferred.resolve(response);
                            }
                        }
                        else {
                            deferred.reject();
                        }
                    }).error(function () {
                        deferred.reject();
                    });

            return deferred.promise;
        };


        return ConversionBarService;
    } ]);
/**
 * Created by C4off on 05.07.15.
 */
CSVapp.factory('conversionCacheService', [
    function () {

        var _conversionListData = [];

        var ConversionCacheService = function(){}

        ConversionCacheService.getConversionObject = function (ObjectDefinitionName) {
            return _conversionListData.filter(function (obj) {
                if (obj.ObjectDefinitionName == ObjectDefinitionName) {
                    return obj
                }
            })[0];
        };

        // CHECKED
        ConversionCacheService.preserveConversionObject = function(conversionObject) {
            var objconversion = _conversionListData.filter(function (obj) {
                if (conversionObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (objconversion == null || objconversion == undefined) {
                _conversionListData.push(conversionObject);
            }
        };

        return ConversionCacheService;
    }
]);
/**
 * Created by antons on 7/3/15.
 */
speedupConversionBar.directive('conversionBar', ['configService', 'conversionBarService',
    'gridWidgetService', 'localizationService', 'notificationService', 'existingObjectDetailService',
    'eventManager',
    function (configService, conversionBarService, gridWidgetService, localizationService, notificationService,
              existingObjectDetailService, eventManager) {
        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('ConversionBar/ConversionBar.html');
            },
            restrict: "EA",
            replace: true,
            link: function ($scope, $element) {
                var odn = $scope.gridParameters.odn;
                conversionBarService.bindConversionBar($element, odn);
                $element.find("._btnObjectConversion").click(function (e) {
                    var control = $element.find("input._selectConversionType").data("kendoDropDownList")
                    if (control != null && control.value().length > 0) {
                        var gConfig = configService.getGlobalConfig();
                        var gridElement = angular.element(gConfig.gridContainer);
                        if (gridElement.length) {
                            var selectedRows = gridWidgetService.getSelectedRows(gridElement);
                            var selectedRowIds = [];
                            selectedRows.forEach(function (rowData) {
                                if (rowData.ObjectEntry_ID) {
                                    selectedRowIds.push(rowData.ObjectEntry_ID);
                                }
                            });
                            if (selectedRowIds.length) {
                                // display loader
                                eventManager.fireEvent(LoadActionStartEvent);

                                conversionBarService.runObjectConversion(control.value(),
                                        odn, selectedRowIds)
                                    .then(function (response) {
                                        // hide loader
                                        eventManager.fireEvent(LoadActionEndEvent);

                                        var msg = localizationService.translate('Messages.ConversionSuccessfully');
                                        notificationService.showNotification(msg);
                                        if(response.NewRecordID && response.NewRecordObjectDefinitionName){
                                            // display new object detail in popup
                                            existingObjectDetailService.displayObjectDetail(response.NewRecordID,
                                            response.NewRecordObjectDefinitionName, {
                                                    type: 'popup'
                                                })
                                        }
                                    }, function(){
                                        eventManager.fireEvent(LoadActionEndEvent);

                                        var msg = localizationService.translate('Messages.ConversionFailed');
                                        notificationService.showNotification(msg, true);
                                    });
                            } else{
                                var msg = localizationService.translate('Messages.NoRecordsForConversion');
                                alert(msg);
                            }
                        }
                    }
                });
            }
        };
    }]);
/**
 * Created by Мама on 07.06.15.
 */
var speedupPrintBar = angular.module('speedup.printBar', ['speedup.CSVModule']);
/**
 * Created by C4off on 05.07.15.
 */
CSVapp.factory('printTemplateCacheService', [
    function () {

        var _objectPrintTemplateData = [];

        var PrintTemplateCacheService = function(){}

        PrintTemplateCacheService.getPrintTemplate = function(odn) {
            return _objectPrintTemplateData.filter(function (obj) {
                if (obj.ObjectDefinitionName == odn) {
                    return obj
                }
            })[0];
        };

        //CHECKED
        PrintTemplateCacheService.preservePrintTemplateObject = function(printTemplateObject) {
            var objPrintTmpl = _objectPrintTemplateData.filter(function (obj) {
                if (printTemplateObject.ObjectDefinitionName == obj.ObjectDefinitionName) {
                    return obj
                }
            })[0];
            if (objPrintTmpl == null || objPrintTmpl == undefined) {
                _objectPrintTemplateData.push(printTemplateObject);
            }
        };

        return PrintTemplateCacheService;
    }
]);
/**
 * Created by antons on 7/3/15.
 */
speedupPrintBar.factory('printBarService', ['$q', '$http', '$compile', '$rootScope', 'configService',
    'printTemplateCacheService', 'gridWidgetService', 'localizationService',
    'notificationService', 'popupService', 'eventManager',
    function ($q, $http, $compile, $rootScope, configService, printTemplateCacheService,
              gridWidgetService, localizationService, notificationService, popupService,
              eventManager) {
        var gConfig = configService.getGlobalConfig();

        var PrintBarService = function () {
        };

        /// <summary>
        /// Method which will bind template list to the 'print' element in print toolbar
        /// <param name="odn">definition name</param>
        /// <param name="container">print element container</param>
        /// </summary>
        PrintBarService.bindPrint = function (odn, container) {
            return PrintBarService.getPrintTemplateList(odn).then(function (templateList) {
                return PrintBarService.bindPrintTemplList(container, templateList, null);
            });
        };
        /// <summary>
        /// Method to display popup with print template
        /// <param name="odn">definition name</param>
        /// <param name="value">print type (value of control)</param>
        /// </summary>
        PrintBarService.displayPrintTemplate = function (odn, value) {
            //get selected records
            var gridElement = angular.element(gConfig.gridContainer);
            var selectedRows = gridWidgetService.getSelectedRows(gridElement);
            var selectedRowIds = [];
            selectedRows.forEach(function (rowData) {
                if (rowData.ObjectEntry_ID) {
                    selectedRowIds.push(rowData.ObjectEntry_ID);
                }
            });
            if (selectedRowIds.length) {
                eventManager.fireEvent(LoadActionStartEvent);
                _getPrintTemplateHtml(odn, value, selectedRowIds).then(function (content) {
                    _displayPrintTemplatePopup(content);
                }, function () {
                    var msg = localizationService.translate("Messages.UnableToCreatePrintTemplate");
                    notificationService.showNotification(msg, true);
                });
            }
        };

        /// <summary>
        /// Method which will get the print template list
        /// <param name="odn">definition name</param>
        /// </summary>
        PrintBarService.getPrintTemplateList = function (odn) {
            var deferred = $q.defer();

            var printTemplateObject = printTemplateCacheService.getPrintTemplate(odn);
            if (printTemplateObject) {
                deferred.resolve(printTemplateObject.PrintTemplateList);
            }
            else {
                var url = configService.getUrlBase('objectPrintTemplateList') + "/" + odn + "/" + gConfig.token;
                $http.get(url).success(function (response) {
                    printTemplateCacheService.preservePrintTemplateObject({
                        ObjectDefinitionName: odn,
                        PrintTemplateList: response
                    });

                    deferred.resolve(response);
                }).error(function () {
                        deferred.reject();
                    });
            }

            return deferred.promise;
        };
        /// <summary>
        /// Method which will bind the print template list in dropdown
        /// <param name="container">dom element of 'print' dropdown</param>
        /// <param name="list">list of items</param>
        /// <param name="selectedValue">selected value</param>
        /// <param name="onChange">on change callback</param>
        /// </summary>
        PrintBarService.bindPrintTemplList = function (container, list, selectedValue, onChange) {
            container.find("input._printTemplList").kendoDropDownList({
                dataTextField: "RecordName",
                dataValueField: "RecordID",
                filter: "contains",
                ignoreCase: true,
                dataSource: list,
                change: onChange,
                value: selectedValue
            });
        };

        /// <summary>
        /// Method which will get print template html fro API
        /// <param name="odn">object definition name</param>
        /// <param name="printTemplateID">Print template Id for which html we get</param>
        /// <param name="recordIds">ids of selected records</param>
        /// </summary>
        function _getPrintTemplateHtml(odn, printTemplateID, recordIds) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('objectPrintTemplateHTML') + "/" +
                odn + "/" + printTemplateID + "/" + gConfig.token;
            var dataToSend = [];
            recordIds.forEach(function (recordId) {
                dataToSend.push({
                    ObjectRecordID: recordId,
                    RequestType: "opth"
                });
            });
            if (dataToSend.length) {
                $http.post(url, JSON.stringify(dataToSend))
                    .success(function (str) {
                        str = _convertjEsc2Char(str, false);
                        str = str.replace(/(\r\n|\n|\r)/gm, "");
                        str = str.replace(/\\/g, '');
                        str = str.substring(0, str.length - 1);

                        deferred.resolve(str);
                    })
                    .error(function () {
                        deferred.reject();
                    });
            }

            return deferred.promise;
        }

        /// <summary>
        /// Method which will display the print window
        /// <param name="content"> to display</param>
        /// </summary>
        function _displayPrintTemplatePopup(content) {
            // generate directive for print template
            var tpl = angular.element('<print-template></print-template>');
            tpl.append(angular.element('<div></div>').html(content));
            var scope = $rootScope.$new();
            var tplFn = $compile(tpl);

            var title = localizationService.translate('Headers.PrintRecord');

            scope.modalInstance = popupService.displayPrintTemplatePopup(title, tpl);
            tplFn(scope);
        }
        /// <summary>
        /// Method which will help converting the template
        /// <param name="str"></param>
        /// <param name="shortEscapes"></param>
        /// </summary>
        function _convertjEsc2Char(str, shortEscapes) {
            // converts a string containing JavaScript or Java escapes to a string of characters
            // str: string, the input
            // shortEscapes: boolean, if true the function will convert \b etc to characters

            // convert \U and 6 digit escapes to characters
            str = str.replace(/\\U([A-Fa-f0-9]{8})/g,
                function (matchstr, parens) {
                    return hex2char(parens);
                }
            );
            // convert \u and 6 digit escapes to characters
            str = str.replace(/\\u([A-Fa-f0-9]{4})/g,
                function (matchstr, parens) {
                    return hex2char(parens);
                }
            );
            // convert \b etc to characters, if flag set
            if (shortEscapes) {
                //str = str.replace(/\\0/g, '\0');
                str = str.replace(/\\b/g, '\b');
                str = str.replace(/\\t/g, '\t');
                str = str.replace(/\\n/g, '\n');
                str = str.replace(/\\v/g, '\v');
                str = str.replace(/\\f/g, '\f');
                str = str.replace(/\\r/g, '\r');
                str = str.replace(/\\\'/g, '\'');
                str = str.replace(/\\\"/g, '\"');
                str = str.replace(/\\\\/g, '\\');
            }
            return str;
        }

        return PrintBarService;
    }]);
/**
 * Created by antons on 7/3/15.
 */
speedupPrintBar.directive('printBar', ['configService', 'printBarService',
        function (configService, printBarService) {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl ||
                        configService.getTemplateUrl('PrintBar/PrintBar.html');
                },
                restrict: "EA",
                replace: true,
                transclude: true,
                link: function ($scope, $element) {
                    var odn = $scope.gridParameters.odn;
                    printBarService.bindPrint(odn, $element).then(function () {
                        // bind button click
                        $element.find('._btnDisplayObjectTempl').click(function () {
                            var control = $element.find("input._printTemplList").data("kendoDropDownList")
                            if (control != null && control.value().length > 0) {
                                printBarService.displayPrintTemplate(odn, control.value());
                            }
                        });
                    });
                }
            };
        }]).directive('printTemplate', ['$modalStack', 'configService', 'eventManager',
        function ($modalStack, configService, eventManager) {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl ||
                        configService.getTemplateUrl('PrintBar/PrintTemplate.html');
                },
                restrict: "EA",
                transclude: true,
                replace: true,
                link: function ($scope, $element) {
                    var content = $element.find('#printTemplContainer').html();
                    $("#hdnprintcontent").remove();
                    var div = $("._dynamicNoprintdiv");
                    div.contents().unwrap();
                    $('body').wrapInner('<div class="noprintable _dynamicNoprintdiv" />');
                    $('body').append('<div class="printable" id="hdnprintcontent"/>');
                    $("#objectPrintTmplWnd").find("#printTemplContainer").html(content);
                    $("#hdnprintcontent").html(content);
                    $element.find('._btnPrintTemplate').click(function () {
                        window.print();
                    });
                    $scope.modalInstance.result.then(function (result) {
                        var div = $("._dynamicNoprintdiv");
                        div.contents().unwrap();
                    }, function () {
                        $('.k-overlay:visible').remove()
                        var div = $("._dynamicNoprintdiv");
                        div.contents().unwrap();
                    });
                    eventManager.fireEvent(LoadActionEndEvent);
                    // TODO: paste 'onChange' code
                }
            };
        }]);
