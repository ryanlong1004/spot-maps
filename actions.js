import Overlay from 'ol/Overlay.js';
import { toLonLat } from 'ol/proj';

class PopUp {
    constructor() {
        this.build()
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = document.getElementById('popup-closer');
        this.overlay = new Overlay({
            element: this.container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        this.closer.onclick = () => {
            this.overlay.setPosition(undefined);
            this.closer.blur();
            return false;
        };
    }

    build = () => {
        const container = document.createElement('div')
        container.id = 'popup'
        container.classList = 'ol-popup'
        const closer = document.createElement('a')
        closer.id = 'popup-closer'
        closer.classList = 'ol-popup-closer'
        const content = document.createElement('div')
        content.id = 'popup-content'
        container.appendChild(closer)
        container.appendChild(content)
        document.getElementsByTagName('body')[0].appendChild(container)
    }
}

{/* <div id="popup" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content"></div>
</div> */}



/**
   * Add single click event to an overlay
   * @param {*} overlay 
   */
const popUpEvent = (map) => {
    const container = new PopUp();
    map.map.addOverlay(container.overlay)
    map.map.on('singleclick', (evt) => {
        const feature = map.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        if (!feature) return;
        container.content.innerHTML = map.getPopupContentV2(map.lookupSpotRequestByLonLat(feature))
        container.overlay.setPosition(evt.coordinate);
    });
}

const mapClickEvent = (map) => {
    map.map.on('singleclick', (evt) => {
        console.log(toLonLat(evt.coordinate));
    });
}

export { PopUp, mapClickEvent, popUpEvent }