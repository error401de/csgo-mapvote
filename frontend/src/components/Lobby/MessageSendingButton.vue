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
    messageType: String,
    displayText: String,
  },
  methods: {
    sendMessage() {
      this.$socket.sendObj([this.messageType]);
    },
  },
};
</script>
