<template>
  <div class="page-wrapper">
    <Header v-if="withHeader" />
    <main>
      <div class="page-content">
        <slot></slot>
      </div>
    </main>
    <GitHubLink />
  </div>
</template>

<script>
import GitHubLink from "@/components/GitHubLink.vue";
import Header from "@/components/Header/Header.vue";

export default {
  name: "Page",
  components: {
    Header,
    GitHubLink,
  },
  props: {
    withHeader: Boolean,
  },
};
</script>

<style scoped>
.page-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-height: 100vh;
}

main {
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  width: calc(100% - 40px);
  margin: auto;
  flex-wrap: wrap;
}

.page-content {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

@media (max-width: 900px) {
  .page-content {
    flex-direction: column;
    min-height: calc(100% - 60px);
    padding: 20px 40px 40px;
    width: calc(100% - 80px);
  }
}
</style>
