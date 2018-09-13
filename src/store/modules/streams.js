import axios from "axios";

export const state = {
  streams: [],
  filters: {
    show: "all"
  }
};

export const getters = {
  streams: (state, getters) =>
    state.streams
      .filter(stream => {
        if (getters.show !== "all") {
          switch (getters.show) {
            case "online":
              return stream.live;
            case "offline":
              return !stream.live;
            default:
              break;
          }
        }
        return stream;
      })
      .sort((x, y) => {
        return x.live === y.live ? 0 : x.live ? -1 : 1;
      }),
  show: state => state.filters.show.toLowerCase()
};

export const mutations = {
  SET_STREAMS(state, streams) {
    state.streams = streams;
  },

  CHANGE_PAGE(state, page) {
    state.currentPage = page;
  },

  SET_FILTER(state, filter) {
    state.filters.show = filter;
  },

  SET_STREAM_LIVE_STATE(state, { title, user_id, sid }) {
    const stream = state.streams.find(
      ({ streamer_id }) => streamer_id === user_id
    );
    if (stream) {
      stream.live = !stream.live;
      stream.sid = sid;
      stream.title = title;
    }
  }
};

export const actions = {
  async fetchStreams({ commit, state }) {
    try {
      const { data } = await axios.get("/media/streams");
      console.log(data);
      commit("SET_STREAMS", data.streams);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
