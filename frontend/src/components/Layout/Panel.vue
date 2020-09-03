<template>
  <div class="panel-styling">
    <div class="panel-header">
      <h1>{{ headline }}</h1>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Panel",
  props: {
    headline: String,
  },
};
</script>

<style scoped>
.panel-styling {
  display: inline-flex;
  flex-direction: column;
  background-color: #313a41;
  margin: 0 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
}

.panel-header {
  background-color: #1b232e;
  min-height: 25px;
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

h1,
h2 {
  font-size: 1em;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-right: 4px;
}
</style>
