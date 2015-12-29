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
