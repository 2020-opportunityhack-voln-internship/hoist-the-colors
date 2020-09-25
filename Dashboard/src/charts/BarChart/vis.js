import * as d3 from "d3";
import "./style.css";

const draw = (props) => {
  d3.select(".vis-barchart > *").remove();
  const data = props.data;
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;
  const subgroups = ["global_avg_score", "current_user_score"];
  const group_data = {
    global_avg_score: {
      toxic: 45,
      severe_toxic: 30,
      obscene: 35,
      threat: 25,
      insult: 47,
      identity_hate: 50,
    },
    current_user_score: {
      toxic: 10,
      severe_toxic: 11,
      obscene: 56,
      threat: 34,
      insult: 45,
      identity_hate: 7,
    },
  };
  const category_names = [
    "toxic",
    "severe_toxic",
    "obscene",
    "threat",
    "insult",
    "identity_hate",
  ];
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
    .call(d3.axisBottom(x).tickSize(0));

  // add the y Axis
  svg.append("g").attr("class", "yaxis").call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal().domain(subgroups).range(["#871F78", "#003366"]);

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
  // .selectAll("rect");
  // .filter(function () {
  //   return !this.classList.contains("legend");
  // });

  // .append("rect")
  // .attr("x", function (d) {
  //   return xSubgroup(d.key);
  // })
  // .attr("y", function (d) {
  //   return y(d.value);
  // })
  // .attr("width", xSubgroup.bandwidth())
  // .attr("fill", function (d) {
  //   return color(d.key);
  // })
  // .attr("height", function (d) {
  //   return height - y(d.value);
  // });

  let barWidth = xSubgroup.bandwidth();

  bars
    .selectAll(".bars")
    .data((d, i) =>
      subgroups.map((key) => {
        return { key: key, value: group_data[key][category_names[i]] };
      })
    )
    .enter()
    .append("rect")
    .attr("class", "bars")
    .attr("y", height)
    .attr("width", barWidth)
    .attr("fill", (d) => color(d.key))
    .attr("height", 0)
    .attr("opacity", (d) => opacity(d.value / 80))
    .on("mousemove", () => {
      let del = 3;
      d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .delay(0)
        .attr("x", (d) => {
          return xSubgroup(d.key) - del / 2;
        })
        .attr("width", barWidth + del);
    })
    .on("mouseout", () => {
      d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .delay(0)
        .attr("x", (d) => xSubgroup(d.key))
        .attr("width", barWidth);
    });

  //Legend
  let legend = [
    ["#871F78", "Global average Score"],
    ["#003366", "Current user score"],
  ];

  let legendIndicatorSize = 18;

  let l = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(810, 20)")
    .style("backgroud-color", "#eee");

  l.append("rect")
    .attr("width", 135)
    .attr("height", 60)
    .attr("transform", `translate(-7,-7)`)
    .attr("fill", "#eee");

  l.selectAll("legend-indicator")
    .data(legend)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * (legendIndicatorSize + 5))
    .attr("width", legendIndicatorSize)
    .attr("height", legendIndicatorSize)
    .style("fill", (d) => d[0]);

  l.selectAll("legend-label")
    .data(legend)
    .enter()
    .append("text")
    .attr("x", legendIndicatorSize + 8)
    .attr(
      "y",
      (d, i) => i * (legendIndicatorSize + 5) + legendIndicatorSize / 2
    )
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
    .style("font-size", "0.72em")
    .style("fill", "#37474F")
    .text((d) => d[1]);

  //animation
  svg
    .selectAll(".bars")
    .transition()
    .duration(800)
    .attr("x", (d) => xSubgroup(d.key))
    .attr("y", (d) => {
      return y(d.value);
    })
    .attr("height", (d) => height - y(d.value))
    .delay((d, i) => i * 80)
    .on("end", () => {
      bars
        .selectAll(".bars")
        .append("text")
        .attr("class", "bar-text")
        .attr("x", (d) => {
          return xSubgroup(d.key) + barWidth / 2;
        })
        .attr("y", (d) => {
          return y(d.value) - 10;
        })
        .attr("dy", "1em")
        .attr("font-size", "0.8em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text((d) => {
          return d.value;
        });
    });
};

export default draw;
