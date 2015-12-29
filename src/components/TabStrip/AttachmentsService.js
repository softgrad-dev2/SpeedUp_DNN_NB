/**
 * Created by antons on 5/19/15.
 */
speedupObjectDetailModule.factory('attachmentsService', ['$q', '$http', 'configService', 'dateTimeService', 'filesystemService',
    'localizationService', 'eventManager',
    function ($q, $http, configService, dateTimeService, filesystemService, localizationService, eventManager) {

        var _attachmentImages = {
            'rar': "Archive_RAR.png",
            'zip': "Archive_ZIP.png",
            'mp3': "Audio_MP3.png",
            'bmp': "Image_BMP.png",
            'gif': "Image_GIF.png",
            'jpg': "Image_JPG.png",
            'png': "Image_PNG.png",
            'doc': "Office_DOC.png",
            'docx': "Office_DOC.png",
            'pdf': "Office_PDF.png",
            'txt': "Office_TXT.png",
            'xls': "Office_XLS.png",
            'xlsx': "Office_XLS.png",
            'default': "icon_unknown_32px.gif"
        };

        var _iconsLarge = {
            'rar': 'Large/rar.png',
            'zip': 'Large/rar.png',
            'mp3': 'Large/mp_3.png',
            'doc': 'Large/docx_win.png',
            'docx': 'Large/docx_win.png',
            'pdf': 'Large/pdf.png',
            'txt': 'Large/text.png',
            'xls': 'Large/xlsx_win.png',
            'xlsx': 'Large/xlsx_win.png',
            'jpg': 'Large/jpeg.png',
            'jpeg': 'Large/jpeg.png',
            'default': "Large/default.png"
        };

        var AttachmentsService = function () {
        };
        var gConfig = configService.getGlobalConfig();
        // cached attachments
        var _temporaryAttachments = [];

        /// <summary>
        /// Save Temporary Attachments
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="newRecordId">new record id</param>
        /// <param name="oldTempId">old temporary id</param>
        AttachmentsService.saveTemporaryAttachments = function (odn, newRecordId, oldTempId) {
            var deferred = $q.defer();
            var attachmentIdx = 0;

            _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);

            return deferred.promise;
        };

        // checked
        AttachmentsService.wrapUploader = function (uploaderElement, odn, recordId, attachments, onSuccess) {
            // if element for uploading exist and hasn't been wrapped yet -
            // WRAP IT!!!
            if (uploaderElement.length && !uploaderElement.data('kendoUpload')) {
                uploaderElement.kendoUpload({
                    async: {
                        saveUrl: 'upload',
                        autoUpload: true
                    },
                    multiple: false,
                    localization: {
                        select: localizationService.translate("Buttons.SelectFile"),
                        dropFilesHere: localizationService.translate("Messages.dropfiles"),
                        uploadSelectedFiles: localizationService.translate("Buttons.Send")
                    },
                    // TODO: get params for methods
                    select: function (e) {
                        AttachmentsService.fileUploaderSelect(e, recordId, odn);
                    },
                    success: function (e) {
                        AttachmentsService.fileUploaderSuccess(e, recordId, odn, attachments).then(function (attachments) {
                            // perform additional actions, like bind image to the object detail
                            if (angular.isFunction(onSuccess)) {
                                onSuccess(attachments);
                            }
                        });
                    }
                });
            }
        };

        // checked
        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        AttachmentsService.getIconImages = function (extensionName) {
            var iconName = _attachmentImages[extensionName];
            iconName = iconName || _attachmentImages['default'];

            return filesystemService.getImageIconUrl(iconName);
        };
        // CHECKED
        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        AttachmentsService.getIconImagesLarge = function (extensionName) {
            var iconName = _iconsLarge[extensionName];
            iconName = iconName || _iconsLarge['default'];

            return filesystemService.getImageIconUrl(iconName);
        };
        // NOT CHECKED
        AttachmentsService.fileUploaderSuccess = function (e, recordId, odn, attachmentsPointer) {
            //Add Record To Temporary Object
            if (recordId && recordId.toString().indexOf("Temp_") > -1) {
                if (e.response.FileName != undefined && e.response.FileName != null) {
                    var objTempAttachment = {
                        TemporaryObjectId: recordId,
                        FileName: e.response.FileName,
                        fileExtension: e.response.FileExtension,
                        Status: "Pending",
                        FilePath: e.response.FilePath,
                        CreatedDate: dateTimeService.FormatDateAmPm(new Date())
                    };
                    _temporaryAttachments.push(objTempAttachment);
                    // TODO:
                    var img = _getImageForNewRecord(recordId);
                    eventManager.fireEvent(NewEntryAttachmentUploadedEvent, img);
                }
            }
            // re-obtain attachments from server, because they contain some 'extra' data now
            return AttachmentsService.getAttachments(recordId, odn).then(function (attachments) {
                attachmentsPointer.attachments = attachments.attachments;

                return attachmentsPointer.attachments;
            });

        };
        // CHECKED
        AttachmentsService.fileUploaderSelect = function (e, recordId, odn) {
            var fileName = "";
            var fileExtension = "";
            $.each(e.files, function (index, value) {
                fileName = value.name.substring(0, value.name.lastIndexOf("."));
                console.log("Size: " + value.size + " bytes");
                fileExtension = value.extension;
                fileExtension = fileExtension.substring(1, fileExtension.length);
            });
            var url = "";
            if (recordId && recordId.toString().indexOf("Temp_") > -1) {
                url = configService.getUrlBase('documentsAndAttachementsTemporary') + "/" + odn +
                    "/" + recordId + "/" + fileName + "/" + fileExtension + "/" + gConfig.token + "?RequestType=ud";
            }
            else {
                url = configService.getUrlBase('documentsAndAttachments') + "/" + odn +
                    "/" + recordId + "/" + fileName + "/" + fileExtension + "/" + gConfig.token + "?RequestType=ud";
            }
            e.sender.options.async.saveUrl = url;

        }

        // NOT CHECKED// Uncompleted
        // warning, became async
        /// <summary>
        /// Method will send remove file request to API
        /// </summary>
        /// <param name="fileId">contain file id</param>
        AttachmentsService.removeFile = function (fileId, ObjectDefinitionName, recordId) {
            var deferred = $q.defer();

            // todo. method should return object or index of attachment
            var confirmMessage = localizationService.translate("Messages.DeleteFile");
            if (confirm(confirmMessage)) {
                if (recordId && recordId.toString().indexOf("Temp_") > -1) {
                    _deleteTemporaryAttachments(fileId);
                    deferred.resolve();
                }
                else {
                    return _doRemoveAttachment(fileId, recordId);
                }
            } else {
                deferred.reject('Cancelled by user');
            }

            return deferred.promise;
        }

        // Not checked
        /// <summary>
        /// Method will update image for object if needed
        /// </summary>
        /// <param name="attachmentsObj">attachments object</param>
        AttachmentsService.updateImage = function (attachments) {
            // no attachments yet (or removed)
            var imgUrl = "";
            if (attachments.length) {
                var ext;
                var imageSet = false;
                // search for an image in attachments
                attachments.some(function (elem) {
                        ext = filesystemService.getFileExtension(elem.ImageUrl);
                        // attachment is image
                        if (filesystemService.fileIsImageByExtension(ext)) {
                            imgUrl = filesystemService.changeImageUrl(elem.ImageUrl);
                            imageSet = true;

                            return true;
                        }

                        return false;
                    }
                );
            }

            return imgUrl;
        };

        // USED TO GET ICONS FOR DIFFERENT TYPES OF ATTACHMENTS
        // CAN BE USED LATER
        /// <summary>
        /// Method will update image for object if needed
        /// </summary>
        /// <param name="attachmentsObj">attachments object</param>
        AttachmentsService.updateImage_old = function (attachments) {
            // no attachments yet (or removed)
            if (!attachments.length) {
                imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
            } else {
                var imgUrl = "";

                var ext;
                var iconPath = "";

                var imageSet = false;
                // search for an image in attachments
                attachments.some(function (elem) {
                        ext = filesystemService.getFileExtension(elem.ImageUrl);
                        // attachment is image
                        if (filesystemService.fileIsImageByExtension(ext)) {
                            imgUrl = filesystemService.changeImageUrl(elem.ImageUrl);
                            imageSet = true;

                            return true;
                        } else { // attachment is other file type
                            // find, if there's icon for this type of attachments
                            if (!iconPath) {
                                iconPath = AttachmentsService.getIconImagesLarge(ext);
                            }
                        }

                        return false;
                    }
                );
                // if no image found, but there's an attachment
                if (!imageSet) {
                    if (iconPath) {
                        imgUrl = iconPath;
                    } else {
                        imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
                    }
                }
            }

            return imgUrl;
        };


        // CHECKED
        AttachmentsService.getAttachments = function (recordId, odn) {
            var deferred = $q.defer();

            var attachments;
            var objAttach = {
                addAttachment: true,
                fileUploadId: "FileUpload" + odn + "_" + recordId
            };
            if (recordId.toString().indexOf("Temp") > -1) {
                attachments = _getTemporaryAttachments(recordId);
                if (attachments == undefined || attachments == null || attachments.length == 0) {
                    objAttach.attachments = [];
                }
                else {
                    objAttach.attachments = attachments;
                }

                deferred.resolve(objAttach);
            }
            else {
                _fetchDocumentsAndAttachments(recordId, odn).then(function (attachments) {
                    if (attachments == undefined || attachments == null || attachments.length == 0) {
                        objAttach.attachments = [];
                        deferred.resolve(objAttach);
                    } else {
                        deferred.resolve(attachments);
                    }
                });
            }

            return deferred.promise;
        };

        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        function _getImageForNewRecord(recordId) {
            imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
            var imgUrl = "";
            var iconPath = "";
            var imageSet = false;
            // search for an image in attachments
            _temporaryAttachments.some(function (elem) {
                    if (elem.TemporaryObjectId == recordId && elem.Status == "Pending") {
                        if (filesystemService.fileIsImageByExtension(elem.fileExtension)) {
                            imgUrl = filesystemService.changeTmpImageUrl(elem.FilePath, elem.FileName, elem.fileExtension);
                            imageSet = true;

                            return true;
                        }
                    } else { // attachment is other file type
                        // find, if there's icon for this type of attachments
                        if (!iconPath) {
                            iconPath = AttachmentsService.getIconImagesLarge(ext);
                        }
                    }

                    return false;
                }
            );
            // if no image found, but there's an attachment
            if (!imageSet) {
                if (iconPath) {
                    imgUrl = iconPath;
                } else {
                    imgUrl = filesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
                }
            }

            return imgUrl;
        }

        var _doRemoveAttachment = function (fileId, recordId) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('deleteAttachment') + "/" +
                fileId + "/" + recordId + "/" + gConfig.token + "?RequestType=df";
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function (response) {
                    response += "";
                    if (response.indexOf('Success') != -1) {
                        deferred.resolve();
                    } else {
                        deferred.reject('Error deleting the attachment');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                    if (respoonseCodeValue == "UnAuthorized")
                        deferred.reject(xhr.getResponseHeader('ResponseCode'));
                    else
                        deferred.reject(url + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                }
            });

            return deferred.promise;
        };

        // checked
        /// <summary>
        /// Delete Temporary Attachments
        /// </summary>
        var _deleteTemporaryAttachments = function (fileId) {
            for (var i = 0; i < _temporaryAttachments.length; i++) {
                var attachments = _temporaryAttachments[i];

                if (attachments.FileName == fileId) {
                    _temporaryAttachments[i].Status = "Deleted";
                }
            }
        };

        // warning. added params. became async
        // checked
        /// <summary>
        /// method will request to API to get Documents and attachments.
        /// </summary>
        var _fetchDocumentsAndAttachments = function (recordId, odn) {
            var deferred = $q.defer();

            if (recordId) {
                var dataArray = [];
                var obj = {
                    attachments: dataArray,
                    fileUploadId: "FileUpload" + odn + "_" + recordId,
                    addAttachment: true
                };
                var PostData = gConfig.postData;
                PostData.Clear();
                PostData.RequestType = "Attachments";
                var url = configService.getUrlBase('documentsAndAttachments') + "/" + recordId + "/" + gConfig.token;
                $.ajax({
                    type: "GET",
                    url: url,
                    data: PostData,
                    dataType: "json",
                    success: function (attachments) {
                        if (attachments.length > 0) {
                            dataArray = [];
                            $.each(attachments, function (i, e) {
                                if (e.FilePath.indexOf("~/") == 0) {
                                    e.FilePath = e.FilePath.substring(2);
                                }
                                var extension = e.FileName.substring(e.FileName.lastIndexOf(".") + 1, e.FileName.length);
                                var objAttachment = {
                                    ImageUrl: filesystemService.getImageUrl(e.FilePath + e.FileName),
                                    ImageName: e.FileName,
                                    iconPath: AttachmentsService.getIconImages(extension.toLowerCase()),
                                    CreatedDate: e.CreatedDate,
                                    FileId: e.FileId,
                                    ObjectDefinitionName: odn,
                                    recordId: recordId,
                                    Detail: 'detailObject.. Why do we need it?'
                                }
                                dataArray.push(objAttachment);
                            });
                            obj.attachments = dataArray;
                        }

                        deferred.resolve(obj);
                    }, error: function (xhr, ajaxOptions, thrownError) {
                        var respoonseCodeValue = xhr.getResponseHeader('ResponseCode');
                        if (respoonseCodeValue == "UnAuthorized")
                            deferred.reject(xhr.getResponseHeader('ResponseCode'));
                        else
                            deferred.reject(url + ":=:" + xhr.status + ' ' + ajaxOptions + ' ' + thrownError);
                    }
                });

            }

            return deferred.promise;
        };

        // CHECKED
        /// <summary>
        /// method will Get Temporary Attachments for Display
        /// </summary>
        var _getTemporaryAttachments = function (recordId) {
            var attachmentsArray = [];
            for (var i = 0; i < _temporaryAttachments.length; i++) {
                var attachments = _temporaryAttachments[i];

                if (attachments.TemporaryObjectId == recordId && attachments.Status == "Pending") {
                    var obj = new Object();
                    obj.Comments = "";
                    obj.ImageName = attachments.FileName + attachments.fileExtension;
                    obj.FileId = attachments.FileName;
                    obj.ObjectRecordId = recordId;
                    obj.ImageUrl = attachments.FilePath;
                    obj.CreatedDate = attachments.CreatedDate;
                    attachmentsArray.push(obj);
                }
            }

            return attachmentsArray;
        };

        /// <summary>
        /// method to save single attachment (calls itself recursively)
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="newRecordId">new record id</param>
        /// <param name="oldTempId">old temporary id</param>
        /// <param name="attachmentIdx">index of attachment in attachments array cache</param>
        function _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx) {
            var length = _temporaryAttachments.length;
            if (length == 0) {
                deferred.resolve();
            } else {
                var attachments = _temporaryAttachments[attachmentIdx];

                if (attachments != undefined && attachments != null && attachments.TemporaryObjectId == oldTempId && attachments.Status == "Pending") {
                    _doSaveTemporaryAttachments(odn, newRecordId, oldTempId, attachments).then(function (response) {
                        if (attachmentIdx != length) {
                            _temporaryAttachments[attachmentIdx].Status = "Finished";
                            attachmentIdx++;
                            // recursively save other attachments
                            _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);
                        }
                    }, function () {
                        attachmentIdx++;
                        // recursively save other attachments
                        _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);
                    });
                } else {
                    attachmentIdx++;
                    if (attachmentIdx < length) {
                        // recursively save other attachments
                        _saveTemporaryAttachments(odn, newRecordId, oldTempId, deferred, attachmentIdx);
                    } else {
                        deferred.resolve();
                    }
                }
            }
        }

        /// <summary>
        /// method will actually save attachments
        /// </summary>
        /// <param name="odn">object definition name</param>
        /// <param name="newRecordId">new record id</param>
        /// <param name="oldTempId">old temporary id</param>
        /// <param name="attachments">attachments object</param>
        function _doSaveTemporaryAttachments(odn, newRecordId, oldTempId, attachments) {
            var deferred = $q.defer();

            var url = configService.getUrlBase('saveTemporaryAttachments') + "/" + gConfig.token;
            var objPostData = {
                ObjectDefinitionName: odn,
                ObjectRecordId: newRecordId,
                OldTempId: oldTempId,
                fileName: attachments.FileName,
                OldFileName: attachments.FileName,
                FileExtension: attachments.fileExtension,
                token: gConfig.token
            };
            $http.post(url, JSON.stringify(objPostData)).success(function (response) {
                deferred.resolve(response);
            }).error(function () {
                    deferred.reject();
                });

            return deferred.promise;
        }


        return AttachmentsService;
    }
]);