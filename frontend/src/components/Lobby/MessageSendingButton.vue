<template>
  <Button :msg="displayText" @buttonClick="sendMessage" />
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "MessageSendingButton",
  components: {
    Button,
  },
  props: {
    messageTypes: Array,
    displayText: String,
  },
  methods: {
    sendMessage() {
      this.messageTypes.forEach((messageType) =>
        this.$socket.sendObj([messageType])
      );
    },
  },
};
</script>
