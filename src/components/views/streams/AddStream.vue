<template>
    <div :class="rootClasses">
        <div :class="overlayClasses" @click="closeModal"></div>
        <div class="modal-card" @click.stop>
            <div class="modal-card-head">
                <p class="modal-card-title">Add Stream</p>
                <span class="delete" @click.stop="closeModal"></span>
            </div>
            <div class="modal-card-body">
                <div class="field is-horizontal align-center">
                    <div class="field-label">
                        <label for="" class="label">Stream:</label>
                    </div>
                    <div class="field-body">
                        <div class="field is-expanded is-grouped">
                            <div class="control is-expanded">
                                <input type="text" class="input" placeholder="Enter stream name..." v-model="owner">
                            </div>
                            <div class="control">
                                <button class="button is-info" @click.stop="add">
                                  <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-card-foot">
                <button class="button is-danger" @click.stop="closeModal">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
let _http;
export default {
  props: {
    show: {
      type: Boolean,
      require: true
    }
  },

  created() {
    _http = axios.create({
      baseURL: "https://api.twitch.tv/helix",
      timeout: 5000,
      headers: {
        "Client-ID": "q6qn858hdi527eg7xrxaob7o5r3gbd"
      },
      transformResponse: [
        function(response) {
          const { data } = JSON.parse(response);
          return Array.isArray(data) && data.length > 1 ? data : data[0];
        }
      ]
    });
  },

  beforeDestroy() {
    _http = null;
  },

  data() {
    return {
      owner: ""
    };
  },

  computed: {
    rootClasses() {
      return ["modal", { "is-active": this.show }];
    },
    overlayClasses() {
      return ["modal-background", { "is-active": this.show }];
    }
  },

  methods: {
    closeModal() {
      this.$emit("update:show", false);
    },

    clearInput() {
      this.owner = "";
    },

    async add() {
      let streamer;
      let params = {
        login: this.owner
      };

      const url = "/users";

      try {
        const { data } = await _http.get(url, { params });
        streamer = { data };
      } catch (err) {
        if (err.response) {
          this.$toasted.show(message, {
            theme: "primary",
            duration: 3000,
            icon: "exclamation-triangle",
            className: ["bis-notification", "danger"]
          });
        }
      }

      try {
        const { data } = await this.$http.post("/media/streams/add", {
          streamer
        });
        await this.$store.dispatch("fetchStreams");
        const message = `${data.stream_owner} has been saved.`;
        this.$toasted.show(message, {
          theme: "primary",
          duration: 3000,
          icon: "check",
          className: ["bis-notification", "success"]
        });
      } catch (err) {
        if (err.response) {
          this.$toasted.show(err.response.data.message || err.response.data, {
            theme: "primary",
            duration: 3000,
            icon: "exclamation-triangle",
            className: ["bis-notification", "danger"]
          });
        }
      } finally {
        this.clearInput();
      }
    }
  }
};
</script>
