<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
</style>



<script>
import setup from "@/essential.js";
import registerStore from "@/store/registerStore.js";
import settingsStore from "@/store/settings.js";
import participantIdStore from "@/store/participantId.js";

[settingsStore, participantIdStore].forEach(registerStore);

export default {
  name: "App",
  mounted() {
    setup();
  },
};
</script>
