import Vue from "vue";
import Vuex from "vuex";

import modules from "./modules";

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    modal: false,
    dropdown: null,
    showMobileMenu: false,
    showEditor: false,
    siteKey: "6Ldcm1sUAAAAALDyu1f5Q60-fQbIDLrG5_i6F-ff"
  },
  getters: {
    modal: state => state.modal,
    showMobileMenu: state => state.showMobileMenu,
    showEditor: state => state.showEditor,
    siteKey: state => state.siteKey,
    dropdown: state => state.dropdown
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
    },
    TOGGLE_DROPDOWN(state, val) {
      if (state.dropdown === val) {
        state.dropdown = null;
        return;
      }
      state.dropdown = val;
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
    },
    toggleDropDown({ commit }, val) {
      commit("TOGGLE_DROPDOWN", val);
    }
  },
  modules
});
