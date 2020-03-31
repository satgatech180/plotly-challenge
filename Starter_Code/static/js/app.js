init()

// =========================================
function init () {
  var selector = d3.select('select')

  d3.json('samples.json').then(data => {
    data.names.forEach(sample => {
      selector
        .append('option')
        .text(sample)
        .property('value', sample)
    });
    showMetadata(data.names[0])
    showChart(data.names[0])
  });
};

function optionChanged(sample) {
  showMetadata(sample);
  showChart(sample);
}

function showMetadata (name) {
  d3.json('samples.json').then(data => {
    var metadata = data.metadata

    var resultArray = metadata.filter(row => row.id == name)
    var result = resultArray[0]
    var panel = d3.select('#sample-metadata')

    panel.html('')

    Object.entries(result).forEach((([key, value]) => {
      panel.append('h6').text(`${key.toUpperCase()}: ${value}`)
    }))
    
    buildGauge(result.wfreg)
  })
}

function showChart (name) {
  d3.json('samples.json').then(data => {
    var samples = data.samples

    var resultArray = samples.filter(row => row.id == name)
    var result = resultArray[0]

    var otu_ids = result.otu_ids
    var otu_labels = result.otu_labels
    var sample_values = result.sample_values

    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode: 'closest',
      xaxis: { title: 'OTU ID'},
      margin: { t: 30 }
    }

    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      }
    
    ]

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    var barData = [
      {
        y: result.otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        x: result.sample_values.slice(0,10).reverse(),
        text: result.otu_labels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h'
      }
    ];

    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot('bar', barData, barLayout);
  });
};
