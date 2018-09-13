<template>
    <div :class="columnClasses">
      <router-link tag="div" :class="rootClasses" :to="`/media/stream/${record.login_name}`">
        <div class="s-thumbnail">
            <img :src="thumbnail" alt="">
        </div>
        <div class="s-info">
            <div class="s-owner-icon">
                <img :src="record.profile_image_url" :alt="record.display_name">
            </div>
            <div class="s-details">
                <p v-if="record.title">{{title}}</p>
                <p>{{record.display_name}}</p>
            </div>
        </div>
        <div class="s-status">
            <span>
                <span :class="statusClasses"></span>
                {{status}}
            </span>
        </div>
        <!-- <div class="s-viewers">{{record.viewers}}</div> -->
      </router-link>
    </div>
</template>

<script>
import truncate from "lodash/truncate";

export default {
  props: {
    record: {
      type: Object,
      required: true
    },

    isAuthorized: {
      type: Boolean,
      required: true
    },

    grid: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    status() {
      return this.record.live ? "Online" : "Offline";
    },
    columnClasses() {
      return [
        "column is-12-xs is-one-third-tablet is-half-mobile",
        { "is-12-desktop": !this.grid }
      ];
    },
    rootClasses() {
      return ["stream", { "is-live": this.record.live }];
    },
    statusClasses() {
      return [
        "status",
        { online: this.record.live, offline: !this.record.live }
      ];
    },
    thumbnail() {
      return this.record.live
        ? this.record.thumbnail
        : this.record.offline_image_url;
    },
    title() {
      return truncate(this.record.title, {
        length: 50,
        separator: "..."
      });
    }
  }
};
</script>

