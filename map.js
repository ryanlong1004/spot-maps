import "./style.css";
import { Map, View } from "ol";
import Style from "ol/style/Style.js";
import LayerGroup from "ol/layer/Group";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import { openStreetMapStandard, arcgisTopograph, arcgisImagery, arcgisStreetMap } from "./layers.js"

const defaultCenter = [39.1189, -94.5207];

let defaultMarkerLayer = new Vector({
    source: new VectorSource(),
    style: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: "https://www.weather.gov/spot/images/monitor/O_C_Marker20x34.png",
        }),
    }),
    title: 'MarkerLayer',
    visible: true,
    opacity: 100
});

let fireLayer = new Vector({
    source: new VectorSource(),
    style: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: "assetts/fire-png-698.png",
        }),
    }),
    title: 'FireLayer',
    visible: true,
    opacity: 100
});

// Layer Group
const defaultBaseLayerGroup = new LayerGroup({
    layers: [
        openStreetMapStandard, arcgisImagery, arcgisStreetMap, arcgisTopograph, fireLayer
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
    constructor() {
        this.map = defaultMap;
        this.baseLayerGroup = defaultBaseLayerGroup;
        this.map.addLayer(this.baseLayerGroup);
        this.controls = document.querySelectorAll('.sidebar > input[type=radio]')
        this._setupLayerControls();
        this.addEvents(this.map.layers);
    }

    _setupLayerControls = () => {
        console.debug("adding layer toggling controls")
        this.controls.forEach(control => {
            control.addEventListener('change', y => {
                this.toggleMapLayer(y.target.value);
            })
        })
    }

    addMarker = (coords) => {
        console.debug(`adding marker at ${coords}`);
        let marker = new Feature(new Point(coords));
        fireLayer.getSource().addFeature(marker);
    }

    addEvents = () => {
        console.debug("adding events")
        this.map.on("click", e => {
            this.addMarker(e.coordinate);
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



// var newCRC = 1;
// var get_wfo = '';
// var mcenter = toLonLat(map.getView().getCenter());
// var mlat = mcenter[1];
// var mlon = mcenter[0];
// var mzoom = map.getView().getZoom();

// var extent = map.getView().calculateExtent(map.getSize());
// var bnds = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

// var ul_lat = bnds[3];
// var ul_lon = (bnds[0] + 540) % 360 - 180; //bnds[0];
// var lr_lat = bnds[1];
// var lr_lon = (bnds[2] + 540) % 360 - 180;  //bnds[2];

// reqtime = new Date().getTime();
// var get_str = "ullat=" + ul_lat + "&ullon=" + ul_lon + "&lrlat=" + lr_lat + "&lrlon=" + lr_lon + "&reqtime=" + reqtime;
// if (wfo != "") {
//   get_str = get_str + "&wfo=" + wfo;
// }
