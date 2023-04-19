
import { arcgisImagery, openStreetMapStandard, arcgisStreetMap, arcgisTopograph } from './layers'
import { SpotMap } from './map'
import { SpotLayer } from './layers'
import mapClickEvent from './actions/coordClick'
import popUpEvent from './actions/popup'

// const url = 'https://www.weather.gov/spot/monitor/monitor_server_json.php?wfo=all'
const url = './response.json'

const layers = [
    new SpotLayer('OSM Standard', openStreetMapStandard),
    new SpotLayer('Arcgis Imagery', arcgisImagery),
    new SpotLayer('Arcgis Street Map', arcgisStreetMap),
    new SpotLayer('Arcgis Topograph', arcgisTopograph),
]

const actions = [
    mapClickEvent,
    popUpEvent
]

const options = {
    zoom: 2,
    minZoom: 0,
    maxZoom: 20,
    center: [-98.3693, 41.1166],
}

let map = new SpotMap(layers, actions, options)
map.update(url)
map.centerOnLonLat([-66.9542, 18.1328])



