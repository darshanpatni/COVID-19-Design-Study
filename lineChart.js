var stateData = null;
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

let attribute = {
    TOTAL_CASES: "totalCases",
    POSITIVE: "positive",
    NEGATIVE: "negative"
};

// Set the dimensions of the canvas / graph
var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 600 - margin.left - margin.right,
	height = 270 - margin.top - margin.bottom;
 
// Parse the date / time
var	parseDate = d3.time.format("%Y%m%d").parse;
 
// Set the ranges
var	x;
var y;
 
// Declare the axes
var	xAxis;  
var	yAxis; 
 
// Declare the line
var	valueline ;

// Adds the svg canvas
var	svgTotalCases = d3.select("#totalCases")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgPositive = d3.select("#positive")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgNegative = d3.select("#negative")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");        
/**
 * 
 * @param {String Abrrivation in Caps} state 
 */
function drawLineChartForState(state) {
	d3.csv("assets/knowledge/covid-data/states/"+state+".csv", function(error, data) {
        //Code for line chart
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.positive = +d.positive;
            d.negative = +d.negative;
            d.totalTestResults = +d.totalTestResults;
        });
    
    drawTotalCases(data);
    drawPostive(data);
    drawNegative(data);
	});
}

function drawTotalCases(data){

 drawLineChart(data, width, height, svgTotalCases, attribute.TOTAL_CASES);

}

function drawPostive(data){

 drawLineChart(data, width, height, svgPositive, attribute.POSITIVE);


}

function drawNegative(data){

 drawLineChart(data, width, height, svgNegative, attribute.NEGATIVE);

}
