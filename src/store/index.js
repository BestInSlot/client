import Vue from "vue";
import Vuex from "vuex";
import recruitment from "./modules/recruitment";
import * as post from "./modules/posts";
import * as streams from "./modules/streams";

Vue.use(Vuex);

const modules = {
  post,
  streams,
  recruitment
};

export default new Vuex.Store({
  state: {
    modal: false,
    showMobileMenu: false,
    showEditor: false,
    siteKey: "6Ldcm1sUAAAAALDyu1f5Q60-fQbIDLrG5_i6F-ff"
  },
  getters: {
    modal: state => state.modal,
    showMobileMenu: state => state.showMobileMenu,
    showEditor: state => state.showEditor,
    _id: state => state._id,
    siteKey: state => state.siteKey
  },
  mutations: {
    SET_MODAL_STATE(state, bool) {
      state.modal = bool;
    },
    TOGGLE_MOBILE(state, bool) {
      state.showMobileMenu = bool;
    },
    TOGGLE_EDITOR(state, bool) {
      state.showEditor = bool;
    }
  },
  actions: {
    setModal({ commit }, payload) {
      commit("SET_MODAL_STATE", payload);
    },
    toggleMobile({ state, commit }, bool) {
      commit("TOGGLE_MOBILE", bool);
    },
    toggleEditor({ commit }, bool) {
      commit("TOGGLE_EDITOR", bool);
    }
  },
  modules
});
