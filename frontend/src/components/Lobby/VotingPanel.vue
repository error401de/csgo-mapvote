<template>
  <Panel headline="Voting Panel" :footer="this.footerMsg">
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
  computed: {
    footerMsg() {
      if (this.$choicesStore.state.votesLeft > 0) {
        return `Status: Please place your vote. ${this.$choicesStore.state.votesLeft} left.`;
      }
      if (this.$choicesStore.state.vetosLeft > 0) {
        return `Status: Please place your veto. ${this.$choicesStore.state.vetosLeft} left.`;
      }
      return "Status: Wait until the result is revealed";
    },
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
