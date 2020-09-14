<template>
    <Panel headline="Voting Panel">Voting</Panel>
</template>

<script>
import Panel from "@/components/Layout/Panel.vue";

export default {
  name: "VotingPanel",
  components: {
    Panel,
  },
  async created() {
    const maps = await Promise.all(
      this.$settingsStore.state.settings.allGameModes.map((gameMode) =>
        fetch(`/config/maps_${gameMode}.json`)
          .then((response) => response.json())
          .then((maps) => maps.items.map((item) => ({ ...item, gameMode })))
      )
    );
    console.log(maps);
    this.maps = maps.flat();
  },
  data() {
    return {
      maps: [],
    };
  },
};
</script>
