import React, { Component } from "react";
import BarChart from "../../charts/BarChart";
import "./viewbarchart.css";

export default class ViewBarChart extends Component {
  render() {
    const { data } = this.props;
    return (
      <div id="viewbarchart" className="pane">
        <div className="header">Category Risks</div>
        <div
          style={{
            overflowX: "scroll",
            overflowY: "hidden",
            border: "1px solid #DCDCDC",
            borderRadius: "8px",
          }}
        >
          <BarChart data={data} width={1000} height={350} />
        </div>
      </div>
    );
  }
}
