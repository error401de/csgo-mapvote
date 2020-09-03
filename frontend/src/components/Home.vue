<template>
  <Page>
    <div>
      <Panel headline="Create Lobby">Test</Panel>
      <Panel headline="Join Lobby">Another Test</Panel>
    </div>
  </Page>
</template>

<script>
import Page from "@/components/Layout/Page.vue";
import Panel from "@/components/Layout/Panel.vue";

export default {
  name: "Home",
  components: {
    Page,
    Panel,
  },
};
</script>
