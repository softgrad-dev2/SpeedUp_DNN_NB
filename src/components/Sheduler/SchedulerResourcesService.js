/**
 * Created by C4off on 27.10.15.
 */
speedupSchedulerModule.factory('schedulerResourcesService', ['$q', 'configService', 'fieldPropertiesService',
    'autocompleteService', 'localizationService',
    function ($q, configService, fieldPropertiesService, autocompleteService, localizationService) {

        var schedulerConfig = configService.getSchedulerConfig();
        var gConfig = configService.getGlobalConfig();
        var dataTypes = gConfig.dataTypes;

        // colors for different resource values
        var _colors = [
            // first row is for unassigned events
            { present: '#97cff2', passed: 'rgba(151, 207, 242, 0.51)' },
            { present: '#2e9dc8', passed: 'rgba(46, 157, 200, 0.51)' },
            { present: '#C83DA0', passed: 'rgba(200, 142, 185, 0.51)' },
            { present: '#AF1CC8', passed: 'rgba(175, 28, 200, 0.51)' },
            { present: '#7C36C8', passed: 'rgba(124, 54, 200, 0.51)' },
            { present: '#2E2BC8', passed: 'rgba(46, 43, 200, 0.51)' },
            { present: '#4484C8', passed: 'rgba(68, 132, 200, 0.51)' },
            { present: '#2DA9C8', passed: 'rgba(45, 169, 200, 0.51)' },
            { present: '#38C8BF', passed: 'rgba(56, 200, 191, 0.51)' },
            { present: '#27C880', passed: 'rgba(39, 200, 128, 0.51)' },
            { present: '#3CC837', passed: 'rgba(60, 200, 55, 0.51)' },
            { present: '#96C838', passed: 'rgba(150, 200, 56, 0.51)' },
            { present: '#C8C52B', passed: 'rgba(200, 197, 43, 0.51)' },
            { present: '#C88B1A', passed: 'rgba(200, 139, 26, 0.51)' },
            { present: '#C8581F', passed: 'rgba(200, 88, 31, 0.51)' },
            { present: '#C8412E', passed: 'rgba(200, 65, 46, 0.51)' },
            { present: '#C80000', passed: 'rgba(187, 6, 0, 0.51)' },
            { present: '#00C800', passed: 'rgba(0, 200, 0, 0.50)' },
            { present: '#0000C8', passed: 'rgba(0, 0, 200, 0.50)' },
            { present: '#5750C8', passed: 'rgba(87, 80, 200, 0.50)' },
            { present: '#BBBBBB', passed: 'rgba(187, 187, 187, 0.51)' }
        ];

        var SchedulerResourcesService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// creaetes 'resources' option for scheduler widget parameters
        /// </summary>
        /// <param name="odn">object definition name</param>
        SchedulerResourcesService.getResources = function (odn) {
            var deferred = $q.defer();

            // get resource field from config.
            var resourceFieldCfg = schedulerConfig.resourceField;
            if (!resourceFieldCfg) {
                deferred.resolve([]);

                return deferred.promise;
            }
            var resourceField;
            // if string - find all properties
            if (typeof resourceFieldCfg == 'string') {
                resourceField = resourceFieldCfg;

                fieldPropertiesService.getAllPropertiesOfSingleFieldPromise(resourceField, odn).then(function (fieldProperties) {
                    var fieldType = fieldProperties.DataType;
                    if (fieldType == dataTypes.ParentRelationship ||
                        fieldType == dataTypes.ObjectRelationship) {
                        // get values from acData
                        var fieldId = fieldProperties.PropertyDefinition_ID;
                        var unsortedValues = autocompleteService.getValuesWithIds(fieldId);
                        // sort values
                        var values = unsortedValues.sort(function(a, b){
                            var aText = (""+a.text).toLowerCase();
                            var bText = (""+b.text).toLowerCase();
                            if(aText > bText){
                                return 1;
                            } else if(aText<bText){
                                return -1;
                            } else{
                                return 0;
                            }
                        });
                        var colorIdx = 1, colorArrLength = _colors.length;
                        var emptyValue = _getEmptyValue(fieldProperties.DataType);
                        var unassignedStr = localizationService.translate("Labels.Unassigned")
                        var dataSource = [{
                            text: unassignedStr,
                            value: emptyValue,
                            color: _colors[0]['present'],
                            // default value for resource panel
                            selected: true
                        }];
                        // for unassigned events
                        var dataSourcePassed = [{
                            text: unassignedStr,
                            value: emptyValue,
                            color: _colors[0]['passed']
                        }];
                        values.forEach(function (element) {
                            if (colorIdx >= colorArrLength) {
                                colorIdx = 1;
                            }
                            dataSource.push({
                                text: element.text,
                                value: element.id + ":" + element.text,
                                color: _colors[colorIdx]['present'],
                                // default value for resource panel
                                selected: true
                            });
                            dataSourcePassed.push({
                                text: element.text,
                                value: element.id + ":" + element.text,
                                color: _colors[colorIdx]['passed']
                            });
                            colorIdx++;
                        });

                        var resources = [
                            {
                                field: "eventEndPassed",
                                dataSource: dataSourcePassed,
                                title: "eventEndPassed"
                            },
                            {
                                field: resourceField,
                                dataSource: dataSource
                            }
                        ];
                    }

                    deferred.resolve(resources);
                });

            } else { // if is object - get values
                // todo: later
            }

            return deferred.promise;
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Returns empty value of particular field type
        /// </summary>
        /// <param name="dataType">field data type</param>
        function _getEmptyValue(dataType){
            switch (dataType) {
                case dataTypes.ParentRelationship:
                case dataTypes.ObjectRelationship:
                    return ":";
                default:
                    return "";
            }
        }

        return SchedulerResourcesService;
    }
]);