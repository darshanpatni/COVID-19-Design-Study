var w = 900;
var h = 600;

var projection = d3.geo.albersUsa()
    .translate([w / 2, h / 2])
    .scale([1000]);

var path = d3.geo.path()
    .projection(projection);

var stateColor = d3.scale.linear().domain([5000, 800000]).range(["#252525", "rgb(255, 0, 0)"])
var countyColor = d3.scale.linear().domain([1, 30000]).range(["rgb(220, 220, 280)", "rgb(255, 0, 0)"])

var Gdiv = d3.select("body").append("div")
    .attr("class", "gtooltip")

var states;
var counties;
var stateZoom = document.getElementById("stateZoom");
var countyZoom = document.getElementById("countyZoom");
var stateDeaths = {};
var stateTests = {};
var stateCases = {};
var stateCodes = {};
var countyCases = {};
var countyDeaths = {};

var Mdiv = d3.select("body").append("div")
    .attr("class", "mtooltip")
    .style("opacity", 0);
var Pdiv = d3.select("#tooltip")

d3.select("#countyMap").style("display", 'none')
d3.select("#stateButton").transition()
    .attr("class", "activeMap")
d3.select("#CmapLegend").style("display", 'none')
countyZoom.style.display = "none";

function drawStates() {
    var svg = d3.select("#SmapLegend");
    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(150,20)")
        .style("font-size", "12px");
    var stateLegend = d3.legend.color()
        .scale(stateColor)
        .shapeWidth(100)
        .orient('horizontal')
        .title("Tests by State")
        .labels(["<=100,000", "2,750,000", "5,050,000", "7,525,000", ">=10,000,000"])
        .on("cellclick", function (d) {
            console.log(d);
            d3.selectAll(".legendSelect").style("fill-opacity", "0")
            d3.select(this)
                .append("rect")
                .attr("class", "legendSelect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 100)
                .attr("height", 40)
                .style("fill-opacity", ".25")

        });


    svg.select(".legendLinear")
        .call(stateLegend);
    console.log("states being drawn");

    var svg = d3.select("#stateMap")
        .attr("width", w)
        .attr("height", h)
    d3.json("assets/knowledge/map/gz_2010_us_040_00_20m.json", function (statesData) {
        d3.csv("assets/knowledge/covid-data/us_states_covid19_daily.csv", function (statesCovid) {
            for (i = 0; i < statesData.features.length; i++) {
                stateCodes[statesData.features[i].properties.STATE] = statesData.features[i].properties.NAME;
            }
            for (i = 0; i < 56; i++) {
                stateDeaths[statesCovid[i].full] = Number(statesCovid[i].death).toLocaleString();
                stateTests[statesCovid[i].full] = Number(statesCovid[i].total).toLocaleString();
                stateCases[statesCovid[i].full] = Number(statesCovid[i].positive).toLocaleString();
                //console.log(statesCovid[i].death);
            }
            //console.log(stateDeaths);
            //console.log(stateTests);
            //console.log(statesCovid);
            //console.log(stateCodes);
            states = statesData;
            //console.log(i); 
            svg.selectAll("path")
                .data(statesData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (state) {
                    try {
                        //console.log(parseFloat(stateTests[state.properties.NAME].replace(/,/g, '')))
                        return stateColor(parseFloat(stateCases[state.properties.NAME].replace(/,/g, '')));
                    }
                    catch (error) {
                        console.error();
                        return 0;
                    }
                })
                .attr("stroke", "black")
                .attr("stroke-width", "1px")
                .on("mouseover", function (state) {
                    //console.log(state.properties.NAME);
                    drawLineChartForState(getAbbrForName(state.properties.NAME));
                    Gdiv.transition()
                        .duration(100)
                        .style("opacity", .9);
                    Gdiv.html(state.properties.NAME + "<br/>" + stateTests[state.properties.NAME] + " test(s) <br/>" + stateCases[state.properties.NAME] + " case(s)" + "<br/>" + stateDeaths[state.properties.NAME] + " death(s)")
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 100) + "px");
                    d3.select(this)
                        .style("fill-opacity", '.5')
                    Pdiv.html("<table><tr><th>State</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr><tr><td>" + state.properties.NAME + "</td><td>" + stateTests[state.properties.NAME] + "</td><td>" + stateCases[state.properties.NAME] + "</td><td>" + stateDeaths[state.properties.NAME] + "</td></tr></table>")
                })
                .on("mouseout", function (state) {
                    Gdiv = d3.selectAll(".gtooltip")
                    Gdiv.transition()
                        .duration(100)
                        .style("opacity", 0);
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
    var svg = d3.select("#CmapLegend");
    svg.append("g")
        .attr("class", "legendSymbol")
        .attr("transform", "translate(150,20)")
        .style("font-size", "12px");
    var legend = d3.legend.color()
        .shapeWidth(100)
        .orient('horizontal')
        .scale(countyColor)
        .title("Case(s) by County")
        .labels(["<=1", "7,500", "15,000", "22,500", ">=30,000"])
        .on("cellclick", function (d) {
            //console.log(d);
            var active = d.active ? false : true,
                newOpacity = active ? 0 : 1
            d3.select(this)
                .transition()
                .duration(100)
                .style("opacity", newOpacity)
            d.active = active;
        });
    svg.select(".legendSymbol")
        .call(legend);

    var svg = d3.select("#countyMap")
        .attr("width", w)
        .attr("height", h)
    d3.json("assets/knowledge/map/gz_2010_us_040_00_20m.json", function (statesData) {
        d3.json("assets/knowledge/map/gz_2010_us_050_00_20m.json", function (countiesData) {
            d3.csv("assets/knowledge/covid-data/us_counties_covid19_daily.csv", function (countiesCovid) {
                for (i = 568098; i < 573338; i++) {
                    countyDeaths[countiesCovid[i].county + countiesCovid[i].full] = Number(countiesCovid[i].deaths).toLocaleString();
                    countyCases[countiesCovid[i].county + countiesCovid[i].full] = Number(countiesCovid[i].cases).toLocaleString();
                    //console.log(countiesCovid[i]);
                }
                counties = countiesData;
                //console.log(countiesCovid);
                //console.log(statesData);
                //console.log(countiesData);
                svg.selectAll("path")
                    .data(countiesData.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .attr("fill", function (county) {
                        try {
                            //console.log(parseFloat(countyCases[county.properties.NAME+ stateCodes[county.properties.STATE]].replace(/,/g, ''));
                            return countyColor(parseFloat(countyCases[county.properties.NAME + stateCodes[county.properties.STATE]].replace(/,/g, '')));
                        }
                        catch (error) {
                            console.error();
                            return "rgb(220, 220, 280)";
                        }
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", ".25px")
                    .on("mouseover", function (county) {
                        //console.log(county.properties.NAME);
                        //console.log(county.properties);
                        Gdiv.transition()
                            .duration(100)
                            .style("opacity", .9);
                        Gdiv.html(county.properties.NAME + "<br/>" + stateCodes[county.properties.STATE] + "<br/>" + countyCases[county.properties.NAME + stateCodes[county.properties.STATE]] + " case(s)" + "<br/>" + countyDeaths[county.properties.NAME + stateCodes[county.properties.STATE]] + " death(s)")
                            .style("left", (d3.event.pageX + 15) + "px")
                            .style("top", (d3.event.pageY - 100) + "px");
                        d3.select(this)
                            .style("fill-opacity", '.5')
                        Pdiv.html("<table><tr><th>County</th><th>State</th><th>Cases</th><th>Deaths</th></tr><tr><td>" + county.properties.NAME + "</td><td>" + stateCodes[county.properties.STATE] + "</td><td>" + countyCases[county.properties.NAME + stateCodes[county.properties.STATE]] + "</td><td>" + countyDeaths[county.properties.NAME + stateCodes[county.properties.STATE]] + "</td></tr></table>")
                    })
                    .on("mouseout", function (county) {
                        Gdiv = d3.selectAll(".gtooltip")
                        Gdiv.transition()
                            .duration(100)
                            .style("opacity", 0);
                        d3.select(this)
                            .style("fill-opacity", '1')
                        //optional to make table empty
                        Pdiv.html("<table><tr><th>County</th><th>State</th><th>Cases</th><th>Deaths</th></tr ><tr><td></td><td></td><td></td><td></td></tr></table>")
                    })


                console.log(countiesData.features.length);
            });
        });
    });
}
function show(value) {
    if (value == "states") {
        d3.select("#stateButton").transition()
            .attr("class", "activeMap")
        d3.select("#countyButton").transition()
            .attr("class", "sort")

        d3.select("#CmapLegend").style("display", 'none')
        stateZoom.style.display = "block";
        countyZoom.style.display = "none";
        d3.select("#countyMap").style("display", 'none')
        d3.select("#stateMap").style("display", 'block')
        d3.select("#SmapLegend").style("display", 'block')
        d3.select("#CmapLegend").style("display", 'none')
        Pdiv.html("<table><tr><th>State</th><th>Tests</th><th>Cases</th><th>Deaths</th></tr ><tr><td></td><td></td><td></td><td></td></tr></table>")
    }
    else if (value == "counties") {
        d3.select("#stateButton").transition()
            .attr("class", "sort")
        d3.select("#countyButton").transition()
            .attr("class", "activeMap")
        stateZoom.style.display = "none";
        countyZoom.style.display = "block";
        d3.select("#stateMap").style("display", 'none')
        d3.select("#countyMap").style("display", 'block')
        d3.select("#SmapLegend").style("display", 'none')
        d3.select("#CmapLegend").style("display", 'block')
        Pdiv.html("<table><tr><th>County</th><th>State</th><th>Cases</th><th>Deaths</th></tr ><tr><td></td><td></td><td></td><td></td></tr></table>")
    }
}
