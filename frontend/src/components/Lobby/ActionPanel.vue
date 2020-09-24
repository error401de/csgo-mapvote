<template>
  <Panel headline="Action Menu">
    <div>
      <MessageSendingButton
        v-if="$settingsStore.state.isAdmin"
        msg="Show Result"
        :messageTypes="messageTypeShowResult"
      />
      <MessageSendingButton
        class="red-button"
        v-if="$settingsStore.state.isAdmin"
        msg="Reset Lobby"
        :messageTypes="messageTypeReset"
      />
      <Settings />
      <LobbyLink />
      <Button
        v-if="$choicesStore.state.votesLeft > 0"
        msg="Skip Votes"
        @buttonClick="$choicesStore.actions.setVotesLeftAction(0)"
      />
      <Button v-else msg="Skip Vetos" @buttonClick="$choicesStore.actions.setVetosLeftAction(0)" />
      <MessageSendingButton
        msg="Reset Choices"
        :messageTypes="messageTypeResetOwnChoices"
        @buttonClick="resetVotingStatus"
      />
    </div>
  </Panel>
</template>

<script>
import Button from "@/components/Button.vue";
import Panel from "@/components/Layout/Panel.vue";
import LobbyLink from "@/components/Lobby/LobbyLink.vue";
import MessageSendingButton from "@/components/Lobby/MessageSendingButton.vue";
import Settings from "@/components/Lobby/Settings.vue";
import { CLIENT_MESSAGES } from "common/messageTypes";

export default {
  name: "ActionPanel",
  components: {
    Button,
    LobbyLink,
    MessageSendingButton,
    Panel,
    Settings,
  },
  data() {
    return {
      messageTypeReset: [CLIENT_MESSAGES.RESET],
      messageTypeShowResult: [CLIENT_MESSAGES.SHOW_RESULT],
      messageTypeResetOwnChoices: [
        CLIENT_MESSAGES.RESET_VOTES,
        CLIENT_MESSAGES.RESET_VETOS,
      ],
    };
  },
  methods: {
    resetVotingStatus() {
      this.$choicesStore.actions.resetAction(
        this.$settingsStore.state.settings.votesPerParticipant,
        this.$settingsStore.state.settings.vetosPerParticipant
      );
    },
  },
};
</script>

<style scoped>
.red-button {
  background-color: #b10000;
}
</style>
