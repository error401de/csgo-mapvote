<template>
  <transition name="modal">
    <div class="modal-background" @click="$emit('close');">
      <div class="modal">
        <slot name="body" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
};
</script>

<style scoped>
.modal-background {
  z-index: 1;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(255, 255, 255, 0.5);
}

.modal {
  z-index: 2;
  min-width: 270px;
  max-width: 425px;
  max-height: 100%;
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
