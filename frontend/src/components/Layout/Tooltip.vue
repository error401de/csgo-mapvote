<template>
  <div :class="{ tooltip: isActive }">
    <slot></slot>
    <div class="tooltiptext">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    isActive: Boolean,
    msg: String,
  },
};
</script>

<style scoped>
.tooltip {
  position: relative;
}

.tooltiptext {
  --tooltip-width: 135px;
  visibility: hidden;
  left: calc(-1 * var(--tooltip-width) - 20px);
  max-width: var(--tooltip-width);
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
}

.tooltip:hover,
.tooltip:hover > * {
  cursor: not-allowed;
}

.tooltiptext:after {
  position: absolute;
  content: "";
  top: calc(50% - 8px);
  right: -16px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 0 8px 16px;
  border-color: transparent transparent transparent #000;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
