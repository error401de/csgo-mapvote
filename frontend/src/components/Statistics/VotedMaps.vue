<template>
  <div :id="id" />
</template>

<script>
import * as d3 from "d3";

export default {
  name: "VotedMaps",
  async mounted() {
    this.generateBarDiagrams();
  },
  props: {
    gameMode: String,
  },
  computed: {
    id() {
      return `times-played-${this.gameMode}`;
    },
  },
  methods: {
    generateBarDiagrams() {
      const data = this.$statisticsStore.state.maps.filter(
        (map) => map.gameMode === this.gameMode
      );
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 87 * data.length - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const x = d3.scaleBand().range([0, width]).padding(0.1);
      const y = d3.scaleLinear().range([height, 0]);

      const svg = d3
        .select(`#${this.id}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      x.domain(
        data.map(function (d) {
          return d.id;
        })
      );
      y.domain([
        0,
        d3.max(data, function (d) {
          return d.timesPlayed;
        }),
      ]);

      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
          return x(d.id);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
          return y(d.timesPlayed);
        })
        .attr("height", function (d) {
          return height - y(d.timesPlayed);
        })
        .attr("fill", "steelblue");

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      svg.append("g").call(d3.axisLeft(y));
    },
  },
};
</script>
