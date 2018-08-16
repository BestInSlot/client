// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VeeValidate from "vee-validate";
import Toasted from "vue-toasted";
import VueSocket from "vue-socket.io"
import App from "./App";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import VueAuth from "@websanova/vue-auth";
import Breadcrumbs from "@/components/breadcrumbs/";
import { mapActions } from "vuex";

Vue.config.productionTip = false;
Vue.router = router;
Vue.use(VueSocket, 'http://localhost:3000');
Vue.use(VeeValidate, { inject: false });
Vue.use(Breadcrumbs);
Vue.use(Toasted, {
  iconPack: "fontawesome"
});
Vue.use(VueAxios, axios);
Vue.use(VueAuth, {
  auth: require("@websanova/vue-auth/drivers/auth/bearer.js"),
  http: require("@websanova/vue-auth/drivers/http/axios.1.x.js"),
  router: require("@websanova/vue-auth/drivers/router/vue-router.2.x.js"),
  loginData: { url: "/users/login" },
  fetchData: { url: "/users/userDetails", method: "GET", enabled: true },
  refreshData: { url: "/users/refresh", method: "GET", enabled: false },
  tokenDefaultName: "best_auth_token",
  parseUserData: function(data) {
    return data.user;
  }
});

Vue.axios.defaults.baseURL = "http://localhost/api/";
Vue.axios.defaults.timeout = 3000;

Object.defineProperties(Vue.prototype, {
  $discourse: {
    get() {
      return {
        url: "localhost",
        port: 1337
      };
    }
  }
});

export const auth = Vue.prototype.$auth;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
