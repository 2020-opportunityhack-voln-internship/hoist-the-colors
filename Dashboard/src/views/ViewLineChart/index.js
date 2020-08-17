import React, { Component } from "react";
import "./viewlinechart.css";
import LineChart from "../../charts/LineChart";

export default class ViewLineChart extends Component {
  render() {
    const { data } = this.props,
      width = 650,
      height = 250;
    return (
      <div id="viewlinechart" className="pane">
        <div className="header">Timeline</div>
        <div
          style={{
            overflowX: "scroll",
            overflowY: "hidden",
            border: "1px solid #DCDCDC",
            borderRadius: "8px",
          }}
        >
          <LineChart data={data} width={width} height={height} />
        </div>
      </div>
    );
  }
}
