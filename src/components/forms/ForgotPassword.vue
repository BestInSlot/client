<template>
  <div id="password-recovery">
    <form action="" v-if="!success">
        <fieldset :disabled="sending">
          <div class="field">
            <div class="control">
              <app-input :name="'Email *'" :id="'email'" :required="true" :email="true" v-model="email"></app-input>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control is-expanded">
              <button :class="buttonClasses" @click.prevent="sendEmail" :disabled="!email || errors.any()">Send</button>
            </div>
            <div class="control is-expanded">
              <button class="button is-outlined is-fullwidth is-small" @click="$emit('setForm', 'app-login')">Cancel</button>
            </div>
          </div>
        </fieldset>
      </form>
      <div class="content" v-else>
        <h1>An email has been dispatched to address on your account.</h1>
        <p>We've received an email recovery request, in order to confirm this request please follow the instructions provided.</p>
        <button class="button is-fullwidth is-medium is-primary" @click.prevent="success = false">Go Back</button>
      </div>
  </div>
</template>



<script>
import Input from './inputs/ModalInput';

export default {
  name: "password-recovery",

  components: { appInput: Input },

  $_veeValidate: {
    validator: "new"
  },

  data() {
    return {
      email: "",
      success: false,
      sending: false
    };
  },

  computed: {
    buttonClasses() {
      return ['button is-fullwidth is-small is-primary', { 'is-loading': this.sending}];
    }
  },

  methods: {
    async sendEmail() {
      if (!this.errors.any()) {
        const email = this.email;
        this.sending = true;
        try {
            const res = await this.$http.post(`/users/reset-password`, { email });
            if (res.status >= 200 && res.status < 400) {
                this.sending = false;
                this.email = '';
                this.success = true;
            }
            console.log(res);
        }
        catch (e) {
            if (e.response) {
              this.sending = false;
              this.success = false;
              this.$notify({
                group: 'notes',
                type: 'danger',
                text: `${e.response.status}:${e.response.data.message}`
              })
            }
        }
      }
    }
  }
};
</script>

<style>

.title {
  color: #cacaca;
  text-align: center;
}

.control {
  display: flex;
  justify-content: space-between;
}
</style>
