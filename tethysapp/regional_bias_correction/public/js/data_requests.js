//todo: change this to point the plot at the right div
let plot = document.getElementById('plot');

let request = {
    reachid: 3001207,
    lat: 100.0,
    lon: 45.0
}

let response = {
    datetime: ['2021-06-01 00:00:00','2021-06-01 00:03:00'],
    original_flow: [100.0, 110.0],
    bias_corrected_flow: [101.0, 112.0],
    reachid: 3001207,
    lat: 100.0,
    lon: 45.0
}

let layout = {
  title: `Original vs. Bias Corrected Flow for ReachID: ${response['reachid']}`,
  xaxis: {
    title: 'DateTime',
    showgrid: true
  },
  yaxis: {
    title: 'Flow Rate m^3/s',
    showgrid: true
  }
};

const MakePlot = (response) => {
    let original_trace = {
        x: response.datetime,
        y: response.original_flow,
        mode: 'lines',
        name: 'Original Forecast'
    }
    let corrected_trace = {
        x: response.datetime,
        y: response.bias_corrected_flow,
        mode: 'lines',
        name: 'Bias Corrected Forecast'
    }

    Plotly.react(plot, [original_trace, corrected_trace], layout, {scrollZoom: true})

}