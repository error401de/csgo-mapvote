<template>
  <Page withHeader>
    <Statistics />
  </Page>
</template>

<script>
import Page from "@/components/Layout/Page.vue";
import Statistics from "@/components/Statistics/Statistics.vue";

export default {
  name: "StatisticsView",
  components: {
    Page,
    Statistics,
  },
};
</script>
