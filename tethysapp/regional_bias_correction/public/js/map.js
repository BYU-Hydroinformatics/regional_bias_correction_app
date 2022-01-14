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

//let gaugeNetwork = L.geoJSON(false, {
//    onEachFeature: function(feature, layer) {
//        REACHID = feature.properties.GEOGLOWSID
//        layer.on("click", function(event) {
//            L.DomEvent.stopPropagation(event)
//            getBiasCorrectedPlots(feature.properties)
//        })
//    },
//    pointToLayer: function(feature, latlng) {
//        return L.circleMarker(latlng, {
//            radius: 6,
//            fillColor: "#ff0000",
//            color: "#000000",
//            weight: 1,
//            opacity: 1,
//            fillOpacity: 1
//        })
//    }
//})
//
//function getBiasCorrectedPlots(gauge_metadata) {
//    let data
//    if (gauge_metadata !== false) {
//        data = gauge_metadata
//        data["gauge_network"] = $("#gauge_networks").val()
//    } else if (!REACHID) {
//        alert(
//            "No Reach-ID has been chosen. You must successfully retrieve streamflow before attempting calibration"
//        )
//        return
//    } else {
//        let csv = $("#uploaded_observations").val()
//        data = {
//            reach_id: REACHID,
//            observation: csv
//        }
//        if (
//            !confirm(
//                'You are about to perform bias correction on reach_id "' +
//                    String(REACHID) +
//                    '" with uploaded ' +
//                    'observed steamflow file "' +
//                    csv +
//                    '". Are you sure you want to continue?'
//            )
//        ) {
//            return
//        }
//    }
//    updateStatusIcons("load")
//    updateDownloadLinks("clear")
//    $("#chart_modal").modal("show")
//    $("#bias_correction_tab_link").show()
//    $.ajax({
//        type: "GET",
//        async: true,
//        data: data,
//        url: URL_getBiasAdjusted,
//        success: function(html) {
//            // forecast tab
//            $("#forecast_tab_link").tab("show")
//            $("#forecast-chart").append(html["correct_hydro"])
//            // historical tab
//            $("#historical_tab_link").tab("show")
//            $("#historical-chart").html(html["new_hist"])
//            $("#historical-table").html("")
//            // average flows tab
//            $("#avg_flow_tab_link").tab("show")
//            $("#daily-avg-chart").html(html["day_avg"])
//            $("#monthly-avg-chart").html(html["month_avg"])
//            // flow duration curve
//            $("#flow_duration_tab_link").tab("show")
//            $("#flowduration-chart").html(html["flowdur_plot"])
//            // stats tab
//            $("#bias_correction_tab_link").tab("show")
//            $("#stats_table").html(html["stats_table"])
//            $("#volume_plot").html(html["volume_plot"])
//            $("#scatters").html(html["scatters"])
//            $("#bias_correction_tab_link").tab("show")
//            updateStatusIcons("ready")
//            updateDownloadLinks("set")
//        },
//        error: function() {
//            updateStatusIcons("fail")
//        }
//    })
