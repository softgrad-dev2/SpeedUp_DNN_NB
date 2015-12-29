/**
 * Created by antons on 5/20/15.
 */
CSVapp.factory('filesystemService', [ function () {

    var _pluginFilesInitPath = "";
    var _imagesBaseUrl = "";
    var _imageIconUrl = "";
    var _templateBaseUrl = "DesktopModules/src/components";

    var _imageSizes = {
        h60: '_t_h60',
        h100: '_t_h100',
        h500: '_t_h500',
        h1024: '_t_h1024'
    };

    var _imageExtensions = [
        'jpg',
        'jpeg',
        'gif',
        'png'
    ];

    var FilesystemService = function () {
    };

    /*PUBLIC METHODS*/

    /// <summary>
    /// Method to understand, that image url is absolute
    /// </summary>
    /// <param name="url">url of an image</param>
    FilesystemService.isImageUrlAbsolute = function(url){

        return ('' + url).indexOf('http://') != -1;
    };

    /// <summary>
    /// Method to get relative address for template and add version to bust cache
    /// </summary>
    /// <param name="tplName">name of template, relative to '_templateBaseUrl'</param>
    /// <param name="version">hash to add to name</param>
    FilesystemService.getTemplateUrl = function(tplName, version){
        version = version ? "?v" + version : "";

        return _templateBaseUrl + '/' + tplName + version;
    };

    // TODO: introduce baseUrl prop to get relative addresses
    FilesystemService.InitPathsByEnv = function (env, throwException) {
        switch (env) {
            case 'local':
                _imagesBaseUrl = "http://localhost/Speedup_dnn/";
                _imageIconUrl = "http://localhost/Speedup_dnn/images/SU_images/FileExtensionImages/";
                _pluginFilesInitPath = "/speedup_dnn/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                break;
            case 'test':
                _pluginFilesInitPath = "/speedupcustomers/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                _imagesBaseUrl = "http://test-srv1.speeduperp.com/speedupcustomers/";
                _imageIconUrl = "http://test-srv1.speeduperp.com/speedupcustomers/images/SU_images/FileExtensionImages/";
                break;
            case 'stage':
                _pluginFilesInitPath = "/speedupcustomers/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                _imagesBaseUrl = "http://staging-srv1.speeduperp.com/speedupcustomers/";
                _imageIconUrl = "http://staging-srv1.speeduperp.com/speedupcustomers/images/SU_images/FileExtensionImages/";
                break;
            case 'prod':
                _pluginFilesInitPath = "/speedupcustomers/DesktopModules/SpeedUp.ObjectManagement.ClientSideViewer/";
                _imageIconUrl = "http://speeduperp.com/Speedupcustomers/images/SU_images/FileExtensionImages/";
                _imagesBaseUrl = "http://speeduperp.com/speedupcustomers/";
                break;
            default:
                if (throwException) {
                    throw "wrong environment variable: '" + env + "'";
                }
        }
        _templateBaseUrl = _imagesBaseUrl + _templateBaseUrl;
    };

    // checked
    FilesystemService.getImageIconUrl = function (imageUrl) {
        return FilesystemService.createCompletePath(imageUrl, 'icon');
    };
    // CHECKED
    FilesystemService.getImageUrl = function (imageUrl) {
        return imageUrl ? FilesystemService.createCompletePath(imageUrl, 'image') : "";
    };
    // CHECKED
    FilesystemService.getPluginImageUrl = function (imageUrl) {
        return FilesystemService.createCompletePath(imageUrl, 'plugin');
    };
    // CHECKED
    FilesystemService.getCompletePluginFilePath = function (filePath) {
        return FilesystemService.createCompletePath(filePath, 'plugin');
    };
    // CHECKED
    FilesystemService.createCompletePath = function (appendPath, type) {
        var constPath;
        switch (type) {
            case 'image':
                constPath = _imagesBaseUrl;
                break;
            case 'plugin':
                constPath = _pluginFilesInitPath;
                break;
            case 'icon':
                constPath = _imageIconUrl;
                break;
        }
        var completePath = "";

        if (constPath == null || constPath == "") {
            completePath = appendPath;
        }
        else {
            var lastChar = constPath.slice(-1);
            if (lastChar == "/") {
                completePath = constPath + appendPath;
            }
            else {
                completePath = constPath + "/" + appendPath;
            }
        }

        return completePath;
    };
    //checked
    FilesystemService.fileIsImageByExtension = function (fileExtension) {
        return $.inArray(fileExtension, _imageExtensions) != -1;
    };
    // checked
    /// <summary>
    /// Method to get file extension
    /// </summary>
    /// <param name="url">filename</param>
    FilesystemService.getFileExtension = function (url) {
        var extension = "";
        var extIndex = url.lastIndexOf('.');
        if (extIndex != -1) {
            extension = url.substr(extIndex + 1).toLowerCase();
        }

        return extension;
    };
    /// <summary>
    /// Method to get url for temporary attachment
    /// </summary>
    /// <param name="url">filename</param>
    FilesystemService.changeTmpImageUrl = function(filePath, fileName, fileExt){
        if (!filePath) {
            return "";
        }
        return _imagesBaseUrl + "/Upload/" + filePath.substring(filePath.lastIndexOf("Temp_OM_Uploads"), filePath.length) + "/"
            + fileName + "." + fileExt;

    };
    //  TODO: now h500 is hardcoded
    FilesystemService.changeImageUrl = function (url) {
        if (url == null || url == '') return "";
        url = FilesystemService.imageUrlFromRelative(url);
        var index = url.lastIndexOf(".");
        var first = url.substring(0, index);
        var last = url.substring(index);
        var img500Size = SUConstants.ImageSizes.h500;

        return first + img500Size + last;
    };
    // checked
    FilesystemService.imageUrlFromRelative = function (url) {
        return url.replace("~", _imagesBaseUrl)
    };
    // checked
    FilesystemService.changeImageUrlAndSize = function (url, size) {
        if (url == null || url == '') {
            url = FilesystemService.getPluginImageUrl("JS/img/NoImage.jpg");
        }
        else {
            url = FilesystemService.imageUrlFromRelative(url);
            var index = url.lastIndexOf(".");
            var first = url.substring(0, index);
            var last = url.substring(index);
            url = first + size + last;
        }

        return url;
    };

    return FilesystemService;
}
]);