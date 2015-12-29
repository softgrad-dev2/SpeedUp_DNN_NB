/**
 * Created by Мама on 07.06.15.
 */
speedupGridModule.factory('gridHelper', ['$rootScope', '$compile', 'filesystemService',
    'gridFilterExpressionService', 'configService', 'notificationService', 'localizationService',
    'gridDataService', 'commonService', 'existingObjectDetailService', 'relatedObjectsService',
    'detailPageMapService', 'popupService', 'eventManager',
    function ($rootScope, $compile, filesystemService, gridFilterExpressionService, configService, notificationService, localizationService, gridDataService, commonService, existingObjectDetailService, relatedObjectsService, detailPageMapService, popupService, eventManager) {

        var gConfig = configService.getGlobalConfig();

        var GridHelper = function () {
        };
        /// <summary>
        /// method will show popup with map
        /// </summary>
        /// <param name="e">event</param>
        /// <param name="target">click target element</param>
        GridHelper.openMapPopup = function (e, target) {
            var $geoDataLink = $(target);
            var lat = $geoDataLink.data("lat");
            var long = $geoDataLink.data("long");
            var address = $geoDataLink.data("add");
            var zoomLevel = $geoDataLink.data("zoom");
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = false;
            var mapType = $geoDataLink.data("maptype");
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = false;
            var saveMapType = false;

            var html = "<div id='ObjectGeoDataPopUp' style='height:350px;width:500px'></div>"
            var mapDiv = "ObjectGeoDataPopUp";
            var modalInstance = popupService.displayMapPopup('Map', html);
            modalInstance.result.then(function (result) {
                $('#ObjectGeoDataPopUp').remove();
            }, function () {
                $('#ObjectGeoDataPopUp').remove();
            });

            setTimeout(function () {
                    detailPageMapService.initializeMap(lat, long, null, null, editable, mapDiv,
                        address, null, null, null, zoomLevel, mapType, saveZoomLevel, saveMapType,
                        false)
                }
                , 1000);
        };
        /// <summary>
        /// method will construct 'options' object fro grid
        /// </summary>
        /// <param name="parameters">parameters from callee</param>
        GridHelper.getGridOptions = function (parameters) {
            return {
                mobile: gConfig.mobileView,
                objectParameters: parameters,
                dataSource: {
//                    autoSync: true,
                    requestStart: _showLoading,
                    requestEnd: _hideLoading,
                    pageSize: gConfig.gridPageSize,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    isAfterSave: false,
                    selectedItem: [],
                    //serverGrouping: true,
                    //group: { field: "Text_Property_Name", dir: "desc" },
                    transport: {
                        read: {
                            cache: false,
                            url: configService.getUrlBase('objectRecordList') + "/" + gConfig.token,
                            type: "POST",
                            dataType: "json"
                        },
                        parameterMap: function (options) {
                            return GridHelper.parameterMap(options, parameters);
                        }
                    },
                    schema: null
                },
                height: parameters.gridHeight,
                scrollable: true,
                filterable: {
                    extra: true,
                    operators: {
                        string: {
                            startswith: "Starts with",
                            endswith: "Ends With",
                            eq: "Is equal to",
                            neq: "Is not equal to",
                            contains: "Contains"
                        },
                        date: {
                            eq: "Is equal to",
                            neq: "Is not equal to",
                            gte: "Is after or equal to",
                            lte: "Is before or equal to"

                        }
                    }
                }, sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                selectable: "multiple, row",
                reorderable: true,
                columnMenu: true,
                pageable: {
                    refresh: parameters.showEditButton
                },
                resizable: false,
                editable: gConfig.gridEditable,
//                TODO: deal
//                edit: GridHelper.edit,
                // THIS FILLS IN LATER
                columns: [],
                dataBound: function (e) {
                    GridHelper.dataBound(e, parameters);
                },
                change: function (e) {
                    GridHelper.selectRow(e, parameters);
                },
                toolbar: '<div class="gridToolbar"></div>'
            }
        };
        /// <summary>
        /// method will select the row by click on row checkbox
        /// </summary>
        /// <param name="e">click event</param>
        /// <param name="grid">grid widget</param>
        /// <param name="parameters">grid parameters</param>
        /// <param name="self">event 'this' link</param>
        GridHelper.selectRowByCheckbox = function (e, grid, parameters, self) {
            var rowsChecked = grid.element.find("tr.k-state-selected");

            var row = $(e.currentTarget).closest('tr');
            var selectedRowItem = grid.dataItem(row);

            var checked = self.checked;
            if (checked) {
                // no selected rows - select one
                if (!rowsChecked.length) {
                    GridHelper.showFirstRecord(selectedRowItem.ObjectEntry_ID, parameters);
                } else {
                    _hidePreviousDisplayer(parameters);
                }
                //-select the row
                row.addClass("k-state-selected");
            } else {
                //-remove selection
                row.removeClass("k-state-selected");
//                row.find('td').removeClass("k-state-selected");
                if (rowsChecked.length == 2) {
                    // get selected record, that's left
                    var selectedRowLeft = grid.element.find("tr.k-state-selected");
                    var selectedDataItemLeft = grid.dataItem(selectedRowLeft);
                    GridHelper.showFirstRecord(selectedDataItemLeft.ObjectEntry_ID, parameters);
                } else {
                    _hidePreviousDisplayer(parameters);
                }
            }
        };

        // TODO:
        /// <summary>
        /// method will select the row on click to the cell
        /// </summary>
        /// <param name="e">onChange event</param>
        /// <param name="parameters">grid parameters</param>
        GridHelper.selectRowsByIds = function (widget, ids) {
            debugger;
            if (!$.isArray(ids) && !ids.length) {
                return false;
            }
            var objectIdKey = SUConstants.ObjectId;
            //  for each row find data item
            $.each(widget.tbody.find('tr'), function () {
                var model = widget.dataItem(this);
                if ($.inArray(model[objectIdKey], ids) != -1) {
                    // select row in grid
                    $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                    // set checkbox
                    $(this).find('._check_row').prop('checked', true);
                }
            });
        }


        /// <summary>
        /// method will select the row on click to the cell
        /// </summary>
        /// <param name="e">onChange event</param>
        /// <param name="parameters">grid parameters</param>
        GridHelper.selectRow = function (e, parameters) {
            var grid = e.sender;
            var selectedCell = grid.select();
//            var checkBoxCellsClicked = selectedCell.find('._check_row');
//            if (checkBoxCellsClicked.length) {
//                checkBoxCellsClicked.click();
//            } else {
//                var selectedRow = selectedCell.closest('tr');
            var selectedRow = grid.select();
            // deselect all rows
            grid.element.find('._check_row').prop('checked', false);
//                grid.element.find('tr').removeClass("k-state-selected");
//            grid.element.find('td').removeClass("k-state-selected");
            // mark row as selected
            selectedRow.find('._check_row').prop('checked', true);
//                selectedRow.addClass("k-state-selected");
            // select records for conversion/print
            if (selectedRow.length > 1) {
                // hide previous object detail
                _hidePreviousDisplayer(parameters);
            } else {
                var currentDataItem = grid.dataItem(selectedRow);
                GridHelper.showFirstRecord(currentDataItem.ObjectEntry_ID, parameters);
            }
        };

        /// <summary>
        /// method will show the selected record in inline editing mode
        /// </summary>
        /// <param name="obj">current edited object</param>
        /// <param name="objField">object field</param>
        /// <param name="key">property name</param>
        /// <param name="cell">dom element</param>
        GridHelper.showRelationalRecord = function (dataType, inputSettings, fieldName, container, model) {
            var dataTypes = gConfig.dataTypes;
            // TODO: do me!!!
            var dropdownList = null;
            //var $container = $($thisDetail).find(obj).closest("._grideditBlock");
            //var key = $container.attr("key");
//            var dataType = objField.DataType;
            // var objField = $config.GetAllPropertiesOfField(key, $thisDetail.settings.ObjectDefinitionName);
            var inputValue = "";
            var objectDefId;
            if (dataType == dataTypes.MultiObjectRelationshipField) {
                dropdownList = $(container).find("#ddl" + fieldName).data("kendoDropDownList");
                inputValue = dropdownList.text();
            }
            else {
                inputSettings = inputSettings.split(':');
                if (inputSettings.length > 0) {
                    objectDefId = inputSettings[0];
                    inputValue = inputSettings[1];
                }
            }
            var odn = inputValue;
            return relatedObjectsService.openRelatedObjectPopup(fieldName, odn, objectDefId, container,
                function (EventData) {
                    var itemId = EventData.ObjectEntry_ID;
                    var name = EventData.Name
                    var value = itemId + ':' + name;
                    if (dataType.MultiObjectRelationshipField == dataType) {
                        if (dropdownList != null) {
                            value = value + ":" + dropdownList.value() + ":" + dropdownList.text();
                        }
                    }
                    if (model != undefined && model != null) {
                        $(container).find('#txt' + fieldName).val(name);
                        model.set(fieldName, value);
                    }
                });
        };
        /// <summary>
        /// method will be called on grid 'destroy'
        /// </summary>
        /// <param name="gridContainer">container of the grid</param>
        GridHelper.gridDestroy = function (gridContainer) {
            gridContainer.data("kendoGrid").destroy(); // destroy the Grid
            gridContainer.empty(); // empty the Grid content (inner HTML)
        };
        /// <summary>
        /// method will be called on grid dataBound event
        /// </summary>
        /// <param name="e">grid event</param>
        /// <param name="parameters">grid parameters object</param>
        GridHelper.dataBound = function (e, parameters) {

            var gridWidget = e.sender;
            // bind 'karta' field click
            gridWidget.element.find("._viewObjectGeoData").off('click');
            gridWidget.element.find("._viewObjectGeoData").on('click', function (e) {
                GridHelper.openMapPopup(e, this);
            });

            // Show first record
            if (parameters.showFirstRecord && !gridWidget.refreshedWithoutAPICall) {
                var data = gridWidget.dataSource.data();
                if (data && data.length) {
                    var entryId = data[0].ObjectEntry_ID;
                    GridHelper.showFirstRecord(entryId, parameters);
                    // Find checkbox and select the row
                    var firstRow = gridWidget.tbody.find(">tr:first");
                    firstRow.find('._check_row').prop('checked', true);
                    firstRow.addClass("k-state-selected");
                }
            }
            // grid was refreshed without API call,
            // reset this flag
            if (gridWidget.refreshedWithoutAPICall) {
                gridWidget.refreshedWithoutAPICall = false;
            }
        };
        /// <summary>
        /// method to parse response from API
        /// </summary>
        /// <param name="response">API response</param>
        GridHelper.parse = function (response) {
            try {
                if (response != null && response.length > 0)
                    response = $.parseJSON(response);
                response.forEach(function (entry) {
                    _updateImage(entry);
                });
            }
            catch (ex) {
                var msg = localizationService.translate('Messages.InvalidJson');
                notificationService.showNotification(msg, true);
            }

            return response || "";
        };
        /// <summary>
        /// method called before API call to form parameters string for API call
        /// </summary>
        /// <param name="options">grid 'options' object(comes from event)</param>
        /// <param name="gridParameters">grid parameters object</param>
        GridHelper.parameterMap = function (options, gridParameters) {
            gridParameters.selectedPage = options.page - 1;
            var customFilter = "";
            // use perspective filter, if present
            var perspectiveFilter = angular.isObject(gConfig.perspectiveFilter) &&
                gConfig.perspectiveFilter[gridParameters.odn] ? gConfig.perspectiveFilter[gridParameters.odn] : "";
            if (perspectiveFilter && gridParameters.filterExpression) {
                customFilter = perspectiveFilter + " AND " + gridParameters.filterExpression;
            } else if (perspectiveFilter) {
                customFilter = perspectiveFilter;
            } else {
                customFilter = gridParameters.filterExpression;
            }

            var recordCountFilterExpression = (options.filter ? (' ' +
                gridFilterExpressionService.getFilterExpression(options.filter, options.filter.logic)) : '');
            if (recordCountFilterExpression == null || $.trim(recordCountFilterExpression) == "") {
                recordCountFilterExpression = customFilter;
            }
            else {
                customFilter = (customFilter == null || $.trim(customFilter)) == "" ? "" : customFilter + " AND ";
                recordCountFilterExpression = customFilter + recordCountFilterExpression;
            }
            // cache recordCountFilterExpression
            gridParameters.recordCountFilterExpression = recordCountFilterExpression;
            var parameters = {
                PageSize: options.pageSize,
                PageNumber: options.page - 1,
                Token: gConfig.token,
                RequestType: "Detail",
                ObjectDefinitionName: gridParameters.odn,
                OrderByExpression: options.sort ?
                    gridFilterExpressionService.getSortExpression(options.sort) :
                    gConfig.defaultSortOrder,
                FilterExpression: recordCountFilterExpression,
                SelectedGridColumns: "*",
                GenericSearch: gridParameters.genericSearch
            };
            // add advanced search custom filters, if present
            if (gridParameters.customASFilters) {
                parameters.customASFilters = gridParameters.customASFilters;
            }

            return JSON.stringify(parameters);
        };

        /// <summary>
        /// method that will show first record of the grid
        /// </summary>
        /// <param name="recordId">id of record</param>
        /// <param name="gridSettings">grid parameters object</param>
        // returns promise
        GridHelper.showFirstRecord = function (recordId, gridSettings) {
            // if grid is already displaying detail page
            // close it
            _hidePreviousDisplayer(gridSettings);

            var detailPageSettings = {
                odn: gridSettings.odn,
                pageTemplateName: gridSettings.pageTemplateName,
                // TODO: remove recordId, use currentRecord.id instead
                recordId: recordId,
                fieldEditMode: 'single',
                pageSize: gridSettings.pageSize,
                displayMode: gridSettings.displayMode,
                editMode: 'detail',
                currentRecord: {
                    id: recordId
                }
            };
            existingObjectDetailService.getObjectsWithSubObjects(detailPageSettings)
                .then(function (displayer) {
                    gridSettings.objectDetailDisplayer = displayer;
                });
        };
        /// <summary>
        /// method will hide previously opened detail page
        /// </summary>
        /// <param name="parameters">grid object parameters</param>
        function _hidePreviousDisplayer(parameters) {
            if (parameters.objectDetailDisplayer) {
                parameters.objectDetailDisplayer.close();
                parameters.objectDetailDisplayer = null;
            }
        }

        /// <summary>
        /// add new image icon field
        /// </summary>
        /// <param name="entry">object entry</param>
        function _updateImage(entry) {
            var iamgeName, img60Size;

            iamgeName = entry[SUConstants.RecordFirstImageColumn];
            img60Size = SUConstants.ImageSizes.h60;
            entry.image_h60 = filesystemService.changeImageUrlAndSize(iamgeName, img60Size);
        }

        /// <summary>
        /// method will show the loader bar.
        /// </summary>
        function _showLoading() {
            eventManager.fireEvent(LoadActionStartEvent);
        }

        /// <summary>
        /// method will hide the loader bar.
        /// </summary>
        function _hideLoading() {
            eventManager.fireEvent(LoadActionEndEvent);
        }

        return GridHelper;
    }]);