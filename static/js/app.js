// Set the path to the JSON data
const dataPath = 'samples.json';

// Fetch the JSON data and log it
d3.json(dataPath).then((data) => {
    console.log(data);
});

function init() {
    // Dropdown menu selector
    let dropdownMenu = d3.select('#selDataset');

    // Fetch data for the dropdown
    d3.json(dataPath).then((data) => {
        let sampleNames = data.names;

        // Populate the sample list in the dropdown
        sampleNames.forEach((sample) => {
            dropdownMenu.append('option').text(sample).property('value', sample);
        });

        // Initialize with the first sample
        let initialSample = sampleNames[0];
        updateBarChart(initialSample);
        updateBubbleChart(initialSample);
        updateMetaData(initialSample);
    });
}

// Initialize the page
init();

// Function defined in index.html and called onchange to update data
function optionChanged(newSample) {
    updateBarChart(newSample);
    updateBubbleChart(newSample);
    updateMetaData(newSample);    
}

function updateBarChart(sample) {
    // Data retrieval
    d3.json(dataPath).then((data) => {
        let samplesData = data.samples;

        // Filter data by sample ID
        let sampleFilter = samplesData.filter((sampleObj) => sampleObj.id == sample);
        let sampleResult = sampleFilter[0];

        let otuIds = sampleResult.otu_ids;
        let otuLabels = sampleResult.otu_labels;
        let sampleValues = sampleResult.sample_values;

        // Trace and plot for the bar chart
        let trace = [{
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];
        Plotly.newPlot('bar', trace);
        console.log(`${sample} bar chart loaded`);
    });
}

function updateBubbleChart(sample) {
    // Data retrieval
    d3.json(dataPath).then((data) => {
        let samplesData = data.samples;

        // Filter data by sample ID
        let sampleFilter = samplesData.filter((sampleObj) => sampleObj.id == sample);
        let sampleResult = sampleFilter[0];

        let otuIds = sampleResult.otu_ids;
        let otuLabels = sampleResult.otu_labels;
        let sampleValues = sampleResult.sample_values;

        // Trace and plot for the bubble chart
        let trace = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Earth',
            }
        }];
        Plotly.newPlot('bubble', trace);
        console.log(`${sample} bubble chart loaded`);
    });
}

function updateMetaData(sample) {
    d3.json(dataPath).then((data) => {
        let metadata = data.metadata;

        // Filter metadata by sample ID
        let metaFilter = metadata.filter((metaObj) => metaObj.id == sample);
        let metaResult = metaFilter[0];

        // Selector for the reference in index.html
        let panel = d3.select("#sample-metadata");

        // Clear old data
        panel.html("");

        // Build new data
        Object.entries(metaResult).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
        console.log(`${sample} metadata loaded`);
    });
}
