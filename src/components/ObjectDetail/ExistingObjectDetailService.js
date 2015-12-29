/**
 * Created by antons on 5/25/15.
 */
speedupObjectDetailModule.factory('existingObjectDetailService', ['$q', '$rootScope', '$compile', '$http',
    'configService', 'schemaService', 'detailPageFieldValuesService', 'objectDataService',
    'fieldPropertiesService', 'filesystemService', 'attachmentsService', 'objectDetailService',
    'objectDetailDisplayerService', 'eventManager', 'notificationService', 'localizationService',
    'objectTemplateService',
    function ($q, $rootScope, $compile, $http, configService, schemaService, detailPageFieldValuesService,
              objectDataService, fieldPropertiesService, filesystemService, attachmentsService,
              objectDetailService, objectDetailDisplayerService, eventManager, notificationService, localizationService,
              objectTemplateService) {
        var gConfig = configService.getGlobalConfig();

        var ExistingObjectDetailService = function () {
        };

        /*PUBLIC METHODS*/
        // shows detail page for edition/creating the event
        ExistingObjectDetailService.displayObjectDetail = function (eventId, odn, displayMode,
                                                                    overridenFields, skipSubObjects) {
            // create settings block, that'll be passed to inline methods
            var detailPageSettings = {
                odn: odn,
                recordId: eventId,
                fieldEditMode: 'single',
                pageSize: 5,
                displayMode: displayMode,
                editMode: 'detail'
            };
            // fields, where default values would be overriden
            if (overridenFields) {
                detailPageSettings.overridenFields = overridenFields;
            }
            ExistingObjectDetailService.getObjectsWithSubObjects(detailPageSettings, skipSubObjects);
        };

        ExistingObjectDetailService.getObjectsWithSubObjects = function (detailPageSettings, skipSubObjects) {
            // create page block for main object
            return ExistingObjectDetailService.createDetailPageBlock(detailPageSettings).then(function (parentDetailPageBlock) {
                return schemaService.createPageTitle(detailPageSettings.odn).then(function (title) {
                    // open popup and set page block as content
                    var displayer = objectDetailDisplayerService.getDisplayer(detailPageSettings.displayMode);
                    displayer.getDetailView(title, parentDetailPageBlock);
                    // get subobjects
                    if (!skipSubObjects){
                        ExistingObjectDetailService.appendSubObjects(parentDetailPageBlock);
                    }

                    return displayer;
                })
            }, function(){
                // in case of no data exception
                eventManager.fireEvent(LoadActionEndEvent);
                var msg = localizationService.translate("Messages.FailedToLoadData");
                notificationService.showNotification(msg, true);
            });
        };


        ExistingObjectDetailService.appendSubObjects = function (parentDetailPageBlock) {
            var settings = parentDetailPageBlock.settings;
            var parentOdn = settings.odn;
            var pageSize = settings.pageSize;
            var parentRecordId = settings.recordId;
            var subObjTypeStr = settings.subObjectsField;

            return _getSubObjectsUnderMainRecordMeta(parentOdn, subObjTypeStr).then(function (subObjectsArray) {
                // just skip if we have no info on subObjects
                if (!$.isArray(subObjectsArray) || !subObjectsArray.length) {
                    return $q.when('noObj');
                }
                subObjectsArray.forEach(function (subObj) {
                    var odn = subObj.ObjectDefinitionName;
                    var propertyName = subObj.PropertyName;
                    // We need it to fetch several pages of objects from API
                    var pageIndex = 0;
                    // get N subObjects from API
                    _getNSubObjectsRecursive(odn, propertyName, parentRecordId,
                        pageSize, pageIndex, parentDetailPageBlock);
                });
            });
        };

        function _getNSubObjectsRecursive(odn, propertyName, parentRecordId, pageSize, pageIndex, parentDetailPageBlock) {
            _getNSubObjects(odn, propertyName, parentRecordId,
                pageSize, pageIndex, parentDetailPageBlock).then(function (qty) {
                    if (!qty || qty < pageSize) {
                        return null
                    } else {
                        pageIndex++;
                    }
                    _getNSubObjectsRecursive(odn, propertyName, parentRecordId,
                        pageSize, pageIndex, parentDetailPageBlock)
                });
        }

        function _getNSubObjects(odn, propertyName, parentRecordId, pageSize, pageIndex, parentDetailPageBlock) {
            return _fetchSubObjects(odn, propertyName, parentRecordId, pageSize, pageIndex).then(function (objects) {
                if (!objects) {
                    return null
                }
                // We need to pass some parameters through with these settings
                var detailPageSettings = parentDetailPageBlock.settings;
                var queue = _createObjectQueue(objects, odn, pageSize, detailPageSettings);
                // queue is empty, don't process subobjects
                if (!queue.length) {
//                    console.log('No queue length');
                    return null;
                }
                return _processSubObjectsQueue(queue, parentDetailPageBlock).then(function () {
                    return objects.length;
                });
            }, function () {
                // API failed, no need to fetch more objects
            });
        }

        function _createObjectQueue(objects, odn, pageSize, settings) {
            // every  subObject render promise will
            // be put here to preserve original ordering, because subObjects with
            // children will render faster, than ones without
            var queue = [];
            objects.forEach(function (object) {
                // TODO: legacy code 'inherited' pageTemplateName for subobjects
                var recordId = object.ObjectEntry_ID;
                // create DetailPageBlock
                var detailPageBlockSettings = {
                    odn: odn,
                    recordId: recordId,
                    fieldEditMode: 'single',
                    displayMode: {
                        type: 'popup'
                    },
                    editMode: 'detail',
                    pageSize: pageSize,
                    currentRecord: {
                        id: object.ObjectEntry_ID,
                        name: object.Name,
                        fk: object.ObjectDefinition_fk
                    }
                };
                if (settings.overridenFields) {
                    detailPageBlockSettings.overridenFields = settings.overridenFields;
                }
                // every child block is in promise
                queue.push(
                    ExistingObjectDetailService.createDetailPageBlock(detailPageBlockSettings, object).then(function (pageBlock) {
                        return ExistingObjectDetailService.appendSubObjects(pageBlock)
                            .then(function () {
//                                console.log('Page block id: ' + pageBlock.id + ' ready');
                                return pageBlock;
                            });
                    })
                );
            });

            return queue;
        }

        function _processSubObjectsQueue(queue, parentPageBlock) {
            // append them only after all of them rendered
            var currentPromise = queue.shift();

            queue.forEach(function (promise) {
                currentPromise = currentPromise.then(function (childBlock) {
                    if (childBlock) {
                        parentPageBlock.appendChildBlock(childBlock);
                    }

                    return promise;
                });
            });
            return currentPromise.then(function (childBlock) {
                if (childBlock) {
                    parentPageBlock.appendChildBlock(childBlock);
                }
                // Maybe, time to finish showing 'loading' icon
                eventManager.fireEvent(LoadActionEndEvent);

                // At last return parent page block
                return parentPageBlock;
            });
        }

        /// <summary>
        /// Method will create new DetailPageBlock for particular dataItem
        /// </summary>
        /// <param name="dataItem">object data</param>
        /// <param name="settings">detail page settings</param>
        /// <param name="fields">optional. May be passed fields data of event</param>
        /// <return>promise</return>
        ExistingObjectDetailService.createDetailPageBlock = function (settings, fields) {
            // fire event that 'loading' begins
            eventManager.fireEvent(LoadActionStartEvent);

            // sometimes schema service cannot provide 'field properties' and 'template'
            // info yet, so not to cause several simultanious API request for same data by 'sibling'
            // objects we proceed only when we're sure, that we
            // already have 'field properties' and 'template' data
            return schemaService.getSchema(settings.odn).then(function(){
                return objectTemplateService.getObjectTemplate(settings.odn).then(function(){
                    var odn = settings.odn;
                    var recordId = settings.recordId;

                    // create new PageBlock
                    var pageBlock = new DetailPageBlock(settings);
                    // get Fields, menu, tabStrip, template promises and title
                    var promises = [
                        ExistingObjectDetailService.getActionsListPromise(odn),
                        ExistingObjectDetailService.getTabStripTabsPromise(odn, recordId),
                        ExistingObjectDetailService.getDetailPageTemplate(),
                        schemaService.createPageTitle(odn),
                        ExistingObjectDetailService.getFieldsPromise(odn, recordId, settings, fields)
                        // todo: get maps and summary, now they're in getFieldsPromise
                    ];
                    return $q.all(promises).then(function (resolvedPromises) {
                        // create scope and set values
                        var scope = $rootScope.$new();
//                        scope.fields = resolvedPromises[3];
                        scope.fields = resolvedPromises[4];
                        scope.actions = resolvedPromises[0];
//                        scope.tabStrip = {};
//                        var tpl = resolvedPromises[1];
//                        scope.objectType = resolvedPromises[2];
                        scope.tabStrip = resolvedPromises[1];
                        var tpl = resolvedPromises[2];
                        scope.objectType = resolvedPromises[3];

                        // also bind settings of the whole PageBlock
                        scope.settings = settings;
                        scope.pageBlock = pageBlock;
                        var contentObject = new ContentObject();
                        // $compile template
                        $compile(tpl)(scope);
                        // set scope and content of pageBlock
                        contentObject.content = tpl;

                        pageBlock.contentObject = contentObject;

                        // fire 'stopped loading'
                        eventManager.fireEvent(LoadActionEndEvent);

                        return pageBlock;
                    });
                });
            });
        };
        /// <summary>
        /// Method will get promise, resolving with data for fields of object Detail Page
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        /// <return>promise</return>
        ExistingObjectDetailService.getFieldsPromise = function (odn, recordId, settings, fields) {
            // get item data
            if (fields) {
                return _getFieldPromiseByObjectData(odn, recordId, fields);
            } else {
                return objectDataService.fetchSingleObjectData(recordId, odn).then(function (data) {
                    if(!data){
                        throw new NoDataException('Failed to get data from server');
                    }
                    // put current record data in detailPageBlock settings.
                    // It's not a good place, but the only,
                    // since we don't have access to this data elsewhere
                    settings.currentRecord = {
                            id: data.ObjectEntry_ID,
                            name: data.Name,
                            fk: data.ObjectDefinition_fk
                        };
                    // here we have event data
                    // we need template data
                    return _getFieldPromiseByObjectData(odn, recordId, data);
                });
            }
        };
        function _getFieldPromiseByObjectData(odn, recordId, data) {
            return  objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // get fields selected for template
                var selectedFieldsString = "";
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedColumnsForTemplate) {
                    selectedFieldsString = jsonSettings[0].SelectedColumnsForTemplate;
                }
                var selectedFields = [];
                // getting selected fields array from string
                selectedFieldsString.split(",").forEach(function (fieldName) {
                    if (fieldName != "") {
                        selectedFields.push(fieldName.replace(/[[\]]/g, ''));
                    }
                });
                // get properties for that fields
                var fieldsWithProperties = fieldPropertiesService.getAllPropertiesOfFieldsArray(selectedFields, odn);
                // Filter API fields. Not all of the 'selected 4 template' fields are present in API data
                // set values for the fields (+ Maps and Summary)
                var fieldValuesCombined = _setFieldValues(fieldsWithProperties, data, recordId);

                var fields = [fieldValuesCombined.data];
                fields[0].Maps = fieldValuesCombined.maps || [];
                fields[0].Summary = fieldValuesCombined.summary || [];
                var img = ExistingObjectDetailService.getAttachmentImage(data);
                if(img){
                    fields[0].ImageUrl = img;
                }

                return fields;
            });
        }

        /// <summary>
        /// Method will get url for attachments image from object settings
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        ExistingObjectDetailService.getAttachmentImage = function (objectSettings) {
            var attachmentUrl = "";
            if (objectSettings && objectSettings[SUConstants.RecordFirstImageColumn]) {
                attachmentUrl = objectSettings[SUConstants.RecordFirstImageColumn];
            }
            var image;
            // if we have already passed absolute src for image
            if(filesystemService.isImageUrlAbsolute(attachmentUrl)){
                image = attachmentUrl;
            } else if (attachmentUrl) { // here we have first attachment file
                var fileExtension = filesystemService.getFileExtension(attachmentUrl);
                // check if it's an image
                if (filesystemService.fileIsImageByExtension(fileExtension)) {
                    image = filesystemService.changeImageUrl(attachmentUrl);
                }
            }

            return image;
        };
        // THIS METHOD WAS USED TO GET ICON FOR DIFFERENT
        // TYPES OF ATTACHMENTS. MAY BE NEEDED LATER
        /// <summary>
        /// Method will get url for attachments image from object settings
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        ExistingObjectDetailService.getAttachmentImage_old = function (objectSettings) {
            var attachmentUrl = "";
            if (objectSettings && objectSettings[SUConstants.RecordFirstImageColumn]) {
                attachmentUrl = objectSettings[SUConstants.RecordFirstImageColumn];
            }
            var icon;
            // if we have already passed absolute src for image
            if(filesystemService.isImageUrlAbsolute(attachmentUrl)){
                icon = attachmentUrl;
            } else if (attachmentUrl) { // here we have first attachment file
                var fileExtension = filesystemService.getFileExtension(attachmentUrl);
                // check if it's an image
                if (filesystemService.fileIsImageByExtension(fileExtension)) {
                    icon = filesystemService.changeImageUrl(attachmentUrl);
                } else {
                    // try to find an icon for that type of file
                    icon = attachmentsService.getIconImagesLarge(fileExtension);
                    if (!icon) {
                        icon = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
                    }
                }
            }
            // or nothing...
            else {
                icon = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
            }

            return icon;
        };
        /// <summary>
        /// Method will get data for 'actions' menu
        /// </summary>
        /// <param name="objectSettings">settings of object</param>
        ExistingObjectDetailService.getActionsListPromise = function (odn) {
            return objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // Get subobjects
                var selectedRelatedObjects;
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedRelatedObjectsForTemplate) {
                    selectedRelatedObjects = jsonSettings[0].SelectedRelatedObjectsForTemplate;
                    if (jsonSettings[0].RelatedObjectUnderMainRecord) {
                        selectedRelatedObjects += jsonSettings[0].RelatedObjectUnderMainRecord;
                    }
                } else {
                    selectedRelatedObjects = null;
                }
                return objectDataService.getSubObjects(odn, selectedRelatedObjects).then(function (subObjects) {
                    // TODO: remove hard-code (move repeatable sign to API response)
                    var meta = {subObjects: subObjects};
                    if (odn == "Work_Order_Detail") {
                        meta.objectRepeatable = true;
                    }

                    return meta;
                });
            });
        };
        /// <summary>
        /// Method will get promise, resolving with data for tabStrip
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="recordId">record id</param>
        /// <return>promise</return>
        ExistingObjectDetailService.getTabStripTabsPromise = function (odn, recordId) {
            return _getTabStripTabs(odn).then(function (tabs) {
                return {
                    settings: {
                        showAttachments: true,
                        addAttachment: true,
                        recordId: recordId,
                        displaySubObjectRecordAddButton: true,
                        attachmentId: "attachmentContent" + odn + "_" + recordId,
                        odn: odn
                    },
                    tabs: tabs,
                    // 'real' attachments are bound when selected for the first time
                    attachments: []
                }
            });

        };
        /// <summary>
        /// Method will return template for 'ObjectDetail' block
        /// </summary>
        // <return>promise</return>
        ExistingObjectDetailService.getDetailPageTemplate = function () {
            var deferred = $q.defer();

            var templateUrl = configService.getTemplateUrl('ObjectDetail/ExistingObjectDetail.html');
            $http.get(templateUrl).success(function (result) {
                deferred.resolve(angular.element(result));
            }).error(function () {
                    deferred.reject('Error loading template ' + templateUrl);
                });

            return deferred.promise;
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// Method will fetch subObject data
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="propertyName">object property, containing parent object ODN</param>
        /// <param name="parentRecordId">id of a parent record</param>
        /// <param name="pageSize">how many objects to fetch</param>
        /// <param name="pageIndex">index of current page(if pageSize<records total)</param>
        /// <return>promise</return>
        function _fetchSubObjects(odn, propertyName, parentRecordId, pageSize, pageIndex) {
            var filterExpression = propertyName ? " [" + propertyName + "] Like '" + parentRecordId + ":%' " : ""

            return objectDataService.fetchObjects(odn, pageSize, pageIndex, filterExpression);
        }

        /// <summary>
        /// get ODN's of object's subObjects, selected to be viewed under main record
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="subObjTypeStr">type of subObjects (for tabStrip or to
        //  display under main record)</param>
        /// <return>promise</return>
        function _getSubObjectsUnderMainRecordMeta(odn, subObjTypeStr) {
            return objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // Get subobjects
                var selectedRelatedObjects;
                subObjTypeStr = subObjTypeStr || "RelatedObjectUnderMainRecord";
                if (jsonSettings && jsonSettings[0] && jsonSettings[0][subObjTypeStr]) {
                    selectedRelatedObjects = jsonSettings[0][subObjTypeStr];
                } else {
                    selectedRelatedObjects = null;
                }
                return objectDataService.getSubObjects(odn, selectedRelatedObjects, true);
            });
        }

        /// <summary>
        /// get tabs data fro tabStrip
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <return>promise</return>
        function _getTabStripTabs(odn) {
            return objectTemplateService.getObjectTemplate(odn).then(function (jsonSettings) {
                // Get subobjects
                var selectedRelatedObjects;
                if (jsonSettings && jsonSettings[0] && jsonSettings[0].SelectedRelatedObjectsForTemplate) {
                    selectedRelatedObjects = jsonSettings[0].SelectedRelatedObjectsForTemplate;
                } else {
                    selectedRelatedObjects = null;
                }
                return objectDataService.getSubObjects(odn, selectedRelatedObjects);
            });
        }

        /// <summary>
        /// Method will set a values for array of fields with settings
        /// </summary>
        /// <param name="fields">fields with properties array</param>
        /// <param name="values">hash (propertyName->value)</param>
        /// <param name="recordId">id of a record</param>
        function _setFieldValues(fields, values, recordId) {
            var returnObject = {
                maps: [],
                summary: [],
                data: []
            };

            var propertyName, value;

            fields.forEach(function (fieldObj) {
                propertyName = fieldObj.PropertyName;
                value = values[propertyName];

                if (fieldObj && fieldObj.PropertyLabel && value != undefined) {
                    // Trying to fix date if broken
                    if (fieldObj.DataType == gConfig.dataTypes.DateTime) {
                        // validating the date
                        var date = kendo.parseDate(value);
                        if (date) {
                            value = kendo.toString(date, "yyyy-MM-dd HH:mm:ss");
                        }
                    }
                    fieldObj.PropertyValue = value;
                    fieldObj.ObjectEntry_fk = "";
                    fieldObj.InlineEdit = false;
                    fieldObj.UniqueKey = recordId;
                    fieldObj = detailPageFieldValuesService.setValuesForElements(fieldObj, propertyName);

                    if (fieldObj.DataType == gConfig.dataTypes.GeoData) {
                        returnObject.maps.push(fieldObj);
                    }
                    else if (fieldObj.DataType == gConfig.dataTypes.Summary) {
                        returnObject.summary.push(fieldObj);
                    } else {
                        returnObject.data.push(fieldObj);
                    }
                }

            });

            return returnObject;
        }

        return ExistingObjectDetailService;
    }]);