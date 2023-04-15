import { Fill, Stroke, Style, Circle, Icon, Text } from 'ol/style.js';


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

const completedGreen = new Style({
    image: new Circle({
        fill: new Fill({
            color: [28, 173, 6, .8],
        }),
        stroke: new Stroke({
            color: 'gray',
            width: .5,
        }),
        radius: 10,
    }),
    text: new Text({
        font: '12px serif',
        textAlign: 'center',
        justify: 'center',
        text: `A`,
        fill: new Fill({
            color: [255, 255, 255, .5],
        }),
        // backgroundFill: new Fill({
        //     color: [168, 50, 153, 0.6],
        // }),
        // padding: [2, 2, 2, 2],
    }),


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
    })
}

const markerOC = new Style({
    image: new Icon({
        anchor: [0.5, 1],
        src: "https://www.weather.gov/spot/images/monitor/O_C_Marker20x34.png",
    }),
})

export { circleRed, markerOC, getCircle, completedGreen }

