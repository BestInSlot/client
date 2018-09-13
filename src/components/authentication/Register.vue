<template>
    <form v-if="!success">
      <fieldset :class="{ 'disabled': sending }" :disabled="sending">
        <app-input v-for="(input, i) in inputs" :key="i" 
        v-model="input.value" 
        :label="input.label" 
        :type="input.type" 
        :id="input.id"
        :delay="input.delay || 0"
        :validators="input.validators"/>
        <div class="field">
          <div class="control recaptcha">
            <vue-recaptcha
            theme="dark"
            ref="recaptcha" 
            :sitekey="siteKey" 
            @expired="onExpire" 
            @verify="onVerify"/>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control is-expanded">
            <button :class="buttonClasses" @click.prevent="createNewUser" :disabled="isDisabled || errors.any()">Create Account</button>
          </div>
          <div class="control is-expanded">
          <button class="button is-medium is-fullwidth is-info" @click.prevent="reset">Reset</button>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="content" v-else>
        <h1>Thanks for registering.</h1>
        <p>Instructions on how to activate your account have been sent to your email address.</p>
        <button class="button is-fullwidth is-medium is-primary" @click.prevent="success = false">Go Back</button>
    </div>
</template>

<script>
import Input from "@/components/forms/inputs/Primary";
import VueRecaptcha from "@/components/Recaptcha";
export default {
  name: "Register",
  components: {
    appInput: Input,
    VueRecaptcha
  },

  $_veeValidate: {
    validator: "new"
  },

  data() {
    return {
      inputs: {
        email: {
          value: "",
          label: "EMAIL ADDRESS *",
          type: "text",
          id: "email",
          delay: 500,
          validators: {
            email: true,
            required: true,
            unique: "email"
          }
        },
        first_name: {
          value: "",
          label: "FIRST NAME *",
          type: "text",
          id: "first-name",
          validators: {
            required: true,
            alpha_spaces: true,
            min: 2
          }
        },
        last_name: {
          value: "",
          label: "LAST NAME *",
          type: "text",
          id: "last-name",
          validators: {
            required: true,
            alpha_spaces: true,
            min: 2
          }
        },
        username: {
          value: "",
          label: "USERNAME *",
          type: "text",
          id: "username",
          delay: 500,
          validators: {
            required: true,
            alpha_spaces: true,
            unique: "username",
            min: 3,
            max: 10
          }
        },
        password: {
          value: "",
          label: "PASSWORD *",
          type: "password",
          id: "password",
          validators: {
            required: true,
            alpha_num: true,
            min: 8,
            max: 20
          }
        }
      },
      recaptcha: null,
      success: false,
      sending: false
    };
  },

  computed: {
    isDisabled() {
      const { inputs } = this;
      return (
        Object.keys(inputs).some(key => !inputs[key].value) || !this.recaptcha
      );
    },

    siteKey() {
      return this.$store.getters.siteKey;
    },

    buttonClasses() {
      return [
        "button is-fullwidth is-medium is-info",
        { "is-loading": this.sending }
      ];
    },

    validInputFields() {
      let result = {};
      Object.entries(this.inputs)
        .filter(([key, input]) => {
          return !!input.value;
        })
        .forEach(([key, input]) => {
          result[key] = input.value;
        });
      return result;
    }
  },

  methods: {
    async createNewUser() {
      if (!this.errors.any() && !this.isDisabled) {
        this.sending = true;

        try {
          await this.$http.post("/users", {
            credentials: this.validInputFields,
            recaptcha: this.recaptcha
          });

          this.success = true;
          this.reset();
        } catch (err) {
          if (err.response) {
            const message = `[${err.response.status}]:${
              err.response.data.message
            }`;
            const options = {
              theme: "primary",
              duration: 5000,
              icon: "exclamation-triangle",
              className: ["bis-notification", "danger"]
            };
            this.$toasted.show(message, options);
            Object.keys(err.response).forEach(err =>
              console.log(err.response[err])
            );
          }
          this.$refs.recaptcha.$refs.recaptcha.reset();
        } finally {
          this.sending = false;
        }
      }
    },

    onVerify(val) {
      this.recaptcha = val;
    },

    onExpire() {
      this.recaptcha = null;
      this.$refs.recaptcha.reset();
    },

    reset() {
      this.clearForm();
      this.$refs.recaptcha.$refs.recaptcha.reset();
      this.recaptcha = null;
    },

    clearForm() {
      const { inputs } = this.$data;
      Object.keys(inputs).forEach(key => {
        inputs[key].value = "";
      });
    }
  }
};
</script>

<style>
.recaptcha {
  display: flex;
  justify-content: center;
}
</style>
