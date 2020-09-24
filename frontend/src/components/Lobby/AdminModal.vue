<template>
  <Modal @close="$emit('close');">
    <template slot="body">
      <div class="modal-content">
        <Share class="illustration" />
        <div class="modal-content-text">
          <h1 class="modal-header">Your lobby is set up!</h1>
          <p>Go ahead and share it with your friends:</p>
          <p>
            <LobbyLink class="lobby-link" />
          </p>
          <p>Click the Icon next to the Lobby id to copy the link to your clipboard</p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import LobbyLink from "@/components/Lobby/LobbyLink.vue";
import Modal from "@/components/Layout/Modal.vue";
import Share from "@/components/Icons/Share.vue";

export default {
  name: "AdminModal",
  components: {
    LobbyLink,
    Modal,
    Share,
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

.modal-content-text {
  width: calc(100% - 120px);
}

.illustration {
  margin-right: 10px;
  width: 100px;
  align-self: flex-start;
}

.lobby-link {
  justify-content: flex-start;
}
</style>
