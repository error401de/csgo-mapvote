<template>
  <router-link to="/" tag="a" class="home-link">
    <img src="../../../public/favicon.svg" />
  </router-link>
</template>

<script>
export default {
  name: "HomeLink",
};
</script>

<style scoped>
.home-link {
  display: block;
  width: 21px;
  height: 21px;
}
</style>
