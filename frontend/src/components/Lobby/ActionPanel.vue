<template>
  <Panel headline="Action Menu">
    <div>
      <ShowResultButton />
    </div>
  </Panel>
</template>

<script>
import Panel from "@/components/Layout/Panel.vue";
import ShowResultButton from "@/components/Lobby/ShowResultButton.vue";

export default {
  name: "ActionPanel",
  components: {
    Panel,
    ShowResultButton,
  },
};
</script>
