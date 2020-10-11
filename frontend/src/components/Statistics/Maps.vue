<template>
  <Fragment>
    <Panel headline="Choices">
      <div class="panel-content">
        <ChoicesScatterplot v-if="$statisticsStore.state.maps" />
      </div>
    </Panel>
    <Fragment
      v-for="gameMode in $settingsStore.state.allGameModes"
      :key="gameMode"
    >
      <Panel :headline="`Played ${gameMode} Maps`">
        <div class="panel-content">
          <VotedMaps v-if="$statisticsStore.state.maps" :gameMode="gameMode" />
        </div>
      </Panel>
    </Fragment>
  </Fragment>
</template>

<script>
import * as d3 from "d3";
import { Fragment } from "vue-fragment";

import ChoicesScatterplot from "./ChoicesScatterplot.vue";
import Panel from "../Layout/Panel.vue";
import VotedMaps from "./VotedMaps.vue";

export default {
  name: "Maps",
  components: {
    ChoicesScatterplot,
    Fragment,
    Panel,
    VotedMaps,
  },
  async created() {
    if (!this.$statisticsStore.state.maps) {
      const data = await fetch("/api/statistics/maps").then((result) =>
        result.json()
      );
      this.$statisticsStore.actions.setMaps(data.items);
    }
  },
};
</script>
