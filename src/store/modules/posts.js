import axios from "axios";

export const state = {
  posts: [],
  orderBy: "DESC",
  limit: 20,
  meta: {
    total: 0
  },
  current: 1,
  editableContent: null,
  verb: "post"
};

export const getters = {
  posts: state => state.posts,
  featured: state => state.posts.filter(el => el.featured),
  current: state => state.current,
  orderBy: state => state.orderBy,
  limit: state => state.limit,
  total: state => state.meta.total,
  totalPages: state => {
    return Math.ceil(state.meta.total / state.limit);
  },
  editableContent: state => state.editableContent,
  verb: state => state.verb
};

export const mutations = {
  SET_POSTS(state, payload) {
    state.posts = payload;
  },
  SET_META(state, payload) {
    state.meta.total = payload;
  },
  SET_EDITABLE_CONTENT(state, payload) {
    state.editableContent = payload;
  },
  SET_CURRENT_PAGE(state, pageNum) {
    state.current = pageNum;
  },
  SET_VERB(state, verb) {
    state.verb = verb;
  }
};

export const actions = {
  setEditableContent({ commit }, payload) {
    commit("SET_EDITABLE_CONTENT", payload);
  },

  setVerb({ commit }, verb) {
    commit("SET_VERB", verb);
  },

  setPosts({ commit }, payload) {
    commit("SET_POSTS", payload);
  },

  setCurrentPage({ commit }, num) {
    commit("SET_CURRENT_PAGE", num);
  },

  setMeta({ commit }, payload) {
    commit("SET_META", payload);
  },

  async deletePost({ state, commit }, topic_id) {
    const params = {
      page: state.current,
      limit: state.limit,
      orderBy: state.orderBy
    };
    try {
      const deleted = await axios.delete(`/posts/${topic_id}`);
      const posts = await axios.get("/posts", { params });

      commit("SET_POSTS", posts.data.posts.results);
      commit("SET_META", posts.data.posts.total);
    } catch (e) {
      throw new Error(e);
    }
  },

  async fetch({ state, commit }, num) {
    commit("SET_CURRENT_PAGE", num);
    let params = {
      page: state.current,
      limit: state.limit,
      orderBy: state.orderBy
    };
    let payload;
    try {
      payload = await axios.get("/posts", { params });
      commit("SET_POSTS", payload.data.posts.results);
      commit("SET_META", payload.data.posts.total);
    } catch (e) {
      console.log(e);
    }
  }
};
