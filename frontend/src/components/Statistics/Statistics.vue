<template>
  <div class="statistics">
    <GameModes />
    <Maps />
  </div>
</template>

<script>
import { Fragment } from "vue-fragment";

import GameModes from "@/components/Statistics/GameModes.vue";
import Maps from "@/components/Statistics/Maps.vue";

export default {
  name: "Statistics",
  components: {
    Fragment,
    GameModes,
    Maps,
  },
};
</script>

<style scoped>
.statistics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 14px;
  width: 100%;
}
</style>
