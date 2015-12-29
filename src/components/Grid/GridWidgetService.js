/**
 * Created by C4off on 05.07.15.
 */
speedupGridModule.factory('gridWidgetService', [
    function () {
        var GridWidgetService = function () {
        };

        /// <summary>
        /// Method to get selected rows
        /// </summary
        GridWidgetService.getSelectedRows = function (gridElement) {
            var selectedRecords = [];
            var entityGrid = gridElement.data("kendoGrid");
            if (entityGrid) {
                gridElement.find(".k-grid-content tbody tr").each(function () {
                    var $row = $(this);

                    if ($row.find("._check_row").is(':checked')) {
                        selectedRecords.push(entityGrid.dataItem(this));
                    }
                });
            }

            return selectedRecords;
        };

        return GridWidgetService;
    }
]);