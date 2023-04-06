import "./style.css";
import { Map, View } from "ol";
import LayerGroup from "ol/layer/Group";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from 'ol/proj'
import { openStreetMapStandard, arcgisTopograph, arcgisImagery, arcgisStreetMap } from "./layers.js"
import { circleRed, getCircle } from "./mapStyles";
import { Control, defaults as defaultControls } from 'ol/control.js';
import { LayerControl } from "./controls";

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

const layerControls = [
    new LayerControl({ name: 'Standard', title: 'OSMStandard' }),
    new LayerControl({ name: 'Imagery', title: 'ArcgisImagery' }),
    new LayerControl({ name: 'StreetMap', title: 'ArcgisStreetMap' }),
    new LayerControl({ name: 'Topograph', title: 'ArcgisTopograph' })
]

const defaultMap = new Map({
    controls: defaultControls().extend(layerControls),
    layers: defaultBaseLayerGroup,
    view: new View({
        center: defaultCenter,
        zoom: 2,
        minZoom: 0,
        maxZoom: 10,
    }),
    target: "map"
});




class SpotMap {
    constructor(data) {
        this.data = data;
        this.map = defaultMap;
        this.addEvents(this.map.layers)
        this.addMarkersAsLonLat(this.data.rows, getCircle('blue', 'black', .25, 10))
    }

    addMarkersAsLonLat = (rows, style) => {
        this.addMarkers(rows.map(function (item) {
            return fromLonLat([item.lon, item.lat]);
        }), style)
    }

    addMarkers = (rows, style) => {
        rows.map((x) => this.addMarker(x, style))
    }

    addMarker = (coords, style) => {
        // console.debug(`adding marker at ${coords}`)
        console
        if (style) {
            defaultMarkerLayer.setStyle(style)
        }
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
}

export { SpotMap }



