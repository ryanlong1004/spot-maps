import "./style.css";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from 'ol/proj'
import { circleRed, getCircle } from "./mapStyles";
import { LayerControl } from "./controls";
import { markerLayer } from "./layers"



const defaultCenter = [39.1189, -94.5207];



class SpotMap {
    constructor(layers, popups) {
        this.map = this.createMap();
        this.addLayers(layers, [markerLayer])
        this.addPopups(popups)
    }

    addLayers = (userLayers, mapLayers) => {
        [...userLayers.map(layer => layer.layer), ...mapLayers].map(layer => this.map.addLayer(layer))
        userLayers.map(layer =>
            this.map.addControl(new LayerControl(layer.name, layer.layer)))
    }

    addPopups = (overlays) => {
        overlays.map(overlay => {
            this.map.addOverlay(overlay.overlay)
            this.addEvent(overlay)
        })
    }

    addMarkersFromLonLat = (rows, style) => {
        this.addMarkers(rows.map(function (item) {
            return fromLonLat([item.lon, item.lat]);
        }), style)
    }

    addMarkers = (rows, style) => {
        rows.map((x) => this.addMarker(x, style))
    }

    addMarker = (coords, style) => {
        if (style) {
            markerLayer.setStyle(style)
        }
        markerLayer.getSource().addFeature(new Feature(new Point(coords)))
    }

    addEvent = (overlay) => {
        this.map.on('singleclick', (evt) => {
            overlay.content.innerHTML = '<p>You clicked here:</p><code>' + evt.coordinate + '</code>';
            overlay.overlay.setPosition(evt.coordinate);
        });


    }

    toggleMapLayer = (mapTitle) => {
        console.debug(`toggling layer ${mapTitle}`)
        this.map.getAllLayers().forEach(layer => {
            const title = layer.get('title');
            if (title !== 'MarkerLayer') {
                title === mapTitle ? layer.setVisible(true) : layer.setVisible(false);
            }
        });
    }

    createMap = () => {
        return new Map({
            view: new View({
                center: defaultCenter,
                zoom: 2,
                minZoom: 0,
                maxZoom: 10,
            }),
            target: "map"
        });
    }
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

export { SpotMap }



