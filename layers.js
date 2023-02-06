import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

// sourceBasePrefix: 'https://server.arcgisonline.com/ArcGIS/rest/services/',

let arcgisTopograph = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "ArcgisTopograph",
});

let arcgisImagery = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "ArcgisImagery",
});

let arcgisTransportation = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "ArcgisTransportation",
});

let arcgisStreetMap = new TileLayer({
    source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}?appid=45ad401c-fa23-4a10-8b2f-a7ad29a3e2a0",
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">ESRI</a>',
    }),
    visible: false,
    title: "ArcgisTransportation",
});

let openStreetMapStandard = new TileLayer({
    source: new OSM(),
    visible: false,
    title: "OSMStandard",
});

export { openStreetMapStandard, arcgisImagery, arcgisTopograph, arcgisTransportation, arcgisStreetMap }