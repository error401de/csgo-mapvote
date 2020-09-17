<template>
  <Panel headline="Action Menu">
    <div>
      <MessageSendingButton
        v-if="$settingsStore.state.isAdmin"
        msg="Show Result"
        :messageTypes="messageTypeShowResult"
      />
      <MessageSendingButton
        v-if="$settingsStore.state.isAdmin"
        msg="Reset All Choices"
        :messageTypes="messageTypeReset"
      />
      <Button
        v-if="$choicesStore.state.votesLeft > 0"
        msg="Skip Votes"
        @buttonClick="$choicesStore.actions.setVotesLeftAction(0)"
      />
      <Button v-else msg="Skip Vetos" @buttonClick="$choicesStore.actions.setVetosLeftAction(0)" />
      <MessageSendingButton msg="Reset Own Choices" :messageTypes="messageTypeResetOwnChoices" />
    </div>
  </Panel>
</template>

<script>
import Button from "@/components/Button.vue";
import Panel from "@/components/Layout/Panel.vue";
import MessageSendingButton from "@/components/Lobby/MessageSendingButton.vue";
import { CLIENT_MESSAGES } from "common/messageTypes";

export default {
  name: "ActionPanel",
  components: {
    Button,
    MessageSendingButton,
    Panel,
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
};
</script>
