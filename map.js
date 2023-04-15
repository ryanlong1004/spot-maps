import "./style.css";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from 'ol/proj'
import { circleRed, getCircle } from "./mapStyles";
import { LayerControl } from "./controls";
import { markerLayer } from "./layers"



const defaultCenter = [39.1189, -94.5207];



class SpotMap {

    zoom = 2
    minZoom = 0
    maxZoom = 10
    constructor(layers, popups) {
        this.map = this.createMap();
        this.addLayers(layers, [markerLayer])
        this.addPopups(popups)
        this.rows = []
    }

    /**
     * Add layers passed from user and required layers to map
     * @param {Layer} userLayers 
     * @param {Layer} mapLayers 
     */
    addLayers = (userLayers, mapLayers) => {
        [...userLayers.map(layer => layer.layer), ...mapLayers].map(layer => this.map.addLayer(layer))
        userLayers.map(layer =>
            this.map.addControl(new LayerControl(layer.name, layer.layer)))
    }

    /**
     * Add popup overlays and events to map
     * @param {Overlay} overlays 
     */
    addPopups = (overlays) => {
        overlays.map(overlay => {
            this.map.addOverlay(overlay.overlay)
            this.addEvent(overlay)
        })
    }

    /**
     * Add markers to map from lon and lat, with an optional style
     * @param {object} rows 
     * @param {Style} style 
     */
    addMarkersFromLonLat = (rows, style) => {
        this.rows = rows
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

    getPopupContentV2 = (spot) => {
        console.log(spot)
        return '<div id="pop"><strong>' + spot.name + '</strong>' + '<br />' +
            '( ' + spot.lon + '&nbsp;&nbsp;' + spot.lat + ' )' + '&nbsp;&nbsp;&nbsp;&nbsp;' +
            spot.snumunum + '&nbsp;&nbsp;&nbsp;&nbsp;WFO:&nbsp;' + spot.wfo + '<br />' +
            'WFO:&nbsp;' + spot.wfo + '<br />' +
            '<strong>Request Made:&nbsp;</strong>' + spot.rmade + '<br />' +
            '<strong>Deliver Time:&nbsp;</strong>' + spot.deliverdtg + '<br />' +
            '<strong>Request Fill:&nbsp;</strong>' + spot.rfill + '<br /><br />' +
            '<div id="actions">' +
            '<table border="0" cellpadding="0" cellspacing="0" align="center">';
    }

    /**
     * Add single click event to an overlay
     * @param {*} overlay 
     */
    addEvent = (overlay) => {
        this.map.on('singleclick', (evt) => {
            const feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            if (!feature) return;
            overlay.content.innerHTML = this.getPopupContentV2(this.lookupSpotRequestByLonLat(feature))
            overlay.overlay.setPosition(evt.coordinate);
        });
    }

    /**
     * Toggles a map layer on by title, mutuall exclusive
     * @param {string} mapTitle 
     */
    toggleMapLayer = (mapTitle) => {
        console.debug(`toggling layer ${mapTitle}`)
        this.map.getAllLayers().forEach(layer => {
            const title = layer.get('title');
            if (title !== 'MarkerLayer') {
                title === mapTitle ? layer.setVisible(true) : layer.setVisible(false);
            }
        });
    }

    /**
     * Looks up a Spot Request by Lattitude and Longitiude fixed to 4 decimal places
     * @param {*} feature 
     * @returns object
     */
    lookupSpotRequestByLonLat = (feature) => {
        const coord = toLonLat(feature.getGeometry().getCoordinates())
        return this.rows.filter(row => this.formatCoordinate(row.lon) == this.formatCoordinate(coord[0]) && this.formatCoordinate(row.lat) == this.formatCoordinate(coord[1]))[0]
    }

    formatCoordinate = (value) => parseFloat(value).toFixed(4)

    createMap = () => {
        return new Map({
            view: new View({
                center: defaultCenter,
                zoom: this.zoom,
                minZoom: this.minZoom,
                maxZoom: this.maxZoom,
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



