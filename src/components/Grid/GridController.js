/**
 * Created by Мама on 07.06.15.
 */
speedupGridModule.controller("GridController", ['$scope', 'configService',
    function ($scope, configService) {
        var gConfig = configService.getGlobalConfig();
        var odn = gConfig.objectDefinitionName;

        $scope.gridParameters = {
            odn: odn,
            selectedPage: 0,
            perspectiveFilter: gConfig.perspectiveFilter,
            filterExpression: "",
            genericSearch: "",
            refreshButton: true,
            recordCountFilterExpression: '',
            gridHeight: 400,
            pageSize: gConfig.gridPageSize,
            columnWidth: "auto",
            columnMinWidth: 150,
            columnMaxWidth: "auto",
            showEditButton: false,
            showSelectButton: false,
            showDeleteButton: false,
//            SelectedColumns: GetSelectedColumnsArray(pageConfig.selectedColumns), //["Name","Text_Property_Name","TextBox_Property_Name","RichTextBox_Property_Name","Date_Property_Name"]
            selectFirstRecord: false,
            showCheckboxForRowSelection: true,
            toolbar: $scope.gridToolbar || false,
            displayMode: gConfig.objectDetailDisplayType,
            pageTemplateName: gConfig.pageTemplateName,
            odPageSize: gConfig.objectDetailPageSize,
            showFirstRecord: gConfig.showFirstRecord,
            batchUpdate: gConfig.batchUpdate
        };
    }]);