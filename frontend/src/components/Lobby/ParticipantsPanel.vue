<template>
  <Panel headline="Participants">
    <div class="participants">
      <div
        class="participant"
        :class="participant.isSelf && 'self'"
        v-for="(participant, index) of participants"
        :key="participant.id || `participant-${index}`"
      >
        <span
          class="participant-name"
          @keyup="handleEditedName"
          @blur="sendNewName"
          @keydown.enter.prevent
          v-bind:contenteditable="participant.isSelf"
        >{{ participant.name }}</span>
        <CheckMark v-if="participant.voted && participant.vetoed" />
        <SandClock v-else />
      </div>
    </div>
  </Panel>
</template>

<script>
import CheckMark from "@/components/Icons/CheckMark.vue";
import Panel from "@/components/Layout/Panel.vue";
import SandClock from "@/components/Icons/SandClock.vue";

export default {
  name: "ParticipantsPanel",
  components: {
    CheckMark,
    Panel,
    SandClock,
  },
  computed: {
    participants: function () {
      return this.$participantsStore.state.participants.map(
        (participant, index) => ({
          isSelf: participant.id === this.$settingsStore.state.participantId,
          ...participant,
        })
      );
    },
  },
  methods: {
    handleEditedName(event) {
      if (event.key === "Enter" || event.target.textContent.length >= 30) {
        event.preventDefault();
        event.target.blur();
      }
    },
    sendNewName(event) {
      this.$socket.sendObj([
        "participant_name_changed",
        { name: event.target.innerText },
      ]);
    },
  },
};
</script>

<style scoped>
.participants {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.participant {
  height: 50px;
  width: 80%;
  border: 1px solid black;
  margin: 10px auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  justify-content: space-between;
}

.participant:first-of-type {
  margin-top: 20px;
}

.participant.self > span:hover {
  cursor: pointer;
}

.participant-name {
  flex: 0 1 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.self > .participant-name:after {
  content: " (You)";
}
</style>
