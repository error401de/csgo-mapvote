<template>
  <div class="github-icon">
    <a href="https://github.com/error401de/csgo-mapvote" target="_blank" border="0">
      <img src="../assets/img/github.png" />
    </a>
  </div>
</template>

<script>
export default {
  name: "GitHubLink",
};
</script>

<style scoped>
.github-icon {
  position: relative;
}

.github-icon > a {
  position: absolute;
  right: 2px;
  bottom: 2px;
}
</style>
