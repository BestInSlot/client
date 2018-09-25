import { get } from "axios";

const namespaced = true;

const state = {
  total: 0,
  currentPage: 1,
  limit: 20,
  applications: null,
  selectedApplication: null,
  content: null,
  selectOptions: [
    { type: "input", text_field: true },
    { type: "textarea", text_field: true },
    { type: "select", text_field: false },
    { type: "checkbox", text_field: false }
  ]
};

const getters = {
  applications: state => state.applications,
  selectedApplication: state => state.selectedApplication,
  selectOptions: state => state.selectOptions,
  limit: state => state.limit,
  current: state => state.currentPage,
  total: state => state.total,
  content: state => state.content,
};

const mutations = {
  SET_APPLICATIONS(state, results) {
    state.applications = results;
  },
  SET_SELECTED_APPLICATION(state, application) {
    state.selectedApplication = application;
  },
  SET_CONTENT(state, content) {
    state.content = content;
  },
  SET_CURRENT_PAGE(state, num) {
    state.currentPage = num;
  },
  SET_TOTAL(state, total) {
    state.total = total;
  },
  SET_LIMIT(state, limit) {
    state.limit = limit;
  }
};

const actions = {
  setContent({ commit }, payload) {
    commit("SET_CONTENT", payload);
  },
  async fetchApplicationTemplates({ state, commit }) {
    try {
      const {
        data: { recruitment: recruitment }
      } = await get("/recruitment/templates", {
        params: { current: state.currentPage, limit: state.limit }
      });

      commit("SET_APPLICATIONS", recruitment.results);
      commit("SET_TOTAL", recruitment.total);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async fetchApplicants({ commit }, id) {
    try {
      const {
        data: { recruitment: recruitment }
      } = await get(`/recruitment/applicants/${id}`);
      console.log(recruitment);
      commit("SET_SELECTED_APPLICATION", recruitment);
    } catch (err) {
      console.log(err);
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
