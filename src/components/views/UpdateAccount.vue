<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <div class="account-header">
                <h4 class="subtitle">Verification Complete</h4>
            </div>
        </div>
        <div class="column is-12">
            <div class="content">
                <p>We've verified your authenticity and your changes have been saved.</p>
            </div>
        </div>
    </div>
</template>

<script>
import isEmpty from "lodash/isEmpty";
import Vue from "vue";
export default {
  async beforeRouteEnter(to, from, next) {
    const data = isEmpty(to.params) ? to.query : to.params;
    console.log(data);
    const path = to.path.split("/");
    const type = path[2];
    const fnName = type.charAt(0).toUpperCase() + type.slice(1);
    next(vm => {
      vm[`save${fnName}Changes`](data);
    })
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },

  methods: {
    async saveSecurityChanges(data) {
      try {
        await this.$http.put(`/users/update/security`, { ...data });
      } catch (err) {
        if (err.response) {
          this.$router.push(`/error/${err.response.status}`);
        } else {
          console.log(err);
          this.$router.push(`/error/500`);
        }
      }
    },

    async savePersonalChanges(data) {
      try {
        let { data } = await this.$http.put(`/users/update/personal`, { ...data });
        // if (this.$auth.check()) {
        //   this.$auth.token("best_auth_token", data.token);
        //   await this.$auth.fetch();
        // }
        await this.$auth.fetch();
      } catch (err) {
        console.log(err);
        if (err && err.response) {
          this.$router.push(`/error/${err.response.status}`);
        } else {
          this.$router.push(`/error/500`);
        }
      }
    }
  }
};
</script>

