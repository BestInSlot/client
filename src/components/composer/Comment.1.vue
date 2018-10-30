<template>
    <div class="column is-12">
        <div class="comment">
            <figure class="comment-left">
                <div class="image is-64x64">
                    <img class="is-rounded" :src="`http://localhost` + comment.author.avatar" alt="">
                </div>
                <p>{{comment.author.username}}</p>
            </figure>
            <div class="comment-body">
                <div class="content" v-html="comment.body" v-if="selectedEditor !== comment.id"></div>
                <slot></slot>
                <div class="comment-ctrls" v-if="selectedEditor !== comment.id">
                    <div class="ctrl-right">
                        <template v-if="isAuthorOrSuperUser">
                            <span class="ctrl" role="button" @click.prevent="toggleEditing">
                                <i class="fa fa-edit"></i>
                                <span>Edit</span>
                            </span>
                            <span class="ctrl" role="button">
                                <i class="fa fa-remove"></i>
                                <span>Delete</span>
                            </span>
                        </template>
                        <span class="ctrl" role="button" @click="quote">
                            <i class="fa fa-quote-left"></i>
                            <span>Quote</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TextEditor from "@/components/quillEditor/Quill";
import TextToolbar from "@/components/quillEditor/CommentToolbar";
export default {
  name: "comment",
  components: { TextEditor, TextToolbar },
  props: {
    comment: {
      type: Object,
      required: true
    },
    selectedEditor: {
      type: Number,
      required: true
    }
  },

  computed: {
    isAuthorOrSuperUser() {
      return (
        this.comment.author.id === this.$auth.user().id ||
        this.$auth.user().is_admin ||
        this.$auth.user().is_curator
      );
    }
  },

  methods: {
    quote() {
      this.$emit("quote", {
        body: this.comment.body,
        author: this.comment.author.username
      });
    },
    toggleEditing() {
      this.$emit("editing", { id: this.comment.id, body: this.comment.body });
    }
  }
};
</script>
