<template>
  <div class="page-wrapper">
    <main>
      <slot></slot>
    </main>
    <GitHubLink />
  </div>
</template>

<script>
import GitHubLink from "@/components/GitHubLink.vue";

export default {
  name: "Page",
  components: {
    GitHubLink,
  },
};
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  width: calc(100% - 40px);
  margin: auto;
  flex-wrap: wrap;
}

.page-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
