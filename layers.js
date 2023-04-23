import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { TileArcGISRest } from 'ol/source.js';
import XYZ from "ol/source/XYZ";
import { LayerControl, OptionalLayerControl } from "./controls";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import { getCircle } from './mapStyles'
import { Style, Fill } from "ol/style";



const defaultMarkerStyle = getCircle('red', 'black', 1, 5)

class SpotLayer {
    constructor(name, layer) {
        this.name = name
        this.layer = layer
        this.control = new LayerControl(name, layer)
    }
}

class OptionalSpotLayer {
    constructor(name, layer) {
        this.name = name
        this.layer = layer
        this.control = new OptionalLayerControl(name, layer)
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

let openStreetMapStandard = new TileLayer({
    source: new OSM(),
    visible: true,
    title: "OSMStandard",
});

let warningWatch = new TileLayer({
    source: new TileArcGISRest({
        url: 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/WWA/watch_warn_adv/MapServer',
        title: 'WarningWatch',
        visible: true,
        opacity: 25,
    }),
});


let markerLayer = new Vector({
    source: new VectorSource(),
    style: defaultMarkerStyle,
    title: 'MarkerLayer',
    visible: true,
    opacity: 25,
});

const style = new Style({
    fill: new Fill({
        color: '#eeeeee',
    }),
});

export { SpotLayer, OptionalSpotLayer, openStreetMapStandard, arcgisImagery, arcgisTopograph, arcgisStreetMap, markerLayer, warningWatch }