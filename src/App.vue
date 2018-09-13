<template>
  <div id="app" v-if="$auth.ready()">
    <app-header></app-header>
    <mobile-menu v-show="showMobileMenu"></mobile-menu>
    <main id="main" :class="mainClasses" @click.prevent="closeMobile" v-if="showMobileMenu">
      <router-view></router-view>
    </main>
    <main id="main" :class="mainClasses" v-else>
      <router-view></router-view>
    </main>
    <app-footer></app-footer>
    <app-modal v-if="!$auth.check()"></app-modal>
  </div>
</template>

<script>
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import MobileMenu from "@/components/navigation/Mobile";

import isUnique from "./validators/isUnique";
import interceptors from "@/util/interceptors";

import Modal from "@/components/authentication/UserModal";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    appHeader: Header,
    appFooter: Footer,
    appModal: Modal,
    MobileMenu
  },

  created() {
    isUnique.call(this);
    interceptors.call(this);
  },

  sockets: {
    connected(id) {
      localStorage.setItem("_sid", id);
    },

    disconnect() {
      localStorage.removeItem("_sid");
    },

    unverifed_email(message) {
      this.$toasted.show(message, {
        theme: "primary",
        duration: 3000,
        className: ["bis-notification", "danger"],
        icon: "exclamation-triangle"
      });
      window.daddy.close();
    },

    user_exists(message) {
      this.$toasted.show(message, {
        theme: "primary",
        duration: 3000,
        className: ["bis-notification", "danger"],
        icon: "exclamation-triangle"
      });
      window.daddy.close();
    },

    async login(id) {
      const data = {
        external_id: id,
        loginMethod: "discord"
      };
      try {
        let response = await this.$auth.login({ data });
        this.$toasted.show("You've been signed in!", {
          className: ["bis-notification", "success"],
          duration: 5000,
          theme: "primary",
          icon: "check"
        });
        this.$store.dispatch("setModal", false);
      } catch (err) {
        if (err.response) {
          this.$toasted.show(err.response.data.message || err.response.data, {
            className: ["bis-notification", "danger"],
            duration: 5000,
            theme: "primary",
            icon: "exclamation-triangle"
          });
        }
      }
      window.daddy.close();
      this.$store.dispatch("setModal", false);
    }
  },

  computed: {
    ...mapGetters(["showMobileMenu"]),

    mainClasses() {
      return [
        "has-fixed-header",
        { "mobile mobile-open": this.showMobileMenu }
      ];
    }
  },
  methods: {
    closeMobile(e) {
      const target = document.querySelector(".mobile-open");
      if (target) {
        const zIndex = window
          .getComputedStyle(target, "::before")
          .getPropertyValue("z-index");

        if (target.classList.contains("mobile") && zIndex > -1) {
          this.$store.dispatch("toggleMobile", false);
        }
      }
    }
  }
};
</script>

<style lang="scss" src="./scss/main.scss">
</style>