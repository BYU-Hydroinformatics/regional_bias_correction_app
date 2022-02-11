const divIDForForecastCharts = 'forecast-chart'
// let request = {
//     reachid: 3001207,
//     lat: 100.0,
//     lon: 45.0,
//     start_date: start_date
// }

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

function makePlot(response) {
    // todo: loading icon, remove text input, format plot better, make modal wider
    let original_trace = {
        x: response.datetime,
        y: response.original_flow,
        mode: 'lines',
        name: 'Original Forecast'
    }

    console.log(original_trace)

    let corrected_trace = {
        x: response.datetime,
        y: response.bias_corrected_flow,
        mode: 'lines',
        name: 'Bias Corrected Forecast'
    }

    console.log(corrected_trace)

    let layout = {
      title: `Original vs. Bias Corrected Flow for ReachID: ${parseInt(response['reachid'])}`,
      xaxis: {
        title: 'DateTime',
        showgrid: true
      },
      yaxis: {
        title: 'Flow Rate m^3/s',
        showgrid: true
      }
    };

    Plotly.react(divIDForForecastCharts, [original_trace, corrected_trace], layout, {scrollZoom: true})

}