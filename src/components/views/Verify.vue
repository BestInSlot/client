<template>
  <section id="verify" class="container">
    <div class="columns is-multiline" >
      <div class="column is-half is-offset-one-quarter">
        <div class="status">
          <i :class="{ 'fa fa-check-circle-o is-success': success, 'fa fa-exclamation-circle error': !success }" aria-hidden="true"></i>          
        </div>
      </div>
      <div class="column is-12">
        <div class="content">
          <h1>{{ success? "Success!" : "Error"}}</h1>
          <h3>{{ success? "Thank you for registering, your account is now active." : "Unfortunately we couldn't authenticate your account due to an invalid or expired key. Please try again."}}</h3>
          <button class="button is-danger" v-if="!success">Resend Key</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { put, post } from "axios";

export default {
  $_veeValidate: {
    validator: "new"
  },

  async beforeRouteEnter(to, from, next) {
   const { code } = to.params;
    try {
      const response = await put("/users/verify", { code });

      if (response.status >= 200 && response.status < 304) {
        next(vm => vm.success = true);
      }
      console.log(response);
    } catch (e) {
      if (e && e.response) {
        switch (e.response.status) {
          case 422:
            next(vm => {
              vm.success = false;
            });
          case 404:
            next(`/error/404`);
            break;
          case 400:
            next(vm => {
              vm.success = false;
            });
            break;
          default:
            next(`/error/${e.response.status}`);
            break;
        }
        console.log(e.response);
      }
    }
  },

  data() {
    return {
      success: false
    };
  },

  methods: {
    async resend() {
      let response,
        username = this.$route.query.username;
      try {
        response = await this.$http.post(
          `/verify/resend/?username=${username}`
        );
      } catch (e) {
        Object.keys(e.response).forEach(err => console.log(e.response[err]));
      }

      if (response.data.email) {
        this.notify({
          group: "notes",
          type: "success",
          title: "Success!",
          text: `An email has been dispatched to ${response.data.email}`
        });
      }
    }
  }
};
</script>

<style lang="scss">
#verify {
  color: #cacaca;
  .status {
    font-size: 10rem;
    text-align: center;
    .success {
      color: #77dd77;
    }
    .error {
      color: #ff3860;
    }
  }
  .content {
    h1,
    h3 {
      color: #cacaca;
    }
    text-align: center;
  }
}
</style>