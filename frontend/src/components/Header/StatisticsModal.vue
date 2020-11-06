<template>
  <div v-if="shouldRender" @click="toggleModal()" class="toggle-modal">
    <img src="@/assets/img/piechart.svg" />
    <Modal v-if="showStatisticsModal" @close.stop="toggleModal()">
      <template slot="body">
        <div class="modal-content">
          <div>
            <div>
              <h1 class="modal-header">CS:GO Mapvote Statistics</h1>
              <Statistics />
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Layout/Modal.vue";
import Statistics from "@/components/Statistics/Statistics.vue";

export default {
  name: "StatisticsModal",
  components: {
    Modal,
    Statistics,
  },
  data() {
    return {
      showStatisticsModal: false,
      shouldRender: this.$route.name !== "Statistics",
    };
  },
  methods: {
    toggleModal() {
      this.showStatisticsModal = !this.showStatisticsModal;
    },
  },
};
</script>

<style scoped>
.toggle-modal > img {
  width: 21px;
  height: 21px;
}

.toggle-modal:hover {
  cursor: pointer;
}

/deep/ .modal {
  overflow: scroll;
  max-width: 100%;
  margin: 14px auto;
}

.modal-header {
  font-size: 1em;
  margin-top: 0px;
  margin-bottom: 14px;
  padding-right: 4px;
}

.modal-content {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
