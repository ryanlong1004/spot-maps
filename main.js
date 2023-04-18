
import { arcgisImagery, openStreetMapStandard, arcgisStreetMap, arcgisTopograph, dummyLayer } from './layers'
import { SpotMap } from './map'
import { getCircle, completedGreen, markerOC } from './mapStyles'
import { SpotLayer } from './layers'
import { PopUp } from './actions'
import { transform } from 'ol/proj';
import { mapClickEvent, popUpEvent } from './actions'

// const url = 'https://www.weather.gov/spot/monitor/monitor_server_json.php?wfo=all'
const url = './response.json'

const layers = [
    new SpotLayer('OSM Standard', openStreetMapStandard),
    new SpotLayer('Arcgis Imagery', arcgisImagery),
    new SpotLayer('Arcgis Street Map', arcgisStreetMap),
    new SpotLayer('Arcgis Topograph', arcgisTopograph),
    new SpotLayer('DummyLayer', dummyLayer)
]

const actions = [
    mapClickEvent,
    popUpEvent
]

const options = {
    zoom: 5,
    minZoom: 0,
    maxZoom: 10,
    center: [-98.3693, 41.1166],
}

let map = new SpotMap(layers, actions, options)
map.update('./response.json')
// map.centerOnLonLat([-66.9542, 18.1328])



