"use strict";

import axios from "axios";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("bis_access_token");

export const state = {
  isAuthenticated: false,
  userDetails: null
};

export const getters = {
  isAuthenticated: state => state.isAuthenticated,
  userDetails: state => state.userDetails
};

export const mutations = {
  SET_AUTHENTICATION(state, bool) {
    state.isAuthenticated = bool;
  },

  SET_CURRENT_USER(state, user) {
    state.userDetails = user;
  },

  SET_FULL_NAME(state, name) {
    state.userDetails.fullname = name;
  },

  SET_AVATAR(state, avatarUrl) {
    state.userDetails.avatar = avatarUrl;
  }
};

export const actions = {
  async authenticate({ dispatch, commit }, { email, password }) {
    try {
      const response = await axios.post("/users/login", {
        email,
        password
      });

      const token = response.data["access_token"];
      localStorage.setItem("bis_access_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch("setModal", false);
      dispatch("fetchUserDetails");
      dispatch("setAuthentication", true);
    } catch (err) {
      dispatch("invalidate");
    }
  },

  async invalidate({ dispatch, commit }, logOutOfForum) {
    if (logOutOfForum) {
      await axios.post("/users/logout").catch();
    }
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("bis_access_token");
    commit("SET_AUTHENTICATION", false);
    commit("SET_CURRENT_USER", null);
  },

  async fetchUserDetails({ state, commit, dispatch }) {
    const response = await axios.get("/users");
    commit("SET_CURRENT_USER", response.data.user);
    // try {
    //   const response = await axios.get("/users");
    //   commit("SET_CURRENT_USER", response.data.user);
    // } catch (e) {
    // //   if (e.response) {
    // //     const status = e.response.status === 401;
    // //     const expired = e.response.data.token_expired;
    // //     if (status) {
    // //       dispatch("invalidate", false);
    // //       console.log(e.response);
    // //     } else {
    // //       console.log(e.response);
    // //     }
    // //   }
    // //   console.log(e.config);
    // // }
  },

  setAuthentication({ commit, dispatch }, bool) {
    commit("SET_AUTHENTICATION", bool);
  },

  setAvatar({ commit }, payload) {
    commit("SET_AVATAR", payload);
  },

  setFullName({ commit }, name) {
    commit("SET_FULL_NAME", name);
  }
};
