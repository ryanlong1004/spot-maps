import "./style.css";
import { Map, View } from "ol";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from 'ol/proj'
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

class SpotMap {
    constructor(layers) {
        this.layers = [...layers.map(layer => layer.layer), defaultMarkerLayer]
        this.layerControls = layers.map(layer => new LayerControl(layer.name, layer.layer))
        this.map = this.createMap(this.layerControls, this.layers);
        this.addEvents(this.map.layers)

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

    createMap = (layerControls, layers) => {
        console.log(layers)
        return new Map({
            controls: defaultControls().extend(layerControls),
            layers: layers,
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

export { SpotMap }



