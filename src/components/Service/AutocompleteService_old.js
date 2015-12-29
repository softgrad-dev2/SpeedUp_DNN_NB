/**
 * Created by antons on 4/10/15.
 */
CSVapp.factory('autocompleteService', ['configService', function (configService) {
//    var gConfig = configService.getGlobalConfig();

    //cached ac data
    var _autocompleteData = [];

    var AutocompleteService = function () {
    };
    // PUBLIC METHODS
    // NOT REFACTORED
    AutocompleteService.GetValuesByPropertyId = function(propertyId){
        var data = [];
        if(config.autocompleteData){
            data = AutocompleteHelper.getDataSource(_autocompleteData, propertyId);
        }

        return data;
    };
    // NOT REFACTORED
    AutocompleteService.GetValuesByODN = function(odn){
        var data = [];
        if(!config.autocompleteData){
            config.autocompleteData = AutocompleteHelper.prepareACData(acData);
        }
        if(config.autocompleteData){
            data = AutocompleteHelper.getDataByODN(config.autocompleteData, odn);
        }

        return data;
    };
    // NOT REFACTORED
    AutocompleteService.wrapElement = function(element, propertyName, oID, acData, options){
        config.autocompleteFields = config.autocompleteFields || {};
        AutocompleteHelper.wrapSimpleElement(config.autocompleteFields, element, propertyName, oID, acData, options);
    }

    return AutocompleteService;
}]);