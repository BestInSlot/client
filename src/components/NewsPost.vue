<template>
  <accordion
    :showInitially="true" 
    parentTag="article" 
    headerTag="div" 
    :containerClasses="{ accordion: true, post: true }" 
    :headerClasses="{ 'toggle-padding': true }">
    <div class="post-header" slot="header">
      <div class="avatar">
         <img :src="`http://localhost${post.author.avatar}`">
      </div>
      <span>
        <h6 class="title is-4">
          <router-link :to="`/news/${post.id}/${post.slug}`">{{post.title}}</router-link>
        </h6>
        <small>Posted by {{post.author.username}} on {{formattedDate}}</small>
      </span>
    </div>
    <div class="post-body">
      <div class="post-content" v-html="post.body"> 
      </div>
    </div>
    <div class="post-foot" v-if="isAdmin || isCurator">
      <post-tools :isDropUp="true"/>      
    </div>
  </accordion>  
</template>

<script>
import format from "date-fns/format";
import PostTools from "@/components/PostTools";
import Accordion from "@/components/Accordion";

export default {
  name: "news",
  components: { Accordion, PostTools },
  props: {
    post: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      height: "",
      timeout: null,
      show: true
    };
  },

  computed: {
    isAdmin() {
      return (
        this.$store.getters.userDetails &&
        this.$store.getters.userDetails.is_admin
      );
    },

    isCurator() {
      return (
        this.$store.getters.userDetails &&
        this.$store.getters.userDetails.is_curator
      );
    },

    formattedDate() {
      return format(this.post.created_at, "dddd, MMMM DD, YYYY");
    }
  },

  methods: {
    editPost() {
      this.$store.dispatch("setVerb", "put");
      this.$store.dispatch("setEditableContent", this.post);
    },
    deletePost() {
      this.$store.dispatch("deletePost", this.post.id);
      setTimeout(() => {
        this.$store.dispatch("fetch");
      }, 100);
    }
  }
};
</script>

<style lang="scss">
@import "../scss/animations/slide-from-top";
</style>
