<template>
  <div class="map" @click="toggleMap" :class="{ hidden: isHidden }">
    {{ name }}
    <CheckMark v-if="this.isVoted" class="map-icon" />
    <Rejected v-else-if="this.isVetoed" class="map-icon" />
  </div>
</template>

<script>
import Button from "@/components/Button.vue";
import CheckMark from "@/components/Icons/CheckMark.vue";
import Rejected from "@/components/Icons/Rejected.vue";

export default {
  name: "Map",
  components: {
    Button,
    CheckMark,
    Rejected,
  },
  props: {
    gameMode: String,
    id: String,
    name: String,
  },
  computed: {
    mapId() {
      return `${this.gameMode}/${this.id}`;
    },
    isVoted() {
      return this.$choicesStore.state.votedMaps.includes(this.mapId);
    },
    isVetoed() {
      return this.$choicesStore.state.vetoedMaps.includes(this.mapId);
    },
    isHidden() {
      return !this.$settingsStore.state.settings.gameModes.includes(
        this.gameMode
      );
    },
  },
  methods: {
    toggleMap() {
      const {
        votedMaps,
        vetoedMaps,
        votesLeft,
        vetosLeft,
      } = this.$choicesStore.state;

      if (votedMaps.includes(this.mapId)) {
        this.$choicesStore.actions.removeVoteAction(this.mapId);
      } else if (vetoedMaps.includes(this.mapId)) {
        this.$choicesStore.actions.removeVetoAction(this.mapId);
      } else if (votesLeft > 0) {
        this.$choicesStore.actions.addVoteAction(this.mapId);
      } else if (vetosLeft > 0) {
        this.$choicesStore.actions.addVetoAction(this.mapId);
      }
    },
  },
};
</script>

<style scoped>
.map {
  height: 125px;
  width: 125px;
  border: 1px solid black;
  margin: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  background-color: inherit;
}

.hidden {
  display: none;
}

.map-icon {
  width: 25px;
  height: 25px;
  background-size: 25px 25px;
  position: absolute;
  right: 5px;
  bottom: 5px;
}

.map:active > .map-icon,
.map:focus > .map-icon,
.map:hover > .map-icon {
  width: 23px;
  height: 23px;
  background-size: 23px 23px;
  right: 6px;
  bottom: 6px;
}

.map:hover,
.map:active,
.map:focus {
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5) inset,
    0 6px 20px 0 rgba(0, 0, 0, 0.19) inset;
}

@media (hover: none) {
  .map:hover,
  .menu-button:hover {
    cursor: auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    font-size: inherit;
  }

  .map:hover > .map-icon {
    width: 25px;
    height: 25px;
    background-size: 25px 25px;
    right: 5px;
    bottom: 5px;
  }
}
</style>