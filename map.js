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

d3.select("#stateMap").style("visibility", 'hidden')
stateZoom.style.visibility = "hidden";

function drawStates() {
    var svg = d3.select("#stateMap")
        .attr("width", w)
        .attr("height", h)
    d3.json("assets/knowledge/map/gz_2010_us_040_00_20m.json", function (data) {
        states = data;
        for (var i = 0; i < data.features.length; i++) {
            //console.log(i);
            svg.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "rgb(" + 255 * Math.random() + "," + 255 * Math.random() + "," + 255 * Math.random() + ")")
                .attr("stroke", "white")
                .attr("stroke-width", "1px");
        }
        console.log(data.features.length);
    });
}
function drawCounties() {
    var svg = d3.select("#countyMap")
        .attr("width", w)
        .attr("height", h)
    d3.json("assets/knowledge/map/gz_2010_us_050_00_20m.json", function (data) {
        counties = data;
        for (var i = 0; i < data.features.length; i++) {
            //console.log(i);
            svg.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", "rgb(" + 255 * Math.random() + "," + 255 * Math.random() + "," + 255 * Math.random() + ")")
                .attr("stroke-width", "1px");
        }
        console.log(data.features.length);
    });
}
function showStates() {
    stateZoom.style.visibility = "visible";
    countyZoom.style.visibility = "hidden";
    d3.select("#countyMap").style("visibility", 'hidden')
    d3.select("#stateMap").style("visibility", 'visible')
}
function showCounties() {
    stateZoom.style.visibility = "hidden";
    countyZoom.style.visibility = "visible";
    d3.select("#stateMap").style("visibility", 'hidden')
    d3.select("#countyMap").style("visibility", 'visible')
}