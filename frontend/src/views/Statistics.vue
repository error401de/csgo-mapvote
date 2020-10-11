<template>
  <Page>
    <div class="page-content">
      <Panel headline="Game Modes">
        <div class="panel-content">
          <GameModes />
        </div>
      </Panel>
      <Maps />
    </div>
  </Page>
</template>

<script>
import Page from "@/components/Layout/Page.vue";
import Panel from "@/components/Layout/Panel.vue";
import GameModes from "@/components/Statistics/GameModes.vue";
import Maps from "@/components/Statistics/Maps.vue";

export default {
  name: "Statistics",
  components: {
    Page,
    Panel,
    GameModes,
    Maps,
  },
};
</script>
