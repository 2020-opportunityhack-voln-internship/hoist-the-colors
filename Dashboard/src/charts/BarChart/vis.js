import * as d3 from "d3";
import "./style.css";

const draw = (props) => {
  d3.select(".vis-barchart > *").remove();
  const data = props.data;
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;
  let svg = d3
    .select(".vis-barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  let x = d3.scaleBand().range([0, width]).padding(0.3);
  let y = d3.scaleLinear().range([height, 0]);
  const yMax =
    d3.max(data, function (d) {
      return d.score;
    }) + 1;
  x.domain(
    data.map(function (d) {
      return d.category_name;
    })
  );
  y.domain([0, 100]);
  let opacity = d3.scaleLinear().domain([0, yMax]).range([0.2, 1.0]);

  // add the x Axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").attr("class", "yaxis").call(d3.axisLeft(y));

  // add text for x Axis
  svg
    .append("text")
    .attr("class", "text-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Risk Score");

  // add text for y Axis
  svg
    .append("text")
    .attr("class", "text-axis-title")
    .attr("y", height + 35)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Toxic categories");

  // append the rectangles for the bar chart
  let bars = svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d) => `translate(${x(d.category_name)}, ${0})`)
    .attr("height", height);

  let barWidth = x.bandwidth();

  bars
    .append("rect")
    .attr("x", 0)
    .attr("y", height)
    .attr("width", barWidth)
    // .attr("fill", "#370C35")
    .attr("height", (d) => {
      return 0;
    })
    .attr("opacity", (d) => {
      return opacity(d.score);
    })
    .on("mousemove", function () {
      let del = 5;
      d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .delay(0)
        .attr("x", -del / 2)
        .attr("width", barWidth + del);
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .delay(0)
        .attr("x", 0)
        .attr("width", barWidth);
    });

  //animation
  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", (d) => {
      return y(d.score);
    })
    .attr("height", (d) => {
      return height - y(d.score);
    })
    .delay(function (d, i) {
      return i * 80;
    })
    .on("end", () => {
      bars
        .append("text")
        .attr("class", "bar-text")
        .attr("x", barWidth / 2)
        .attr("y", (d, i, nodes) => y(data[i].score) - 20)
        .attr("dy", "1em")
        .attr("font-size", "0.8em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text((d, i, nodes) => data[i].score);
    });
};

export default draw;
