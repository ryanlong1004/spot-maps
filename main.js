import { SpotMap } from './map'
import { openStreetMapStandard, arcgisTopograph, arcgisImagery, arcgisStreetMap } from './layers'



let map = new SpotMap(null, null, [openStreetMapStandard, arcgisTopograph, arcgisImagery, arcgisStreetMap])

map.toggleMapLayer('ArcgisTopograph')