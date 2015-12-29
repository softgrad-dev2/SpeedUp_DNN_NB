/**
 * Created by Мама on 23.05.15.
 */
CSVapp.factory('detailPageMapService', ['$q',
    function ($q) {
        function DetailPageMapService(){
        }

        /// <summary>
        /// method will display the address based on latitude and longitude.
        /// </summary>
        DetailPageMapService.getAddressFromLatLong = function(latField, longField, addressField,
                                                              mapDiv, mapZoomField, mapTypeField) {
            var lat = $("#" + latField).val();
            var long = $("#" + longField).val();
            var zoomLevel = $("#" + mapZoomField).val();
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = true;
            var address = $("#" + addressField).val();
            var mapType = $("#" + mapTypeField).val();
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = true;
            var saveMapType = true;

            _OMJSUNIQUE_GetAddressFromLatLong(latField, longField, addressField);
            DetailPageMapService.initializeMap(lat, long, latField, longField, editable, mapDiv,
                address, addressField, mapZoomField, mapTypeField, zoomLevel, mapType, saveZoomLevel, saveMapType);
        };
        /// <summary>
        /// method will display latitude and longitude based on address.
        /// </summary>
        DetailPageMapService.getLatLongFromAddress = function (latField, longField, addressField,
                                                               mapDiv, mapZoomField, mapTypeField) {
            var lat = $("#" + latField).val();
            var long = $("#" + longField).val();
            var zoomLevel = $("#" + mapZoomField).val();
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = true;
            var address = $("#" + addressField).val();
            var mapType = $("#" + mapTypeField).val();
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = true;
            var saveMapType = true;
            _OMJSUNIQUE_GetLatLongFromAddress(latField, longField, addressField);
            DetailPageMapService.initializeMap(lat, long, latField, longField, editable, mapDiv,
                address, addressField, mapZoomField, mapTypeField, zoomLevel, mapType, saveZoomLevel, saveMapType);
        };
        /// <summary>
        /// method will display the user's current location on map.
        /// </summary>
        DetailPageMapService.getCurrentLocation = function (latField, longField, addressField, mapDiv,
                                                            mapZoomField, mapTypeField) {
            var lat = $("#" + latField).val();
            var long = $("#" + longField).val();
            var zoomLevel = $("#" + mapZoomField).val();
            zoomLevel = $.isNumeric(zoomLevel) == true ? zoomLevel : 14;
            var editable = true;
            var address = $("#" + addressField).val();
            var mapType = $("#" + mapTypeField).val();
            mapType = mapType == undefined || mapType == "undefined" ? "" : mapType;
            var saveZoomLevel = true;
            var saveMapType = true;
            _OMJSUNIQUE_getCurrentLocation(latField, longField, addressField);
            DetailPageMapService.initializeMap(lat, long, latField, longField, editable,
                mapDiv, address, addressField, mapZoomField, mapTypeField, zoomLevel, mapType, saveZoomLevel, saveMapType);
        };


//
//        // MOVED to mapservice
//        /// <summary>
//        /// method will display the address based on latitude and longitude.
//        /// </summary>
//        $.GetAddress = function (latField, longField, addressField, mapDiv, mapZoomField, mapTypeField) {
//
//            $config.GetAddressFromLatLong(latField, longField, addressField, mapDiv, mapZoomField, mapTypeField);
//        }
//        // MOVED to mapservice
//        /// <summary>
//        /// method will display latitude and longitude based on address.
//        /// </summary>
//        $.GetLatLongFromAddress = function (latField, longField, addressField, mapDiv, mapZoomField, mapTypeField) {
//
//            $config.GetLatLongFromAddress(latField, longField, addressField, mapDiv, mapZoomField, mapTypeField);
//        }
//        // MOVED to mapservice
//        /// <summary>
//        /// method will display the user's current location on map.
//        /// </summary>
//        $.GetCurrentLocation = function (latField, longField, addressField, mapDiv, mapZoomField, mapTypeField) {
//
//            $config.GetCurrentLocation(latField, longField, addressField, mapDiv, mapZoomField, mapTypeField);
//        }

        /// <summary>
        /// Method to create the maps
        /// </summary>
        DetailPageMapService.createMaps = function (geoDataValues) {
            $.each(geoDataValues, function (i, e) {
                if (e.PropertyValue != undefined && e.PropertyValue != null && e.PropertyValue != "") {
                    var latlng = e.PropertyValue.split(":");
                    if (e.InlineEdit != undefined && e.InlineEdit == false) {
                        DetailPageMapService.initializeMap(e.Latitude, e.Longitude, e.LatField,
                            e.LongField, false, e.Mapdiv, e.Address, e.AddressField,
                            e.MapZoomField, e.MapTypeField, e.MapZoom, 'OPENSTREET', true, false, true);
                    }
                    else {
                        DetailPageMapService.initializeMap(e.Latitude, e.Longitude, e.LatField,
                            e.LongField, true, e.Mapdiv, e.Address, e.AddressField, e.MapZoomField,
                            e.MapTypeField, e.MapZoom, 'OPENSTREET', true, true, true);
                    }
                }
            });
        };

        // checked
        /// <summary>
        /// Method to initialize the map
        /// </summary>
        DetailPageMapService.initializeMap = function (lat, lng, LatField, LongField, editable, MapDiv, Address,
                                                       AddressField, ZoomField, MapTypeField, zoomlevel,
                                                       maptype, SaveZoomLevel, SaveMapType, disableScroll) {
            try {
                _OMJSUNIQUE_loadMap_eor(lat, lng, "Address", LatField, LongField, editable, MapDiv, Address,
                    AddressField, ZoomField, MapTypeField, zoomlevel, maptype, SaveZoomLevel, SaveMapType,
                disableScroll);
            } catch (ex) {
//                debugger;
            }
        };

        return DetailPageMapService;

    }]);