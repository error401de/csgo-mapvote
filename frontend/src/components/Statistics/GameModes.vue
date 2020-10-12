<template>
  <div id="game-modes-venn" />
</template>

<script>
import * as d3 from "d3";
import * as venn from "@upsetjs/venn.js";

export default {
  name: "GameModes",
  async created() {
    if (!this.$statisticsStore.state.gameModes) {
      const data = await fetch("/api/statistics/game-modes").then((result) =>
        result.json()
      );
      this.$statisticsStore.actions.setGameModes(data);
    }
    this.generateVenn();
  },
  methods: {
    generateVenn() {
      const w = 500;
      const h = 500;
      const sets = this.$statisticsStore.state.gameModes.gameModesPerLobby;

      const chart = venn.VennDiagram();
      d3.select("#game-modes-venn").datum(sets).call(chart);
    },
  },
};
</script>
