<template>
  <Button :msg="msg" @buttonClick="onButtonClick" />
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
    onButtonClick() {
      this.sendMessage();
      this.$emit("buttonClick");
    },
    sendMessage() {
      this.messageTypes.forEach((messageType) =>
        this.$socket.sendObj([messageType])
      );
    },
  },
};
</script>
