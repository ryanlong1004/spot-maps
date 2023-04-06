import { Fill, Stroke, Style, Circle, Icon } from 'ol/style.js';


const colorRed = {
    fill: new Fill({
        color: 'rgba(249,6,6,0.6)',
    }),

    stroke: new Stroke({
        color: 'gray',
        width: 1.25,
    })
}


const circleRed = new Style({
    image: new Circle({
        fill: colorRed.fill,
        stroke: colorRed.stroke,
        radius: 10,
    }),
    fill: colorRed.fill,
    stroke: colorRed.stroke,

})

const getCircle = (fillColor, strokeColor, strokeWidth, radius) => {
    const fill = new Fill({
        color: fillColor,
    })

    const stroke = new Stroke({
        color: strokeColor,
        width: strokeWidth,
    })
    return new Style({
        image: new Circle({
            fill: fill,
            stroke: stroke,
            radius: radius,
        }),
        fill: fill,
        stroke: stroke,

    })
}

const markerOC = new Style({
    image: new Icon({
        anchor: [0.5, 1],
        src: "https://www.weather.gov/spot/images/monitor/O_C_Marker20x34.png",
    }),
})

export { circleRed, markerOC, getCircle }

