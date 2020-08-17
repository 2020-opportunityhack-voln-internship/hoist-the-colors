import * as d3 from "d3";
import _ from "lodash";
import "./style.css";

const draw = (props) => {
  d3.select(".vis-linechart > *").remove();
  const data = props.data;
  console.log(data);
  let margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;
  let svg = d3
    .select(".vis-linechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis --> it is a date format
  let x = d3
    .scaleOrdinal()
    .domain(
      data.map((d) => {
        return d.year;
      })
    )
    .range([
      ...Array.from(Array(data.length).keys()).map(
        (i) => (i * width) / (data.length - 1)
      ),
    ]);

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.score;
      }),
    ])
    .range([height, 0]);

  let line = d3
    .line()
    .x((d) => {
      return x(d.year);
    })
    .y((d) => {
      return y(d.score);
    });

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("class", "text-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Risk Score");

  svg
    .append("text")
    .attr("class", "text-axis-title")
    .attr("y", height + 35)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Year");

  let path = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke", "steelblue")
    .attr("class", "line")
    .attr("d", line);

  let pathLength = path.node().getTotalLength();

  let transitionPath = d3
    .transition()
    .ease(d3.easeLinear)
    .delay(90)
    .duration(1000);
  path
    .attr("stroke-dashoffset", pathLength)
    .attr("stroke-dasharray", pathLength)
    .transition(transitionPath)
    .on("end", () => {
      //   let self = this;
      svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", (d, i) => `dot dot-${i}`)
        .attr("cx", (d, i) => {
          return x(d.year);
        })
        .attr("cy", (d) => {
          return y(d.score);
        })
        .attr("r", 4);
      // .on("click", function (d) {
      //   if (self.selectedDot) {
      //     self.selectedDot.attr("r", 4).classed("selected", false);
      //   }

      //   if (d.score == 0) {
      //     return;
      //   }
      //   self.selectedDot = d3
      //     .select(this)
      //     .attr("r", 8)
      //     .classed("selected", true);
      //   self.onDotSelected(d.year);
      // });
    })
    .attr("stroke-dashoffset", 0);

  let self = this;
  let findClosestRange = (x, range) => {
    for (let i = 0; i < range.length; i++) {
      if (Math.abs(x - range[i]) < 30) {
        return i;
      }
    }
    return -1;
  };

  svg
    .append("rect")
    .attr("class", "overlay")
    // .attr("fill", "white")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", () => {
      console.log("MouseOver");
      svg.select(".highlight-path").remove();
    })
    .on("mouseout", () => {
      svg.select(".highlight-path").remove();
    })
    .on("mousemove", (d, i, nodes) => {
      console.log("MouseMove");
      svg.select(".highlight-path").remove();

      let mouseX = d3.mouse(nodes[i])[0];
      let idx = findClosestRange(mouseX, x.range());
      if (idx == -1) {
        return;
      }
      // console.log(x, y);
      let x1 = x(data[idx].year);
      let y1 = y(data[idx].score);
      var data1 = [
        [0, y1],
        [x1, y1],
        [x1, height],
      ];
      var lineGenerator = d3.line();
      var pathString = lineGenerator(data1);
      svg
        .append("path")
        .attr("class", "highlight-path")
        .attr("d", pathString)
        .attr("fill", "none");
    })
    .on("click", (d, i, nodes) => {
      let mouseX = d3.mouse(nodes[i])[0];
      let idx = findClosestRange(mouseX, x.range());
      if (idx == -1) {
        return;
      }

      let x1 = x(data[idx].year);
      let y1 = y(data[idx].score);
      //       // console.log(x, y);

      if (this.selectedDot) {
        this.selectedDot.attr("r", 4).classed("selected", false);
      }

      //       // if (this.currentData[idx].stars == 0) {
      //       //   return;
      //       // }

      //       // // console.log(this.svg.select(`circle.dot-${idx}`));
      //       // this.selectedDot = this.svg
      //       //   .select(`circle.dot-${idx}`)
      //       //   .attr("r", 8)
      //       //   .classed("selected", true);
      //       // this.onDotSelected(this.currentData[idx].month);
    });
  // };
};

export default draw;
