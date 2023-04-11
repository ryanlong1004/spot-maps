
import { SpotMap } from './map'

fetch('./response.json').then((response) =>
    response.json()
).then(
    response => {
        let map = new SpotMap(response)
    }
);

// 
