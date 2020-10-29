<template>
  <div :id="id" />
</template>

<script>
import * as d3 from "d3";
import * as venn from "@upsetjs/venn.js";

export default {
  name: "GameModesVenn",
  beforeCreate() {
    this.id = `game-modes-venn-${Math.floor(Math.random() * 1000)}`;
  },
  mounted() {
    this.generateVenn();
  },
  methods: {
    generateVenn() {
      const w = 500;
      const h = 500;
      const sets = this.$statisticsStore.state.gameModes.gameModesPerLobby;

      const chart = venn.VennDiagram();
      console.log(d3.select(this.id), this.id, this.$el);
      d3.select(`#${this.id}`).datum(sets).call(chart);
    },
  },
};
</script>
