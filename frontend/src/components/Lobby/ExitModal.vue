<template>
  <Modal @close="emitLeaveEvent(false)">
    <template slot="body">
      <div class="modal-content">
        <h1 class="modal-header">Do you really want to leave the lobby?</h1>
        <p>All your choices will be discarded.</p>
        <Button
          class="button"
          @buttonClick="emitLeaveEvent(true)"
          msg="Leave"
        />
        <Button
          class="button red"
          @buttonClick="emitLeaveEvent(false)"
          msg="Stay"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import Button from "@/components/Button.vue";
import Modal from "@/components/Layout/Modal.vue";

export default {
  name: "ExitModal",
  components: {
    Button,
    Modal,
  },
  methods: {
    emitLeaveEvent(confirmed) {
      this.$emit("leave", { confirmed });
    },
  },
};
</script>

<style scoped>
.modal-header {
  font-size: 1em;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-right: 4px;
}

.modal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.button {
  width: 66%;
}
.red {
  background-color: #b10000;
}
</style>
