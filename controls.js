import "./style.css";
import { Control } from 'ol/control.js';

const defaultCenter = [39.1189, -94.5207];

//
// Define rotate to north control.
//

class LayerControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.innerHTML = options.name;
        button.className = 'layer-control-button';

        const element = document.createElement('div');
        element.appendChild(button)

        super({
            element: element,
            // target: document.getElementsByClassName('ol-overlaycontainer-stopevent')[0]
        });

        button.addEventListener('click', () => this.handleSelection(options.title), false);
    }


    handleSelection(new_title) {
        // this.getMap().getView().setRotation(0);
        this.getMap().getAllLayers().forEach(layer => {
            const title = layer.get('title');
            if (title !== 'MarkerLayer') {
                title === new_title ? layer.setVisible(true) : layer.setVisible(false);
            }
        });
    }
}

export { LayerControl }