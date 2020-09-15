<template>
  <Page>
    <ParticipantsPanel id="participants-panel" />
    <VotingPanel id="voting-panel" />
    <ActionPanel />
  </Page>
</template>

<script>
import ActionPanel from "@/components/Lobby/ActionPanel.vue";
import ParticipantsPanel from "@/components/Lobby/ParticipantsPanel.vue";
import Page from "@/components/Layout/Page.vue";
import VotingPanel from "@/components/Lobby/VotingPanel.vue";

function handleMessage(message) {
  const [messageType, data] = JSON.parse(message.data);

  switch (messageType) {
    case "participants":
      this.$participantsStore.actions.setParticipantsAction(data.items);
      break;
    case "registered":
      this.$settingsStore.actions.setParticipantIdAction(data.id);
      this.$settingsStore.actions.setIsAdminAction(data.isAdmin);
      break;
    case "settings":
      this.$settingsStore.actions.setSettingsAction(data);
      break;
    default:
      console.log("Message not handled", message);
  }
}

export default {
  name: "Lobby",
  components: {
    ActionPanel,
    Page,
    ParticipantsPanel,
    VotingPanel,
  },
  mounted() {
    this.$connect(
      `${document.location.protocol === "https:" ? "wss" : "ws"}://${
        document.location.host
      }${this.$route.path}`,
      {
        format: "json",
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 10000,
      }
    );
    this.$options.sockets.onmessage = handleMessage.bind(this);
  },
};
</script>
<style scoped>
#participants-panel,
#voting-panel {
  background-color: #313a41;
  display: flex;
  flex-direction: column;
}

#participants-panel {
  width: 200px;
}

#voting-panel {
  width: 600px;
}

@media (max-width: 900px) {
  #participants-panel,
  #voting-panel {
    width: 100%;
    margin-top: 10px;
  }

  #voting-panel {
    flex: 1 1 auto;
  }
}
</style>
