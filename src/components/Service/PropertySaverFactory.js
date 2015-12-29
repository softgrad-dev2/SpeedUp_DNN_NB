/**
 * Created by C4off on 20.08.15.
 */
CSVapp.factory('objectPropertySaverFactory', ['$q', 'configService', 'eventManager',
    function ($q, configService, eventManager) {
        var gConfig = configService.getGlobalConfig();

        var ObjectPropertySaverFactory = {};

        /// <summary>
        /// Factory method to get object property saver,
        /// depending on settings
        /// </summary>
        /// <param name="type">save method(server|local)</param>
        ObjectPropertySaverFactory.getSaver = function (type) {
            switch (type) {
                case 'local':
                    return new ObjectPropertySaverLocal();
                    break;
                case 'server':
                    return new ObjectPropertySaverServer();
                    break;
                default:
                    throw new BadParameterException('Wrong type of ObjectPropertySaver: ' + type);
            }
        };

        function ObjectPropertySaver(){
        }
        // used to 'virtually' save the property and release interface
        function ObjectPropertySaverLocal(){
            this.type = 'local';
            // Call the parent's constructor without hard coding the parent
            ObjectPropertySaverLocal.base.constructor.call(this, arguments);
        }

        Object.inherit(ObjectPropertySaver, ObjectPropertySaverLocal, {
            /// <summary>
            /// Method will save value for edited field with
            /// 'background' API call. DOESN'T wait until response to
            /// 'release' user interface
            /// </summary>
            /// <param name="odn">object definition name</param>
            /// <param name="fieldName">field name</param>
            /// <param name="propertyFk">field id</param>
            /// <param name="fieldValue">field value</param>
            /// <param name="objectEntryFK">record id</param>
            /// <param name="fireEvent">fire event? (true/false)</param>
            saveObjectField: function (odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent) {
                var deferred = $q.defer();

                // fire event to update data sources of widgets (e.g. Scheduler or Grid)
                if(fireEvent){
                    eventManager.fireEvent(ObjectPropertySavedEvent, {
                        fieldName: fieldName,
                        fieldValue: fieldValue,
                        recordId: objectEntryFK,
                        odn: odn
                    });
                }
                deferred.resolve("Update Successfull.");
                // make API call to perform 'background' saving
                _saveObjectFieldAPI(odn, fieldName, propertyFk, fieldValue, objectEntryFK, false);

                return deferred.promise;
            }
        });
        // used to save the property and wait for
        // response before releasing interface
        function ObjectPropertySaverServer(){
            this.type = 'server';
            // Call the parent's constructor without hard coding the parent
            ObjectPropertySaverServer.base.constructor.call(this, arguments);
        }
        Object.inherit(ObjectPropertySaver, ObjectPropertySaverServer, {
            /// <summary>
            /// Method will save value for edited field with API call. Waits until response
            /// </summary>
            /// <param name="odn">object definition name</param>
            /// <param name="fieldName">field name</param>
            /// <param name="propertyFk">field id</param>
            /// <param name="fieldValue">field value</param>
            /// <param name="objectEntryFK">record id</param>
            /// <param name="fireEvent">fire event? (true/false)</param>
            saveObjectField: function (odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent) {
                return _saveObjectFieldAPI(odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent);
            }
        });
        /// <summary>
        /// method performs actual API call to save the edited value
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="fieldName">field name</param>
        /// <param name="propertyFk">field id</param>
        /// <param name="fieldValue">field value</param>
        /// <param name="objectEntryFK">record id</param>
        /// <param name="fireEvent">fire event? (true/false)</param>
        /// <return>promise</return>
        function _saveObjectFieldAPI(odn, fieldName, propertyFk, fieldValue, objectEntryFK, fireEvent){
            var deferred = $q.defer();
            // TODO: handle emptyFieldDefinition
            var objInlineEditData = {
                PropertyValue: fieldValue,
                ObjectEntry_fk: objectEntryFK,
                PropertyDefinition_fk: propertyFk,
                RequestType: "sio"
            };

            var url = configService.getUrlBase('saveObjectField') + "/" + gConfig.token;
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(objInlineEditData),
                dataType: "json",
                success: function (response) {
                    var txt = "Exception";
                    if (response.ResponseMessage && response.ResponseMessage.indexOf(txt) > -1) {
                        deferred.reject(response.ResponseMessage);
                    } else {
                        if (fireEvent) {
                            eventManager.fireEvent(ObjectPropertySavedEvent, {
                                fieldName: fieldName,
                                fieldValue: fieldValue,
                                recordId: objectEntryFK,
                                odn: odn
                            });
                        }
                        deferred.resolve(response);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    deferred.reject(xhr.getResponseHeader('ResponseCode'));
                }
            });

            return deferred.promise;
        }

        return ObjectPropertySaverFactory;
    }]);