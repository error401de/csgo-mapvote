<template>
  <div class="lobby-link">
    Lobby Id: {{ $route.params.lobbyId }}
    <Clipboard class="lobby-link-image" v-clipboard="() => url" />
  </div>
</template>

<script>
import Clipboard from "@/components/Icons/Clipboard.vue";

export default {
  name: "LobbyLink",
  components: {
    Clipboard,
  },
  data() {
    return {
      url: window.location.toString(),
    };
  },
  methods: {
    copyToClipboard(lobbyId) {
      const el = document.createElement("textarea");
      el.value = url;
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    },
  },
};
</script>

<style scoped>
.lobby-link {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lobby-link-image {
  cursor: pointer;
}

.lobby-link-image :hover {
  opacity: 0.5;
}
</style>
