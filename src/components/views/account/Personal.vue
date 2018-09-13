<template>
    <fieldset :class="rootClasses">
        <div class="columns is-multiline">
            <div class="column is-12">
                <div class="account-header">
                    <h4 class="subtitle">Personal</h4>
                </div>
            </div>
            <div class="column is-12" v-for="(field, key) in formFields" :key="key">
                <div :class="key">
                    <div class="account-desc">
                        <h4 class="subtitle">{{field.header.toUpperCase()}}</h4>
                        <span>{{field.desc}}</span>
                    </div>
                    
                    <div class="field is-horizontal">
                        <div class="field-body">
                            <div class="field" v-for="(input, _key) in field.inputs" :key="_key">
                                <label for="" class="label">{{input.attrs.label.toUpperCase()}}</label>
                                <small>REQUIRED</small>
                                    <keep-alive>
                                    <dark-input 
                                        v-model="formFieldValues[_key]"
                                        :ref="input.attrs.id"
                                        :id="input.attrs.id"
                                        :delay="input.delay || 0"
                                        :error="errors.first(input.attrs.id)"
                                        :attrs="input.attrs"
                                        :data-vv-delay="input.delay"
                                        v-validate="input.validators"/>
                                    </keep-alive>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
            <div class="column is-12">
                <div class="field">
                    <div class="control">
                        <vue-recaptcha theme="dark" ref="personal" :sitekey="siteKey" @expired="reset" @verify="onVerify"/>                                                              
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-primary" :disabled="isDisabled" @click.prevent="saveChanges">Save Changes</button>
                    </div>
                    <div class="control">
                        <button class="button is-default" @click.prevent="discardChanges">Discard Changes</button>
                    </div>
                </div>
            </div>
        </div>
    </fieldset>
</template>

<script>
import DarkInput from "@/components/forms/inputs/DarkInput2.vue";
import VueRecaptcha from "@/components/Recaptcha";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";

export default {
  name: "Personal",

  components: { DarkInput, VueRecaptcha },
  $_veeValidate: {
    validator: "new"
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.populateFormFields();
    });
  },

  created() {
    console.log(this.$refs);
  },

  data() {
    return {
      formFields: {
        credentials: {
          header: "USER CREDENTIALS",
          desc:
            "Manage your user credentials. Changes require email verification.",
          inputs: {
            username: {
              delay: 500,
              attrs: {
                id: "username",
                type: "text",
                label: "USERNAME *"
              },
              validators: {
                required: true,
                alpha_num: true,
                unique: "username",
                min: 3,
                max: 20
              }
            },
            email: {
              delay: 500,
              attrs: {
                id: "email",
                type: "text",
                label: "EMAIL ADDRESS *"
              },
              validators: {
                required: true,
                unique: "email",
                email: true
              }
            }
          }
        },
        personal: {
          header: "PERSONAL DETAILS",
          desc:
            "Manage your personal details. None of these will be displayed to the public.",
          inputs: {
            first_name: {
              attrs: {
                id: "first-name",
                type: "text",
                label: "FIRST NAME *"
              },
              validators: {
                required: true,
                alpha: true,
                max: 30
              }
            },
            last_name: {
              attrs: {
                id: "last-name",
                type: "text",
                label: "LAST NAME *"
              },
              validators: {
                required: true,
                alpha: true,
                max: 30
              }
            }
          }
        }
      },

      formFieldValues: {
        username: "",
        email: "",
        first_name: "",
        last_name: ""
      },

      notificationOpts: {
        theme: "primary",
        icon: "check",
        duration: 3000,
        className: ["bis-notification", "success"]
      },

      isSaving: false,
      showConfirm: false,
      recaptcha: null
    };
  },

  computed: {
    siteKey() {
      return this.$store.getters.siteKey;
    },
    rootClasses() {
      return { 'processing': this.isSaving };
    },
    userDetails() {
      return this.$auth.user();
    },
    altered() {
      let result = {};
      Object.entries(this.formFieldValues)
        .filter(([key, value]) => {
          return value !== this.userDetails[key];
        })
        .forEach(([key, value]) => {
          result[key] = value;
        });
      return result;
    },
    isDisabled() {
      return (
        Object.keys(this.formFieldValues).some(
          key => !this.formFieldValues[key]
        ) ||
        !this.recaptcha ||
        this.errors.any()
      );
    }
  },

  methods: {
    populateFormFields() {
      Object.keys(this.formFieldValues).forEach(key => {
        this.formFieldValues[key] = this.userDetails[key];
      });
    },

    discardChanges() {
      this.populateFormFields();
      this.errors.clear();
      this.reset();
    },

    onVerify(val) {
      this.recaptcha = val;
    },

    onExpire() {
      this.reset();
    },

    reset() {
      this.$refs.personal.$refs.recaptcha.reset();
      this.recaptcha = null;
    },

    async saveChanges() {
      if (this.errors.any()) return;

      this.isSaving = true;

      //_pick doesn't throw an error when keys don't exist.
      const name = pick(this.altered, ["first_name", "last_name"]);
      const require_verification = pick(this.altered, ["username", "email"]);

      const data = {
        recaptcha: this.recaptcha,
        name: isEmpty(name) ? null : name,
        require_verification: isEmpty(require_verification)
          ? null
          : require_verification
      };

      let response;

      try {
        await this.$http.post("/users/update/personal", data);
        this.$auth.fetch();
        this.$toasted.show(
          "We've dispatched an email with instructions to validate your request.",
          {
            theme: "primary",
            className: ["bis-notification", "success"],
            icon: "check",
            duration: 3000
          }
        );
      } catch (err) {
        if (err.response) {
          this.$toated.show(err.response.data.message || err.response.data, {
            theme: "primary",
            duration: 3000,
            className: ["bis-notification", "danger"],
            icon: "exclamation-triangle"
          });
        }
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>
