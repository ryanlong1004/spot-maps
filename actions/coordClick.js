import { toLonLat } from "ol/proj";

const mapClickEvent = (map) => {
    map.map.on('singleclick', (evt) => {
        console.debug(toLonLat(evt.coordinate));
    });
}

export default mapClickEvent