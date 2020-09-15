<template>
  <Button msg="Show Result" @buttonClick="sendMessage" />
</template>

<script>
import Button from "@/components/Button.vue";
import { CLIENT_MESSAGES } from "common/messageTypes";

export default {
  name: "ShowResultButton",
  components: {
    Button,
  },
  methods: {
    sendMessage() {
      this.$socket.sendObj([CLIENT_MESSAGES.SHOW_RESULT]);
    },
  },
};
</script>
