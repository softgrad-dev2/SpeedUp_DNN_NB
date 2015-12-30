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