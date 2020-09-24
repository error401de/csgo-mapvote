<template>
  <Modal @close="handleClose">
    <template slot="body">
      <div class="modal-content">
        <h1 class="modal-header">Your connection was interrupted!</h1>
        <p>{{ msg }}</p>
        <Button v-if="navigateToHome" @buttonClick="handleClose" msg="Back To The Start Page" />
      </div>
    </template>
  </Modal>
</template>

<script>
import Button from "@/components/Button.vue";
import Modal from "@/components/Layout/Modal.vue";

export default {
  name: "AdminModal",
  components: {
    Button,
    Modal,
  },
  props: {
    msg: String,
    navigateToHome: Boolean,
  },
  methods: {
    handleClose() {
      if (this.navigateToHome) {
        this.$router.push({ path: "/" });
      }
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
  justify-content: center;
  text-align: center;
}
</style>
