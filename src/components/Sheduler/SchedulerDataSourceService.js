/**
 * Created by C4off on 14.06.2015.
 */
speedupSchedulerModule.factory('schedulerDataSourceService', ['configService',
    function (configService) {
        var SchedulerDataSourceService = {};

        var schedulerConfig = configService.getSchedulerConfig();

        /// <summary>
        /// updates single field in scheduler data source
        /// </summary>
        /// <param name="fieldName">field name</param>
        /// <param name="fieldValue">value of the field</param>
        /// <param name="eventId">object entry id</param>
        /// <param name="widget">scheduler widget object</param>
        /// <return>promise</return>
        SchedulerDataSourceService.updateSingleProperty = function (fieldName, fieldValue, eventId, widget) {
            var ds = widget.dataSource;
            if (!ds) {
                return;
            }
            var data = ds.data();
            if (!data) {
                return;
            }
            var resourceProperty = schedulerConfig.resourceField;
            // search an updated event
            data.some(function (entry) {
                if (entry.ObjectEntry_ID == eventId) {
                    // in case of 'special' fields (scheduler transforms them)
                    if (fieldName == schedulerConfig.startField) {
                        entry.start = kendo.parseDate(fieldValue);
                    } else if (fieldName == schedulerConfig.endField) {
                        entry.end = kendo.parseDate(fieldValue);
                    } else {
                        entry[fieldName] = fieldValue;
                    }
                    SchedulerDataSourceService.checkAndUpdateIfDatePassed(entry, true, resourceProperty);
                    // update data source data (otherwise ds.data() will return unmodified ds)
                    ds.data(data);
                    // refresh dataSource
                    widget.refresh();

                    return true;
                }
                return false;
            });
        };

        /// <summary>
        /// check if event end_date has passed and make it 'grey'
        /// </summary>
        /// <param name="entry">object entry</param>
        /// <param name="alreadyParsed">if end_date property has been already converted to end</param>
        /// <param name="resourceProperty">resource field name</param>
        SchedulerDataSourceService.checkAndUpdateIfDatePassed = function (entry, alreadyParsed, resourceProperty) {
            var nowTStamp = new Date().getTime();

            var endDate;
            if (alreadyParsed) {
                endDate = entry.end;
            } else {
                var end = schedulerConfig.endField;
                endDate = kendo.parseDate(entry[end]);
            }
            if (endDate) {
                var entryEndTStamp = endDate.getTime();
                if (entryEndTStamp < nowTStamp && resourceProperty) {
                    entry.eventEndPassed = entry[resourceProperty];
                } else{
                    delete entry.eventEndPassed;
                }
            }
        };

        return SchedulerDataSourceService;
    }]);
