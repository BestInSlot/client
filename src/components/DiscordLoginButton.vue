<template>
    <button class="discord" @click="openNewWindow">
        <div class="button-content">
            <div class="icon"></div>
            <span>Login through Discord</span>
        </div>
    </button>
</template>

<script>
import querystring from "querystring";
import cookie from "js-cookie";
export default {
  data() {
    return {
      timer: null
    };
  },
  methods: {
    async openNewWindow() {
      try {
        const params = {
          _id: localStorage.getItem("_sid"),
          type: "login"
        };
        const { data } = await this.$http.get("/discord/getState", { params });

        const q = querystring.stringify({
          client_id: "472571154943442955",
          redirect_uri: "http://localhost/api/discord/oauth2",
          response_type: "code",
          state: data.state,
          scope: "identify email"
        });

        const requestURI = `https://discordapp.com/api/oauth2/authorize?${q}`;
        const windowFeatures = "resizable=no,height=550,width=400";

        window.daddy = window.open(requestURI, "_blank", windowFeatures);
      } catch (err) {
        let opts = {
          theme: "primary",
          duration: 5000,
          icon: "exclamantion-triangle",
          className: ["bis-notification", "danger"]
        };
        if (err.response) {
          const message = err.response.data.message || err.response.data;
          this.$toasted.show(message, opts);
        } else if (err.request) {
          this.$toasted.show(err.request, opts);
        } else {
          this.$toasted.show(err.message, opts);
        }
      }
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>
