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


