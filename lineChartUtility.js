let attribute = {
    TOTAL_CASES: "totalCases",
    POSITIVE: "positive",
    NEGATIVE: "negative"
};

function drawLineChart(data, width, height, svg, attr) {

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) {
            switch (attr) {
                case attribute.TOTAL_CASES:
                    return y(d.totalTestResults);
                case attribute.POSITIVE:
                    return y(d.positive);
                case attribute.NEGATIVE:
                    return y(d.negative);
            }
        });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) {
        switch (attr) {
            case attribute.TOTAL_CASES:
                return d.totalTestResults;
            case attribute.POSITIVE:
                return d.positive;
            case attribute.NEGATIVE:
                return d.negative;
        }
    })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}