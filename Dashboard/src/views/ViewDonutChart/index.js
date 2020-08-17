import React, { Component } from "react";
import DonutChart from "../../charts/DonutChart";
import "./viewdonutchart.css";

export default class ViewDonutChart extends Component {
  render() {
    const { data } = this.props;
    return (
      <div id="viewdonutchart" className="pane">
        <div className="header">Comparison with global average risk score</div>
        <div
          style={{
            overflowX: "scroll",
            overflowY: "hidden",
            border: "1px solid #DCDCDC",
            borderRadius: "8px",
          }}
        >
          <DonutChart data={data} width={500} height={250} />
        </div>
      </div>
    );
  }
}
