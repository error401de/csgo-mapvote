<template>
  <Modal @close="$emit('close');">
    <template slot="body">
      <div class="modal-content">
        <div>
          <div>
            <h1 class="modal-header">Welcome to CS:GO Mapvote!</h1>
            <p>
              Place your votes and vetos by clicking on the maps. See the status bar at the bottom to see how many
              you have left.
            </p>
            <p>Change you username by clicking it.</p>
            <p>Click anywhere to hide this box.</p>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Layout/Modal.vue";

export default {
  name: "AdminModal",
  components: {
    Modal,
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
  justify-content: center;
}
</style>
