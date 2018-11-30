<template>
  <div id="applicant" class="wrapper">
    
      <div class="composer-row no-padding">
        <div id="questions">
          <div class="question" v-for="(field, parent) in answers" :key="parent">
            <div class="q-header">QUESTION {{parent+1}}</div>
            <div class="content">
              <p>{{field.question}}</p>
              <p>{{field.answer}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="composer-row">
        <div class="score-wrapper">
          <score/>
        </div>
      </div>
      <div class="composer-row">
        <div class="head">
          <div class="level">
            <div class="level-left">
              <span class="level-item subtitle is-4">Comments ({{ comments ? comments.length : 0}})</span>
            </div>
            <div class="level-right">
              <div class="buttons level-item">
                <button
                  class="button is-small is-info"
                  @click="toggleEditor"
                  :disabled="!!selectedEditor"
                >
                  <span>Show Editor</span>
                </button>
                <button class="button is-small is-info" @click="getComments(content.id)">
                  <span>Show Comments</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div class="composer-row" v-show="showEditor" v-if="!selectedEditor">
          <div class="media">
            <figure class="media-left">
              <div class="image is-64x64">
                <img
                  :src="`http://localhost${$auth.user().avatar}`"
                  :alt="$auth.user().username"
                  class="is-rounded"
                >
              </div>
            </figure>
            <div class="media-content">
              <div class="field">
                <div class="control">
                  <text-editor
                    v-model="body"
                    ref="editor"
                    :name="'comment-editor'"
                    :className="'comment-editor'"
                  >
                    <span class="submit-wrapper buttons">
                      <button
                        class="button is-primary is-small"
                        @click="submit"
                        :disabled="isDisabled"
                      >SAVE</button>
                      <button class="button is-primary is-small" @click="closeEditor">CLOSE</button>
                    </span>
                  </text-editor>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <div class="composer-row">
        <nav class="level">
          <div class="level-left">
            <pagination v-if="comments && comments.length" :size="'is-small'"/>
          </div>
          <div class="level-right">
            <div class="level-item select is-small">
              <select class="composer-select">
                <option value="20">Show 20</option>
                <option value="40">Show 40</option>
                <option value="60">Show 60</option>
              </select>
            </div>
            <div class="level-item select is-small">
              <select class="composer-select">
                <option value>Show Newest</option>
                <option value>Show Oldest</option>
              </select>
            </div>
          </div>
        </nav>
      </div>
      <transition name="fade">
        <div class="composer-row" v-if="comments && comments.length">
          <transition-group tag="div" class="columns is-multiline" name="fade">
            <comment
              v-for="(comment, i) in comments"
              :key="i"
              :comment="comment"
              :selectedEditor="selectedEditor"
              @editing="enableEditing"
              @quote="applyQuote"
            >
              <text-editor
                v-model="body"
                ref="commentEditor"
                :name="'comment-editor'"
                :className="'comment-editor'"
                v-if="selectedEditor === comment.id"
              >
                <span class="submit-wrapper buttons">
                  <button
                    class="button is-primary is-small"
                    @click="submit"
                    :disabled="isDisabled"
                  >SAVE</button>
                  <button class="button is-primary is-small" @click="closeEditor">CLOSE</button>
                </span>
              </text-editor>
            </comment>
          </transition-group>
        </div>
      </transition>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Score from "./Score";
import TextEditor from "@/components/squireEditor/Squire.vue";
import Pagination from "@/components/Pagination.vue";
import Comment from "@/components/composer/Comment";
import upperFirst from "lodash/upperFirst";

export default {
  name: "ViewApplicant",
  components: { TextEditor, Pagination, Comment, Score },
  computed: {
    ...mapGetters("recruitment", ["answers", "content"]),
    ...mapGetters("recruitmentComments", [
      "comments",
      "current",
      "limit",
      "sortBy",
      "total"
    ]),
    isDisabled() {
      return (
        this.body
          .replace(/<([^>]+)>/gi, "")
          .replace(/\s/g, "")
          .trim().length < 10 || !this.body
      );
    }
  },

  data() {
    return {
      newComment: null,
      showEditor: false,
      isLoading: false,
      selectedEditor: 0,
      body: ""
    };
  },

  created() {
    const username = this.$store.getters["recruitment/content"].applicant
      .username;
    this.$emit("updateTitle", `${upperFirst(username)}'s Application`);
  },

  beforeDestroy() {
    this.$emit("updateTitle", "");
    this.$off("commentSubmit");
    this.commentButton = null;
    this.$store.commit("recruitment/SET_CONTENT", null);
  },

  methods: {
    ...mapActions("recruitmentComments", ["getComments"]),
    submit() {
      console.log("submit works...");
    },
    applyQuote(quote) {
      const editor = this.selectedEditor
        ? this.$refs.commentEditor[0]
        : this.$refs.editor;
      // document.querySelector(".comment-editor").scrollIntoView();

      const html =
        "<br><blockquote><b>Quote from </b><i>@ " +
        quote.author +
        "</i>" +
        quote.body +
        "</blockquote><br>&nbsp;";

      editor.insertHTML(html);
      editor.scrollToBottom();
    },

    enableEditing({ id, body }) {
      this.showEditor = false;
      if (this.selectedEditor === id) {
        this.selectedEditor = 0;
        this.body = "";
        return;
      }
      this.selectedEditor = id;
      this.body = body;
    },

    closeEditor() {
      console.log("button works....");
      this.selectedEditor = 0;
      this.body = "";
    },

    toggleEditor() {
      this.showEditor = !this.showEditor;
      if (this.showEditor) this.$refs.editor.focus();
    },
    async createComment() {
      const id = this.content.id;
      const author_id = this.$auth.user().id;
      const { body } = this;

      try {
        const {
          data: { comment: comment }
        } = await this.$http.post(`/recruitment/${id}/comments`, {
          author_id,
          body
        });
        this.$toasted.show("Comment Saved.", {
          theme: "primary",
          duration: 3000,
          className: ["bis-notification", "success"],
          icon: "check"
        });
        this.newComment = comment;
      } catch (err) {
        console.log(err);
        if (err && err.response) {
          const message = err.response
            ? err.response.data.message
            : { ...err.response.data };
          this.$toasted.show(message, {
            theme: "primary",
            duration: 3000,
            className: ["bis-notification", "danger"],
            icon: "exclamanation-triangle"
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
#applicant {
  padding-bottom: 5rem;
  .questions {
    padding-bottom: 0;
  }
}
.q-header {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.score-wrapper {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
}

.composer-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0 1rem;
  &.no-padding {
    padding: 0;
  }
}
</style>
