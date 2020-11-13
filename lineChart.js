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

/**
 * 
 * @param {String Abrrivation in Caps} state 
 */
function drawLineChartForState(state) {
	d3.csv("assets/knowledge/covid-data/states/"+state+".csv", function(error, data) {
		//Code for line chart
	});
}