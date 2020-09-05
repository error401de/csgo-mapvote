<template>
  <Page>
    <ParticipantsPanel/>
    <VotingPanel/>
    <ActionPanel/>
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
};
</script>
