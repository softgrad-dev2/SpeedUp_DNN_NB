/**
 * Created by C4off on 15.09.15.
 */
describe("SchemaService unit tests", function () {

    var WOPageTemplateObjectDflt = {
        ObjectDefinitionName: "Work_Order",
        PageTemplate: [
            {
                IsPublic: "1",
                IsSystemTemplate: "1",
                Name: "Default",
                ObjectDefinition: "1310396698027:Work_Order",
                ObjectDefinition_fk: 1364476860680,
                ObjectEntry_ID: 1369754150720,
                PageTemplateLabel: "Default",
                RecordFirstImagePath: "",
                RelatedObjectDisplayType: "DetailModePaging",
                RelatedObjectUnderMainRecord: "1310399481237:1352472264003:Work_Order_Detail;",
                RowNum: 1,
                SelectedColumnsForTemplate: ",[Name],[Customer],[Description],[Projekt],[Status],[Approved_By_WorkLeader],[CreatedBy],[CreatedDate],[Faktureringsperiod],[End_Date],[Estimated_Time_min]",
                SelectedRelatedObjectsForTemplate: "DocumentsAndAttachements;AutidTrail;1385400005430:1352472264003:TestObject;",
                TemplateOptions: "",
                oeIsDeleted: false,
                oeOrganizationID: 1352472264003,
                oeOwnerID: 16,
                oePortalID: 6
            }
        ]
    };
    var WOPageTemplateObjectUsrTpl = {
        ObjectDefinitionName: "Work_Order",
        PageTemplate: [
            {
                IsPublic: "1",
                IsSystemTemplate: "1",
                Name: "UserTemplate",
                ObjectDefinition: "1310396698027:Work_Order",
                ObjectDefinition_fk: 1364476860680,
                ObjectEntry_ID: 1369754150720,
                PageTemplateLabel: "User Template",
                RecordFirstImagePath: "",
                RelatedObjectDisplayType: "DetailModePaging",
                RelatedObjectUnderMainRecord: "1310399481237:1352472264003:Work_Order_Detail;",
                RowNum: 1,
                SelectedColumnsForTemplate: ",[Name],[Customer],[Description],[Status],[Approved_By_WorkLeader],[CreatedBy],[CreatedDate]",
                SelectedRelatedObjectsForTemplate: "DocumentsAndAttachements;AutidTrail;1385400005430:1352472264003:TestObject;",
                TemplateOptions: "",
                oeIsDeleted: false,
                oeOrganizationID: 1352472264003,
                oeOwnerID: 16,
                oePortalID: 6
            }
        ]
    };
    var WTPageTemplateObject = {
        ObjectDefinitionName: "Work_Order_Detail",
        PageTemplate: [
            {
                IsPublic: "1",
                IsSystemTemplate: "1",
                Name: "Default",
                ObjectDefinition: "1310399481237:Work_Order_Detail",
                ObjectDefinition_fk: 1364476860680,
                ObjectEntry_ID: 1414678747383,
                PageTemplateLabel: "Default",
                RecordFirstImagePath: "",
                RelatedObjectDisplayType: "DetailModeAll",
                RelatedObjectUnderMainRecord: "1322837065477:1352472264003:Time_Report;1366897444800:1352472264003:Reported_Material;1366897443843:1352472264003:Reported_Resource;",
                RowNum: 1,
                SelectedColumnsForTemplate: ",[Name],[Work_Order],[Status],[Activity_Task],[Start_Date],[End_Date],[Assigned_To],[Problem_Name],[Description],[Platsinformation],[GeoPosition],[Approved_By_Employee],[Objekt_Type],[ActionCategory],[Item],[Others],[Atgard],[PerformedAction],[Ursprungsid],[Kommentar],[MeddelandeTillUtforare],[SourceRecordID]",
                SelectedRelatedObjectsForTemplate: "DocumentsAndAttachements;AutidTrail;",
                TemplateOptions: "",
                oeIsDeleted: false,
                oeOrganizationID: 1352472264003,
                oeOwnerID: 16,
                oePortalID: 6
            }
        ]
    };

    beforeEach(function () {
        //Ensure angular modules available
        module('speedup.CSVModule');
    });
    var schemaService;
    beforeEach(inject(function (_schemaService_) {
        schemaService = _schemaService_;
    }));
    // ensure service is injected
    it('should have Schema Service to be defined', function () {
        expect(schemaService).toBeDefined();
    });
    it('should return null for WO page template', function(){
        var tplObj = schemaService.GetPageTemplateObjByObjectDefinitionName("Work_Order");
        expect(tplObj).toBeNull();
    });
    it('should return default page template object for WO ', function(){
        schemaService.PreservePageTemplate(WOPageTemplateObjectDflt);
        var tplObj = schemaService.GetPageTemplateObjByObjectDefinitionName("Work_Order");
        expect(tplObj).toEqual(WOPageTemplateObjectDflt);
    });
    it('should null for page template object for WT', function(){
        var tplObj = schemaService.GetPageTemplateObjByObjectDefinitionName("Work_Order_Detail");
        expect(tplObj).toBeNull();
    });
    it('should get page template object for WT from API', function(){
        var tplObj = schemaService.GetPageTemplateObjByObjectDefinitionName("Work_Order_Detail", "UserTemplate");
        expect(tplObj).toBeNull();
    });
    describe('Mocked HTTP Requests', function() {

        var $httpBackend;

        beforeEach(inject(function($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');
            var params = + "/Work_Order_Detail/UserTemplate/" + pageConfig.token;
            $httpBackend.when('POST', 'http://localhost/speedup_dnn/desktopmodules/SpeedUp.ObjectManagement.API/OMAPI.svc/rest/ObjectPageLayout/'+params)
                .respond(200, WOPageTemplateObjectUsrTpl);
        }));


//
//        afterEach(function() {
//            $httpBackend.verifyNoOutstandingExpectation();
//            $httpBackend.verifyNoOutstandingRequest();
//        });


        it('should have sent a POST request to the getObjectTemplate API', function() {
            schemaService.GetObjectTemplateSettings("Work_Order_Detail");
            pageConfig.perspectivePageTemplate = {"Work_Order_Detail":"UserTemplate"};
            $httpBackend.expectPOST('http://localhost/speedup_dnn/desktopmodules/SpeedUp.ObjectManagement.API/OMAPI.svc/rest/ObjectPageLayout/');
            $httpBackend.flush();
        });

    });

});