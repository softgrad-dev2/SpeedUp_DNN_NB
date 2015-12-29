/// <reference path="google-maps-3-vs-1-0.js" />
/// <reference path="google_maps_api_v3_10.js" />

var
_OMJSUNIQUE_map_eor, _OMJSUNIQUE_box_eor, _OMJSUNIQUE_mapMarker_eor, _OMJSUNIQUE_markersLayer, _OMJSUNIQUE_LinePolygonLayer;
var _OMJSUNIQUE_latlngboundsVA;
var _OMJSUNIQUE_latField_eor, _OMJSUNIQUE_lngField_eor, _OMJSUNIQUE_AddressField_eor;
var _OMJSUNIQUE_zoomLvlField_eor, _OMJSUNIQUE_MaptypeField_eor;
var _OMJSUNIQUE_polyline, _OMJSUNIQUE_polygon;
var _OMJSUNIQUE_ShapeType;
var _OMJSUNIQUE_ShapeLatLongArrayField;
var _OMJSUNIQUE_vertexImgPath = '_OMJSIMAGEPATH_';


var _OMJSUNIQUE_EditableMap = false;
var _OMJSUNIQUE_EditableMapLatField;
var _OMJSUNIQUE_EditableMapLongField;


function _OMJSUNIQUE_loadMap_eor_Line_Polygon(LatLongArray, HTML, editable, MapDiv, DefaultLat, DefaultLng, shpOption, shpType, shpLatLngField) {
    _OMJSUNIQUE_loadMap_eor_Line_Polygon(LatLongArray, HTML, editable, MapDiv, DefaultLat, DefaultLng, shpOption, shpType, shpLatLngField);
}

function _OMJSUNIQUE_loadMap_eor_Line_Polygon(LatLongArray, HTML, editable, MapDiv, DefaultLat, DefaultLng, shpOption, shpType, shpLatLngField, ZoomField, MapTypeField, zoomlevel, maptype, SaveZoomLevel, SaveMapType) {

    _OMJSUNIQUE_latlngboundsVA = new OpenLayers.Bounds();

    _OMJSUNIQUE_ShapeLatLongArrayField = shpLatLngField;

    var gmapZoom = 14;
    var gmapType = google.maps.MapTypeId.ROADMAP;

    if (shpType == undefined || shpType == null || shpType == "")
        _OMJSUNIQUE_ShapeType = "Polyline";
    else
        _OMJSUNIQUE_ShapeType = shpType;

    if (MapDiv == undefined || MapDiv == null || MapDiv == "")
        MapDiv = "_OMJSUNIQUE_map_eor";

    if (editable == undefined || editable == null || editable == '')
        editable = false;

    if (SaveZoomLevel == true && zoomlevel != undefined && zoomlevel != null && zoomlevel != "") {
        gmapZoom = parseInt(zoomlevel);
    }

    document.getElementById(MapDiv).style.display = "block";

    if (DefaultLat == undefined || DefaultLat == null || DefaultLat == '')
        DefaultLat = "59";

    if (DefaultLng == undefined || DefaultLng == null || DefaultLng == '')
        DefaultLng = "18";

    // Add the OpenLayer Maps
    _OMJSUNIQUE_map_eor = new OpenLayers.Map({
        div: MapDiv,
        //projection: "EPSG:900913",
        //displayProjection: "EPSG:900913",
        projection: "EPSG:4326",
        displayProjection: "EPSG:4326",

        numZoomLevels: zoomlevel,
        unit: 'm'
    });

    // create Google Mercator layers
    var gphy = new OpenLayers.Layer.Google("Google Physical", {
        mapid: "TERRAIN",
        'sphericalMercator': true,
        //'sphericalMercator': false,
        type: google.maps.MapTypeId.TERRAIN
    });
    var gmap = new OpenLayers.Layer.Google("Google Streets", // the default
	{
	    'sphericalMercator': true,
	    //'sphericalMercator': false,
	    mapid: "ROADMAP"
	});
    var ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
        mapid: "HYBRID",
        'sphericalMercator': true,
        //'sphericalMercator': false,
        type: google.maps.MapTypeId.HYBRID
    });
    var gsat = new OpenLayers.Layer.Google("Google Satellite", {
        mapid: "SATELLITE",
        'sphericalMercator': true,
        //'sphericalMercator': false,
        type: google.maps.MapTypeId.SATELLITE
    });
// TODO: do we need BING 2015-11-13
    // create Bing layers

    // API key for http://openlayers.org. Please get your own at
    // http://bingmapsportal.com/ and use that instead.
//    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
//
//    var veroad = new OpenLayers.Layer.Bing({
//        mapid: "BINGROAD",
//        'sphericalMercator': true,
//        //'sphericalMercator': false,
//        key: apiKey,
//        type: "Road",
//        wrapDateLine: true
//    });
//    var veaer = new OpenLayers.Layer.Bing({
//        mapid: "BINGSATELLITE",
//        'sphericalMercator': true,
//        //'sphericalMercator': false,
//        key: apiKey,
//        type: "Aerial",
//        wrapDateLine: true
//    });
//    var vehyb = new OpenLayers.Layer.Bing({
//        mapid: "BINGHYBRID",
//        'sphericalMercator': true,
//        //'sphericalMercator': false,
//        key: apiKey,
//        type: "AerialWithLabels",
//        wrapDateLine: true
//    });
// TODO: do we need BING 2015-11-13 END
    // create OSM layers
    var mapnik = new OpenLayers.Layer.OSM("OpenStreet Map", "", {
        'sphericalMercator': true,
        //'sphericalMercator': false,
        mapid: "OPENSTREET"
    });

    //    mapnik.projection = new OpenLayers.Projection("EPSG:4326");
    //    gphy.projection = new OpenLayers.Projection("EPSG:4326");
    //    gmap.projection = new OpenLayers.Projection("EPSG:4326");
    //    gsat.projection = new OpenLayers.Projection("EPSG:4326");
    //    ghyb.projection = new OpenLayers.Projection("EPSG:4326");
    //    veroad.projection = new OpenLayers.Projection("EPSG:4326");
    //    veaer.projection = new OpenLayers.Projection("EPSG:4326");
    //    vehyb.projection = new OpenLayers.Projection("EPSG:4326");

//    _OMJSUNIQUE_map_eor.addLayers([mapnik, gphy, gmap, gsat, ghyb, veroad, veaer, vehyb]);
    _OMJSUNIQUE_map_eor.addLayers([mapnik, gphy, gmap, gsat, ghyb]);
    // Select the Default Map Layer
    if (SaveMapType == true && maptype != undefined && maptype != null && maptype != "") {

        if (maptype == "ROADMAP")
            _OMJSUNIQUE_map_eor.setBaseLayer(gmap);
        else if (maptype == "SATELLITE")
            _OMJSUNIQUE_map_eor.setBaseLayer(gsat);
        else if (maptype == "HYBRID")
            _OMJSUNIQUE_map_eor.setBaseLayer(ghyb);
        else if (maptype == "TERRAIN")
            _OMJSUNIQUE_map_eor.setBaseLayer(gphy);
        else if (maptype == "OPENSTREET")
            _OMJSUNIQUE_map_eor.setBaseLayer(mapnik);
//        else if (maptype == "BINGROAD")
//            _OMJSUNIQUE_map_eor.setBaseLayer(veroad);
//        else if (maptype == "BINGSATELLITE")
//            _OMJSUNIQUE_map_eor.setBaseLayer(veaer);
//        else if (maptype == "BINGHYBRID")
//            _OMJSUNIQUE_map_eor.setBaseLayer(vehyb);

    }

    _OMJSUNIQUE_map_eor.addControl(new OpenLayers.Control.LayerSwitcher());
    _OMJSUNIQUE_map_eor.addControl(new OpenLayers.Control.MousePosition());

    // The location of our marker and popup.
    var point = new OpenLayers.LonLat(DefaultLng, DefaultLat).transform(new OpenLayers.Projection("EPSG:4326"), _OMJSUNIQUE_map_eor.getProjectionObject());

    _OMJSUNIQUE_map_eor.setCenter(point, gmapZoom);

    // Get the ShapeOptions
    var so = shpOption.split(':');
    //strokeColor: "#FF0000",
    //strokeOpacity: 0.8,
    //strokeWeight: 2,
    //fillColor: "#FF0000",
    //fillOpacity: 0.3

    ////	if (_OMJSUNIQUE_ShapeType == "Polyline") {

    ////		var wgs84 = new OpenLayers.Projection("EPSG:4326");
    ////		var defStyle = {
    ////			strokeColor : "blue",
    ////			strokeOpacity : "0.7",
    ////			strokeWidth : 2,
    ////			fillColor : "blue",
    ////			pointRadius : 3,
    ////			cursor : "pointer"
    ////		};
    ////		var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
    ////		var sm = new OpenLayers.StyleMap({
    ////			'default' : sty,
    ////			'select' : {
    ////				strokeColor : "red",
    ////				fillColor : "red"
    ////			}
    ////		});
    ////		var saveStrategy = new OpenLayers.Strategy.Save();
    ////		saveStrategy.events.register('success', null, saveSuccess);
    ////		saveStrategy.events.register('fail', null, saveFail);

    ////		_OMJSUNIQUE_LinePolygonLayer = new OpenLayers.Layer.Vector("Line Layer");

    ////		_OMJSUNIQUE_map_eor.addLayer(_OMJSUNIQUE_LinePolygonLayer);

    ////		var navControl = new OpenLayers.Control.Navigation({
    ////			title : 'Pan/Zoom'
    ////		});
    ////		var editPanel = new OpenLayers.Control.Panel({
    ////			displayClass : 'editPanel'
    ////		});
    ////		editPanel.addControls([new OpenLayers.Control.DrawFeature(_OMJSUNIQUE_LinePolygonLayer, OpenLayers.Handler.Point, {
    ////			displayClass : 'pointButton',
    ////			title : 'Add point',
    ////			handlerOptions : {
    ////				style : sty
    ////			}
    ////		}), new OpenLayers.Control.DrawFeature(_OMJSUNIQUE_LinePolygonLayer, OpenLayers.Handler.Path, {
    ////			displayClass : 'lineButton',
    ////			title : 'Draw line',
    ////			handlerOptions : {
    ////				style : sty
    ////			}
    ////		}), new OpenLayers.Control.ModifyFeature(_OMJSUNIQUE_LinePolygonLayer, {
    ////			title : 'Edit feature'
    ////		}), new DeleteFeature(_OMJSUNIQUE_LinePolygonLayer, {
    ////			title : 'Delete Feature'
    ////		}), new OpenLayers.Control.Split({
    ////			layer : _OMJSUNIQUE_LinePolygonLayer,
    ////			deferDelete : true,
    ////			title : 'Split line'
    ////		}), new OpenLayers.Control.Button({
    ////			displayClass : 'saveButton',
    ////			trigger : function() {
    ////				saveStrategy.save()
    ////			},
    ////			title : 'Save changes'
    ////		}), navControl]);
    ////		editPanel.defaultControl = navControl;
    ////		_OMJSUNIQUE_map_eor.addControl(editPanel);

    ////		DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
    ////			initialize : function(layer, options) {
    ////				OpenLayers.Control.prototype.initialize.apply(this, [options]);
    ////				this.layer = layer;
    ////				this.handler = new OpenLayers.Handler.Feature(this, layer, {
    ////					click : this.clickFeature
    ////				});
    ////			},
    ////			clickFeature : function(feature) {
    ////				// if feature doesn't have a fid, destroy it
    ////				if (feature.fid == undefined) {
    ////					this.layer.destroyFeatures([feature]);
    ////				} else {
    ////					feature.state = OpenLayers.State.DELETE;
    ////					this.layer.events.triggerEvent("afterfeaturemodified", {
    ////						feature : feature
    ////					});
    ////					feature.renderIntent = "select";
    ////					this.layer.drawFeature(feature);
    ////				}
    ////			},
    ////			setMap : function(map) {
    ////				this.handler.setMap(map);
    ////				OpenLayers.Control.prototype.setMap.apply(this, arguments);
    ////			},
    ////			CLASS_NAME : "OpenLayers.Control.DeleteFeature"
    ////		})

    ////		//_OMJSUNIQUE_map_eor.addControl(new OpenLayers.Control.DrawFeature(_OMJSUNIQUE_LinePolygonLayer, OpenLayers.Handler.Path));

    ////		var points = new Array();

    ////		if (LatLongArray != "") {
    ////			var latlongs = LatLongArray.split(";");
    ////			for (var j = 0; j < latlongs.length; j++) {
    ////				var latlong = latlongs[j].split(":");

    ////				var waypoint = new OpenLayers.Geometry.Point(parseFloat(latlong[1]), parseFloat(latlong[0])).transform(new OpenLayers.Projection("EPSG:4326"), _OMJSUNIQUE_map_eor.getProjectionObject());

    ////				_OMJSUNIQUE_latlngboundsVA.extend(waypoint);

    ////				points.push(waypoint);
    ////			}
    ////			_OMJSUNIQUE_map_eor.zoomToExtent(_OMJSUNIQUE_latlngboundsVA, true);
    ////		}

    ////		_OMJSUNIQUE_polyline = new OpenLayers.Geometry.LineString(points);
    ////		var polyOptions = {
    ////			strokeColor : so[0],
    ////			strokeOpacity : so[1] / 100,
    ////			strokeWeight : so[2]
    ////		}

    ////		var lineFeature = new OpenLayers.Feature.Vector(_OMJSUNIQUE_polyline, null, polyOptions);
    ////		_OMJSUNIQUE_LinePolygonLayer.addFeatures([lineFeature]);

    ////		if (editable) {
    ////			//if (LatLongArray == "")
    ////			//	google.maps.event.addListener(_OMJSUNIQUE_map_eor, 'click', _OMJSUNIQUE_addPolyline);
    ////			//else
    ////			//	_OMJSUNIQUE_polyline.runEdit(true, _OMJSUNIQUE_vertexImgPath)

    ////			//setInterval("_OMJSUNIQUE_loadMap_eor()", 1000);
    ////		}
    ////	} else if (_OMJSUNIQUE_ShapeType == "Polygon") {
    ////		var polyOptions = {
    ////			strokeColor : so[0],
    ////			strokeOpacity : so[1] / 100,
    ////			strokeWeight : so[2],
    ////			fillColor : so[3],
    ////			fillOpacity : so[4] / 100
    ////		}
    ////		_OMJSUNIQUE_polygon = new google.maps.Polygon(polyOptions);
    ////		_OMJSUNIQUE_polygon.setMap(_OMJSUNIQUE_map_eor);

    ////		var pgPath = _OMJSUNIQUE_polygon.getPath();

    ////		if (LatLongArray != "") {
    ////			var latlongs = LatLongArray.split(";");
    ////			for (var j = 0; j < latlongs.length; j++) {
    ////				var latlong = latlongs[j].split(":");
    ////				var waypoint = new google.maps.LatLng(parseFloat(latlong[0]), parseFloat(latlong[1]));

    ////				_OMJSUNIQUE_latlngboundsVA.extend(waypoint);

    ////				pgPath.push(waypoint);
    ////			}
    ////			_OMJSUNIQUE_map_eor.fitBounds(_OMJSUNIQUE_latlngboundsVA);
    ////		}
    ////		if (editable) {
    ////			//if (LatLongArray == "")
    ////			//	google.maps.event.addListener(_OMJSUNIQUE_map_eor, 'click', _OMJSUNIQUE_addPolygon);
    ////			//else
    ////			//	_OMJSUNIQUE_polygon.runEdit(true, _OMJSUNIQUE_vertexImgPath)

    ////			//setInterval("_OMJSUNIQUE_loadMap_eor()", 1000);
    ////		}
    ////	}

    ////	//            if (_OMJSUNIQUE_map_eor.getZoom() > 14) {
    ////	//                _OMJSUNIQUE_map_eor.setZoom(14);
    ////	//            }

}

/*
////function saveSuccess(event) {
////	alert('Changes saved');
////}

////function saveFail(event) {
////	alert('Error! Changes not saved');
////}

////function dataLoaded(event) {
////	this.map.zoomToExtent(event.object.getDataExtent());
////}

////function formatLonlats(lonLat) {
////	var lat = lonLat.lat;
////	var long = lonLat.lon;
////	var ns = OpenLayers.Util.getFormattedLonLat(lat);
////	var ew = OpenLayers.Util.getFormattedLonLat(long, 'lon');
////	return ns + ', ' + ew + ' (' + (Math.round(lat * 10000) / 10000) + ', ' + (Math.round(long * 10000) / 10000) + ')';
////}

////DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
////	initialize : function(layer, options) {
////		OpenLayers.Control.prototype.initialize.apply(this, [options]);
////		this.layer = layer;
////		this.handler = new OpenLayers.Handler.Feature(this, layer, {
////			click : this.clickFeature
////		});
////	},
////	clickFeature : function(feature) {
////		// if feature doesn't have a fid, destroy it
////		if (feature.fid == undefined) {
////			this.layer.destroyFeatures([feature]);
////		} else {
////			feature.state = OpenLayers.State.DELETE;
////			this.layer.events.triggerEvent("afterfeaturemodified", {
////				feature : feature
////			});
////			feature.renderIntent = "select";
////			this.layer.drawFeature(feature);
////		}
////	},
////	setMap : function(map) {
////		this.handler.setMap(map);
////		OpenLayers.Control.prototype.setMap.apply(this, arguments);
////	},
////	CLASS_NAME : "OpenLayers.Control.DeleteFeature"
////});
*/

var _OMJSUNIQUE_markersPolyline = [];
//store markers on _OMJSUNIQUE_polyline
function _OMJSUNIQUE_addPolyline(event) {
    var path = _OMJSUNIQUE_polyline.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear
    path.push(event.latLng);

    // set the marker image
    var imgVertex = new google.maps.MarkerImage(_OMJSUNIQUE_vertexImgPath + 'vertex.png', new google.maps.Size(11, 11), new google.maps.Point(0, 0), new google.maps.Point(6, 6));
    // Add a new marker at the new plotted point on the _OMJSUNIQUE_polyline.
    var marker = new google.maps.Marker({
        position: event.latLng,
        title: '#' + path.getLength(),
        draggable: true,
        map: _OMJSUNIQUE_map_eor,
        icon: imgVertex
    });

    _OMJSUNIQUE_markersPolyline.push(marker);
    //drag end event for the poly marker
    google.maps.event.addListener(marker, 'dragend', function () {

        var i = 0
        for (; i < _OMJSUNIQUE_markersPolyline.length && _OMJSUNIQUE_markersPolyline[i] != marker; i++) {
            ;
        }

        path.setAt(i, marker.getPosition());
        //_OMJSUNIQUE_saveClickedDotsOrPoly();
    });

    //_OMJSUNIQUE_saveClickedDotsOrPoly();
}

var _OMJSUNIQUE_markersPolygon = [];
//store markers on _OMJSUNIQUE_polygon
function _OMJSUNIQUE_addPolygon(event) {
    var path = _OMJSUNIQUE_polygon.getPath();

    path.push(event.latLng);

    // set the marker image
    var imgVertex = new google.maps.MarkerImage(_OMJSUNIQUE_vertexImgPath + 'vertex.png', new google.maps.Size(11, 11), new google.maps.Point(0, 0), new google.maps.Point(6, 6));
    var marker = new google.maps.Marker({
        position: event.latLng,
        title: '#' + path.getLength(),
        draggable: true,
        map: _OMJSUNIQUE_map_eor,
        icon: imgVertex
    });
    _OMJSUNIQUE_markersPolygon.push(marker);
    //drag end event for the poly marker
    google.maps.event.addListener(marker, 'dragend', function () {

        var i = 0
        for (; i < _OMJSUNIQUE_markersPolygon.length && _OMJSUNIQUE_markersPolygon[i] != marker; i++) {
            ;
        }
        path.setAt(i, marker.getPosition());
        //_OMJSUNIQUE_saveClickedDotsOrPoly();
    });

    // _OMJSUNIQUE_saveClickedDotsOrPoly();
}

//save the clicked dots value in a string format of "index,lat,lng;"
function _OMJSUNIQUE_saveClickedDotsOrPoly() {

    document.getElementById(_OMJSUNIQUE_ShapeLatLongArrayField).value = "";
    var newShapeLatLong = "";

    if (_OMJSUNIQUE_ShapeType == "Polyline") {
        if (_OMJSUNIQUE_polyline.getPath().length > 0) {
            if (_OMJSUNIQUE_markersPolyline && _OMJSUNIQUE_markersPolyline.length > 0) {
                for (var i = 0; i < _OMJSUNIQUE_markersPolyline.length; i++) {
                    newShapeLatLong += _OMJSUNIQUE_markersPolyline[i].getPosition().lat() + ":" + _OMJSUNIQUE_markersPolyline[i].getPosition().lng() + ";";
                }
            } else {
                var plth = _OMJSUNIQUE_polyline.getPath();
                // Iterate over the vertices.
                for (var i = 0; i < plth.length; i++) {
                    var xy = plth.getAt(i);
                    newShapeLatLong += xy.lat() + ":" + xy.lng() + ";";
                }
            }

            //remove the last ";"
            newShapeLatLong = newShapeLatLong.substring(0, newShapeLatLong.length - 1);
        }
    } else if (_OMJSUNIQUE_ShapeType == "Polygon") {
        if (_OMJSUNIQUE_polygon.getPath().length > 0) {
            if (_OMJSUNIQUE_markersPolygon && _OMJSUNIQUE_markersPolyline.length > 0) {
                for (var i = 0; i < _OMJSUNIQUE_markersPolygon.length; i++) {
                    newShapeLatLong += _OMJSUNIQUE_markersPolygon[i].getPosition().lat() + ":" + _OMJSUNIQUE_markersPolygon[i].getPosition().lng() + ";";
                }
            } else {
                var pgth = _OMJSUNIQUE_polygon.getPath();
                // Iterate over the vertices.
                for (var i = 0; i < pgth.length; i++) {
                    var xy = pgth.getAt(i);
                    newShapeLatLong += xy.lat() + ":" + xy.lng() + ";";
                }
            }
            //remove the last ";"
            newShapeLatLong = newShapeLatLong.substring(0, newShapeLatLong.length - 1);
        }
    }

    document.getElementById(_OMJSUNIQUE_ShapeLatLongArrayField).value = newShapeLatLong;
}

function _OMJSUNIQUE_loadMap_eor(lat, lng, name, LatField, LongField, editable, MapDiv) {

    _OMJSUNIQUE_loadMap_eor(lat, lng, name, LatField, LongField, editable, MapDiv, '');
}

function _OMJSUNIQUE_loadMap_eor(lat, lng, name, LatField, LongField, editable, MapDiv, Address) {
    _OMJSUNIQUE_loadMap_eor(lat, lng, name, LatField, LongField, editable, MapDiv, Address, null)
}

function _OMJSUNIQUE_loadMap_eor(lat, lng, name, LatField, LongField, editable, MapDiv, Address, AddressField) {
    _OMJSUNIQUE_loadMap_eor(lat, lng, name, LatField, LongField, editable, MapDiv, Address, AddressField, null, null, "", "", "", "")
}

function _OMJSUNIQUE_loadMap_eor(lat, lng, name, LatField, LongField, editable, MapDiv, Address,
                                 AddressField, ZoomField, MapTypeField, zoomlevel, maptype,
                                 SaveZoomLevel, SaveMapType, disableFields) {

    _OMJSUNIQUE_latField_eor = LatField;
    _OMJSUNIQUE_lngField_eor = LongField;
    _OMJSUNIQUE_AddressField_eor = AddressField;
    _OMJSUNIQUE_zoomLvlField_eor = ZoomField;
    _OMJSUNIQUE_MaptypeField_eor = MapTypeField;

    var gmapZoom = 14;
    var gmapType = "OPENSTREET";

    if (MapDiv == undefined || MapDiv == null || MapDiv == "")
        MapDiv = "_OMJSUNIQUE_map_eor";

    if (editable == undefined || editable == null || editable == "")
        editable = false;

    if (SaveZoomLevel == true && zoomlevel != undefined && zoomlevel != null && zoomlevel != "") {
        gmapZoom = parseInt(zoomlevel);
        if (gmapZoom <= 0)
            gmapZoom = 14;
    }
    if (SaveMapType == true && maptype != undefined && maptype != null && maptype != "") {
        gmapType = maptype;
    }

    // Save the Default Maptype and Zoom Level if the user does not trigger an event

    if (editable == true) {
        var mapTypeFld = $('#'+_OMJSUNIQUE_MaptypeField_eor);
        var zoomLvlFld = $('#'+_OMJSUNIQUE_zoomLvlField_eor);
        if(mapTypeFld.length && zoomLvlFld.length){
            mapTypeFld.val(gmapType);
            zoomLvlFld.val(gmapZoom);
        }
    }

    document.getElementById(MapDiv).style.display = "block";
    document.getElementById(MapDiv).innerHTML = "";

    // Add the OpenLayer Maps
    _OMJSUNIQUE_map_eor = new OpenLayers.Map({
        div: MapDiv,
        //projection: "EPSG:900913",
        //displayProjection: "EPSG:900913",
        projection: "EPSG:4326",
        displayProjection: "EPSG:4326",
        unit: 'm'
    });

    // create Google Mercator layers
    var gphy = new OpenLayers.Layer.Google("Google Physical", {
        mapid: "TERRAIN",
        'sphericalMercator': true,
        //'sphericalMercator': false,
        numZoomLevels: 20,
        type: google.maps.MapTypeId.TERRAIN
    });
    var gmap = new OpenLayers.Layer.Google("Google Streets", // the default
	{
	    'sphericalMercator': true,
	    //'sphericalMercator': false,
	    numZoomLevels: 20,
	    mapid: "ROADMAP"
	});
    var ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
        mapid: "HYBRID",
        'sphericalMercator': true,
        //'sphericalMercator': false,
        numZoomLevels: 20,
        type: google.maps.MapTypeId.HYBRID
    });
    var gsat = new OpenLayers.Layer.Google("Google Satellite", {
        mapid: "SATELLITE",
        'sphericalMercator': true,
        //'sphericalMercator': false,
        numZoomLevels: 20,
        type: google.maps.MapTypeId.SATELLITE
    });

    // TODO: do we need BING 2015-11-13
    // create Bing layers

    // API key for http://openlayers.org. Please get your own at
    // http://bingmapsportal.com/ and use that instead.
//    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

//    var veroad = new OpenLayers.Layer.Bing({
//        mapid: "BINGROAD",
//        'sphericalMercator': true,
//        //'sphericalMercator': false,
//        key: apiKey,
//        type: "Road",
//        wrapDateLine: true
//    });
//    var veaer = new OpenLayers.Layer.Bing({
//        mapid: "BINGSATELLITE",
//        'sphericalMercator': true,
//        //'sphericalMercator': false,
//        key: apiKey,
//        type: "Aerial",
//        wrapDateLine: true
//    });
//    var vehyb = new OpenLayers.Layer.Bing({
//        mapid: "BINGHYBRID",
//        'sphericalMercator': true,
//        //'sphericalMercator': false,
//        key: apiKey,
//        type: "AerialWithLabels",
//        wrapDateLine: true
//    });
// TODO: do we need BING 2015-11-13 END
    // create OSM layers
    var mapnik = new OpenLayers.Layer.OSM("OpenStreet Map", "", {
        'sphericalMercator': true,
        //'sphericalMercator': false,
        mapid: "OPENSTREET"
    });

    //    mapnik.projection = new OpenLayers.Projection("EPSG:4326");
    //    gphy.projection = new OpenLayers.Projection("EPSG:4326");
    //    gmap.projection = new OpenLayers.Projection("EPSG:4326");
    //    gsat.projection = new OpenLayers.Projection("EPSG:4326");
    //    ghyb.projection = new OpenLayers.Projection("EPSG:4326");
    //    veroad.projection = new OpenLayers.Projection("EPSG:4326");
    //    veaer.projection = new OpenLayers.Projection("EPSG:4326");
    //    vehyb.projection = new OpenLayers.Projection("EPSG:4326");


    // Dynamically Add the base map layers

    // Always have OpenStreet Map
    //if(_SHOW_OPENSTREET_ == true)
    _OMJSUNIQUE_map_eor.addLayer(mapnik);

    //if (_SHOW_GOOGLEPHYSICAL_ == true)
    _OMJSUNIQUE_map_eor.addLayer(gphy);
    //if (_SHOW_GOOGLESTREET_ == true)
    _OMJSUNIQUE_map_eor.addLayer(gmap);
    //if (_SHOW_GOOGLESATTELITE_ == true)
    _OMJSUNIQUE_map_eor.addLayer(gsat);
    //if (_SHOW_GOOGLEHYBRID_ == true)
    _OMJSUNIQUE_map_eor.addLayer(ghyb);

    //if (_SHOW_BINGROAD_ == true)
    //_OMJSUNIQUE_map_eor.addLayer(veroad);
    //if (_SHOW_BINGARIAL_ == true)
    // _OMJSUNIQUE_map_eor.addLayer(veaer);
    //if (_SHOW_BINGHYBRID_ == true)
    // _OMJSUNIQUE_map_eor.addLayer(vehyb);



    //_OMJSUNIQUE_map_eor.addLayers([mapnik, gphy, gmap, gsat, ghyb, veroad, veaer, vehyb]);
    // Select the Default Map Layer
    //if (SaveMapType == true && maptype != undefined && maptype != null && maptype != "") {

    if (gmapType == "ROADMAP") {
        _OMJSUNIQUE_map_eor.setBaseLayer(gmap);
    }
    else if (gmapType == "SATELLITE") {
        _OMJSUNIQUE_map_eor.setBaseLayer(gsat);
    }
    else if (gmapType == "HYBRID") {
        _OMJSUNIQUE_map_eor.setBaseLayer(ghyb);
    }
    else if (gmapType == "TERRAIN") {
        _OMJSUNIQUE_map_eor.setBaseLayer(gphy);
    }
    else if (gmapType == "OPENSTREET") {
        _OMJSUNIQUE_map_eor.setBaseLayer(mapnik);
    }
//    else if (gmapType == "BINGROAD") {
//        _OMJSUNIQUE_map_eor.setBaseLayer(veroad);
//    }
//    else if (gmapType == "BINGSATELLITE") {
//        _OMJSUNIQUE_map_eor.setBaseLayer(veaer);
//    }
//    else if (gmapType == "BINGHYBRID") {
//        _OMJSUNIQUE_map_eor.setBaseLayer(vehyb);
//    }


    if (_OMJSUNIQUE_map_eor.baseLayer == gmap ||
        _OMJSUNIQUE_map_eor.baseLayer == gsat ||
        _OMJSUNIQUE_map_eor.baseLayer == ghyb ||
        _OMJSUNIQUE_map_eor.baseLayer == gphy
    ) {
        if (gmapZoom > 19)
            gmapZoom = 19;
    }
//    if (_OMJSUNIQUE_map_eor.baseLayer == mapnik ||
//        _OMJSUNIQUE_map_eor.baseLayer == veroad ||
//        _OMJSUNIQUE_map_eor.baseLayer == veaer ||
//        _OMJSUNIQUE_map_eor.baseLayer == vehyb
//        ) {
//        if (gmapZoom > 18)
//            gmapZoom = 18;
//    }
    if (_OMJSUNIQUE_map_eor.baseLayer == mapnik ) {
        if (gmapZoom > 18)
            gmapZoom = 18;
    }



    //}

    _OMJSUNIQUE_map_eor.addControl(new OpenLayers.Control.LayerSwitcher());
    _OMJSUNIQUE_map_eor.addControl(new OpenLayers.Control.MousePosition());

    if(disableFields){
        // Disabling scroll over map
        var controls = _OMJSUNIQUE_map_eor.getControlsByClass('OpenLayers.Control.Navigation');
        for(var i = 0; i < controls.length; ++i){
            // use it to disable scrolling
//        if (_OMJSUNIQUE_map_eor.controls[i].displayClass ==
//            "olControlNavigation") {
//            _OMJSUNIQUE_map_eor.controls[i].deactivate();
//        }
            controls[i].disableZoomWheel();
        }
    }

    // The location of our marker and popup.
    var point = new OpenLayers.LonLat(lng, lat).transform(new OpenLayers.Projection("EPSG:4326"), _OMJSUNIQUE_map_eor.getProjectionObject());

    _OMJSUNIQUE_map_eor.setCenter(point, gmapZoom, false);

    // Create a MarkerLayer
    _OMJSUNIQUE_markersLayer = new OpenLayers.Layer.Markers("Markers");
    _OMJSUNIQUE_map_eor.addLayer(_OMJSUNIQUE_markersLayer);

    // Define the marker style
    var size = new OpenLayers.Size(21, 25);
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
    //var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
	var icon = new OpenLayers.Icon('http://speeduperp.se/staticMaplite/images/markers/ol-marker.png', size, offset);

    var feature = new OpenLayers.Feature(_OMJSUNIQUE_markersLayer, point);
    feature.closeBox = true;
    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.Anchored, {
        minSize: new OpenLayers.Size(50, 50)
    })
    feature.data.popupContentHTML = "<table class='_mapAddPoPup123' style='width: 100%; border: 0px solid #ee0000;'><tr><td><b>" + name + "</b>: <br />" + "<br />Address: " + Address + "<br />Latitude: " + lat + ", Longitude: " + lng + "<br /> </td></tr></table>";

    _OMJSUNIQUE_mapMarker_eor = new OpenLayers.Marker(point, icon.clone());
    _OMJSUNIQUE_mapMarker_eor.feature = feature;

    var markerClick = function (evt) {
        var $this = this;
        var AddresspopupId = $this.id + "_popup";
        if (_OMJSUNIQUE_latField_eor != null && _OMJSUNIQUE_lngField_eor != null) {
            lat = document.getElementById(_OMJSUNIQUE_latField_eor).value;
            lng = document.getElementById(_OMJSUNIQUE_lngField_eor).value;
        }
        if (lat != "" && lng != "") {
            var geocoder = new google.maps.Geocoder();
            var latLng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({
                'latLng': latLng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    Address = results[0].formatted_address;
                    if (_OMJSUNIQUE_AddressField_eor != null && $("#" + _OMJSUNIQUE_AddressField_eor).val() == "") {
                        $("#" + _OMJSUNIQUE_AddressField_eor).val(Address);
                    }
                    var addressHtml = "<tr><td><b>" + name + "</b>: <br />" + "<br />Address: " + Address + "<br />Latitude: " + lat + ", Longitude: " + lng + "<br /> </td></tr>";
                    if ($this.popup == null) {
                        $this.popup = $this.createPopup($this.closeBox);
                        _OMJSUNIQUE_map_eor.addPopup($this.popup);
                        $("#" + AddresspopupId).find("._mapAddPoPup123").html(addressHtml);//to update the current location on address popup  on marker click
                        $this.popup.show();
                        $this.popup.updateSize();
                    } else {
                        $("#" + AddresspopupId).find("._mapAddPoPup123").html(addressHtml);//to update the current location on address popup on marker click
                        $this.popup.toggle();
                    }
                    OpenLayers.Event.stop(evt);
                }
            });
        }


    };
    //_OMJSUNIQUE_mapMarker_eor.events.register("mouseover", feature, markerClick);

    _OMJSUNIQUE_markersLayer.addMarker(_OMJSUNIQUE_mapMarker_eor);




    _OMJSUNIQUE_EditableMap = editable;
    _OMJSUNIQUE_EditableMapLatField = LatField;
    _OMJSUNIQUE_EditableMapLongField = LongField;

    var EditMapClickFunction = function (event) {

        if (_OMJSUNIQUE_EditableMap == true) {
            var $this = this;

            // update the point coordinates in the text fields.
            _OMJSUNIQUE_updateMarkerPosition(event, _OMJSUNIQUE_EditableMapLatField, _OMJSUNIQUE_EditableMapLongField, AddressField);

            // this position
            var position = _OMJSUNIQUE_map_eor.getLonLatFromPixel(event.xy);


            //_OMJSUNIQUE_mapMarker_eor.lonlat = position;
            //_OMJSUNIQUE_map_eor.setCenter(position);
            //_OMJSUNIQUE_markersLayer.redraw();


            //_OMJSUNIQUE_mapMarker_eor.moveTo(event.xy)
            //_OMJSUNIQUE_markersLayer.clearMarkers();
            //_OMJSUNIQUE_markersLayer.drawMarker(_OMJSUNIQUE_mapMarker_eor);
            var newLonLat = new OpenLayers.LonLat(position.lon, position.lat);
            var newPx = _OMJSUNIQUE_map_eor.getLayerPxFromLonLat(newLonLat);
            _OMJSUNIQUE_mapMarker_eor.moveTo(newPx);

            //  _OMJSUNIQUE_map_eor.addLayer(_OMJSUNIQUE_markersLayer);
            //  var size = new OpenLayers.Size(21, 25);
            //  var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
            //  var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
            ////  _OMJSUNIQUE_mapMarker_eor = new OpenLayers.Layer.Markers("Markers");
            //  _OMJSUNIQUE_markersLayer.addMarker(new OpenLayers.Marker(position, icon));

            OpenLayers.Event.stop(event);
        }
    }



    // CodeUpdate.Start.20150209
    // Updated By: Mojeeb. 2015-02-09
    // Replacing the click event of the map with new code from Loai
    //_OMJSUNIQUE_map_eor.events.register("click", _OMJSUNIQUE_map_eor, EditMapClickFunction);

    // This is the new code for click event so that in mobile we can move the marker.
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 20, // tolerance of 20 pixel will allow the user to touch the map in mobile within 20 pixel radius to move the marker.
            'stopSingle': false,
            'stopDouble': false
        },

        initialize: function (options) {
            this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
            OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    );
            this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': EditMapClickFunction
                        }, this.handlerOptions
                    );
        },

        trigger: function (e) {
            // click logic here.
        }

    });

    var click = new OpenLayers.Control.Click();
    _OMJSUNIQUE_map_eor.addControl(click);
    click.activate(); 
    // CodeUpdate.End.20150209




    if (SaveZoomLevel == true) {
        _OMJSUNIQUE_map_eor.events.register("zoomend", _OMJSUNIQUE_map_eor, _OMJSUNIQUE_onZoomLevelChanged);
    }
    if (SaveMapType == true) {
        _OMJSUNIQUE_map_eor.events.register("changebaselayer", _OMJSUNIQUE_map_eor, _OMJSUNIQUE_onMapTypeChanged);
    }

    ////    // ADD SOME 3rd PARTY MAP

    ////    var Nordicwms = new OpenLayers.Layer.WMS(
    ////        'Nordic SGU 1:1M Bedrock Lithology - Fennoscandian Shield',
    ////        'http://maps2.sgu.se/wmsconnector/com.esri.wms.Esrimap/SGU_Bedrock_geology_Fennoscandian_shield?',
    ////        {
    ////            layers: 'NORDIC_SGU_1M_BLT',
    ////            SRS: "EPSG:4326",
    ////            CRS: "EPSG:4326",
    ////            transparent: 'true',
    ////            'sphericalMercator': true
    ////        }
    ////    )
    ////    //Nordicwms.projection = new OpenLayers.Projection("EPSG:4326");
    ////    _OMJSUNIQUE_map_eor.addLayer(Nordicwms);

    ////    var bwms = new OpenLayers.Layer.WMS("NewMap",
    ////                    "http://mapbender.wheregroup.com/cgi-bin/mapserv?map=/data/umn/osm/osm_basic.map&",
    ////                    {
    ////                        //getURL: get_my_url
    ////                        layers: "Grenzen",
    ////                        version: "1.1.1",
    ////                        request: "GetMap",
    ////                        format: "image/jpeg",
    ////                        Service: "WMS",
    ////                        SRS: "EPSG:4326",
    ////                        CRS: "EPSG:4326",
    ////                        styles: "default",
    ////                        'sphericalMercator': true
    ////                    }
    ////                );

    ////    //bwms.projection = new OpenLayers.Projection("EPSG:4326");
    ////    _OMJSUNIQUE_map_eor.addLayer(bwms);

    ////    _OMJSUNIQUE_map_eor.addLayer(new OpenLayers.Layer.TMS("Name",
    ////                       "http://example.com/",
    ////                       { 'type': 'png', 'getURL': WMSGetTileUrl })
    ////                       );
}
function _OMJSUNIQUE_toggleEditableMap(editable) {

    if (editable == undefined || editable == null || editable == "")
        editable = false;

    _OMJSUNIQUE_EditableMap = editable;

}
function WMSGetTileUrl(bounds) {
    ////    var projection = _OMJSUNIQUE_map_eor.getProjection();
    ////    var zpow = Math.pow(2, zoom);
    ////    var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
    ////    var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
    ////    var ulw = projection.fromPointToLatLng(ul);
    ////    var lrw = projection.fromPointToLatLng(lr);

    //    var res = _OMJSUNIQUE_map_eor.getResolution();
    //    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    //    var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    //    var z = _OMJSUNIQUE_map_eor.getZoom();

    //The user will enter the address to the public WMS layer here.  The data must be in WGS84
    var baseURL = "http://mapbender.wheregroup.com/cgi-bin/mapserv?map=/data/umn/osm/osm_basic.map&";
    var version = "1.1.1";
    var request = "GetMap";
    var format = "image%2Fjpeg";
    //type of image returned  or image/jpeg
    //The layer ID.  Can be found when using the layers properties tool in ArcMap or from the WMS settings
    var layers = "Grenzen";
    //projection to display. This is the projection of google map. Don't change unless you know what you are doing.
    //Different from other WMS servers that the projection information is called by crs, instead of srs
    var crs = "EPSG:4326";
    //With the 1.3.0 version the coordinates are read in LatLon, as opposed to LonLat in previous versions
    //var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
    //var bbox = lrw.lat() + "," + lrw.lng() + "," + ulw.lat() + "," + ulw.lng();
    //var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
    var bbox = bounds.left + "," + bounds.top + "," + bounds.right + "," + bounds.bottom;
    //var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
    //var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
    var service = "WMS";
    //the size of the tile, must be 256x256
    var width = "256";
    var height = "256";
    //Some WMS come with named styles.  The user can set to default.
    var styles = "default";
    //Establish the baseURL.  Several elements, including &EXCEPTIONS=INIMAGE and &Service are unique to openLayers addresses.
    var url = baseURL + "Layers=" + layers + "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&Styles=" + styles + "&format=" + format + "&SRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height;
    return url;

    //return "http://mapbender.wheregroup.com/cgi-bin/mapserv?map=/data/umn/osm/osm_basic.map&LAYERS=Grenzen&TRANSPARENT=true&FORMAT=image/png&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application/vnd.ogc.se_inimage&SRS=EPSG:4326"+ "&BBOX=" + bbox + "&width=" + width + "&height=" + height;

}

function _OMJSUNIQUE_GetLatLongFromAddress(LatField, LongField, AddressField) {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById(AddressField).value;

    if (address != "") {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                // Update the Lat Long text boxes
                document.getElementById(LatField).value = results[0].geometry.location.lat();
                document.getElementById(LongField).value = results[0].geometry.location.lng();

                if (_OMJSUNIQUE_map_eor != null && _OMJSUNIQUE_map_eor != undefined) {

                    var point = new OpenLayers.LonLat(results[0].geometry.location.lng(), results[0].geometry.location.lat()).transform(new OpenLayers.Projection("EPSG:4326"), _OMJSUNIQUE_map_eor.getProjectionObject());

                    _OMJSUNIQUE_mapMarker_eor.lonlat = point;
                    _OMJSUNIQUE_map_eor.setCenter(point);

                    _OMJSUNIQUE_markersLayer.redraw();
                }

            } else {
                document.getElementById(LatField).value = "";
                document.getElementById(LongField).value = "";
            }
        });
    }
}

function _OMJSUNIQUE_GetAddressFromLatLong(LatField, LongField, AddressField) {

    if (AddressField != undefined && AddressField != null && AddressField != "") {
        var geocoder = new google.maps.Geocoder();
        var lat = document.getElementById(LatField).value;

        var lng = document.getElementById(LongField).value;

        if (lat != "" && lng != "") {
            var latLng = new google.maps.LatLng(lat, lng);

            geocoder.geocode({
                'latLng': latLng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // Update the address text box 
                    $("#" + AddressField).val(results[0].formatted_address);
                } else {
                    $("#" + AddressField).val("");
                }
            });
        }
    }
}

function _OMJSUNIQUE_updateMarkerPosition(event, LatField, LongField, AddressField) {

    if (_OMJSUNIQUE_EditableMap == true) {
        // Change the projection of the points to match the map projections
        var position = _OMJSUNIQUE_map_eor.getLonLatFromPixel(event.xy).transform(_OMJSUNIQUE_map_eor.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));

        if (LatField != undefined && LatField != null && LatField != "")
            document.getElementById(LatField).value = position.lat;
        if (LongField != undefined && LongField != null && LongField != "")
            document.getElementById(LongField).value = position.lon;
        if (AddressField != undefined && AddressField != null && AddressField != "") {
            _OMJSUNIQUE_GetAddressFromLatLong(LatField, LongField, AddressField);
        }
    }
}

function _OMJSUNIQUE_getCurrentLocation(LatField, LongField, AddressField) {

    _OMJSUNIQUE_latField_eor = LatField;
    _OMJSUNIQUE_lngField_eor = LongField;
    _OMJSUNIQUE_AddressField_eor = AddressField;

    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(_OMJSUNIQUE_onPositionUpdate);
    else
        alert("navigator.geolocation is not available");
}

function _OMJSUNIQUE_onPositionUpdate(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    var point = new OpenLayers.LonLat(lng, lat).transform(new OpenLayers.Projection("EPSG:4326"), _OMJSUNIQUE_map_eor.getProjectionObject())
    _OMJSUNIQUE_mapMarker_eor.lonlat = point;
    _OMJSUNIQUE_map_eor.setCenter(point);

    _OMJSUNIQUE_markersLayer.redraw();

    if (_OMJSUNIQUE_latField_eor != undefined && _OMJSUNIQUE_latField_eor != null && _OMJSUNIQUE_latField_eor != "")
        document.getElementById(_OMJSUNIQUE_latField_eor).value = lat;
    if (_OMJSUNIQUE_lngField_eor != undefined && _OMJSUNIQUE_lngField_eor != null && _OMJSUNIQUE_lngField_eor != "")
        document.getElementById(_OMJSUNIQUE_lngField_eor).value = lng;

    _OMJSUNIQUE_GetAddressFromLatLong(_OMJSUNIQUE_latField_eor, _OMJSUNIQUE_lngField_eor, _OMJSUNIQUE_AddressField_eor);

    //alert("Current position: " + lat + " " + lng);
}

function _OMJSUNIQUE_onZoomLevelChanged() {
    if (_OMJSUNIQUE_EditableMap == true) {
        document.getElementById(_OMJSUNIQUE_zoomLvlField_eor).value = _OMJSUNIQUE_map_eor.getZoom();
    }
}

function _OMJSUNIQUE_onMapTypeChanged() {
    if (_OMJSUNIQUE_EditableMap == true) {
        document.getElementById(_OMJSUNIQUE_MaptypeField_eor).value = _OMJSUNIQUE_map_eor.baseLayer.mapid.toUpperCase();
    }
}

