<template>
  <Button :msg="msg" @buttonClick="sendMessage" />
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
    msg: String,
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
