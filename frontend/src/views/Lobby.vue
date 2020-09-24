<template>
  <div>
    <ErrorModal
      v-if="error !== null"
      :navigateToHome="error.shouldNavigateToHome"
      :msg="error.msg"
    />
    <AdminModal
      v-else-if="$settingsStore.state.isAdmin && showAdminModal"
      @close="showAdminModal = false;"
    />
    <EntryModal
      v-else-if="!$settingsStore.state.isAdmin && showEntryModal"
      @close="showEntryModal = false;"
    />
    <Page>
      <ParticipantsPanel id="participants-panel" />
      <VotingPanel id="voting-panel" />
      <ActionPanel id="action-panel" />
    </Page>
  </div>
</template>

<script>
import ActionPanel from "@/components/Lobby/ActionPanel.vue";
import AdminModal from "@/components/Lobby/AdminModal.vue";
import EntryModal from "@/components/Lobby/EntryModal.vue";
import ErrorModal from "@/components/Lobby/ErrorModal.vue";
import ParticipantsPanel from "@/components/Lobby/ParticipantsPanel.vue";
import Page from "@/components/Layout/Page.vue";
import VotingPanel from "@/components/Lobby/VotingPanel.vue";
import { SERVER_MESSAGES, ERROR_CODES } from "common/messageTypes";

function handleMessage(message) {
  const [messageType, data] = JSON.parse(message.data);

  switch (messageType) {
    case SERVER_MESSAGES.LOBBY_ADMIN_CHANGE:
      this.$settingsStore.actions.setIsAdminAction(data.isAdmin);
      break;
    case SERVER_MESSAGES.PARTICIPANTS:
      this.$participantsStore.actions.setParticipantsAction(data.items);
      break;
    case SERVER_MESSAGES.REGISTERED:
      this.$settingsStore.actions.setParticipantIdAction(data.id);
      this.$settingsStore.actions.setIsAdminAction(data.isAdmin);
      break;
    case SERVER_MESSAGES.RESULT:
      this.$choicesStore.actions.setResultAction(data.items);
      this.$choicesStore.actions.resetAction(0, 0);
      break;
    case SERVER_MESSAGES.RESET:
      this.$choicesStore.actions.setResultAction(null);
      this.$choicesStore.actions.resetAction(
        this.$settingsStore.state.settings.votesPerParticipant,
        this.$settingsStore.state.settings.vetosPerParticipant
      );
      break;
    case SERVER_MESSAGES.SETTINGS:
      this.$settingsStore.actions.setSettingsAction(data);
      break;
    default:
      console.log("Message not handled", message);
  }
}

function handleWSClosed(closeEvent) {
  const error = {
    msg: "",
    shouldNavigateToHome: true,
  };

  switch (closeEvent.code) {
    case ERROR_CODES.LOBBY_ID_NOT_FOUND:
      error.msg = "Your lobby id is invalid.";
      break;
    case ERROR_CODES.LOBBY_LOCKED:
      error.msg = "There are no free seats left, you can not join anymore.";
      break;
    case ERROR_CODES.POOL_CLOSED:
      error.msg =
        "A new lobby can currently not be opened. Please try again later.";
      break;
    case ERROR_CODES.TOO_MANY_MESSAGES:
      error.msg =
        "You sent too many messages. Try reloading the page in a few seconds.";
      error.shouldNavigateToHome = false;
      break;
    default:
      error.msg = "Try reloading the page";
      error.shouldNavigateToHome = false;
      break;
  }

  this.error = error;
}

export default {
  name: "Lobby",
  components: {
    ActionPanel,
    AdminModal,
    EntryModal,
    ErrorModal,
    Page,
    ParticipantsPanel,
    VotingPanel,
  },
  data() {
    return {
      showAdminModal: true,
      showEntryModal: true,
      error: null,
    };
  },
  mounted() {
    this.$connect(
      `${document.location.protocol === "https:" ? "wss" : "ws"}://${
        document.location.host
      }${this.$route.path}`,
      {
        format: "json",
      }
    );
    this.$options.sockets.onmessage = handleMessage.bind(this);
    this.$options.sockets.onclose = handleWSClosed.bind(this);

    window.addEventListener(
      "beforeunload",
      () => (this.$options.sockets.onclose = null)
    );
  },
  destroyed() {
    this.$options.sockets.onclose = null;
    this.$socket.close();
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
  max-width: 600px;
}

#action-panel {
  width: 200px;
}

@media (max-width: 900px) {
  #participants-panel,
  #voting-panel,
  #action-panel {
    max-width: 100%;
    width: 100%;
    margin-top: 10px;
  }

  #voting-panel {
    flex: 1 1 auto;
  }
}
</style>
