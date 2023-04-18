import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { LayerControl } from "./controls";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getCircle } from './mapStyles'
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style,
    Text,
} from 'ol/style.js';

const defaultMarkerStyle = getCircle('red', 'black', 1, 5)

// sourceBasePrefix: 'https://server.arcgisonline.com/ArcGIS/rest/services/',

class SpotLayer {
    constructor(name, layer) {
        this.name = name
        this.layer = layer
        this.control = new LayerControl(name, layer)
    }
}

let arcgisTopograph = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "ArcgisTopograph",
});

let arcgisImagery = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "ArcgisImagery",
});


let arcgisStreetMap = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "ArcgisStreetMap",
});

let dummyLayer = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "DummyLayer",
});

let openStreetMapStandard = new TileLayer({
    source: new OSM(),
    visible: true,
    title: "OSMStandard",
});


let markerLayer = new Vector({
    source: new VectorSource(),
    style: defaultMarkerStyle,
    title: 'MarkerLayer',
    visible: true,
    opacity: 50,
});

export { SpotLayer, openStreetMapStandard, arcgisImagery, arcgisTopograph, arcgisStreetMap, markerLayer, dummyLayer }