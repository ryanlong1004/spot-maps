
import { arcgisImagery, openStreetMapStandard, arcgisStreetMap, arcgisTopograph } from './layers'
import { SpotMap } from './map'
import { getCircle, completedGreen } from './mapStyles'
import { SpotLayer } from './layers'
import { PopUpContainer } from './popup'

// const url = 'https://www.weather.gov/spot/monitor/monitor_server_json.php?wfo=all'
const url = './response.json'

const layers = [
    new SpotLayer('OSM Standard', openStreetMapStandard),
    new SpotLayer('Arcgis Imagery', arcgisImagery),
    new SpotLayer('Arcgis Street Map', arcgisStreetMap),
    new SpotLayer('Arcgis Topograph', arcgisTopograph),
]

fetch(url).then((response) =>
    response.json()
).then(
    response => {
        let map = new SpotMap(layers, [new PopUpContainer()])
        map.addMarkersFromLonLat(response.rows, completedGreen)
    }
);

