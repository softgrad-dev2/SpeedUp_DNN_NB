/**
 * Created by C4off on 16.09.15.
 */
pageConfig = angular.merge({}, pageConfig, {
    token: "FMSDGPQPLZKAGGFICMCK",
    JSONStructure: "{}",
    userName: "admin",
    objectDefinitionName: "Work_Order",
    selectedColumns: ",Name,Customer,Status,{FirstPicture},ChangedBy,ChangedDate,CreatedBy,CreatedDate,OrganizationID,OwnerID,PortalID,RecordType,Description,Customer_Manager,Faktureringsperiod",
    defaultSortOrder: "[CreatedDate] DESC",
    pageTemplateName: 'Default',
    perspectivePageTemplate: '',
    hfPerspectiveFilter: '',
    //            hfPerspectiveFilter: {"Work_Order": "[Customer] like '%asd%'", 'Work_Order_Detail': "[Start_Date] IS NOT NULL AND [Start_Date] <> '' AND SUBSTRING([Start_Date], 1, 4) = '2015' AND CONVERT(DATETIME2, [Start_Date]) >= CONVERT(DATETIME2, '2015-8-25')"},
    baseUrl: '/speedup_dnn/desktopmodules/SpeedUp.ObjectManagement.API/OMAPI.svc/rest'
});
var CSVapp = angular.module('speedup.CSVModuleTest',[]);