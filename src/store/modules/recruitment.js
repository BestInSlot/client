import { get } from "axios";

export const state = {
  total: 0,
  currentPage: 1,
  limit: 20,
  applications: null,
  selectedApplication: null,
  content: null,
  selectOptions: [
    { type: "input", name: "Short Answer", text_field: true },
    { type: "textarea", name: "Long Answer", text_field: true },
    { type: "select", name: "Select", text_field: false },
    { type: "checkbox", name: "Multi Choice", text_field: false }
  ]
};

export const getters = {
  applications: state => state.applications,
  selectedApplication: state => state.selectedApplication,
  selectOptions: state => state.selectOptions,
  limit: state => state.limit,
  current: state => state.currentPage,
  total: state => state.total,
  content: state => state.content,
  answers: (state, getters) => {
    if (getters.selectedApplication && getters.content) {
      return getters.selectedApplication.fields.map(field => {
        const record = getters.content.fields.find(
          content => content.aid === field.qid
        );
        const { question } = field;
        const answer = record ? record.value : null;
        return { question, answer };
      });
    }
    return null;
  }
};

export const mutations = {
  SET_APPLICATIONS(state, results) {
    state.applications = results;
  },
  SET_SELECTED_APPLICATION(state, application) {
    state.selectedApplication = application;
  },
  SET_CONTENT(state, id) {
    if (typeof id === "string") {
      const record = state.selectedApplication.applications.find(
        el => el.id === id
      );

      if (record) {
        state.content = record;
      }
    } else {
      state.content = null;
    }
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

export const actions = {
  setContent({ commit }, id) {
    commit("SET_CONTENT", id);
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
