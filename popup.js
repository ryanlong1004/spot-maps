import Overlay from 'ol/Overlay.js';

class PopUpContainer {
    constructor() {
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
}

export { PopUpContainer }