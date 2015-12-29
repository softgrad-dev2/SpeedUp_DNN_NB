/**
 * Created by antons on 7/3/15.
 */
speedupPrintBar.factory('printBarService', ['$q', '$http', '$compile', '$rootScope', 'configService',
    'printTemplateCacheService', 'gridWidgetService', 'localizationService',
    'notificationService', 'popupService', 'eventManager',
    function ($q, $http, $compile, $rootScope, configService, printTemplateCacheService,
              gridWidgetService, localizationService, notificationService, popupService,
              eventManager) {
        var gConfig = configService.getGlobalConfig();

        var PrintBarService = function () {
        };

        /// <summary>
        /// Method which will bind template list to the 'print' element in print toolbar
        /// <param name="odn">definition name</param>
        /// <param name="container">print element container</param>
        /// </summary>
        PrintBarService.bindPrint = function (odn, container) {
            return PrintBarService.getPrintTemplateList(odn).then(function (templateList) {
                return PrintBarService.bindPrintTemplList(container, templateList, null);
            });
        };
        /// <summary>
        /// Method to display popup with print template
        /// <param name="odn">definition name</param>
        /// <param name="value">print type (value of control)</param>
        /// </summary>
        PrintBarService.displayPrintTemplate = function (odn, value) {
            //get selected records
            var gridElement = angular.element(gConfig.gridContainer);
            var selectedRows = gridWidgetService.getSelectedRows(gridElement);
            var selectedRowIds = [];
            selectedRows.forEach(function (rowData) {
                if (rowData.ObjectEntry_ID) {
                    selectedRowIds.push(rowData.ObjectEntry_ID);
                }
            });
            if (selectedRowIds.length) {
                eventManager.fireEvent(LoadActionStartEvent);
                _getPrintTemplateHtml(odn, value, selectedRowIds).then(function (content) {
                    _displayPrintTemplatePopup(content);
                }, function () {
                    var msg = localizationService.translate("Messages.UnableToCreatePrintTemplate");
                    notificationService.showNotification(msg, true);
                });
            }
        };

        /// <summary>
        /// Method which will get the print template list
        /// <param name="odn">definition name</param>
        /// </summary>
        PrintBarService.getPrintTemplateList = function (odn) {
            var deferred = $q.defer();

            var printTemplateObject = printTemplateCacheService.getPrintTemplate(odn);
            if (printTemplateObject) {
                deferred.resolve(printTemplateObject.PrintTemplateList);
            }
            else {
                var url = configService.getUrlBase('objectPrintTemplateList') + "/" + odn + "/" + gConfig.token;
                $http.get(url).success(function (response) {
                    printTemplateCacheService.preservePrintTemplateObject({
                        ObjectDefinitionName: odn,
                        PrintTemplateList: response
                    });

                    deferred.resolve(response);
                }).error(function () {
                        deferred.reject();
                    });
            }

            return deferred.promise;
        };
        /// <summary>
        /// Method which will bind the print template list in dropdown
        /// <param name="container">dom element of 'print' dropdown</param>
        /// <param name="list">list of items</param>
        /// <param name="selectedValue">selected value</param>
        /// <param name="onChange">on change callback</param>
        /// </summary>
        PrintBarService.bindPrintTemplList = function (container, list, selectedValue, onChange) {
            container.find("input._printTemplList").kendoDropDownList({
                dataTextField: "RecordName",
                dataValueField: "RecordID",
                filter: "contains",
                ignoreCase: true,
                dataSource: list,
                change: onChange,
                value: selectedValue
            });
        };

        /// <summary>
        /// Method which will get print template html fro API
        /// <param name="odn">object definition name</param>
        /// <param name="printTemplateID">Print template Id for which html we get</param>
        /// <param name="recordIds">ids of selected records</param>
        /// </summary>
        function _getPrintTemplateHtml(odn, printTemplateID, recordIds) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('objectPrintTemplateHTML') + "/" +
                odn + "/" + printTemplateID + "/" + gConfig.token;
            var dataToSend = [];
            recordIds.forEach(function (recordId) {
                dataToSend.push({
                    ObjectRecordID: recordId,
                    RequestType: "opth"
                });
            });
            if (dataToSend.length) {
                $http.post(url, JSON.stringify(dataToSend))
                    .success(function (str) {
                        str = _convertjEsc2Char(str, false);
                        str = str.replace(/(\r\n|\n|\r)/gm, "");
                        str = str.replace(/\\/g, '');
                        str = str.substring(0, str.length - 1);

                        deferred.resolve(str);
                    })
                    .error(function () {
                        deferred.reject();
                    });
            }

            return deferred.promise;
        }

        /// <summary>
        /// Method which will display the print window
        /// <param name="content"> to display</param>
        /// </summary>
        function _displayPrintTemplatePopup(content) {
            // generate directive for print template
            var tpl = angular.element('<print-template></print-template>');
            tpl.append(angular.element('<div></div>').html(content));
            var scope = $rootScope.$new();
            var tplFn = $compile(tpl);

            var title = localizationService.translate('Headers.PrintRecord');

            scope.modalInstance = popupService.displayPrintTemplatePopup(title, tpl);
            tplFn(scope);
        }
        /// <summary>
        /// Method which will help converting the template
        /// <param name="str"></param>
        /// <param name="shortEscapes"></param>
        /// </summary>
        function _convertjEsc2Char(str, shortEscapes) {
            // converts a string containing JavaScript or Java escapes to a string of characters
            // str: string, the input
            // shortEscapes: boolean, if true the function will convert \b etc to characters

            // convert \U and 6 digit escapes to characters
            str = str.replace(/\\U([A-Fa-f0-9]{8})/g,
                function (matchstr, parens) {
                    return hex2char(parens);
                }
            );
            // convert \u and 6 digit escapes to characters
            str = str.replace(/\\u([A-Fa-f0-9]{4})/g,
                function (matchstr, parens) {
                    return hex2char(parens);
                }
            );
            // convert \b etc to characters, if flag set
            if (shortEscapes) {
                //str = str.replace(/\\0/g, '\0');
                str = str.replace(/\\b/g, '\b');
                str = str.replace(/\\t/g, '\t');
                str = str.replace(/\\n/g, '\n');
                str = str.replace(/\\v/g, '\v');
                str = str.replace(/\\f/g, '\f');
                str = str.replace(/\\r/g, '\r');
                str = str.replace(/\\\'/g, '\'');
                str = str.replace(/\\\"/g, '\"');
                str = str.replace(/\\\\/g, '\\');
            }
            return str;
        }

        return PrintBarService;
    }]);