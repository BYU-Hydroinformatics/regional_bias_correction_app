const mapObj = L.map("map", {
    zoom: 3,
    minZoom: 2,
    boxZoom: true,
    maxBounds: L.latLngBounds(L.latLng(-100, -225), L.latLng(100, 225)),
    center: [20, 0]
})
let REACHID
let CURRENTDATE
let mapMarker = null
let controlsObj
let SelectedSegment = L.geoJSON(false, { weight: 5, color: "#00008b" }).addTo(mapObj)

const basemapsJson = {
    "ESRI Topographic": L.esri.basemapLayer("Topographic").addTo(mapObj),
    "ESRI Terrain": L.layerGroup([
        L.esri.basemapLayer("Terrain"),
        L.esri.basemapLayer("TerrainLabels")
    ]),
    "ESRI Grey": L.esri.basemapLayer("Gray")
}
