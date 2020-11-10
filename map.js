var w = 900;
var h = 600;

var projection = d3.geo.albersUsa()
    .translate([w / 2, h / 2])
    .scale([1000]);

var path = d3.geo.path()
    .projection(projection);

var states;
var counties;
var stateZoom = document.getElementById("stateZoom");
var countyZoom = document.getElementById("countyZoom");
var stateDeaths;

var Mdiv = d3.select("body").append("div")
    .attr("class", "mtooltip")
    .style("opacity", 0);
var Pdiv = d3.select("#tooltip")

d3.select("#countyMap").style("visibility", 'hidden')
countyZoom.style.visibility = "hidden";

function drawStates() {
    console.log("states being drawn");
    var svg = d3.select("#stateMap")
        .attr("width", w)
        .attr("height", h)
    d3.json("assets/knowledge/map/gz_2010_us_040_00_20m.json", function (statesData) {
        d3.csv("assets/knowledge/covid-data/us_states_covid19_daily.csv", function (statesCovid) {
            for (i = 0; i < 56; i++) {
                console.log(statesCovid[i].death);
            }
            //console.log(statesCovid);
            states = statesData;
            //console.log(i);
            svg.selectAll("path")
                .data(statesData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "rgb(" + 255 * Math.random() + "," + 255 * Math.random() + "," + 255 * Math.random() + ")")
                .attr("stroke", "black")
                .attr("stroke-width", "1px")
                .on("mouseover", function (state) {
                    //console.log(state.properties.NAME);
                    //console.log(state.properties);
                    d3.select(this)
                        .style("fill-opacity", '.25')
                    Pdiv.html("<table><tr><th>State</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr><tr><td>" + state.properties.NAME + "</td><td></td><td></td><td></td></tr></table>")
                })
                .on("mouseout", function (state) {
                    d3.select(this)
                        .style("fill-opacity", '1')
                    //optional to make table empty
                    Pdiv.html("<table><tr><th>State</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr ><tr><td></td><td></td><td></td><td></td></tr></table>")
                })


            console.log(statesData.features.length);
        });
    });
}
function drawCounties() {
    var svg = d3.select("#countyMap")
        .attr("width", w)
        .attr("height", h)
    d3.json("assets/knowledge/map/gz_2010_us_050_00_20m.json", function (countiesData) {
        d3.csv("", function () {
            counties = countiesData;
            //console.log(i);
            svg.selectAll("path")
                .data(countiesData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", "rgb(" + 255 * Math.random() + "," + 255 * Math.random() + "," + 255 * Math.random() + ")")
                .attr("stroke-width", "1px")
                .on("mouseover", function (county) {
                    //console.log(county.properties.NAME);
                    //console.log(county.properties);
                    d3.select(this)
                        .style("fill-opacity", '.25')
                    Pdiv.html("<table><tr><th>County</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr><tr><td>" + county.properties.NAME + "</td><td></td><td></td><td></td></tr></table>")
                })
                .on("mouseout", function (state) {
                    d3.select(this)
                        .style("fill-opacity", '1')
                    //optional to make table empty
                    Pdiv.html("<table><tr><th>County</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr ><tr><td></td><td></td><td></td><td></td></tr></table>")
                })


            console.log(countiesData.features.length);
        });
    });
}
function showStates() {
    stateZoom.style.visibility = "visible";
    countyZoom.style.visibility = "hidden";
    d3.select("#countyMap").style("visibility", 'hidden')
    d3.select("#stateMap").style("visibility", 'visible')
    Pdiv.html("<table><tr><th>State</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr ><tr><td></td><td></td><td></td><td></td></tr></table>")
}
function showCounties() {
    stateZoom.style.visibility = "hidden";
    countyZoom.style.visibility = "visible";
    d3.select("#stateMap").style("visibility", 'hidden')
    d3.select("#countyMap").style("visibility", 'visible')
    Pdiv.html("<table><tr><th>County</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr ><tr><td></td><td></td><td></td><td></td></tr></table>")
}