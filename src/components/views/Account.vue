<template>
    <section id="account" class="section" v-if="$auth.user()">
        <div class="container">
            <breadcrumbs/>
            <div class="columns is-vcentered has-text-centered-mobile">
                <div class="column is-narrow is-flex centered">
                    <app-avatar/>
                </div>
                <div class="column">
                    <h4 class="title">{{userDetails.username}}</h4>
                </div>
            </div>
            <div class="columns">
                <div class="column is-one-third is-narrow">
                    <div class="panel">
                        <router-link to="/account/personal" :active-class="'is-active'" :class="['panel-block', { 'is-active': $route.name === 'personal'}]" exact>
                            <span class="panel-icon">
                                <i class="fa fa-user"></i>
                            </span>
                            Personal
                        </router-link>
                        <router-link to="/account/security" class="panel-block" :active-class="'is-active'">
                            <span class="panel-icon">
                                <i class="fa fa-user"></i>
                            </span>
                            Security
                        </router-link>
                    </div>
                </div>
                <div class="column is-two-thirds">
                    <router-view/>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Avatar from "@/components/Avatar";

export default {
  name: "Account",
  components: { appAvatar: Avatar },

  data() {
    return {
      toast: {
        theme: "primary",
        icon: "check",
        duration: 3000,
        className: ["bis-notification", "success"]
      }
    };
  },

  computed: {
    userDetails() {
      return this.$auth.user();
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },

  watch: {
    isAuthenticated() {
      if (!this.isAuthenticated) {
        this.$router.push("/");
      }
    }
  },

  methods: {
    async saveChanges(url, data) {
      let response;
      try {
        response = await this.$http.put(url, data);
        this.toast.icon = "check";
        this.toast.className[1] = "success";
        const message = "Changes saved.";
        this.$toasted.show(message, this.toast);
      } catch (e) {
        this.notificationOpts.icon = "exclamation-triangle";
        this.notificationsOpts.className[1] = "danger";
        if (e.response) {
          const message = `[${e.response.status}]:${e.response.data.message}`;
          this.$toasted.show(message, this.toast);
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
