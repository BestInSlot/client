<template>
    <section id="streams" class="section">
        <div class="container">
            <breadcrumbs/>
            <div class="columns is-multiline">
                <div class="column is-12">
                    <div class="shead">
                        <h4 class="subtitle is-4">Streams</h4>
                        <div class="buttons">
                          <button class="button is-info is-small" @click="show = true">
                            <i class="fa fa-plus"></i>
                            <span>Add</span>
                          </button>
                          <button class="button is-info is-small" @click="fetch">
                            <i class="fa fa-repeat"></i>
                            <span>Refresh</span>
                          </button>
                        </div>
                        
                    </div>
                </div>
                <div class="column is-12">
                    <div class="columns is-multiline">
                        <div class="column is-half-desktop is-half-tablet is-12-mobile">
                            <pagination
                            v-if="total" 
                            :current="pagination.current" 
                            :per-page="pagination.perPage" 
                            :total="total" 
                            :size="'is-small'" 
                            :order="'is-centered'" 
                            @change="changePage"/>
                        </div>
                        <div class="column is-half-desktop is-half-tablet is-12-mobile">
                          <div class="tabs-control">
                            <div class="tabs-column">
                              <div class="tabs is-small is-toggle is-left">
                                <ul>
                                  <li :class="{ 'is-active': !this.grid}"><a class="fa fa-list" @click.prevent="grid = false"></a></li>
                                  <li :class="{ 'is-active': this.grid}"><a class="fa fa-th" @click.prevent="grid = true"></a></li>
                                </ul>
                              </div>
                            </div>
                            <div class="tabs-column">
                              <div class="tabs is-toggle is-small is-right">
                                <ul>
                                  <li v-for="(tab, index) in formattedTabs" 
                                    :key="'tab'+index"
                                    :class="{ 'is-active': index === activeTab}" 
                                    @click.prevent.stop="setTab(index, tab)"><a>{{tab}}</a></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>                        
                    </div>
                </div>
                <div class="column is-12" style="position: relative">
                    <div :class="overlayClasses">
                      <div class="loading">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <template v-if="streams.length">
                        <div :class="streamListClasses">
                            <stream :record="stream" :isAuthorized="isAuthorized" v-for="(stream, index) in records" :grid="grid" :key="index"/>
                        </div>
                    </template>
                    <template v-else>
                        <div class="no-streams">
                            <i class="fa fa-video-slash fa-4x"></i>
                            <p style="text-align: center;">No Content</p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <stream-modal :show.sync="show"/>
    </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BreadCrumbs from "@/components/breadcrumbs/Breadcrumbs";
import Stream from "@/components/views/streams/StreamItem";
import StreamModal from "@/components/views/streams/AddStream";
import Pagination from "@/components/Pagination";
import store from "@/store";

export default {
  name: "stream_list",
  components: { Stream, StreamModal, BreadCrumbs, Pagination },
  async beforeRouteEnter(to, from, next) {
    await store
      .dispatch("fetchStreams")
      .then(
        next(vm => {
          vm.$socket.emit("join room", "streams");
        })
      )
      .catch(e => console.log("Couldn't fetch streams"));
  },

  beforeRouteLeave(to, from, next) {
    this.$socket.emit("leave room", "streams");
    next();
  },
  sockets: {
    update(id) {
      this.$store.commit("SET_STREAM_LIVE_STATE", stream);
    }
  },
  data() {
    return {
      show: false,
      pagination: {
        current: 1,
        perPage: 20
      },
      tabs: ["all", "online", "offline"],
      activeTab: 0,
      isLoading: false,
      grid: false
    };
  },
  computed: {
    ...mapGetters(["streams"]),

    isAuthorized() {
      return (
        this.$auth.check() &&
        (this.$auth.user().is_admin || this.$auth.user().is_curator)
      );
    },

    streamListClasses() {
      return ["stream-list columns is-multiline", { grid: this.grid }];
    },

    formattedTabs() {
      return this.tabs.map(tab => tab.charAt(0).toUpperCase() + tab.slice(1));
    },

    tabClasses() {
      return ["is-right is-small", { "is-active": this.isActiveTab }];
    },

    total() {
      return Math.ceil(this.streams.length / this.pagination.perPage);
    },

    offset() {
      return (this.pagination.current - 1) * this.pagination.perPage;
    },

    limit() {
      return this.pagination.current * this.pagination.perPage - 1;
    },

    overlayClasses() {
      return ["is-overlay", { active: this.isLoading }];
    },

    records() {
      return this.streams.slice(this.offset, this.limit);
    }
  },

  methods: {
    ...mapActions(["fetchStreams"]),
    async fetch() {
      this.isLoading = true;
      this.fetchStreams()
        .catch(e => console.log(e))
        .finally(() => (this.isLoading = false));
    },
    changePage(num) {
      this.$store.dispatch("changePage", num);
      this.fetch();
    },
    isActiveTab(index) {
      return index === this.activeTab;
    },
    setTab(num, tab) {
      this.activeTab = num;
      this.pagination.current = 1;
      this.$store.commit("SET_FILTER", tab);
    }
  }
};
</script>
