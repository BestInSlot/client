import { get } from "axios";

const namespaced = true;

const state = {
  total: 0,
  currentPage: 1,
  limit: 20,
  applications: [],
  selectOptions: [
    { type: "input", text_field: true },
    { type: "textarea", text_field: true },
    { type: "select", text_field: false },
    { type: "checkbox", text_field: false }
  ]
};

const getters = {
  applications: state => state.applications,
  selectOptions: state => state.selectOptions,
  limit: state => state.limit,
  current: state => state.currentPage,
  total: state => state.total
};

const mutations = {
  SET_APPLICATIONS(state, payload) {
    state.applications = payload;
  },
  SET_CURRENT_PAGE(state, num) {
    state.currentPage = num;
  },
  SET_TOTAL(state, total) {
    state.meta.total = total;
  },
  SET_LIMIT(state, limit) {
    state.limit = limit;
  }
};

const actions = {
  async fetchApplicationTemplates({ state, commit }) {
    try {
      const resp = await get("/users/admin/recruitment", {
        params: { current: state.current, limit: state.limit }
      });
      commit("SET_APPLICATIONS", resp.data.results);
      commit("SET_TOTAL", resp.data.total);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
};
