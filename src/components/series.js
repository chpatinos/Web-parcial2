import React, { useEffect } from "react";
import * as d3 from "d3";

const urlES =
  "https://gist.githubusercontent.com/josejbocanegra/c55d86de9e0dae79e3308d95e78f997f/raw/d9eb0701f6b495dac63bbf59adc4614a9eb5fbc8/series-es.json";
const urlEN =
  "https://gist.githubusercontent.com/josejbocanegra/5dc69cb7feb7945ef58b9c3d84be2635/raw/64146e99e4416da3a8be2e2da4156cb87b3f6fd0/series-en.json";

const getSeries = async () => {
  return (await fetch(urlES)).json();
};

const Series = () => {
  let rows = "";

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("series") === null) rows = "No data to show, connect to se data.";
      else {
        rows = localStorage.getItem("series");
        document.querySelector(".listSeries").innerHTML = rows;
      }
    } else {
      rows = "";
      getSeries().then((resp) => {
        console.log(resp);
        resp.forEach((el, i) => {
          rows += `<tr>
                <th scope="row">${i + 1}</th>
                <td>${el.name}</td>
                <td>${el.channel}</td>
                <td>${el.description}</td>
              </tr>`;
        });
        localStorage.setItem("series", rows);
        document.querySelector(".listSeries").innerHTML = rows;
      });
    }
  }, []);

  const drawChart = () => {
    console.log("draw");
    const canvas = d3.select("#canvas");
    d3.json(urlES).then((data) => {
      const maxValue = Math.max(...data.map((item) => Number.parseInt(item.seasons)));

      const width = 900;
      const height = 600;
      const margin = { top: 10, left: 50, bottom: 40, right: 10 };
      const iwidth = width - margin.left - margin.right;
      const iheight = height - margin.top - margin.bottom;

      const svg = canvas.append("svg");
      svg.attr("width", width);
      svg.attr("height", height);

      let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      const y = d3.scaleLinear().domain([0, maxValue]).range([iheight, 0]);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, iwidth])
        .padding(0.1);

      const bars = g.selectAll("rect").data(data);

      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", "steelblue")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.seasons))
        .attr("height", (d) => iheight - y(d.seasons))
        .attr("width", x.bandwidth());

      g.append("g").classed("x--axis", true).call(d3.axisBottom(x)).attr("transform", `translate(0, ${iheight})`);

      g.append("g").classed("y--axis", true).call(d3.axisLeft(y));
    });
  };

  drawChart();

  return (
    <div className="container-fluid p-3 ">
      <div className="row">
        <div className="col-12 my-3">
          <h2>
            <strong>Series</strong>
          </h2>
        </div>
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Channel</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody className="listSeries"></tbody>
          </table>
          <div className="col-12 my-3">
            <h2>
              <strong>Seasons</strong>
            </h2>
          </div>
          <div id="canvas"></div>
        </div>
      </div>
    </div>
  );
};

export default Series;
