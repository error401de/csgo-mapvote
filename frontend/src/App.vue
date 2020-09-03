<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
</style>



<script>
import setup from "@/essential.js";
export default {
  name: "App",
  mounted() {
    setup();
  },
};
</script>
