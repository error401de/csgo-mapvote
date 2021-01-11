<template>
  <div
    class="map"
    @click="toggleMap"
    :class="{
      'not-displayed': isNotDisplayed,
      'not-visible': !isVisible,
      'cursor-voting': voting,
      'cursor-vetoing': vetoing,
      'cursor-trashcan': removingChoice,
    }"
    :style="cssProps"
  >
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
  data() {
    return {
      cssProps: this.getCssProps({ layerX: 5, layerY: 5 }),
    };
  },
  computed: {
    mapId() {
      return `${this.gameMode}/${this.id}`;
    },
    voting() {
      return this.$choicesStore.state.votesLeft > 0;
    },
    vetoing() {
      return this.$choicesStore.state.vetosLeft > 0 && !this.voting;
    },
    removingChoice() {
      return (
        this.$choicesStore.state.votedMaps.includes(this.mapId) ||
        this.$choicesStore.state.vetoedMaps.includes(this.mapId)
      );
    },
    votingResult() {
      const { result } = this.$choicesStore.state;

      if (!result) {
        return null;
      }

      return {
        isVoted: result.some(({ votes }) => votes.includes(this.mapId)),
        isVetoed: result.some(({ vetos }) => vetos.includes(this.mapId)),
      };
    },
    isVoted() {
      return this.$choicesStore.state.votedMaps.includes(this.mapId);
    },
    isVetoed() {
      return (
        this.$choicesStore.state.vetoedMaps.includes(this.mapId) ||
        (this.votingResult && this.votingResult.isVetoed)
      );
    },
    isNotDisplayed() {
      return !this.$settingsStore.state.settings.gameModes.includes(
        this.gameMode
      );
    },
    isVisible() {
      return !this.votingResult || this.votingResult.isVoted;
    },
  },
  methods: {
    getCssProps(ev) {
      return {
        "--icon-left": `${ev.layerX}px`,
        "--icon-top": `${ev.layerY}px`,
      };
    },
    toggleMap(ev) {
      const {
        votedMaps,
        vetoedMaps,
        votesLeft,
        vetosLeft,
      } = this.$choicesStore.state;

      if (votedMaps.includes(this.mapId)) {
        this.$choicesStore.actions.removeVoteAction(this.mapId);
        return;
      }

      if (vetoedMaps.includes(this.mapId)) {
        this.$choicesStore.actions.removeVetoAction(this.mapId);
        return;
      }

      if (votesLeft > 0) {
        this.cssProps = this.getCssProps(ev);
        this.$choicesStore.actions.addVoteAction(this.mapId);
        return;
      }

      if (vetosLeft > 0) {
        this.cssProps = this.getCssProps(ev);
        this.$choicesStore.actions.addVetoAction(this.mapId);
        return;
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
  font-size: 16px;
}

.not-displayed {
  display: none;
}

.not-visible {
  visibility: hidden;
}

.map-icon {
  width: 25px;
  height: 25px;
  background-size: 25px 25px;
  position: absolute;
  left: var(--icon-left);
  top: var(--icon-top);
}

.map:active > .map-icon,
.map:focus > .map-icon,
.map:hover > .map-icon {
  width: 23px;
  height: 23px;
  background-size: 23px 23px;
  left: calc(var(--icon-left) + 1px);
  top: calc(var(--icon-top) + 1px);
}

.map:hover,
.map:active,
.map:focus {
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5) inset,
    0 6px 20px 0 rgba(0, 0, 0, 0.19) inset;
  font-size: 15px;
}

.cursor-voting:hover {
  cursor: url("~@/assets/img/tick.svg") 0 0, pointer;
}

.cursor-vetoing:hover {
  cursor: url("~@/assets/img/rejected.svg") 0 0, pointer;
}

.cursor-trashcan:hover {
  cursor: url("~@/assets/img/trashcan.svg") 0 0, pointer;
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
