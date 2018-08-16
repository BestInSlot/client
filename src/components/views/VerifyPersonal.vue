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
import axios from "axios";
import pick from "lodash/pick";

export default {
  async beforeRouteEnter(to, from, next) {
    const { code } = to.params;
    const path = to.path.split("/");
    const type = path[2];
    let response;
    try {
      response = await axios.put(`/users/update/${type}`, { code });
      next(async vm => {
        if (vm.isAuthenticated) {
          const token = response.data.access_token;
          localStorage.setItem("bis_access_token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          await vm.$store.dispatch("fetchUserDetails");
        }
      });
    } catch (err) {
      console.log(err);
      if (err && err.response) {
        next(`/error/${err.response.status}`);
      } else {
        next(`/error/500`);
      }
    }
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  }
};
</script>

