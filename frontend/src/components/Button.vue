<template>
  <div class="button" ref="self" @click="onButtonClick">{{ msg }}</div>
</template>

<script>
export default {
  name: "Button",
  props: {
    msg: String,
  },
  methods: {
    onButtonClick() {
      this.$emit("onButtonClick");
    },
    blurButton() {
      this.$refs.self.blur();
    },
  },
};
</script>

<style scoped >
.button {
  height: 20px;
  padding: 14px;
  border: 1px solid #000;
  margin: 20px auto;
  max-width: 66%;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05) inset,
    0px 6px 20px rgba(10, 10, 10, 1);
  background-color: var(--color-green);
}

.button:active,
.button:focus,
.button:hover {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5) inset,
    0 6px 20px 0 rgba(0, 0, 0, 0.19) inset;
  cursor: pointer;
  line-height: 20px;
  font-size: 15px;
}
</style>
