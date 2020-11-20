var stateData = null;
var dropdown = null;
var defaultOption = null;

window.addEventListener('load', function() {
    console.log('All assets are loaded')
    dropdown = document.getElementById('state-dropdown');
    dropdown.length = 0;

    dropdown.selectedIndex = 0;

    d3.json("assets/knowledge/state-titlecase.json", function(error, data) {
        let option;
        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i]["name"];
          option.value = data[i]["abbreviation"];
          dropdown.add(option);
        }
    })
    drawLineChartForState("IN");
})


d3.json("assets/knowledge/covid-data/states_data.json", function(error, data) {
    stateData = data;
});

/**
 * 
 * @param {String Abbrivation in Caps} state 
 */
function getCumulitiveDataForState(state) {
    return stateData[state]["cumulitive_data"];
}

/**
 * 
 * @param {String Abbrivation in Caps} state 
 * @param {String YYYY-mm-dd format} date 
 */
function getStateDataForDate(state, date) {
    return stateData[state]["date_data"][date];
}

// Set the dimensions of the canvas / graph
var	margin = {top: 30, right: 70, bottom: 30, left: 0},
	width = 550 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom;
 
// Parse the date / time
var	parseDate = d3.time.format("%Y%m%d").parse;
 
// Adds the svg canvas
var	divTotalCases = d3.select("#totalCases");

var divPositive = d3.select("#positive");

var divRecovered = d3.select("#recovered");

function selectStateFromDropDown() {
    drawLineChartForState(dropdown.value);
}

/**
 * 
 * @param {String Abrrivation in Caps} state 
 */
function drawLineChartForState(state) {
	d3.csv("assets/knowledge/covid-data/states/"+state+".csv", function(error, data) {
        dropdown.value = state;
        //Code for line chart
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.positive = +d.positive;
            d.negative = +d.negative;
            d.totalTestResults = +d.totalTestResults;
        });
    
        drawTotalCases(data);
        drawPostive(data);
        drawRecovered(data);
	});
}

function drawTotalCases(data){
    divTotalCases.select("svg").remove();

    var	svgTotalCases = divTotalCases
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    drawLineChart(data, width, height, svgTotalCases, attribute.TOTAL_CASES);

}

function drawPostive(data){
    divPositive.select("svg").remove();

    var svgPositive = divPositive
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawLineChart(data, width, height, svgPositive, attribute.POSITIVE);
}

function drawRecovered(data){
    divRecovered.select("svg").remove();

    var svgRecovered = divRecovered
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");   

    drawLineChart(data, width, height, svgRecovered, attribute.RECOVERED);
}
