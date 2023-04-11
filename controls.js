import "./style.css";
import { Control } from 'ol/control.js';

const defaultCenter = [39.1189, -94.5207];

// class SpotLayer {
//     constructor(name, title, layer) {
//         this.name = name
//         this.title = title
//         this.layer = layer
//         this.control = new LayerControl({
//             name: this.name,
//             title: this.title,
//         })
//     }
// }

//
// Define rotate to north control.
//

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
        // this.getMap().getView().setRotation(0);
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