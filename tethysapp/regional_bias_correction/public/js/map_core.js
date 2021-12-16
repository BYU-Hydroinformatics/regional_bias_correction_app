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


//////////////////////////////////////////////////////////////////////// ADD LEGEND LAT LON BOX
// lat/lon tracking box on the bottom left of the map
let latlon = L.control({ position: "bottomleft" })
latlon.onAdd = function() {
    let div = L.DomUtil.create("div", "well well-sm")
    div.innerHTML = '<div id="mouse-position" style="text-align: center"></div>'
    return div
}
latlon.addTo(mapObj)
mapObj.on("mousemove", function(event) {
    $("#mouse-position").html(
        "Lat: " + event.latlng.lat.toFixed(4) + ", Lon: " + event.latlng.lng.toFixed(4)
    )
})
//////////////////////////////////////////////////////////////////////// OTHER UTILITIES ON THE LEFT COLUMN
function findReachID() {
    $.ajax({
        type: "GET",
        async: true,
        url:
            URL_find_reach_id +
            L.Util.getParamString({
                reach_id: prompt("Please enter a Reach ID to search for")
            }),
        success: function(response) {
            if (mapMarker) {
                mapObj.removeLayer(mapMarker)
            }
            mapMarker = L.marker(L.latLng(response["lat"], response["lon"])).addTo(mapObj)
            mapObj.flyTo(L.latLng(response["lat"], response["lon"]), 9)
        },
        error: function() {
            alert("Unable to find the reach_id specified")
        }
    })
}

////////////////////////////////////////////////////////////////////////  GET DATA FROM API AND MANAGING PLOTS
// todo update charts
const chart_divs = [
    $("#forecast-chart"),
    $("#forecast-table"),
    $("#historical-chart"),
    $("#historical-table"),
    $("#daily-avg-chart"),
    $("#monthly-avg-chart"),
    $("#flowduration-chart"),
    $("#volume_plot"),
    $("#scatters"),
    $("#stats_table")
]


function getFormattedDate(dateObj) {
    return `${dateObj.getFullYear()}${("0" + (dateObj.getMonth() + 1)).slice(-2)}${(
        "0" + dateObj.getDate()
    ).slice(-2)}.00`
}

// todo needs to be changed later
function getForecastData() {
    let ftl = $("#forecast_tab_link") // select divs with jquery so we can reuse them
    ftl.tab("show")
    let fc = chart_divs[0]
    fc.html(
        '<img src="https://www.ashland.edu/sites/all/themes/ashlandecard/2014card/images/load.gif">'
    )
    fc.css("text-align", "center")
    let dateOffset = 24 * 60 * 60 * 1000 * 7 // 7 days converted to milliseconds, the js time unit
    let start_date = new Date()
    start_date.setTime(CURRENTDATE.getTime() - dateOffset)

    const fakedDataFromTethysController = {
        x: ["2021-12-09 09:00:00"]
        y: []
        axisLabels: "'",
        table: "html string"
    }

    //todo make a function that makes plots and tables and whatever




//    $.ajax({
//        type: "GET",
//        async: true,
//        data: {
//            reach_id: REACHID,
//            end_date: getFormattedDate(CURRENTDATE),
//            start_date: getFormattedDate(start_date)
//        },
//        url: URL_getForecastData,
//        success: function(response) {
//            // forecast tab
//            ftl.tab("show")
//            fc.html(response["plot"])
//            $("#forecast-table").html(response["table"])
//            updateDownloadLinks("set")
//            updateStatusIcons("ready")
//            showGetHistorical()
//            showBiasCalibrationTabs()
//        },
//        error: function() {
//            updateStatusIcons("fail")
//            REACHID = null
//        }
//    })
    return
}
// todo needs to be changed later
function getHistoricalData() {
    updateStatusIcons("load")
    updateDownloadLinks("clear")
    let tl = $("#historical_tab_link") // select divs with jquery so we can reuse them
    tl.tab("show")
    let plotdiv = chart_divs[2]
    plotdiv.html(
        '<img src="https://www.ashland.edu/sites/all/themes/ashlandecard/2014card/images/load.gif">'
    )
    plotdiv.css("text-align", "center")
    $.ajax({
        type: "GET",
        async: true,
        data: { reach_id: REACHID },
        url: URL_getHistoricalData,
        success: function(response) {
            showHistoricalTabs()
            // historical tab
            tl.tab("show")
            $("#get-historical-btn").hide()
            plotdiv.html(response["plot"])
            $("#historical-table").html(response["table"])
            // average flows tab
            $("#avg_flow_tab_link").tab("show")
            $("#daily-avg-chart").html(response["dayavg"])
            $("#monthly-avg-chart").html(response["monavg"])
            // flow duration tab
            $("#flow_duration_tab_link").tab("show")
            $("#flowduration-chart").html(response["fdp"])
            // update other messages and links
            tl.tab("show")
            updateStatusIcons("ready")
        },
        error: function() {
            updateStatusIcons("fail")
        }
    })
}


//////////////////////////////////////////////////////////////////////// UPDATE STATUS ICONS FUNCTION
// todo needs to be changed later
function updateStatusIcons(type) {
    let statusObj = $("#request-status")
    if (type === "identify") {
        statusObj.html(" (Getting Stream ID)")
        statusObj.css("color", "orange")
    } else if (type === "load") {
        statusObj.html(" (Loading ID " + REACHID + ")")
        statusObj.css("color", "orange")
    } else if (type === "ready") {
        statusObj.html(" (Ready)")
        statusObj.css("color", "green")
    } else if (type === "fail") {
        statusObj.html(" (Failed)")
        statusObj.css("color", "red")
    } else if (type === "cleared") {
        statusObj.html(" (Cleared)")
        statusObj.css("color", "grey")
    }
}
// todo needs to be changed later
function fix_buttons(tab) {
    let buttons = [
        $("#download-forecast-btn"),
        $("#download-historical-btn"),
        $("#start-bias-correction-btn")
    ]
    for (let i in buttons) {
        buttons[i].hide()
    }
    if (tab === "forecast") {
        buttons[0].show()
    } else if (tab === "historical") {
        buttons[1].show()
    } else if (tab === "biascorrection") {
        buttons[2].show()
    }
    fix_chart_sizes(tab)
    $("#resize_charts").attr({ onclick: "fix_chart_sizes('" + tab + "')" })
}
// todo needs to be changed later
function fix_chart_sizes(tab) {
    let divs = []
    if (tab === "forecast") {
        divs = [$("#forecast-chart .js-plotly-plot")]
    } else if (tab === "historical") {
        divs = [$("#historical-5-chart .js-plotly-plot")]
    } else if (tab === "averages") {
        divs = [
            $("#daily-avg-chart .js-plotly-plot"),
            $("#monthly-avg-chart .js-plotly-plot")
        ]
    } else if (tab === "flowduration") {
        divs = [$("#flowduration-5-chart .js-plotly-plot")]
    } else if (tab === "biascorrection") {
        divs = [$("#volume_plot .js-plotly-plot"), $("#scatters .js-plotly-plot")]
    }
    for (let i in divs) {
        try {
            divs[i].css("height", 500)
            Plotly.Plots.resize(divs[i][0])
        } catch (e) {}
    }
}

function clearChartDivs() {
    for (let i in chart_divs) {
        chart_divs[i].html("")
    }
}

function showGetHistorical() {
    $("#historical_tab_link").show()
    $("#get-historical-btn").show()
}

function hideGetHistorical() {
    $("#historical_tab_link").hide()
    $("#get-historical-btn").hide()
}

function hideHistoricalTabs() {
    $("#avg_flow_tab_link").hide()
    $("#flow_duration_tab_link").hide()
}

function showHistoricalTabs() {
    $("#avg_flow_tab_link").show()
    $("#flow_duration_tab_link").show()
}

function hideBiasCalibrationTabs() {
    $("#bias_correction_tab_link").hide()
}

function showBiasCalibrationTabs() {
    $("#bias_correction_tab_link").show()
}

$("#forecast_tab_link").on("click", function() {
    fix_buttons("forecast")
})
$("#historical_tab_link").on("click", function() {
    fix_buttons("historical")
})
$("#avg_flow_tab_link").on("click", function() {
    fix_buttons("averages")
})
$("#flow_duration_tab_link").on("click", function() {
    fix_buttons("flowduration")
})
$("#bias_correction_tab_link").on("click", function() {
    fix_buttons("biascorrection")
})