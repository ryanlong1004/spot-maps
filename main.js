
import { SpotMap } from './map'

const data = fetch('./response.json').then((response) =>
    response.json()
).then(
    response => {
        let map = new SpotMap(response)
    }
);

// 
