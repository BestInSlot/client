<template>
<div class="columns is-multiline">
  <div class="column is-12">
      <div class="account-header">
          <h4 class="subtitle">Security</h4>
      </div>
  </div>
  <div class="column is-12">
      <div class="account-desc">
          <h4 class="subtitle">CHANGE YOUR PASSWORD</h4>
          <p class="is-small">For your security, we highly recommend that you choose a unique password that you don't use for any other online account.</p>
      </div>
  </div>
  <div class="column is-half has-divider">
    <form action="">
        <fieldset :disabled="isSending">
            <div class="field" v-for="(field, key) in formFields" :key="key">
                <label for="" class="label">{{field.attrs.label.toUpperCase()}}</label>
                <small>REQUIRED</small>
                <keep-alive>
                  <dark-input 
                v-model="field.value"
                :ref="field.attrs.id"
                :id="field.attrs.id"
                :error="errors.first(field.attrs.id)"
                :attrs="field.attrs" 
                v-validate="field.validators"/>
                </keep-alive>
            </div>
            <div class="field">
                <div class="control">
                    <vue-recaptcha theme="dark" ref="recaptcha" :sitekey="siteKey" @expired="onExpire" @verify="onVerify"/>
                </div>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <button class="button is-primary" :disabled="errors.any() || isDisabled" @click.prevent="changePassword">Save Changes</button>
                    <button class="button is-default" @click.prevent="reset">Reset</button>
                </div>
            </div>
        </fieldset>
    </form>
  </div>
  <div class="column is-half">
      <div class="content">
          <ul class="requirements">
              <li>New password must not match old password.</li>
              <li>Password must contain 8 characters minimal.</li>
              <li>Password must contain at least 1 capital.</li>
              <li>Password must not contain any spaces or non alpha numeric characters.</li>
          </ul>
      </div>
  </div>
</div>
</template>

<script>
import DarkInput from "@/components/forms/inputs/DarkInput2.vue";
import VueRecaptcha from "@/components/Recaptcha";
// import recaptcha from "@/mixins/recaptcha";
export default {
  name: "PasswordSecurity",

  components: {
    DarkInput,
    VueRecaptcha
  },

  $_veeValidate: {
    validator: "new"
  },

  mounted() {
    console.log(this.$refs);
  },

  computed: {
    siteKey() {
      return this.$store.getters.siteKey;
    }
  },

  // //injects this.recaptcha, onVerify and onExpire.
  // mixins: [recaptcha],

  data() {
    return {
      formFields: {
        newPassword: {
          value: "",
          attrs: {
            type: "password",
            label: "NEW PASSWORD",
            id: "password"
          },
          validators: {
            required: true,
            alpha_num: true,
            min: 8,
            max: 20
          }
        },
        retypePassword: {
          value: "",
          attrs: {
            type: "password",
            label: "RETYPE NEW PASSWORD",
            id: "retype"
          },
          validators: {
            required: true,
            confirmed: "password"
          }
        }
      },
      isSending: false,
      recaptcha: null,
      toast: {
        theme: "primary",
        icon: "check",
        duration: 3000,
        className: ["bis-notification", "success"]
      }
    };
  },

  computed: {
    siteKey() {
      return this.$store.getters.siteKey;
    },

    isDisabled() {
      return (
        Object.keys(this.formFields).some(key => !this.formFields[key].value) ||
        !this.recaptcha
      );
    }
  },

  methods: {
    clearForm() {
      Object.keys(this.formFields).forEach(key => {
        this.formFields[key].value = "";
      });
    },

    onVerify(val) {
      this.recaptcha = val;
    },

    onExpire() {
      this.recaptcha = null;
      this.$refs.recaptcha.$refs.recaptcha.reset();
    },

    reset() {
      this.clearForm();
      this.$refs.recaptcha.$refs.recaptcha.reset();
      this.recaptcha = null;
    },

    async changePassword() {
      const new_password = this.formFields.newPassword.value;
      const recaptcha = this.recaptcha;

      this.isSending = true;

      if (!this.errors.any() && recaptcha) {
        try {
          const res = await this.$http.post("/users/update/password", {
            new_password,
            recaptcha
          });

          if (res.status >= 200 && res.status < 400) {
            const message =
              "An verification has been sent to your email address.";
            this.toast.icon = "check";
            this.toast.className[1] = "success";
            this.$toasted.show(message, this.toast);
          }
        } catch (e) {
          if (e.response) {
            const errorStatus = e.response.status;
            if (errorStatus >= 400 && errorStatus < 500) {
              const message = e.response.data.message;
              this.toast.icon = "exclamantion-triangle";
              this.toast.className[1] = "danger";
              this.$toasted.show(message, this.toast);
            }
          } else {
            console.log(e);
          }
        } finally {
          this.isSending = false;
          this.reset();
        }
      }
    }
  }
};
</script>
