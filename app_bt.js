// Define SVG area dimensions
var svgWidth = 1260;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 30,
  bottom: 30,
  left: 90
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.json("caliburn_ranks.json", function (data) {
  var parseDate = d3.timeParse("%B-%Y")
  var xBand = d3.scaleBand()
		.domain(data.map(d=>d.date_list))
		.range([0,chartWidth])
		.padding(0.1)

  var xTime = d3.scaleTime()
		.domain(d3.extent(data, d=>parseDate(d.date_list)))
		.range([0,chartWidth]);

  var yLinearScale = d3.scaleLinear()
	.domain([1,5])
	.range([0,chartHeight]);

  var topAxis = d3.axisTop(xBand);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(5);

  chartGroup.append("g")
	.attr("class","leftAxis")
	.call(leftAxis);

  chartGroup.append("g")
	.attr("transform",`translate(0,0)` )
	.attr("class","topAxis")
	.call(topAxis);

  chartGroup.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBand(d.date_list))
    .attr("y", d => 0)
    .attr("width", xBand.bandwidth())
    .attr("height", d => yLinearScale(d.big_ten_rank));

  chartGroup.selectAll(".marker")
	.data(data)
	.enter()
	.append("text")
	.attr("class","marker")
	.attr("x", d=> xBand(d.date_list)+xBand.bandwidth()/2-20)
	.attr("y", d=> yLinearScale(d.big_ten_rank)-10)
	.text(function(d) {return d.big_ten_rank});

});
