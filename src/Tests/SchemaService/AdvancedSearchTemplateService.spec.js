/**
 * Created by C4off on 16.10.15.
 */
describe("Advanced search template service test", function() {
    beforeEach(function () {
        //Ensure angular modules available
        module('speedup.CSVModule');
    });
    // inject
    var asTemplateSrvc = null;
    beforeEach(inject(function (_advancedSearchTemplateService_) {
        asTemplateSrvc = _advancedSearchTemplateService_;
    }));
    it('should have Advanced search template service  be defined', function () {
        expect(asTemplateSrvc).toBeDefined();
    });
});
