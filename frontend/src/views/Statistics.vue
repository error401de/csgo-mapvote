<template>
  <Page>
    <div class="page-content">
      <GameModes />
      <Maps />
    </div>
  </Page>
</template>

<script>
import Page from "@/components/Layout/Page.vue";
import GameModes from "@/components/Statistics/GameModes.vue";
import Maps from "@/components/Statistics/Maps.vue";

export default {
  name: "Statistics",
  components: {
    Page,
    GameModes,
    Maps,
  },
};
</script>

<style scoped>
.page-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 14px;
}
</style>
