import { Control } from 'ol/control.js';

class LayerControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(name, layer) {

        const button = document.createElement('button');
        button.innerHTML = name;
        button.className = 'layer-control-button';

        const element = document.createElement('div');
        element.appendChild(button)

        super({
            element: element,
            // target: document.getElementsByClassName('ol-overlaycontainer-stopevent')[0]
        });
        button.addEventListener('click', () => this.handleSelection(layer.get('title'), false));
    }


    handleSelection(new_title) {
        this.getMap().getAllLayers().forEach(layer => {
            console.debug("switching layer")
            const title = layer.get('title');
            const ignore = ['MarkerLayer', 'WarningWatch'];
            console.log(ignore.includes(title), title)
            if (!ignore.includes(title) && title !== undefined) {
                title === new_title ? layer.setVisible(true) : layer.setVisible(false);
            }
        });
    }
}

class OptionalLayerControl extends LayerControl {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(name, layer) {

        const button = document.createElement('button');
        button.innerHTML = name;
        button.className = 'layer-control-button';

        const element = document.createElement('div');
        element.appendChild(button)

        super(name, layer);
        button.addEventListener('click', () => this.toggle(layer.get('title'), false));
    }


    toggle(new_title) {
        this.getMap().getAllLayers().forEach(layer => {
            console.debug("toggling")
            const title = layer.get('title');
            if (title === new_title) {
                console.debug(layer.getVisible())
                layer.setVisible(!layer.getVisible())
            }
        });
    }
}

export { LayerControl, OptionalLayerControl }