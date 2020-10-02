<template>
  <Panel headline="Voting Panel" :footer="this.footerMsg">
    <div class="maps">
      <Map
        v-for="map of $choicesStore.state.maps"
        :key="`${map.gameMode}/${map.id}`"
        :name="map.name"
        :gameMode="map.gameMode"
        :id="map.id"
      />
    </div>
  </Panel>
</template>

<script>
import { CLIENT_MESSAGES } from "common/messageTypes";
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
    if (!this.$choicesStore.state.maps.length) {
      const maps = await Promise.all(
        this.$settingsStore.state.allGameModes.map((gameMode) =>
          fetch(`/api/config/maps_${gameMode}`)
            .then((response) => response.json())
            .then((maps) => maps.items.map((item) => ({ ...item, gameMode })))
        )
      );
      this.$choicesStore.actions.setMapsAction(maps.flat());
    }
  },
  destroyed() {
    this.$choicesStore.actions.resetAction(
      this.$settingsStore.state.settings.votesPerParticipant,
      this.$settingsStore.state.settings.vetosPerParticipant
    );
  },
  computed: {
    footerMsg() {
      if (this.$choicesStore.state.votesLeft > 0) {
        return `Status: Please place your vote. ${this.$choicesStore.state.votesLeft} left.`;
      }
      if (this.$choicesStore.state.vetosLeft > 0) {
        return `Status: Please place your veto. ${this.$choicesStore.state.vetosLeft} left.`;
      }
      if (!this.$choicesStore.state.result) {
        return "Status: Wait until the result is revealed";
      }
      return "Status: Wait until the votes are reset";
    },
  },

  methods: {
    sendVotes() {
      const { votedMaps } = this.$choicesStore.state;

      this.$socket.sendObj([CLIENT_MESSAGES.VOTED, { maps: votedMaps }]);
    },
    sendVetos() {
      const { vetoedMaps } = this.$choicesStore.state;

      this.$socket.sendObj([CLIENT_MESSAGES.VETOED, { maps: vetoedMaps }]);
    },
    resetVotes() {
      this.$socket.sendObj([CLIENT_MESSAGES.RESET_VOTES]);
    },
    resetVetos() {
      this.$socket.sendObj([CLIENT_MESSAGES.RESET_VETOS]);
    },
  },
  watch: {
    "$choicesStore.state.votesLeft"(newValue, oldValue) {
      if (newValue > 0 && oldValue === 0) {
        return this.resetVotes();
      }
      if (newValue === 0 && oldValue > 0) {
        return this.sendVotes();
      }
    },
    "$choicesStore.state.vetosLeft"(newValue, oldValue) {
      if (newValue > 0 && oldValue === 0) {
        return this.resetVetos();
      }
      if (newValue === 0 && oldValue > 0) {
        return this.sendVetos();
      }
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
