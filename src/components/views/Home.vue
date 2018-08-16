<template>
  <div class="container">
    <app-carousel :slides="slides"></app-carousel>
    <section id="recent-news">
      <div class="section-header">
        <h2>Recent News</h2>
      </div>
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="columns">
            <div class="column" v-if="total">
              <pagination :total="total" :current="current" :size="'is-small'" @change="fetch"></pagination>
            </div>
            <div class="right-options column">
              <button class="button is-small is-primary" @click.prevent="toggleEditor(true)">
                <i class="fa fa-plus" aria-hidden="true"></i>
                  <span>Create Post</span>
              </button>
            </div>
          </div>
        </div>
        <template v-if="posts.length">
          <div class="column is-12" v-for="(post, index) in posts" :key="index">
            <app-post :post="post"/>
        </div>
        </template>
        <template v-else>
          <div class="column is-12">
            <div class="content has-text-centered no-records">
              <i class="fa fa-search"></i>
              <h2>No records found.</h2>
            </div>
          </div>
        </template>  
    </div>
    </section>
    <text-editor :showEditor="showEditor"></text-editor>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Post from "@/components/NewsPost";
import Carousel from "@/components/carousel/Carousel";
import TextEditor from "@/components/editor/ComposerNoPreview";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "home",
  components: {
    appPost: Post,
    appCarousel: Carousel,
    Pagination,
    TextEditor
  },

  props: ["page"],

  beforeRouteEnter(to, from, next) {
    const { require_login } = to.query;
    const token = localStorage.getItem("bis_access_token");
    const page = typeof to.params.page === undefined ? 1 : to.params.page;

    next(vm => {
      if (require_login && !token) {
        vm.$store.dispatch("setModal", true);
      }
      vm.$store.dispatch("fetch", page);
    });
  },

  data() {
    return {
      perPage: 20,
      slides: [
        {
          img: "http://localhost/images/img1.jpeg",
          title: "Trees N Shit"
        },
        {
          img:
            "https://images.pexels.com/photos/55821/pyrenees-mountains-snow-zenith-55821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          title: "Earth N Shit"
        },
        {
          img:
            "https://images.pexels.com/photos/48178/mountains-ice-bergs-antarctica-berg-48178.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          title: "Mountains N Shit"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["showEditor", "posts", "total", "totalPages", "current"])
  },

  methods: {
    ...mapActions(["fetch"]),
    toggleEditor(bool) {
      this.$store.dispatch("setVerb", "post");
      this.$store.dispatch("toggleEditor", true);
    }
  },

  watch: {
    //if the incoming page request is greater than total pages, we redirect it to keep it within parameters
    page(page) {
      console.log(page);
      if (page > this.totalPages) {
        this.$router.redirect(`/page/${this.meta.totalPages}`);
        this.$store.dispatch("fetch", this.totalPages);
      } else if (page < 1) {
        this.$router.redirect("/");
        this.$store.dispatch("fetch", 1);
      } else {
        if (!page) {
          this.$store.dispatch("fetch", 1);
        }
      }
    }
  }
};
</script>

<style lang="scss">
#recent-news {
  .no-records {
    i {
      font-size: 5rem;
    }
  }
  .column:last-child {
    margin-bottom: 1.5rem;
  }
  .right-options {
    display: flex;
    justify-content: flex-end;
    span {
      margin-left: 0.5rem;
    }
  }
}
</style>
