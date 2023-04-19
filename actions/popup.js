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

const formatPopupContent = (spot) => {
    return `
    <div>
    <strong>${spot.name}</strong> <span style="float: right; margin-right: 10%">${spot.snumunum}</span>
    </div>
    <div style="font-style: italic">
    ${spot.type.split('<')[0]}
    </div>
    <hr>
    </div>
    <div style="padding-bottom: 12px">
    @${spot.lon},${spot.lat}
    <span style="float: right; margin-right: 10%">
    WFO: ${spot.wfo}
    </span>
    </div>
    <div>
    <div><strong>Request Made:</strong><span style="float: right">${spot.rmade}</span></div>
    <div><strong>Deliver Time:</strong><span style="float: right">${spot.deliverdtg}</span></div>
    <div><strong>Request Fill:</strong><span style="float: right">${spot.rfill}</span></div>
    </div>`
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
        const data = map.lookupSpotRequestByLonLat(feature)
        console.debug(data)
        container.content.innerHTML = formatPopupContent(map.lookupSpotRequestByLonLat(feature))
        container.overlay.setPosition(evt.coordinate);
    });
}




export default popUpEvent