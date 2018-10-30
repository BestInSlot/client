"use strict";
import { get } from "axios";

export const state = {
  comments: null,
  current: 1,
  limit: 20,
  sortBy: "newest",
  total: 0
};

export const getters = {
  // comments: state => {
  //   if (state.comments) {
  //     state.comments.sort((a, b) => {
  //       if (state.sortBy === "newest") {
  //         if (a.created_at < b.created_at) {
  //           return -1;
  //         }
  //       } else {
  //         if (a.created_at > b.createad_at) {
  //           return 1;
  //         }
  //       }
  //       return 0;
  //     });
  //   }
  //   return null;
  // },
  comments: state => state.comments,
  limit: state => state.limit,
  sortBy: state => state.sortBy,
  total: state => state.total,
  current: state => state.current
};

export const mutations = {
  SET_COMMENTS(state, comments) {
    state.comments = comments;
  },
  SET_CURRENT_PAGE(state, page) {
    state.current = page;
  },
  SET_TOTAL(state, total) {
    state.total = total;
  },
  SET_SORT(state, sort) {
    state.sortBy = sort;
  },
  SET_LIMIT(state, limit) {
    state.limit = limit;
  }
};

export const actions = {
  async getComments({ commit }, id) {
    try {
      const {
        data: { comments: comments }
      } = await get(`/recruitment/application/${id}/comments`, {
        params: { current: state.current, limit: state.limit }
      });
      commit("SET_COMMENTS", comments);
      // commit("SET_TOTAL", comments.total);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
