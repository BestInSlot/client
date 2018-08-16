<template>
    <section id="post-view" class="section" v-if="post">
       <div class="container">
           <breadcrumbs/>
           <div class="columns is-multiline">
                <div class="column is-12">
                    <div class="post-view-title">
                        <img :src="`http://localhost:${post.author.avatar}`" alt="" class="icon">
                        <div>
                            <h4 class="title is-4">{{post.title}}</h4>
                            <p class="meta">Submitted on: {{date}}</p>
                        </div>
                    </div>
                </div>
                <div class="column is-12">
                    <div class="columns is-gapless post-view-outer">
                        <div class="column is-narrow">
                            <div class="side">
                                <img :src="`http://localhost${post.author.avatar}`" alt="" class="icon">
                                <span>{{post.author.username}}</span>
                            </div>
                            
                        </div>
                        <div class="column is-flex">
                            <div class="post-view-body">
                                <post-tools></post-tools>
                                <div class="post-view-content" v-html="post.body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           </div>
    </section>
</template>

<script>
import format from "date-fns/format";
import PostTools from "@/components/PostTools";
import { get } from "axios";

export default {
  name: "ViewPost",
  components: {
    PostTools
  },
  async beforeRouteEnter(to, from, next) {
    let response;
    try {
      response = await get(`/posts/${to.params.id}`);
      next(vm => {
        vm.post = response.data.post;
      });
    } catch (e) {
      if (e.response) {
        next(`/error/${e.response.status}`);
      }
    }
  },

  created() {
      console.log(this.$breadcrumbs);
  },

  computed: {
    date() {
      return format(this.post.created_at, "dddd, MMMM DD, YYYY");
    }
  },

  data() {
    return {
      post: null
    };
  }
};
</script>

