import Overlay from 'ol/Overlay.js';

class PopUp {
    constructor() {
        this.buildAndAppendContainer()
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

    buildAndAppendContainer = () => {
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

export default popUpEvent