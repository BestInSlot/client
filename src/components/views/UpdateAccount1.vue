
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
// import Vue from "vue";
import {auth} from "@/main";
import axios from "axios";
import isEmpty from "lodash/isEmpty";

export default (function() {
  async function saveChanges(type, data, next) {
    try {
      await axios.put(`/users/update/${type}`, { ...data });
      if (type === "personal") {
        if (auth.check()) {
          auth.token(null, data.token);
          auth.fetch();
        }
      }
      next();
    } catch (err) {
      if (err.response) {
        next(`/error/${err.response.status}`);
      } else {
        next("/error/500");
      }
    }
  }

  return {
    name: "AccountChangeConfirmation",

    beforeRouteEnter(to, from, next) {
      const data = isEmpty(to.params) ? to.query : to.params;
      const path = to.path.split("/");
      const type = path[2];
      saveChanges(type, data, next);
    }
  };
})();
</script>
