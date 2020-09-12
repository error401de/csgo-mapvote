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
import participantsStore from "@/store/participants.js";

[settingsStore, participantsStore].forEach(registerStore);

export default {
  name: "App",
  mounted() {
    setup();
  },
};
</script>
