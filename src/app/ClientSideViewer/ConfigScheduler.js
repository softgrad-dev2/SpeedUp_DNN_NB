/**
 * Created by C4off on 16.09.15.
 */
pageConfig = angular.merge({}, pageConfig, {
    objectDetailDisplayType: {
        type: 'popup'
    },
    showFirstRecord: false
//    // todo: remove stub
//    advancedSearchTpl:
//        "Main.Work_Order.Work_Order_Detail.Start_Date, " +
//        "Main.Work_Order.Work_Order_Detail.End_Date, " +
//        "Parent.Work_Order.Customer, " +
//        "Parent.Work_Order.Projekt, " +
//        "Parent.Work_Order.Status, " +
//        "Main.Work_Order.Work_Order_Detail.Status," +
//        "Main.Work_Order.Work_Order_Detail.Priority"
});

var SchedulerConfig = {
    mainObjectDefinitionName: pageConfig.objectDefinitionName,
    objectDefinitionName: "Work_Order_Detail", ///REQUIRED : Object Definition Name
    pageTemplateName: "Default",
    waitForFilter: true,
    schedulerHolder: "#Scheduler",
    height: 733,
    // Used to modify only time
    workDayStart: "2013/1/1 6:00 AM",
    workDayEnd: "2013/1/1 5:00 PM",
    startField: "Start_Date",
    endField: "End_Date",
    schedulerPopupHolder: "SchedulerPopupHolder",
    startEndDiff: 60,
    ObjectDetailDisplayMode: 'popup',
    numberOfDaysToAdd: 7,
    titleField: "Name",
    showResourcePanel: true,
    resourceField: "Assigned_To"
//    resourceField: pageConfig.hfSchedulerResourceField

//    tokenId: pageConfig.token,
//    userName: pageConfig.userName, ///REQUIRED : 'USERNAME_GRANTED_BY_API',
//    baseUrl: '/speedup_dnn/desktopmodules/SpeedUp.ObjectManagement.API/OMAPI.svc/rest',
////            GenericSearch: $.config.GenericSearchExpression,
//    genericSearch: "",
//    id: "ObjectEntry_ID",
//    filterExpression: "",
//    timezone: "Etc/UTC",
//    appContainer: "TopContainer",
//    gridContainer: "GridContainer",
//    mobile: false,

};