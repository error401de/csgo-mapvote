<template>
  <Page>
    <Panel headline="Create Lobby">
      <div class="panel-content">
        <Button msg="Create Lobby" @onButtonClick="createLobby" />
      </div>
    </Panel>
    <Panel headline="Join Lobby">
      <div class="panel-content">
        <input
          v-on:input="onInput"
          type="text"
          name="lobbyid"
          id="lobby-input"
          minlength="6"
          maxlength="6"
          autofocus
          ref="lobbyInput"
        />
        <Button ref="joinLobby" msg="Join lobby" @onButtonClick="joinLobby" />
      </div>
    </Panel>
  </Page>
</template>

<script>
import Page from "@/components/Layout/Page.vue";
import Panel from "@/components/Layout/Panel.vue";
import Button from "@/components/Button.vue";

export default {
  name: "Home",
  components: {
    Page,
    Panel,
    Button,
  },
  methods: {
    async createLobby() {
      try {
        const response = await fetch("/lobby", { method: "POST" });
        if (response.ok) {
          const { id } = await response.json();
          return (document.location = "/lobby/" + id);
        }

        console.error(
          `Lobby creation failed with status code ${response.status}`
        );
      } catch (e) {
        console.error("Could not create lobby", e);
      }
    },
    joinLobby() {
      const input = this.$refs.lobbyInput;
      const { value } = input;
      if (value && value.length === 6) {
        window.location = "/lobby/" + value;
        return;
      }
      this.$refs.joinLobby.blurButton();
      this.$refs.joinLobby.$el.blur();
      input.reportValidity && input.reportValidity();
      input.focus();
    },
    onInput(ev) {
      if (ev.target.value && event.key === "Enter") {
        event.preventDefault();
        this.joinLobby();
      }
    },
  },
};
</script>

<style scoped>
.panel-styling {
  width: 200px;
  margin: 14px;
  height: 272px;
  position: relative;
}

.panel-content {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#lobby-input {
  width: 95px;
  height: 50px;
  background-color: #6c6d75;
  color: white;
  border: 2px solid black;
  border-radius: 10px;
  outline-width: 0;
  text-align: center;
  text-transform: uppercase;
  font-size: 17px;
}

#lobby-input:invalid {
  background-image: url(../assets/img/rejected.svg);
  background-size: 14px;
  background-position: 97% 3%;
  background-repeat: no-repeat;
}

#join-lobby {
  margin: 20px 0 0;
}
</style>
