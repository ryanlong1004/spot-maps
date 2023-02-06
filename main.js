import { SpotMap } from './map'
import { openStreetMapStandard, arcgisTopograph, arcgisImagery, arcgisStreetMap } from './layers'



let map = new SpotMap(null, null, [openStreetMapStandard, arcgisTopograph, arcgisImagery, arcgisStreetMap])

map.toggleMapLayer('OSMStandard');
await new Promise(r => setTimeout(r, 5000));
console.log("Changing");
map.toggleMapLayer('ArcgisTopograph')
