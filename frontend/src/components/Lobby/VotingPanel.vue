<template>
  <Panel headline="Voting Panel">
    <div class="maps">
      <Map
        v-for="map of maps"
        :key="`${map.gameMode}/${map.id}`"
        :name="map.name"
        :gameMode="map.gameMode"
        :id="map.id"
      />
    </div>
  </Panel>
</template>

<script>
import Button from "@/components/Button.vue";
import Map from "@/components/Lobby/Map.vue";
import Panel from "@/components/Layout/Panel.vue";

export default {
  name: "VotingPanel",
  components: {
    Button,
    Map,
    Panel,
  },
  async created() {
    const maps = await Promise.all(
      this.$settingsStore.state.allGameModes.map((gameMode) =>
        fetch(`/config/maps_${gameMode}.json`)
          .then((response) => response.json())
          .then((maps) => maps.items.map((item) => ({ ...item, gameMode })))
      )
    );
    this.maps = maps.flat();
  },
  data() {
    return {
      maps: [],
    };
  },
};
</script>

<style scoped >
.maps {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
}
</style>
