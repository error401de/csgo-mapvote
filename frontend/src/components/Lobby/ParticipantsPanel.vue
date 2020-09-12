<template>
  <Panel headline="Participants">
    <div v-if="$participantsStore.state.participants" class="participants">
      <div
        class="participant"
        v-for="(participant, index) of $participantsStore.state.participants"
        :key="participant.id || `participant-${index}`"
      >
        <span>{{ participant.name }}</span>
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

.participant > span {
  text-overflow: ellipsis;
  flex: 0 1 100%;
  white-space: nowrap;
  overflow: hidden;
}
</style>
