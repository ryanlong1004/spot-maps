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
            if (title !== 'MarkerLayer') {
                title === new_title ? layer.setVisible(true) : layer.setVisible(false);
            }
        });
    }
}

export { LayerControl }