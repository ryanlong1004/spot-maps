import "./style.css";
import { Map, View } from "ol";
import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import LayerGroup from "ol/layer/Group";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import { fromLonLat } from 'ol/proj'
import { openStreetMapStandard, arcgisTopograph, arcgisImagery, arcgisStreetMap } from "./layers.js"
import { circleRed, getCircle } from "./mapStyles";

const defaultCenter = [39.1189, -94.5207];

let defaultMarkerLayer = new Vector({
    source: new VectorSource(),
    style: getCircle('red', 'black', .25, 10),
    title: 'MarkerLayer',
    visible: true,
    opacity: 100
});

let fireLayer = new Vector({
    source: new VectorSource(),
    style: getCircle('red', 'gray', .5, 10),
    title: 'FireLayer',
    visible: true,
    opacity: 100
});

// Layer Group
const defaultBaseLayerGroup = new LayerGroup({
    layers: [
        openStreetMapStandard, arcgisImagery, arcgisStreetMap, arcgisTopograph, defaultMarkerLayer
    ]
})


const defaultMap = new Map({
    view: new View({
        center: defaultCenter,
        zoom: 2,
        minZoom: 0,
        maxZoom: 10
    }),
    target: "map"
});

class SpotMap {
    constructor(data) {
        this.data = data;
        this.map = defaultMap;
        this.baseLayerGroup = defaultBaseLayerGroup;
        this.map.addLayer(this.baseLayerGroup);
        this.controls = document.querySelectorAll('.sidebar > input[type=radio]')
        this._setupLayerControls()
        this.addEvents(this.map.layers)
        this.addMarkersAsLonLat(this.data.rows)
    }

    /**
     * Adds the controls responsible for switching between
     * topographic layers.
     */
    _setupLayerControls = () => {
        console.debug("adding layer toggling controls")
        this.controls.forEach(control => {
            control.addEventListener('change', y => {
                this.toggleMapLayer(y.target.value);
            })
        })
    }

    addMarkersAsLonLat = (rows) => {
        this.addMarkers(rows.map(function (item) {
            return fromLonLat([item.lon, item.lat]);
        }))
    }

    addMarkers = (rows) => {
        rows.map((x) => this.addMarker(x))
    }

    addMarker = (coords) => {
        console.debug(`adding marker at ${coords}`)
        defaultMarkerLayer.getSource().addFeature(new Feature(new Point(coords)))
    }

    addEvents = () => {
        console.debug("adding events")
        this.map.on("click", e => {
            // this.addMarker(e.coordinate);
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
    toggleMarkerLayer = (markerTitle) => {
        return
    }
}

export { SpotMap }



