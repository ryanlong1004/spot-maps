var wfo = "all";
//var autoRefresh = "< ?php echo $autoRefresh; ? >";
var map = null;
var dataLayer = null;
var info = null;
var dataCRC = 1;
var defaultMarkerData = null;
var popup = null;
var reqtime = '';

var ACCESS_BLOCKED = -1;
var ACCESS_KNOWN = 1;
var ACCESS_VIEW = 2;
var ACCESS_OWNER = 3;
var ACCESS_EDIT = 4;

// rjh 24oct16 Added autoRefresh.  To reduce bandwidth, set it up so that the auto 
// refresh was only available when the user also narrowed the request to a specific wfo. 
//	if (wfo != 'all' && autoRefresh == 'yes') {
//		function refresh() {
//			window.location.reload(true);
//		}
//		setTimeout(refresh, 120000);
//	}

$(function () {
    $("#dialog-confirm-close").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Archive Incident': function () {
                var snumunum = $(this).data('snumunum');
                closeRequest(snumunum)
                $(this).dialog('close');
            },
            Cancel: function () {
                $(this).dialog('close');
            }
        }
    });
});

$(function () {
    $("#dialog-confirm-delete").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Delete Request': function () {
                var snumunum = $(this).data('snumunum');
                deleteRequest(snumunum);
                if (popup) {
                    popup.hide();
                };
                $(this).dialog('close');
            },
            Cancel: function () {
                $(this).dialog('close');
            }
        }
    });
});

$(function () {
    $("#dialog-delete-success").dialog({
        resizable: false,
        height: 160,
        width: 250,
        modal: true,
        autoOpen: false,
        //			dialogClass: 'greenpopup',
        buttons: {
            'OK': function () {
                refreshDisplay();
                $(this).dialog('close');
            }
        },
        open: function (event, ui) {
            $(document).css('position', 'fixed');
        }
    });
});

/*
 ===============================================================================
 Crc32 is a JavaScript function for computing the CRC32 of a string
 Version: 1.2 - 2006/11 - http://noteslog.com/category/javascript/
 Copyright (c) 2006 Andrea Ercolino
 http://www.opensource.org/licenses/mit-license.php
 ===============================================================================
 */
var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

/* Number */
function crc32(/* String */ str, /* Number */ crc) {
    if (crc == window.undefined)
        crc = 0;
    var n = 0; //a number between 0 and 255
    var x = 0; //an hex number

    crc = crc ^ (-1);
    for (var i = 0, iTop = str.length; i < iTop; i++) {
        n = (crc ^ str.charCodeAt(i)) & 0xFF;
        x = "0x" + table.substr(n * 9, 8);
        crc = (crc >>> 8) ^ x;
    }
    return crc ^ (-1);
}

// This is a synchronous call 
// rjh 26sep17 removed this unused function
/*    function getAllMarkers() { //, proj, displayProj, markerData) {
        //console.log('getAllMarkers');
        var markerData = null;
        $.ajax({
            type: 'GET',
            url: 'monitor_server_json.php',
            dataType: 'json',
            success: function (data) {
                markerData = data;
                //console.log(markerData);
            },
            data: "",
            async: false
        });
        return markerData;
    } */
function displayCalendar() {
    var mcenter = ol.proj.toLonLat(map.getView().getCenter());
    var mlat = mcenter[1];
    var mlon = mcenter[0];
    var mzoom = map.getView().getZoom();
    if (wfo != "") {
        window.location.href = "../php/calendar.php?lat=" + mlat + "&lon=" + mlon + "&z=" + mzoom + "&mode=active&wfo=" + wfo;
    } else {
        window.location.href = "../php/calendar.php?lat=" + mlat + "&lon=" + mlon + "&z=" + mzoom + "&mode=active";
    }
}

function viewForecast(snumunum) {
    var mcenter = ol.proj.toLonLat(map.getView().getCenter());
    var mlat = mcenter[1];
    var mlon = mcenter[0];
    var mzoom = map.getView().getZoom();
    window.location.href = "../php/forecast.php?snumunum=" + snumunum + "&lat=" + mlat + "&lon=" + mlon + "&z=" + mzoom;
}

function onCloseRequest(snumunum, spotname) {
    $("#incidentname").html(spotname)
    $("#dialog-confirm-close").data('snumunum', snumunum).dialog("open");
}

function closeRequest(snumunum) {
    $.ajax({
        type: 'POST',
        url: '../php/archive_server.php',
        dataType: 'json',
        success: function (data) {
            if (data != snumunum) {
                alert("ERROR: " + data);
            } else {
                refreshDisplay();
            }
        },
        error: function () {
            alert("There was an Error Closing the Incident");
        },
        data: { snumunum: snumunum },
        async: false
    });
}

function onConfirmDeleteRequest(snumunum, spotname) {
    $("#incidentnamedelete").html(spotname)
    $("#dialog-confirm-delete").data('snumunum', snumunum).dialog("open");
}

function deleteRequestNEW(snumunum) {
    alert(snumunum);
    snumunum = snumunum.substring(0, snumunum.indexOf('.'));
    alert(snumunum);
    $.ajax({
        action: 'ACTION_DELETEREQUEST', // ACTION_FEEDBACK
        spotid: snumunum,
        type: 'POST',
        url: '../php/fcst_server.php',
        dataType: 'text',
        success: function (data) {
            $("#dialog-delete-success").dialog('open');
            refreshDisplay();
        },
        error: function () {
            alert("There was an Error Deleting the Request");
        },
        async: false
    });
}

function deleteRequest(spotId) {
    spotId = spotId.substring(0, spotId.indexOf('.'));
    $.post(
        '../php/fcst_server.php',
        {
            action: 'ACTION_DELETEREQUEST', // ACTION_FEEDBACK
            spotid: spotId
        },
        function (response) {
            if (response == "error") {
                alert("There was an Error Deleting the Request");
            } else {
                $("#dialog-delete-success").dialog('open');
                refreshDisplay();
            }
        }
    );
}

function onChangeRequest(snumunum, spotname) {
    var mcenter = ol.proj.toLonLat(map.getView().getCenter());
    var mlat = mcenter[1];
    var mlon = mcenter[0];
    var mzoom = map.getView().getZoom();

    var baseLocation = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);
    var updateLink = baseLocation + '../php/spot_request.php' + '?snumunum=' + snumunum + '&changerequest=true' + '&formtype=request_form' + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom;
    window.location.href = updateLink;
}

function onRequestForecastUpdate(snumunum, lat, lon) {
    spotId = snumunum.substr(0, 7); // Remove update num 1601684.0
    var baseLocation = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);
    // Hardcoded zoom level
    var requestUpdateLinkThisIncident = baseLocation + '../php/spot_request.php' + '?spotid=' + spotId + '&copynewspotrequestthisincident=true' + '&formtype=request_form' + '&lat=' + lat + '&lon=' + lon + '&z=6';
    location.href = requestUpdateLinkThisIncident;
}

// Display will only refresh when data has changed for any open spot
function refreshDisplay() {
    var newCRC = 1;
    var get_wfo = '';
    var mcenter = ol.proj.toLonLat(map.getView().getCenter());
    var mlat = mcenter[1];
    var mlon = mcenter[0];
    var mzoom = map.getView().getZoom();

    var extent = map.getView().calculateExtent(map.getSize());
    var bnds = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

    var ul_lat = bnds[3];
    var ul_lon = (bnds[0] + 540) % 360 - 180; //bnds[0];
    var lr_lat = bnds[1];
    var lr_lon = (bnds[2] + 540) % 360 - 180;  //bnds[2];

    reqtime = new Date().getTime();
    var get_str = "ullat=" + ul_lat + "&ullon=" + ul_lon + "&lrlat=" + lr_lat + "&lrlon=" + lr_lon + "&reqtime=" + reqtime;
    if (wfo != "") {
        get_str = get_str + "&wfo=" + wfo;
    }

    $.getJSON("monitor_server_json.php?" + get_str, function (json) {
        json.reqtime = 123456789; // 3apr18 Don't want the timestamp included in determining if data has changed
        var defaultJSONData = $.toJSON(json);
        newCRC = crc32(defaultJSONData); // Set global varialble value
        //console.log('refreshDisplay::' + newCRC);
        //console.log('dataCRC:'+ dataCRC);
        if (newCRC != dataCRC) {
            dataCRC = newCRC;
            //drawActiveSpots();
            //				drawActiveSpotsPartial(); // rjh 2apr18
            //				makeExtentTable();
            makeExtentTable_drawSpots();
        }
    });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var zoomLevel = 4;
//var center_pt = null;
var centerLat = null;
var centerLon = null;
var markersArray = [];

function drawMap() {
    //console.log('drawMap');
    var sourceBasePrefix = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
    var sourceBaseSuffix = '/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0';
    var centroid_lat = parseFloat(centerLat);
    var centroid_lon = parseFloat(centerLon);

    var attribution = new ol.Attribution({
        html: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>'
    });

    var topoSource = new ol.source.XYZ({
        url: sourceBasePrefix + 'World_Topo_Map' + sourceBaseSuffix,
        attributions: [attribution]
    });

    var imagerySource = new ol.source.XYZ({
        url: sourceBasePrefix + 'World_Imagery' + sourceBaseSuffix,
        attributions: [attribution]
    });

    var transportationSource = new ol.source.XYZ({
        url: sourceBasePrefix + 'Reference/World_Transportation' + sourceBaseSuffix,
        attributions: [attribution]
    });

    var backgroundLayer = new ol.layer.Tile();
    backgroundLayer.setSource(topoSource);
    backgroundLayer['id'] = 'map';

    var topoGroup = new ol.layer.Group({
        layers: [
            new ol.layer.Tile({
                source: imagerySource
            }),
            new ol.layer.Tile({
                source: transportationSource
            })
        ],
        id: 'sat',
        visible: false
    });

    dataLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: []
        })
    });

    var mapView = new ol.View({
        center: ol.proj.fromLonLat([centroid_lon, centroid_lat]),
        zoom: zoomLevel
    });

    map = new ol.Map({
        layers: [
            backgroundLayer,
            topoGroup,
            dataLayer
        ],
        view: mapView,
        target: 'map_canvas_monitor'
    });

    map.on("moveend", function (e) {
        //console.log('moveend');
        //           drawActiveSpotsPartial(); // rjh 2apr18
        //           makeExtentTable();
        makeExtentTable_drawSpots()
    });

    var buttonMap = document.createElement('button');
    buttonMap.innerHTML = 'Map';
    var buttonSat = document.createElement('button');
    buttonSat.innerHTML = 'Satellite';

    var handleLayerMap = function (e) {
        e.preventDefault();
        toggleMapLayer('map');
    };
    var handleLayerSat = function (e) {
        e.preventDefault();
        toggleMapLayer('sat');
    };

    function toggleMapLayer(mapId) {
        var layers = map.getLayers();
        layers.forEach(function (layer) {
            if (typeof layer.get('id') !== 'undefined') {
                layer.setVisible(layer.get('id') === mapId ? true : false);
            }
        });
    }

    buttonMap.addEventListener('click', handleLayerMap, false);
    buttonSat.addEventListener('click', handleLayerSat, false);

    var element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(buttonMap);
    element.appendChild(buttonSat);

    var LayerControl = new ol.control.Control({
        element: element
    });
    map.addControl(LayerControl);

    popup = new ol.Overlay.Popup();
    map.addOverlay(popup);

    map.on("singleclick", function (e) {
        // rjh 25oct16 Changed to get the first feature which should be the most recent start_dtg
        var allFeaturesAtPixel = [];
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
            allFeaturesAtPixel.push(feature);
        });
        var content = getPopupContent(allFeaturesAtPixel[0].get("spot"));
        showPopup(allFeaturesAtPixel[0].getGeometry().getCoordinates(), content);

        //            map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        //                var content = getPopupContent(feature.get("spot"));
        //                showPopup(feature.getGeometry().getCoordinates(), content);
        //            });
    });
}

function showPopup(coords, content) {
    popup.show(coords, content);
}
/* OBSOLETE
    function makeExtentTable() {
    //console.log('fromwhere:' + fromwhere);		
        var mcenter = ol.proj.toLonLat(map.getView().getCenter());
        var mlat = mcenter[1];
        var mlon = mcenter[0];
        var mzoom = map.getView().getZoom();
    
        var extent = map.getView().calculateExtent(map.getSize());
        var bnds = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
        
        var ul_lat = bnds[3];
        var ul_lon = (bnds[0]+540)%360 - 180; //bnds[0];
        var lr_lat = bnds[1];
        var lr_lon = (bnds[2]+540)%360 - 180;  //bnds[2];
        
        reqtime = new Date().getTime();
        var get_str = "ullat=" + ul_lat + "&ullon=" + ul_lon + "&lrlat=" + lr_lat + "&lrlon=" + lr_lon + "&reqtime=" + reqtime;
        if (wfo != "") {
            get_str = get_str + "&wfo=" + wfo;
        }
//console.log('get_str:' + get_str);		
        var makeWide = false;
        $("#mspottable").jqGrid('clearGridData');
        $.getJSON("monitor_server_json.php?" + get_str, function (spotjson) {
            //console.log('reqtime:' + spotjson.reqtime);
            if (spotjson.reqtime < reqtime) {
//console.log('aborted makeExtentTable');		
                return;
            }
            spotjson.reqtime=123456789; // 3apr18 Don't want the timestamp included in determining if data has changed
            var defaultJSONData = $.toJSON(spotjson);
            dataCRC = crc32(defaultJSONData); // Set global varialble value
            //console.log('makeExtentTable::' + dataCRC);
        	
            $.each(spotjson.rows, function (i, spot) {
            // rjh 20oct16 temp kludge to fix problem with apostrophes in name cause js errors
            //jsSafeName = spot.name.replace("&#39;", "'");
            //jsSafeName = spot.name.replace(/'/g, "\\'");
            var jsSafeName = spot.name.replace(/&#39;/g, "'");
            jsSafeName = jsSafeName.replace(/'/g, "\\'");

                //spot.accesslevel = ACCESS_OWNER;
                if (spot.accesslevel == ACCESS_EDIT) {
                    makeWide = true; // A wfo is accessing this page so make grid wider to accomadate the close option
                    if (spot.stat == 'C') {
                        spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></span>';
                        spot.acts += '<br /><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + mlat + '\',\'' + mlon + '\')">Request Forecast Update</a>&nbsp;|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                    }
                    if (spot.stat == 'P') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></span>';
                        spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                    }
                    if (spot.stat == 'Q') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></span>';
                        spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                   }
                } else {
                    if (spot.accesslevel == ACCESS_OWNER) {
                        if (spot.stat == 'C') {
                              spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol"></span>';
                            spot.acts += '<br /><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + mlat + '\',\'' + mlon + '\')">Request Forecast Update</a>&nbsp;|<span class="archiveDeleteCol"></span>';
                        }
                        if (spot.stat == 'P') {
                            spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                            spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                        }
                        if (spot.stat == 'Q') {
                            spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                            spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                        }
                    } else if (spot.accesslevel == ACCESS_VIEW) {
                        if (spot.stat == 'C') {
                            spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol"></span>';
                        }
                        if (spot.stat == 'P') {
//                            spot.acts = '<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + spot.name + '\')">Change&nbsp;Request</a>&nbsp;|&nbsp;' + '<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;';
                            spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                        }
                        if (spot.stat == 'Q') {
//                            spot.acts = '<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + spot.name + '\')">Change&nbsp;Request</a>&nbsp;|&nbsp;' + '<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;';
                            spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                        }
                    } else {
                        if (spot.stat == 'C') {
                              spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>';
                spot.acts += '<br /><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + mlat + '\',\'' + mlon + '\')">Request Forecast Update</a>&nbsp;';
                        }
                        if (spot.stat == 'P') {
                            spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>';
                        }
                        if (spot.stat == 'Q') {
                            spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>';
                        }
//                        if (spot.accesslevel != ACCESS_BLOCKED) {
// 	                        spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol"></span>';
//                       }
                    }
                }
                spot.name = '<a href="../php/forecast.php?snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">' + spot.name + '</a>';
           });
            buildTable(spotjson.rows, makeWide);
        });
    }
*/

function makeExtentTable_drawSpots() {
    //console.log('fromwhere:' + fromwhere);		
    var mcenter = ol.proj.toLonLat(map.getView().getCenter());
    var mlat = mcenter[1];
    var mlon = mcenter[0];
    var mzoom = map.getView().getZoom();

    var extent = map.getView().calculateExtent(map.getSize());
    var bnds = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

    var ul_lat = bnds[3];
    var ul_lon = (bnds[0] + 540) % 360 - 180; //bnds[0];
    var lr_lat = bnds[1];
    var lr_lon = (bnds[2] + 540) % 360 - 180;  //bnds[2];

    reqtime = new Date().getTime();
    var get_str = "ullat=" + ul_lat + "&ullon=" + ul_lon + "&lrlat=" + lr_lat + "&lrlon=" + lr_lon + "&reqtime=" + reqtime;
    if (wfo != "") {
        get_str = get_str + "&wfo=" + wfo;
    }
    //console.log('get_str:' + get_str);		
    var makeWide = false;
    $("#mspottable").jqGrid('clearGridData');
    $.getJSON("monitor_server_json.php?" + get_str, function (spotjson) {
        //console.log('reqtime:' + spotjson.reqtime);
        if (spotjson.reqtime < reqtime) {
            //console.log('aborted makeExtentTable_drawSpots()');		
            return;
        }
        spotjson.reqtime = 123456789; // 3apr18 Don't want the timestamp included in determining if data has changed
        var defaultJSONData = $.toJSON(spotjson);
        dataCRC = crc32(defaultJSONData); // Set global varialble value
        //console.log('makeExtentTable_drawSpots()::' + dataCRC);

        // rjh 3apr18 Added the placing of markers in same this function to reduce number of calls to monitor_server_json.php
        //  Spots are returned in DESC order (ORDER BY spot_rqst.req_status, spot_rqst.start_dtg DESC)
        //  When there are multiple spots at the same location, we want the most recent spot to be on top
        var nLen = spotjson.rows.length;
        for (i = nLen - 1; i > -1; i--) {
            addMarker(spotjson.rows[i]);
        }

        $.each(spotjson.rows, function (i, spot) {
            // rjh 20oct16 temp kludge to fix problem with apostrophes in name cause js errors
            var jsSafeName = spot.name.replace(/&#39;/g, "'");
            jsSafeName = jsSafeName.replace(/'/g, "\\'");

            //spot.accesslevel = ACCESS_OWNER;
            if (spot.accesslevel == ACCESS_EDIT) {
                makeWide = true; // A wfo is accessing this page so make grid wider to accomadate the close option
                if (spot.stat == 'C') {
                    spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></span>';
                    spot.acts += '<br /><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + mlat + '\',\'' + mlon + '\')">Request Forecast Update</a>&nbsp;|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                } else if (spot.stat == 'P') {
                    spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></span>';
                    spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                } else if (spot.stat == 'Q') {
                    spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></span>';
                    spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                }
            } else {
                if (spot.accesslevel == ACCESS_OWNER) {
                    if (spot.stat == 'C') {
                        spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol"></span>';
                        spot.acts += '<br /><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + mlat + '\',\'' + mlon + '\')">Request Forecast Update</a>&nbsp;|<span class="archiveDeleteCol"></span>';
                    } else if (spot.stat == 'P') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                        spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                    } else if (spot.stat == 'Q') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                        spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                    }
                } else if (spot.accesslevel == ACCESS_VIEW) {
                    if (spot.stat == 'C') {
                        spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol"></span>';
                    } else if (spot.stat == 'P') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                    } else if (spot.stat == 'Q') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                    }
                } else {
                    if (spot.stat == 'C') {
                        spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol"></span>';
                        spot.acts += '<br /><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + mlat + '\',\'' + mlon + '\')">Request Forecast Update</a>&nbsp;|<span class="archiveDeleteCol"></span>';
                    } else if (spot.stat == 'P') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                        spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                    } else if (spot.stat == 'Q') {
                        spot.acts = '<span class="changeRequestCol"><a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a></span>' + '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol">&nbsp;</span>';
                        spot.acts += '<br />|<span class="archiveDeleteCol">&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></span>';
                    }
                    if (spot.accesslevel != ACCESS_BLOCKED) {
                        spot.acts = '|<span class="submitObsCol">&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></span>' + '|<span class="archiveDeleteCol"></span>';
                    }
                }
            }
            spot.name = '<a href="../php/forecast.php?snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">' + spot.name + '</a>';
        });
        buildTable(spotjson.rows, makeWide);
    });
}

function buildTable(data, makeWide) {
    var actsWidth = 240;
    $("#mspottable").jqGrid('clearGridData');
    if (makeWide == true) {
        actsWidth = 240;
    }

    $("#mspottable").jqGrid({
        datatype: "local",
        colNames: ['ID', 'Name', 'Type/Deliver Time', 'TID', 'LAT', 'LON', 'RQST', 'Ignition Time', 'Stat', 'Status', 'WFO', 'WFOID', 'Actions'],
        colModel: [
            { name: 'snumunum', index: 'snumunum', width: 1, hidden: true },
            { name: 'name', index: 'name', width: 240 },
            { name: 'type', index: 'type', width: 150 },
            { name: 'tid', index: 'tid', width: 1, hidden: true },
            { name: 'lat', index: 'lat', width: 1, hidden: true },
            { name: 'lon', index: 'lon', width: 1, hidden: true },
            { name: 'rmade', index: 'rmade', width: 160, hidden: true },
            { name: 'rfill', index: 'rfill', width: 170, hidden: true },
            { name: 'stat', index: 'stat', width: 1, hidden: true },
            { name: 'stattext', index: 'stattext', align: 'left', width: 230, sorttype: 'text' },
            { name: 'wfo', index: 'wfo', align: 'center', width: 30 },
            { name: 'wfoid', index: 'wfoid', width: 1, hidden: true },
            { name: 'acts', index: 'acts', width: actsWidth, sortable: false, align: 'right' }
        ],
        multiselect: false,
        rowNum: -1, //"500", // rjh added 6jan16 // rjh 26oct changed from "200" to -1
        height: "300",
        width: "1020", // ejh added 18mar16
        caption: "Active Spot Forecasts",
        onSelectRow: function (id) {
            var d = $("#mspottable").getRowData(id);
            var coords = ol.proj.fromLonLat([parseFloat(d.lon), parseFloat(d.lat)]);
            showPopup(coords, getPopupContent(d));
        }
    });

    for (var i = 0; i <= data.length; i++) {
        $("#mspottable").jqGrid('addRowData', i + 1, data[i]);
    }
}

// Place Active Spots on Map
// Need to get all spot markers (not just those in the displayed boundary) so that
// if the user pans the display the other spot markers will be shown
function drawActiveSpots() {
    deleteMarkers();

    var get_wfo = '';
    if (wfo != "") {
        get_wfo = "?wfo=" + wfo;
    }
    //        $.getJSON("monitor_server_json.php", function (json) {
    $.getJSON("monitor_server_json.php" + get_wfo, function (json) {
        json.reqtime = 123456789; // 3apr18 Don't want the timestamp included in determining if data has changed
        var defaultJSONData = $.toJSON(json);
        dataCRC = crc32(defaultJSONData); // Set global varialble value
        //console.log('drawActiveSpots::' + dataCRC);

        //	rjh 25oct16 Changed to add markers in reverse order.
        //  Spots are returned in DESC order (ORDER BY spot_rqst.req_status, spot_rqst.start_dtg DESC)
        //  When there are multiple spots at the same location, we want the most recent spot to be on top
        var nLen = json.rows.length;
        for (i = nLen - 1; i > -1; i--) {
            addMarker(json.rows[i]);
        }
        // This is the original code...
        //            $.each(json.rows, function (i, spot) {
        //                var s = "";
        //                addMarker(spot);
        //            });
    });
}

// rjh 2apr18
// Replaced drawActiveSpots with this function, which only returns the spots that are the map boundaries.
function drawActiveSpotsPartial() {
    deleteMarkers();
    var mcenter = ol.proj.toLonLat(map.getView().getCenter());
    var mlat = mcenter[1];
    var mlon = mcenter[0];
    var mzoom = map.getView().getZoom();

    var extent = map.getView().calculateExtent(map.getSize());
    var bnds = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

    var ul_lat = bnds[3];
    var ul_lon = (bnds[0] + 540) % 360 - 180; //bnds[0];
    var lr_lat = bnds[1];
    var lr_lon = (bnds[2] + 540) % 360 - 180;  //bnds[2];

    reqtime = new Date().getTime();
    var get_str = "ullat=" + ul_lat + "&ullon=" + ul_lon + "&lrlat=" + lr_lat + "&lrlon=" + lr_lon + "&reqtime=" + reqtime;
    if (wfo != "") {
        get_str = get_str + "&wfo=" + wfo;
    }

    $.getJSON("monitor_server_json.php?" + get_str, function (json) {
        // rjh 3apr18 Added this time test here 
        if (json.reqtime < reqtime) {
            console.log('aborted drawActiveSpotsPartial');
            //	return;
        }
        json.reqtime = 123456789; // 3apr18 Don't want the timestamp included in determining if data has changed
        var defaultJSONData = $.toJSON(json);
        dataCRC = crc32(defaultJSONData); // Set global varialble value
        //console.log('drawActiveSpotsPartial::' + dataCRC);

        //	rjh 25oct16 Changed to add markers in reverse order.
        //  Spots are returned in DESC order (ORDER BY spot_rqst.req_status, spot_rqst.start_dtg DESC)
        //  When there are multiple spots at the same location, we want the most recent spot to be on top
        var nLen = json.rows.length;
        for (i = nLen - 1; i > -1; i--) {
            addMarker(json.rows[i]);
        }
    });
}

//Create marker for each spot
function addMarker(spot) {
    var i_prefix = "";
    var t_prefix = "";
    var image = "";
    var ico_image = "";
    //small size icon

    switch (spot.tid) {
        case '0':
            t_prefix = "W_";
            break;
        case '1':
            t_prefix = "P_";
            break;
        case '2':
            t_prefix = "M_";
            break;
        case '3':
            t_prefix = "H_";
            break;
        case '4':
            t_prefix = "H_";
            break;
        case '5':
            t_prefix = "S_";
            break;
        case '6':
            t_prefix = "S_";
            break;
        case '7':
            t_prefix = "O_";
            break;
    }

    image = t_prefix + spot.stat + "_";
    ico_image = '/spot/images/monitor/' + image + 'Marker20x34.png';

    var style = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: ico_image
        })
    });

    var markerLonLat = ol.proj.fromLonLat([parseFloat(spot.lon), parseFloat(spot.lat)]);

    var geoMarker = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point([
            markerLonLat[0],
            markerLonLat[1]
        ]),
        spot: spot
    });
    geoMarker.setStyle(style);
    dataLayer.getSource().addFeature(geoMarker);
}

function getPopupContent(spot) {
    var mcenter = ol.proj.toLonLat(map.getView().getCenter());
    var mlat = mcenter[1];
    var mlon = mcenter[0];
    var mzoom = map.getView().getZoom();
    var content = '<div id="pop"><strong>' + spot.name + '</strong>' + '<br />' +
        '( ' + spot.lon + '&nbsp;&nbsp;' + spot.lat + ' )' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
        spot.snumunum + '&nbsp;&nbsp;&nbsp;&nbsp;WFO:&nbsp;' + spot.wfo + '<br />' +
        'WFO:&nbsp;' + spot.wfo + '<br />' +
        '<strong>Request Made:&nbsp;</strong>' + spot.rmade + '<br />' +
        '<strong>Deliver Time:&nbsp;</strong>' + spot.deliverdtg + '<br />' +
        '<strong>Request Fill:&nbsp;</strong>' + spot.rfill + '<br /><br />' +
        '<div id="actions">' +
        '<table border="0" cellpadding="0" cellspacing="0" align="center">';
    //'<tr><td><a href="../php/forecast.php?snumunum='+spot.snumunum+'" target="_blank">View Forecast</a></td>'+
    // Cannot store lat/lon/zoom when listener is added because this function is not called when map is
    // panned/zoomed.  So calling a javascript function that gets current lat/lon/z, then calls the forecast.php code

    // Other code modifies the spot.name, turning it into an href.  This code just
    // gets the actual name from within the href...then escapes the apostrophes
    var jsSafeName = spot.name.substring(0, spot.name.length - 4);
    var last = jsSafeName.lastIndexOf('>');
    jsSafeName = jsSafeName.substr(last + 1, jsSafeName.length - last - 1);
    // rjh 20oct16 temp kludge to fix problem with apostrophes in name cause js errors
    jsSafeName = jsSafeName.replace(/&#39;/g, "'");
    jsSafeName = jsSafeName.replace(/'/g, "\\'");

    //spot.accesslevel = ACCESS_OWNER;

    if (spot.accesslevel == ACCESS_EDIT) {
        if (spot.stat == 'C') {
            content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></td>';
            content = content + '<tr><td align="center"><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + spot.lat + '\',\'' + spot.lon + '\')">Request Forecast Update</a></td>';
        }
        if (spot.stat == 'P') {
            content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></td>';
            content = content + '<tr><td align="center"><a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></td>';
        }
        if (spot.stat == 'Q') {
            content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onCloseRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Archive</a></td>';
            content = content + '<tr><td align="center"><a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></td>';
        }
    } else {
        if (spot.accesslevel == ACCESS_OWNER) {
            if (spot.stat == 'C') {
                content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></td>';
                content = content + '<tr><td align="center"><a href="javascript:void(0)" onclick="javascript:onRequestForecastUpdate(\'' + spot.snumunum + '\',\'' + spot.lat + '\',\'' + spot.lon + '\')">Request Forecast Update</a></td>';

            }
            if (spot.stat == 'P') {
                content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></td>';
            }
            if (spot.stat == 'Q') {
                content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onConfirmDeleteRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Delete</a></td>';
            }
        }
        else if (spot.accesslevel == ACCESS_VIEW) {
            if (spot.stat == 'C') {
                content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></td>';
            }
            if (spot.stat == 'P') {
                content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></td>';
            }
            if (spot.stat == 'Q') {
                content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onclick="javascript:onChangeRequest(\'' + spot.snumunum + '\',\'' + jsSafeName + '\')">Change&nbsp;Request</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></td>';
            }
        } else {
            if (spot.accesslevel != ACCESS_BLOCKED) {
                content = content + '<tr><td><a href="javascript:void(0)" onclick="javascript:viewForecast(\'' + spot.snumunum + '\')">View</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../php/submit_obs.php?mode=submitobs&snumunum=' + spot.snumunum + '&lat=' + mlat + '&lon=' + mlon + '&z=' + mzoom + '">Submit&nbsp;Obs</a></td>';
            }
        }
    }

    content = content + '</table></div></div>';
    return content;
}

function deleteMarkers() {
    dataLayer.getSource().clear();
}

// **************************************************************************************************
// $(document).ready
// **************************************************************************************************
$(document).ready(function () {
    var qsParm = new Array();
    function getParams() {
        var query = window.location.search.substring(1);
        var parms = query.split('&');
        for (var i = 0; i < parms.length; i++) {
            var pos = parms[i].indexOf('=');
            if (pos > 0) {
                var key = parms[i].substring(0, pos);
                var val = parms[i].substring(pos + 1);
                qsParm[key] = val;
            }
        }
    }

    qsParm['lat'] = null;
    qsParm['lon'] = null;
    qsParm['z'] = null;

    getParams();

    if (qsParm['lat'] && qsParm['lon']) {
        if (qsParm['z']) {
            zoomLevel = parseInt(qsParm['z']);
        }
        centerLat = qsParm['lat'];
        centerLon = qsParm['lon'];
    } else {
        centerLat = 39.1189;
        centerLon = -94.5207;
    }

    drawMap();
    //drawActiveSpots();
    //       drawActiveSpotsPartial(); // rjh 2apr18
    // rjh 26sep17 removed this call because the call to drawMap also calls map.on("moveend" function which also calls makeExtentTable
    // makeExtentTable();

    $("#permalink").bind('click', (function (event) {
        event.preventDefault();
        var mcenter = ol.proj.toLonLat(map.getView().getCenter());
        var mlat = mcenter[1];
        var mlon = mcenter[0];
        var z = map.getView().getZoom();

        var baseLocation = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);
        window.location.href = baseLocation + '?lat=' + mlat + '&lon=' + mlon + '&z=' + z;
    }));

    window.setInterval("refreshDisplay()", 60000); // 1 minute
});