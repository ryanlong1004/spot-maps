import "./style.css";
import { Map, View } from "ol";
import Style from "ol/style/Style.js";
import LayerGroup from "ol/layer/Group";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import { Control, defaults as defaultControls } from 'ol/control.js';

class RotateNorthControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.innerHTML = 'N';

        const element = document.createElement('div');
        element.className = 'rotate-north ol-unselectable ol-control';
        element.appendChild(button);

        super({
            element: element,
            target: "map",
        });

        button.addEventListener('click', this.handleRotateNorth.bind(this), false);
    }

    handleRotateNorth() {
        baseLayerGroup.getLayers().forEach(function (layer) {
            layer.setVisible(layer.get("title") === target.value);
        });
    }
}

const defaultCenter = [39.1189, -94.5207];


const defaultView = new View({
    center: defaultCenter,
    zoom: 2,
    // maxZoom: 10,
    // minZoom: 2,
    rotation: 0, // in radians
});



const defaultMap = new Map({
    controls: defaultControls().extend([new RotateNorthControl()]),
    target: "map",
    view: defaultView,
});

const defaultMarkerLayer = new Vector({
    source: new VectorSource(),
    style: new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: "https://www.weather.gov/spot/images/monitor/O_C_Marker20x34.png",
        }),
    }),
});



class SpotMap {
    constructor(view = null, map = null, layers = [], center = null) {
        this.center = center || defaultCenter;
        this.view = view || defaultView;
        this.map = map || defaultMap;
        this.map.controls = defaultControls().extend([new RotateNorthControl()]);
        this.markerLayer = defaultMarkerLayer;
        this.addLayers([...layers, this.markerLayer])
        this.addEvents(this.markerLayer)
    }

    addLayers(layers) {
        console.debug("adding layers")
        let baseLayerGroup = new LayerGroup({
            layers: [...layers],
        });
        this.map.addLayer(baseLayerGroup);
    }

    addMarker(coords) {
        console.debug(`adding marker at ${coords}`);
        let marker = new Feature(new Point(coords));
        this.markerLayer.getSource().addFeature(marker);
    }

    addEvents() {
        console.debug("adding events")
        this.map.on("click", e => {
            this.addMarker(e.coordinate);
        });
    }

    toggleMapLayer(mapId) {
        this.map.getLayers().forEach(layer => {
            console.log(layer)
            if (typeof layer.get('id') !== 'undefined') {
                layer.setVisible(layer.get('id') === mapId ? true : false);
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
