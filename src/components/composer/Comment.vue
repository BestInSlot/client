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
                <text-editor v-model="body" ref="editor" :name="'comment-editor'" :className="'comment-editor'" v-else>
                    <text-toolbar slot="toolbar">
                      <span class="submit-wrapper">
                        <button class="button is-primary is-small" @click.native="submit" :disabled="isDisabled">SAVE</button>
                      </span>
                    </text-toolbar>
                  </text-editor>
                <div class="comment-ctrls">
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

  data() {
    return {
      isEditing: false,
      body: ""
    };
  },

  computed: {
    isAuthorOrSuperUser() {
      return (
        this.comment.author.id === this.$auth.user().id ||
        this.$auth.user().is_admin ||
        this.$auth.user().is_curator
      );
    },
    isDisabled() {
      return (
        this.body
          .replace(/<([^>]+)>/gi, "")
          .replace(/\s/g, "")
          .trim().length < 10 || !this.body
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
      this.isEditing = !this.isEditing;
      this.body = this.isEditing ? this.comment.body : "";
      const id = this.isEditing ? this.comment.id : 0;
      this.$emit("editing", { isEditing: this.isEditing, id });
    }
  }
};
</script>
