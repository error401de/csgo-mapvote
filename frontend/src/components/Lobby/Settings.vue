<template>
  <div>
    <Tooltip
      :isActive="!$settingsStore.state.isAdmin"
      msg="Settings can only be changed by lobby lead"
    >
      <div class="slider-wrapper">
        <span class="slider-text">
          <span>Votes:</span>
          <span>{{ settings.votesPerParticipant }}</span>
        </span>
        <input
          type="range"
          min="0"
          :max="mapCount"
          :value="settings.votesPerParticipant"
          class="slider"
          :disabled="!$settingsStore.state.isAdmin"
          @input="handleVotesAndVetos('votesPerParticipant')"
        />
        <span class="slider-text">
          <span>Vetos:</span>
          <span>{{ settings.vetosPerParticipant }}</span>
        </span>
        <input
          type="range"
          min="0"
          :max="mapCount"
          :value="settings.vetosPerParticipant"
          class="slider"
          :disabled="!$settingsStore.state.isAdmin"
          @input="handleVotesAndVetos('vetosPerParticipant')"
        />
      </div>
    </Tooltip>
    <Tooltip
      :isActive="!$settingsStore.state.isAdmin"
      msg="Settings can only be changed by lobby lead"
    >
      <div class="game-modes">
        <div>Game Modes</div>
        <Fragment v-for="gameMode in this.$settingsStore.state.allGameModes" :key="gameMode">
          <label for="`game-mode-${gameMode}`">{{ gameMode }}</label>
          <input
            type="checkbox"
            id="`game-mode-${gameMode}`"
            :disabled="!$settingsStore.state.isAdmin"
            v-model="settings.gameModes"
            :value="gameMode"
            @change="handleGameModes"
          />
        </Fragment>
      </div>
    </Tooltip>
  </div>
</template>

<script>
import { Fragment } from "vue-fragment";

import { CLIENT_MESSAGES } from "common/messageTypes";
import Tooltip from "@/components/Layout/Tooltip.vue";

export default {
  name: "Settings",
  components: {
    Fragment,
    Tooltip,
  },
  data() {
    return {
      settings: {
        gameModes: this.$settingsStore.state.settings.gameModes,
        votesPerParticipant: this.$settingsStore.state.settings
          .votesPerParticipant,
        vetosPerParticipant: this.$settingsStore.state.settings
          .vetosPerParticipant,
      },
    };
  },

  computed: {
    mapCount() {
      return Array.from(this.$choicesStore.state.maps).filter((map) =>
        this.settings.gameModes.some((gameMode) => map.gameMode === gameMode)
      ).length;
    },
  },
  methods: {
    getNewSliderValue(sliderValue) {
      return Math.min(sliderValue || 1, this.mapCount);
    },
    handleGameModes() {
      this.settings.votesPerParticipant = this.getNewSliderValue(
        this.settings.votesPerParticipant
      );
      this.settings.vetosPerParticipant = this.getNewSliderValue(
        this.settings.vetosPerParticipant
      );
      this.sendSettings();
    },
    handleVotesAndVetos(settingsProp) {
      this.settings[settingsProp] = parseInt(event.target.value, 10);
      this.sendSettings();
    },
    sendSettings(ev) {
      this.$socket.sendObj([CLIENT_MESSAGES.SETTINGS, this.settings]);
    },
  },
  watch: {
    "$settingsStore.state.settings"(newValue, oldValue) {
      this.settings = newValue;
    },
  },
};
</script>

<style scoped>
.slider-wrapper {
  max-width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
}

.slider {
  -webkit-appearance: none;
  height: 15px;
  border-radius: 15px;
  background: #6c6d75;
  outline: none;
  opacity: 1;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  margin-top: 8px;
  margin-bottom: 15px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #006400;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #006400;
  border: 0;
  cursor: pointer;
}

input:disabled:hover::-moz-range-thumb,
input:disabled:hover::-webkit-slider-thumb,
input:disabled:hover {
  cursor: not-allowed;
}

.input:disabled {
  opacity: 0.3;
}

.slider-text {
  align-self: flex-start;
  margin-left: 20px;
}

.slider-text > span:first-child {
  margin-right: 7px;
}

.game-modes {
  padding: 25px;
  display: grid;
  grid-template-rows: 25px;
  grid-template-columns: 2fr 1fr;
}

.game-modes > div {
  grid-column-start: 1;
  grid-column-end: 3;
}

.game-modes > label {
  text-transform: capitalize;
}

.slider,
.game-modes > * {
  cursor: inherit;
}
</style>
