<template>
  <div class="panel-styling">
    <div class="panel-description panel-header">
      <h1>{{ headline }}</h1>
    </div>
    <slot></slot>
    <div class="panel-description panel-footer" v-if="this.footer">
      <h2>{{ footer }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Panel",
  props: {
    headline: String,
    footer: String,
  },
};
</script>

<style scoped>
.panel-styling {
  display: flex;
  flex-direction: column;
  background-color: #313a41;
  margin: 0 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
}

.panel-description {
  background-color: #1b232e;
  min-height: 25px;
}

.panel-header {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
}

.panel-footer {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
}

h1,
h2 {
  font-size: 1em;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-right: 4px;
}

@media (max-width: 900px) {
  .panel-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: auto 70px;
    width: calc(100% - 120px);
  }
}
</style>
