<template>
  <Page>
    <ParticipantsPanel />
    <VotingPanel />
    <ActionPanel />
  </Page>
</template>

<script>
import ActionPanel from "@/components/Lobby/ActionPanel.vue";
import ParticipantsPanel from "@/components/Lobby/ParticipantsPanel.vue";
import Page from "@/components/Layout/Page.vue";
import VotingPanel from "@/components/Lobby/VotingPanel.vue";

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
      }${this.$route.path}`
    );
    this.$options.sockets.onmessage = console.log;
  },
};
</script>
