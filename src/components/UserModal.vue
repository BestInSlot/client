<template>
<transition mode="out-in" name="fade">
  <div id="modal-overlay" @click="setModal(false)" v-show="showModal">
      <div :id="formType" class="bis bis-modal" @click.stop>
          <div class="bis-modal-head">
              <ul v-if="selected !== 'app-password-recovery'">
                  <li :class="{ 'tab-active': selected === 'app-register'}" @click.prevent="selected = 'app-register'">Register</li>
                  <li :class="{ 'tab-active': selected === 'app-login'}" @click.prevent="selected = 'app-login'">Sign In</li>
              </ul>
              <ul v-else>
                  <li class="tab-active">Password Recovery</li>
              </ul>
              <span class="delete" @click="setModal(false)"></span>
          </div>
          <div class="bis-modal-body">
              <div class="bis-icon">
                  <img src="http://localhost/images/bis-logo-sm.png" alt="">
              </div>
              <div id="alternative-login" v-if="selected === 'app-login'">
                  <discord-login/>
              </div>
              <div class="divider"></div>
              <keep-alive>
                  <component :is="selected" @setForm="selected = $event"></component>
              </keep-alive>
          </div>
      </div>
  </div>
</transition>
</template>

<script>
import Register from "@/components/forms/Register";
import Login from "@/components/forms/Login";
import ForgotPassword from "@/components/forms/ForgotPassword";
import DiscordLogin from "@/components/DiscordLoginButton";

export default {
  components: {
    appRegister: Register,
    appLogin: Login,
    appPasswordRecovery: ForgotPassword,
    DiscordLogin
  },

  data() {
    return {
      selected: "app-login"
    };
  },

  computed: {
    showModal() {
      return this.$store.getters.modal;
    },
    formType() {
      return this.selected.slice(
        this.selected.indexOf("-") + 1,
        this.selected.length
      );
    }
  },

  methods: {
    setModal(bool) {
      this.$store.dispatch("setModal", bool);
    }
  }
};
</script>


<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

