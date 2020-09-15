<template>
  <Panel headline="Action Menu">
    <div>
      <MessageSendingButton displayText="Show Result" :messageTypes="messageTypeShowResult" />
      <MessageSendingButton displayText="Reset All Choices" :messageTypes="messageTypeReset" />
      <MessageSendingButton
        displayText="Reset Own Choices"
        :messageTypes="messageTypeResetOwnChoices"
      />
    </div>
  </Panel>
</template>

<script>
import Panel from "@/components/Layout/Panel.vue";
import MessageSendingButton from "@/components/Lobby/MessageSendingButton.vue";
import { CLIENT_MESSAGES } from "common/messageTypes";

export default {
  name: "ActionPanel",
  components: {
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
