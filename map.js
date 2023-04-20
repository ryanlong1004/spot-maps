import "./spot_map.css";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from 'ol/proj'
import { circleRed, getCircle, markerOC } from "./mapStyles";
import { LayerControl } from "./controls";
import { markerLayer } from "./layers"



const defaultCenter = [39.1189, -94.5207];

const defaults = {
    zoom: 4,
    minZoom: 0,
    maxZoom: 20,
}

class SpotMap {


    constructor(layers, actions, options = defaults) {
        this.map = this.createMap(options);
        this.updateUrl = options.updateUrl;
        this.addLayers(layers, [markerLayer])
        this.addActions(actions)
        this.rows = []
    }

    /**
     * Fetches data from URL and adds markers
     * @param {str} url 
     */
    update = (url) => {
        fetch(url).then((response) =>
            response.json()
        ).then(
            response => {
                this.rows = response.rows
                this.rows.map(item => {
                    if (item.stat.toLowerCase().trim() == 'p') {
                        this.addMarkerAsLonLat([item.lon, item.lat], getCircle('red', 'black', 1, 15, item.type[0]))
                    }
                    if (item.stat.toLowerCase().trim() == 'c') {
                        this.addMarkerAsLonLat([item.lon, item.lat], getCircle('green', 'black', 1, 15, item.type[0]))
                    }
                })
            }
        );
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
     * Add actions to the map
     * @param {[fx]} actions 
     */
    addActions = (actions) => {
        actions.map(action => action(this))
    }

    /**
     * Add markers to map from lon and lat, with an optional style
     * @param {object} rows 
     * @param {Style} style 
     */
    addMarkersAsLonLat = (style) => {
        this.rows.map(item => {
            this.addMarkerAsLonLat([item.lon, item.lat], style)
        })
    }

    /**
     * Adds a marker as Lon, Lat
     * @param {[lon, lat]]} coords 
     * @param {obj} style 
     */
    addMarkerAsLonLat = (coords, style) => {
        const feature = new Feature(new Point(fromLonLat(coords)))
        feature.setStyle(style)
        markerLayer.getSource().addFeature(feature)
    }

    /**
     * Add markers to the map with optional style
     * @param {[obj]} rows 
     * @param {obj} style 
     */
    addMarkers = (rows, style) => {
        rows.map((x) => this.addMarker(x, style))
    }

    /**
     * Add marker to map with optional style
     * @param {[float, float]} coords 
     * @param {obj} style 
     */
    addMarker = (coords, style) => {
        if (style) {
            markerLayer.setStyle(style)
        }
        markerLayer.getSource().addFeature(new Feature(new Point(coords)))
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

    /**
     * Returns float to the 9th decimal place
     * @param {float} value 
     * @returns float
     */
    formatCoordinate = (value) => parseFloat(value).toFixed(9)

    /**
     * Centers the map on longitute and lattitude
     * @param {[float, float]} coords 
     */
    centerOnLonLat = (coords) => {
        this.map.getView().setCenter(fromLonLat(coords))
    }

    /**
     * Creates and renders open layers map
     * @param {object} options 
     * @returns 
     */
    createMap = (options) => {
        const center = options.center ? fromLonLat(options.center) : defaultCenter
        return new Map({
            view: new View({
                center: center,
                zoom: options.zoom,
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
            }),
            target: "map"
        });
    }
}


export { SpotMap }



