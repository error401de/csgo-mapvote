<template>
  <div :id="id" />
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ChoicesScatterplot",
  beforeCreate() {
    this.id = `maps-scatter-${Math.floor(Math.random() * 1000)}`;
  },
  mounted() {
    this.generateScatterplot();
  },
  methods: {
    generateScatterplot() {
      const margin = { top: 10, right: 30, bottom: 30, left: 60 };
      const width = 460 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const maxVotes = Math.max(
        ...this.$statisticsStore.state.maps.map((m) => m.votes)
      );
      const maxVetos = Math.max(
        ...this.$statisticsStore.state.maps.map((m) => m.vetos)
      );
      const svg = d3
        .select(`#${this.id}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([0, maxVotes]).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
      svg
        .append("text")
        .attr(
          "transform",
          `translate(${width / 2},${height + margin.top + 20})`
        )
        .style("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-size", "10px")
        .text("Votes");

      const y = d3.scaleLinear().domain([0, maxVetos]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-size", "10px")
        .text("Vetos");

      svg
        .append("g")
        .selectAll("dot")
        .data(this.$statisticsStore.state.maps)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.votes);
        })
        .attr("cy", function (d) {
          return y(d.vetos);
        })
        .attr("r", 3)
        .style("fill", "#69b3a2")
        .append("svg:title")
        .text(function (d) {
          return `${d.gameMode}/${d.id}`;
        });
    },
  },
};
</script>
