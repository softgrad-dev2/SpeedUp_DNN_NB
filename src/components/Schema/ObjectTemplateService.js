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