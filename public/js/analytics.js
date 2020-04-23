
var data = [["One", 1, 2, 3, 4], ["two", 1, 2, 3, 4], ["three", 1, 2, 3, 4]]; 
 
d3.select('#analytics').append('svg')
  .attr("viewBox", [0, 0, width, height])
  .attr('id', "stackChart")
  .style('background', '#dff0d8');

d3.select("#stackChart").append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  d3.select("#stackChart").append("g")
      .call(xAxis);

  d3.select("#stackChart").append("g")
      .call(yAxis);