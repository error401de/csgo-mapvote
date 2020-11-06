<template>
  <div class="header">
    <HomeLink />
    <StatisticsModal />
  </div>
</template>

<script>
import HomeLink from "@/components/Header/HomeLink.vue";
import StatisticsModal from "@/components/Header/StatisticsModal.vue";

export default {
  name: "Header",
  components: {
    HomeLink,
    StatisticsModal,
  },
};
</script>

<style scoped>
.header {
  display: flex;
}

.header > * {
  margin: 7px;
}
</style>
