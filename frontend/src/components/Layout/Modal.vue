<template>
  <transition name="modal">
    <div class="modal-background" @click="emitCloseEvent">
      <div class="modal">
        <slot name="body" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  methods: {
    emitCloseEvent(ev) {
      this.$emit("close", ev);
    },
  },
};
</script>

<style scoped>
.modal-background {
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(255, 255, 255, 0.5);
}

.modal {
  z-index: 2;
  min-width: 270px;
  max-width: 425px;
  max-height: calc(100% - 28px);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #313a41;
  border: 1px solid black;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
