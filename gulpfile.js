// Include gulp
var gulp = require('gulp');
// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
// ViewObjectDataGrid. Concatenate and minify JS
gulp.task('simpleGridPage', function() {
    var srcArray = [
            <!-- PAGE PARAMETERS -->
            'src/app/ClientSideViewer/configCommon.js',
            'src/app/ClientSideViewer/configGrid.js',
            <!-- HELPERS -->
            'src/components/Helpers/DateTimeHelper.js',
            'src/components/Common/common.js',
            <!-- ANGULAR BASED COMPONENTS-->
            'src/app/ClientSideViewer/CSVPageLogicController.js',
            'src/components/Localization/LocalizationModule.js',
            'src/components/Localization/languages/ObjectLanguage-sv-SE.js',
            'src/components/Exception/ExceptionHandler.js',
            'src/components/Service/CommonService.js',
            'src/components/Service/FieldService.js',
            'src/components/RelatedObjects/RelatedObjectsService.js',
            'src/components/RelatedObjects/RelatedObjectsDirective.js',
            'src/components/Service/EventManager.js',
            'src/components/Exception/Exceptions.js',
            'src/components/Service/DateTimeService.js',
            'src/components/Service/ObjectDataService.js',
            'src/components/Service/FieldPropertiesService.js',
            <!--ObjectDetail-->
            'src/components/ObjectDetail/module.js',
            'src/components/ObjectDetailDisplayer/ObjectDetailDisplayerService.js',
            'src/components/Map/DetailPageMapService.js',
            'src/components/ActionsList/ActionsListService.js',
            'src/components/ActionsList/ActionsListDirective.js',
            'src/components/TabStrip/AttachmentsService.js',
            'src/components/AnimationService/AnimationService.js',
            'src/components/ObjectDetail/DetailPageFieldService.js',
            'src/components/ObjectDetail/InlineFieldValueValidatorService.js',
            'src/components/ObjectDetail/InlineFieldValueSaverService.js',
            'src/components/ObjectDetail/FieldInlineEditService.js',
            'src/components/TabStrip/TabStripService.js',
            'src/components/TabStrip/TabStripDirective.js',
            'src/components/TabStrip/ObjectDetailAttachmentDirective.js',
            'src/components/ObjectDetail/DetailPageFieldValuesService.js',
            'src/components/ObjectDetail/ObjectDetailService.js',
            'src/components/ObjectDetail/ExistingObjectDetailService.js',
            'src/components/ObjectDetail/ObjectDetailDirective.js',
            'src/components/ActionsList/RepeatActionService.js',
            'src/components/ObjectRecurrence/ObjectRecurrenceDirective.js',
            <!--ObjectEdit-->
            'src/components/ObjectEdit/ObjectEditDirective.js',
            'src/components/ObjectEdit/ObjectEditService.js',
            <!-- BASIC SERVICES -->
            'src/components/Modal/ModalService.js',
            'src/components/Service/ObjectService.js',
            'src/components/Service/PropertySaverFactory.js',
            'src/components/ObjectDetail/DetailPageBlock.js',
            'src/components/Service/Events.js',
            'src/components/Notification/NotificationService.js',
            'src/components/Notification/NotificationPopupService.js',
            'src/components/Schema/ObjectTemplateService.js',
            'src/components/Schema/PageTemplateObjectCacheService.js',
            'src/components/Schema/PageTemplateObjectService.js',
            'src/components/Service/SchemaService.js',
            'src/components/Service/ConfigHelper.js',
            'src/components/Service/ConfigService.js',
            'src/components/Service/FilesystemService.js',
            'src/components/Service/AutocompleteService.js',
            'src/components/Service/PopupService.js',
            <!--advanced search component-->
            'src/components/Service/ListDataService.js',
            'src/components/AdvancedSearch/AdvancedSearchFilterExpressionService.js',
            'src/components/AdvancedSearch/AdvancedSearchService.js',
            'src/components/Schema/AdvancedSearchTemplateService.js',
            'src/components/AdvancedSearch/AdvancedSearchDirective.js',
            <!--filter component-->
            'src/components/Filter/FilterService.js',
            'src/components/Filter/FilterTabDirective.js',
            <!--grid component-->
            'src/components/Grid/module.js',
            'src/components/Grid/GridController.js',
            'src/components/Grid/GridRefreshService.js',
            'src/components/Grid/GridHelper.js',
            'src/components/Grid/GridColumnsService.js',
            'src/components/Grid/GridDataService.js',
            'src/components/Grid/GridDrective.js',
            'src/components/Grid/GridFilterExpressionService.js',
            'src/components/Grid/GridSchemaService.js',
            'src/components/Grid/BatchEdit/BatchEditService.js',
            'src/components/Grid/BatchEdit/BatchEditDirective.js',
            'src/components/Grid/Toolbar/GridToolbarDirective.js',
            'src/components/Grid/GridWidgetService.js',
            'src/components/TabStrip/SubObject/TabStripHeaderSubObjectDirective.js',
            'src/components/TabStrip/SubObject/TabStripHeaderSubObjectService.js',
            <!--Conversion bar-->
            'src/components/ConversionBar/module.js',
            'src/components/ConversionBar/ConversionBarService.js',
            'src/components/ConversionBar/ConversionCacheService.js',
            'src/components/ConversionBar/ConversionBarDirective.js',
            <!--Print bar-->
            'src/components/PrintBar/module.js',
            'src/components/PrintBar/PrintTemplateCacheService.js',
            'src/components/PrintBar/PrintBarService.js',
            'src/components/PrintBar/PrintBarDirective.js'
    ];
    return gulp.src(srcArray)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/ViewObjectDataGrid/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('build/ViewObjectDataGrid/js'));
});
// ViewObjectDataGrid. Concatenate and minify JS
gulp.task('schedulerPage', function() {
    var srcArray = [
            <!-- PAGE PARAMETERS -->
            'src/app/ClientSideViewer/configCommon.js',
            'src/app/ClientSideViewer/configScheduler.js',
            <!-- HELPERS -->
            'src/components/Helpers/DateTimeHelper.js',
            'src/components/Common/common.js',
            <!-- ANGULAR BASED COMPONENTS-->
            'src/components/Localization/LocalizationModule.js',
            'src/components/Localization/languages/ObjectLanguage-sv-SE.js',
            'src/components/Exception/ExceptionHandler.js',
            'src/app/ClientSideViewer/PageLogicController.js',
            'src/components/Service/CommonService.js',
            'src/components/Service/FieldService.js',
            'src/components/RelatedObjects/RelatedObjectsService.js',
            'src/components/RelatedObjects/RelatedObjectsDirective.js',
            'src/components/Service/EventManager.js',
            'src/components/Exception/Exceptions.js',
            'src/components/Service/DateTimeService.js',
            'src/components/Service/ObjectDataService.js',
            'src/components/Service/FieldPropertiesService.js',
            <!--ObjectDetail-->
            'src/components/ObjectDetail/module.js',
            'src/components/ObjectDetailDisplayer/ObjectDetailDisplayerService.js',
            'src/components/Map/DetailPageMapService.js',
            'src/components/ActionsList/ActionsListService.js',
            'src/components/ActionsList/ActionsListDirective.js',
            'src/components/TabStrip/AttachmentsService.js',
            'src/components/AnimationService/AnimationService.js',
            'src/components/ObjectDetail/DetailPageFieldService.js',
            'src/components/ObjectDetail/InlineFieldValueValidatorService.js',
            'src/components/ObjectDetail/InlineFieldValueSaverService.js',
            'src/components/ObjectDetail/FieldInlineEditService.js',
            'src/components/TabStrip/TabStripService.js',
            'src/components/TabStrip/TabStripDirective.js',
            'src/components/TabStrip/ObjectDetailAttachmentDirective.js',
            'src/components/ObjectDetail/ObjectDetailService.js',
            'src/components/ObjectDetail/DetailPageFieldValuesService.js',
            'src/components/ObjectDetail/ExistingObjectDetailService.js',
            'src/components/ObjectDetail/ObjectDetailDirective.js',
            'src/components/ActionsList/RepeatActionService.js',
            'src/components/ObjectRecurrence/ObjectRecurrenceDirective.js',
            <!--ObjectEdit-->
            'src/components/ObjectEdit/ObjectEditDirective.js',
            'src/components/ObjectEdit/ObjectEditService.js',
            <!-- BASIC SERVICES -->
            'src/components/Modal/ModalService.js',
            'src/components/Service/ObjectService.js',
            'src/components/Service/PropertySaverFactory.js',
            'src/components/ObjectDetail/DetailPageBlock.js',
            'src/components/Service/Events.js',
            'src/components/Notification/NotificationService.js',
            'src/components/Notification/NotificationPopupService.js',
            'src/components/Schema/ObjectTemplateService.js',
            'src/components/Schema/PageTemplateObjectCacheService.js',
            'src/components/Schema/PageTemplateObjectService.js',
            'src/components/Service/SchemaService.js',
            'src/components/Service/ConfigHelper.js',
            'src/components/Service/ConfigService.js',
            'src/components/Service/FilesystemService.js',
            'src/components/Service/AutocompleteService.js',
            'src/components/Service/PopupService.js',
            <!--advanced search component-->
            'src/components/Service/ListDataService.js',
            'src/components/AdvancedSearch/AdvancedSearchFilterExpressionService.js',
            'src/components/AdvancedSearch/AdvancedSearchService.js',
            'src/components/Schema/AdvancedSearchTemplateService.js',
            'src/components/AdvancedSearch/AdvancedSearchDirective.js',
            <!--filter component-->
            'src/components/Filter/FilterService.js',
            'src/components/Filter/FilterTabDirective.js',
            <!--scheduler component-->
            'src/components/Sheduler/module.js',
            'src/components/Sheduler/ResourcePanel/SchedulerAPIFilterService.js',
            'src/components/Sheduler/SchedulerDirective.js',
            'src/components/Sheduler/ResourcePanel/SchedulerResourcePanelDirective.js',
            'src/components/Sheduler/SchedulerDataSourceService.js',
            'src/components/Sheduler/SchedulerPopupService.js',
            'src/components/Sheduler/SchedulerHelper.js',
            'src/components/Sheduler/SchedulerParametersService.js',
            'src/components/Sheduler/SchedulerRefreshService.js',
            'src/components/Sheduler/SchedulerResourcesService.js',
            'src/components/Sheduler/Sheduler.js',
            <!--grid component-->
            'src/components/Grid/module.js',
            'src/components/Grid/GridController.js',
            'src/components/Grid/GridRefreshService.js',
            'src/components/Grid/GridHelper.js',
            'src/components/Grid/GridColumnsService.js',
            'src/components/Grid/GridDataService.js',
            'src/components/Grid/GridDrective.js',
            'src/components/Grid/GridFilterExpressionService.js',
            'src/components/Grid/GridSchemaService.js',
            'src/components/Grid/BatchEdit/BatchEditService.js',
            'src/components/Grid/BatchEdit/BatchEditDirective.js',
            'src/components/Grid/Toolbar/GridToolbarDirective.js',
            'src/components/Grid/GridWidgetService.js',
            'src/components/TabStrip/SubObject/TabStripHeaderSubObjectDirective.js',
            'src/components/TabStrip/SubObject/TabStripHeaderSubObjectService.js',
            /*cache services*/
            'src/components/PrintBar/PrintTemplateCacheService.js',
            'src/components/ConversionBar/ConversionCacheService.js'
    ];
    return gulp.src(srcArray)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/ViewObjectDataGridCalendar/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('build/ViewObjectDataGridCalendar/js'));
});
var karma = require('gulp-karma');

gulp.task('test', function() {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

//gulp.task('autotest', function() {
//    return gulp.watch(['www/js/**/*.js', 'test/spec/*.js'], ['test']);
//});
// Default Task
gulp.task('default', ['simpleGridPage', 'schedulerPage']);