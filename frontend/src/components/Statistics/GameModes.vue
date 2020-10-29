<template>
  <Panel headline="Game Modes">
    <div class="panel-content">
      <GameModesVenn
        v-if="
          $statisticsStore.state.gameModes !== null &&
          $statisticsStore.state.gameModes.gameModePerLobby !== null
        "
      />
    </div>
  </Panel>
</template>

<script>
import * as d3 from "d3";
import * as venn from "@upsetjs/venn.js";

import GameModesVenn from "@/components/Statistics/GameModesVenn.vue";
import Panel from "@/components/Layout/Panel.vue";

export default {
  name: "GameModes",
  components: {
    GameModesVenn,
    Panel,
  },
  beforeCreate() {
    this.id = `game-modes-venn-${Math.floor(Math.random() * 1000)}`;
  },
  async created() {
    if (!this.$statisticsStore.state.gameModes) {
      const data = await fetch("/api/statistics/game-modes").then((result) =>
        result.json()
      );
      this.$statisticsStore.actions.setGameModes(data);
    }
  },
};
</script>
