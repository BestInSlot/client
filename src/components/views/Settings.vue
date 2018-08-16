<template>
  <div id="my-account" class="container">
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="columns is-vcentered">
          <div class="column is-narrow">
            <avatar/>
          </div>
          <div class="column" v-if="userDetails">
            <h1 class="title">{{userDetails.username}}</h1>
            <h2 class="subtitle">
              <i>Member since {{date}}</i>
            </h2>
          </div>
        </div>
      </div>
    </section>
    <div class="columns is-multiline">
      <edit-password-form :sending.sync="sending"></edit-password-form>
      <edit-email-form :sending.sync="sending"></edit-email-form>  
    </div> 
  </div>
</template>

<script>
"use strict";
import format from "date-fns/format";
import Avatar from "@/components/Avatar.vue";
import EditPasswordForm from "@/components/forms/EditPasswordForm";
import EditEmailForm from "@/components/forms/EditEmailForm";

export default {
  name: "MyAccount",
  components: { EditPasswordForm, EditEmailForm, Avatar },

  beforeRouteEnter(to, from, next) {
    const { action, type, code, username } = to.query;
    next(vm => {
      if (!vm.isAuthenticated) {
        vm.$router.push("/?require_login=true");
      } else if (action === "edit") {
        // const data = type === "password" ? { username, key } : { key };
        let data = {};
        Object.keys(to.query).forEach(key => {
          if (key !== "action" || key !== "type") {
            data[key] = to.query[key];
          }
        });
        vm.saveChanges(`/users/update/${type}`, data);
      }
    });
  },

  data() {
    return {
      sending: false,
      notificationOpts: {
        theme: "primary",
        icon: "check",
        duration: 3000,
        className: ["bis-notification", "success"]
      }
    };
  },

  watch: {
    isAuthenticated() {
      if (!this.isAuthenticated) {
        this.$router.push("/");
      }
    }
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userDetails() {
      return this.$store.getters.userDetails;
    },
    date() {
      return format(this.userDetails.created_at, "dddd, MMMM DD, YYYY");
    }
  },

  methods: {
    async saveChanges(url, data) {
      let response;
      try {
        response = await this.$http.put(url, data);
        this.notificationOpts.icon = "check";
        this.notificationsOpts.className[1] = "success";
        const message = response.data.mesage;
        this.$toasted.show(message, notificationOpts);
      } catch (e) {
        this.notificationOpts.icon = "exclamation-triangle";
        this.notificationsOpts.className[1] = "danger";
        if (e.response) {
          const message = `[${e.response.status}]:${e.response.data.message}`;
          this.$toasted.show(message, opts);
        } else if (e.request) {
          console.log(e.request);
        } else {
          console.log(e.message);
        }
      }
    }
  }
};
</script>

<style lang="scss">
.avatar {
  img {
    border-radius: 50%;
  }
}

#edit-password {
  margin-top: 1.5rem;
}

.section-head {
  border-left: 3px solid #3f88c5;
  background-color: #222;
  padding: 5px;
  h1,
  h2,
  h3,
  h4 {
    color: #cacaca;
  }
}

.section-body {
  padding: 20px;
  background-color: #333;
  border-left: 3px solid #555;
  label {
    color: #cacaca;
  }
}
</style>
