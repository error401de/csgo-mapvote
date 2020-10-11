<template>
  <Panel headline="Choices">
    <div class="panel-content">
      <ChoicesScatterplot v-if="$statisticsStore.state.maps" />
    </div>
  </Panel>
</template>

<script>
import * as d3 from "d3";

import ChoicesScatterplot from "./ChoicesScatterplot.vue";
import Panel from "../Layout/Panel.vue";

export default {
  name: "Maps",
  components: {
    ChoicesScatterplot,
    Panel,
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
