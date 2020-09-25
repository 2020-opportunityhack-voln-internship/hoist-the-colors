import * as d3 from "d3";
import "./style.css";

const draw = (props) => {
  d3.select(".vis-donutchart > *").remove();
  const data = props.data;
  console.log("DATA", data);
  const query = ".vis-donutchart";
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const cWidth = props.width - margin.left - margin.right;
  const cHeight = props.height - margin.top - margin.bottom;
  let options = {
    diameter: 200,
    max: 100,
    round: true,
    series: [
      {
        value: data,
        color: ["#66cc66", "#cc3333"],
      },
    ],
    center: function (d) {
      return d + " %";
    },
  };

  let normalizeCenter = function (center) {
    if (!center) return null;

    // Convert to object notation
    if (center.constructor !== Object) {
      center = { content: center };
    }

    // Defaults
    center.content = center.content || [];
    center.x = center.x || 0;
    center.y = center.y || 0;

    // Convert content to array notation
    if (!Array.isArray(center.content)) {
      center.content = [center.content];
    }

    return center;
  };
  let ColorsIterator = (function () {
    ColorsIterator.DEFAULT_COLORS = [
      "#1ad5de",
      "#a0ff03",
      "#e90b3a",
      "#ff9500",
      "#007aff",
      "#ffcc00",
      "#5856d6",
      "#8e8e93",
    ];

    function ColorsIterator() {
      this.index = 0;
    }

    ColorsIterator.next = function () {
      if (this.index === ColorsIterator.DEFAULT_COLORS.length) {
        this.index = 0;
      }

      return ColorsIterator.DEFAULT_COLORS[this.index++];
    };

    return ColorsIterator;
  })();

  let normalizeColor = function (color, defaultColorsIterator) {
    if (!color) {
      color = { solid: defaultColorsIterator.next() };
    } else if (typeof color === "string") {
      color = { solid: color };
    } else if (Array.isArray(color)) {
      color = { interpolate: color };
    } else if (typeof color === "object") {
      if (
        !color.solid &&
        !color.interpolate &&
        !color.linearGradient &&
        !color.radialGradient
      ) {
        color.solid = defaultColorsIterator.next();
      }
    }

    // Validate interpolate syntax
    if (color.interpolate) {
      if (color.interpolate.length !== 2) {
        throw new Error("interpolate array should contain two colors");
      }
    }

    // Validate gradient syntax
    if (color.linearGradient || color.radialGradient) {
      if (
        !color.stops ||
        !Array.isArray(color.stops) ||
        color.stops.length !== 2
      ) {
        throw new Error("gradient syntax is malformed");
      }
    }

    // Set background when is not provided
    if (!color.background) {
      if (color.solid) {
        color.background = color.solid;
      } else if (color.interpolate) {
        color.background = color.interpolate[0];
      } else if (color.linearGradient || color.radialGradient) {
        color.background = color.stops[0]["stop-color"];
      }
    }

    return color;
  };

  let normalizeOptions = function (options) {
    if (!options || typeof options !== "object") {
      options = {};
    }

    var _options = {
      diameter: options.diameter || 100,
      stroke: {
        width: (options.stroke && options.stroke.width) || 40,
        gap:
          !options.stroke || options.stroke.gap === undefined
            ? 2
            : options.stroke.gap,
      },
      shadow: {
        width:
          !options.shadow || options.shadow.width === null
            ? 4
            : options.shadow.width,
      },
      animation: {
        duration: (options.animation && options.animation.duration) || 1750,
        delay: (options.animation && options.animation.delay) || 200,
      },
      min: options.min || 0,
      max: options.max || 100,
      round: options.round !== undefined ? !!options.round : true,
      series: options.series || [],
      center: normalizeCenter(options.center),
    };

    var defaultColorsIterator = new ColorsIterator();
    for (var i = 0, length = _options.series.length; i < length; i++) {
      var item = options.series[i];

      // convert number to object
      if (typeof item === "number") {
        item = { value: item };
      }

      _options.series[i] = {
        index: i,
        value: item.value,
        labelStart: item.labelStart,
        color: normalizeColor(item.color, defaultColorsIterator),
      };
    }

    return _options;
  };
  options = normalizeOptions(options);
  console.log(options);

  // internal  variables
  var series = options.series,
    width =
      15 +
      (options.diameter / 2 +
        options.stroke.width * options.series.length +
        (options.stroke.gap * options.series.length - 1)) *
        2,
    height = width,
    // dim = "0 0 " + (cHeight + 50) + " " + (cWidth + 20),
    dim = "0 0 500 300",
    τ = 2 * Math.PI,
    inner = [],
    outer = [];
  console.log(dim);

  function innerRadius(item) {
    var radius = inner[item.index];
    if (radius) return radius;

    // first ring based on diameter and the rest based on the previous outer radius plus gap
    radius =
      item.index === 0
        ? options.diameter / 2
        : outer[item.index - 1] + options.stroke.gap;
    inner[item.index] = radius;
    return radius;
  }

  function outerRadius(item) {
    var radius = outer[item.index];
    if (radius) return radius;

    // based on the previous inner radius + stroke width
    radius = inner[item.index] + options.stroke.width;
    outer[item.index] = radius;
    return radius;
  }

  let progress = d3
    .arc()
    .startAngle(0)
    .endAngle(function (item) {
      return (item.percentage / 100) * τ;
    })
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(function (d) {
      // Workaround for d3 bug https://github.com/mbostock/d3/issues/2249
      // Reduce corner radius when corners are close each other
      var m = d.percentage >= 90 ? (100 - d.percentage) * 0.1 : 1;
      return (options.stroke.width / 2) * m;
    });

  var background = d3
    .arc()
    .startAngle(0)
    .endAngle(τ)
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  // create svg
  let svg = d3
    .select(query)
    .append("svg")
    .attr("width", cWidth + margin.left + margin.right)
    .attr("height", cHeight + margin.top + margin.bottom)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", dim)
    .append("g")
    .attr("transform", "translate(" + width / 1.5 + "," + height / 2 + ")");

  // add gradients defs
  var defs = svg.append("svg:defs");

  // add shadows defs
  defs = svg.append("svg:defs");
  var dropshadowId = "dropshadow-" + Math.random();
  var filter = defs.append("filter").attr("id", dropshadowId);
  if (options.shadow.width > 0) {
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", options.shadow.width)
      .attr("result", "blur");

    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 1)
      .attr("result", "offsetBlur");
  }

  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "offsetBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // add inner text
  if (options.center) {
    svg
      .append("text")
      .attr("class", "rbc-center-text")
      .attr("text-anchor", "middle")
      .attr("x", options.center.x + "px")
      .attr("y", options.center.y + "px")
      .selectAll("tspan")
      .data(options.center.content)
      .enter()
      .append("tspan")
      .attr("dominant-baseline", function () {
        // Single lines can easily centered in the middle using dominant-baseline, multiline need to use y
        if (options.center.content.length === 1) {
          return "central";
        }
      })
      .attr("class", function (d, i) {
        return "rbc-center-text-line" + i;
      })
      .attr("x", 0)
      .attr("dy", function (d, i) {
        if (i > 0) {
          return "1.1em";
        }
      })
      .each(function (d) {
        if (typeof d === "function") {
          this.callback = d;
        }
      })
      .text(function (d) {
        if (typeof d === "string") {
          return d;
        }

        return "";
      });
  }

  // add ring structure
  let field = svg.selectAll("g").data(series).enter().append("g");

  field
    .append("path")
    .attr("class", "progress")
    .attr("filter", "url(#" + dropshadowId + ")");

  field
    .append("path")
    .attr("class", "bg")
    .style("fill", function (item) {
      return item.color.background;
    })
    .style("opacity", 0.2)
    .attr("d", background);

  field
    .append("text")
    .classed("rbc-label rbc-label-start", true)
    .attr("dominant-baseline", "central")
    .attr("x", "10")
    .attr("y", function (item) {
      return -(
        options.diameter / 2 +
        item.index * (options.stroke.gap + options.stroke.width) +
        options.stroke.width / 2
      );
    })
    .text(function (item) {
      return item.labelStart;
    });

  let update = function (data) {
    // parse new data
    if (data) {
      if (typeof data === "number") {
        data = [data];
      }

      var series;

      if (Array.isArray(data)) {
        series = data;
      } else if (typeof data === "object") {
        series = data.series || [];
      }

      for (var i = 0; i < series.length; i++) {
        this.options.series[i].previousValue = this.options.series[i].value;

        var item = series[i];
        if (typeof item === "number") {
          this.options.series[i].value = item;
        } else if (typeof item === "object") {
          this.options.series[i].value = item.value;
        }
      }
    }

    // calculate from percentage and new percentage for the progress animation
    console.log(options);
    options.series.forEach(function (item) {
      item.fromPercentage = item.percentage ? item.percentage : 5;
      item.percentage =
        ((item.value - options.min) * 100) / (options.max - options.min);
    });

    var center = svg.select("text.rbc-center-text");

    // progress
    field
      .select("path.progress")
      .interrupt()
      .transition()
      .duration(options.animation.duration)
      .delay(function (d, i) {
        // delay between each item
        return i * options.animation.delay;
      })
      //   .ease("elastic")
      .attrTween("d", function (item) {
        var interpolator = d3.interpolateNumber(
          item.fromPercentage,
          item.percentage
        );
        return function (t) {
          item.percentage = interpolator(t);
          return progress(item);
        };
      })
      .tween("center", function (item) {
        // Execute callbacks on each line
        if (options.center) {
          var interpolate = options.round
            ? d3.interpolateRound
            : d3.interpolateNumber;
          var interpolator = interpolate(item.previousValue || 0, item.value);
          return function (t) {
            center.selectAll("tspan").each(function () {
              if (this.callback) {
                d3.select(this).text(
                  this.callback(interpolator(t), item.index, item)
                );
              }
            });
          };
        }
      })
      .tween("interpolate-color", function (item) {
        if (item.color.interpolate && item.color.interpolate.length == 2) {
          var colorInterpolator = d3.interpolateHsl(
            item.color.interpolate[0],
            item.color.interpolate[1]
          );

          return function (t) {
            var color = colorInterpolator(item.percentage / 100);
            d3.select(this).style("fill", color);
            d3.select(this.parentNode).select("path.bg").style("fill", color);
          };
        }
      });
    //   .style("fill", function (item) {
    //     if (item.color.solid) {
    //       return item.color.solid;
    //     }

    //     if (item.color.linearGradient || item.color.radialGradient) {
    //       return "url(#gradxsient" + item.index + ")";
    //     }
    //   });
  };
  update();

  const global_avg = 25;
  const angle = (global_avg / 100) * 360 + 90;
  const radians = (angle * Math.PI) / 180;
  const x1 = -100 * Math.cos(radians);
  const y1 = -100 * Math.sin(radians);
  const x2 = -(100 + options.stroke.width) * Math.cos(radians);
  const y2 = -(100 + options.stroke.width) * Math.sin(radians);

  //Draw line for global risk score
  svg
    .append("line")
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2);
};

export default draw;
