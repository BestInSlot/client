<template>
  <transition enter-active-class="slide-in-from-bottom" leave-active-class="slide-out-from-bottom">
    <div id="editor-container" :class="rootClasses" :style="rootStyles" v-show="showEditor">
      <div class="draft-controls" v-if="hidden">
        <div class="restore" @click.prevent.stop="expand">
          <span class="draft-text">Post draft in progress. Click to resume.</span>
        </div>
        <button class="editor-close" @click="initCancelPrompt">
          <i class="fa fa-times fa-2x"></i>
        </button>
      </div>
      <div id="resizer" @touchstart.prevent.stop="init" @mousedown.prevent.stop="init" v-if="!hidden"></div>
      <div class="top-controls">
        <div class="right-controls">
          <button class="minimize" @click.prevent="hide">
            <i class="fa fa-chevron-down"></i>
          </button>
        </div>
      </div>
      <div class="editor-modals">
        <div class="modal-background" v-show="modalType"></div>
        <component :is="modalType" :modalType.sync="modalType" @closeEditor="closeEditor"></component>
      </div>
      <div :class="contentClasses">
        <div class="editor-wrappers">
          <div class="editor-wrapper">
            <div class="editor-input-wrapper">
              <input type="text" class="editor-input" v-model="title">
            </div>
            <editor v-model="content"></editor>
          </div>
        </div>
      </div>
      <div class="bottom-controls">
        <div class="left-controls">
          <button class="control-button is-primary" :disabled="isSaving" @click.prevent="save">Save</button>
          <button class="control-button has-outline" @click.prevent="initCancelPrompt">Cancel</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Editor from "./Editor";
import CancelPrompt from "./modals/CancelPrompt";
import { mapGetters } from "vuex";
export default {
  name: "composer",
  components: {
    Editor,
    CancelPrompt
  },
  props: {
    showEditor: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      startingPointY: 0,
      startingHeight: 0,
      height: 460,
      hidden: false,
      isSaving: false,
      isDragging: false,
      draft: null,
      modalType: "",
      title: "",
      content: "Insert your text here....",
      msgOpts: {
        theme: "primary",
        icon: "check",
        duration: 3000,
        className: ["bis-notification", "success"]
      }
    };
  },
  computed: {
    ...mapGetters("posts", ["editableContent", "verb"]),

    rootClasses() {
      return { draft: this.hidden };
    },

    rootStyles() {
      return {
        height: this.height + "px",
        transition:
          "height " +
          (this.isDragging ? "0" : "250") +
          "ms ease, background 250ms ease, max-width 250ms ease"
      };
    },

    contentClasses() {
      return ["editor-area", { hidden: this.hidden }];
    }
  },

  watch: {
    editableContent(content) {
      if (content) {
        this.title = content.title;
        this.$store.dispatch("toggleEditor", true);
      } else {
        this.title = "";
      }
    }
  },

  methods: {
    init(evt) {
      console.log("attaching event listeners.");
      this.startingHeight = this.height;
      this.isDragging = true;
      if (evt instanceof MouseEvent) {
        this.startingPointY = evt.clientY;
        window.addEventListener(
          "mousemove",
          evt => {
            this.resize(evt, evt.clientY);
          },
          false
        );
        window.addEventListener("mouseup", this.onEnd, false);
      } else {
        this.startingPointY = evt.targetTouches[0].clientY;
        window.addEventListener(
          "touchmove",
          evt => {
            this.resize(evt, evt.targetTouches[0].clientY);
          },
          false
        );
        window.addEventListener("touchend", this.onEnd, false);
      }
    },

    resize(evt, y) {
      evt.preventDefault();
      if (this.isDragging) {
        this.height = this.startingHeight - (y - this.startingPointY);
      }
    },

    onEnd(evt) {
      evt.preventDefault();
      console.log("removing event listeners");
      this.isDragging = false;
      window.removeEventListener("mousemove", this.onMouseMove, false);
      window.removeEventListener("mouseup", this.onMouseUp, false);
      window.removeEventListener("touchmove", this.onMove, false);
      window.removeEventListener("touchend", this.onEnd, false);
    },
    hide() {
      this.hidden = true;
    },
    expand() {
      this.hidden = false;
    },
    initCancelPrompt() {
      if (this.content) {
        this.modalType = "cancel-prompt";
      }
    },
    closeEditor() {
      this.$store.dispatch("toggleEditor", false);
      this.modalType = "";
      setTimeout(() => {
        this.$nextTick(() => {
          this.hidden = false;
          this.showPreview = true;
          this.content = "Insert plain text or html here...";
          this.$store.dispatch("setEditableContent", null);
        });
      }, 250);
    },

    async save() {
      if (!this.$auth.check()) {
        const message = "Not authorized to make a post.";
        this.msgOpts.icon = "exclamation-triangle";
        this.msgOpts.className[1] = "danger";
        this.$toasted.show(message, this.msgOpts);
        return;
      }

      let data, url, response;

      if (this.verb === "post") {
        data = {
          author_id: this.$store.getters.userDetails.id,
          title: this.title,
          body: this.content
        };
        url = "/posts";
      } else {
        data = {
          title: this.title,
          body: this.content
        };
        url = `/posts/${this.editableContent.id}`;
      }

      try {
        response = await this.$http[this.verb](url, { post: data });
        this.msgOpts.icon = "check";
        this.msgOpts.className[1] = "success";
        this.$toasted.show("Saved.", this.msgOpts);
        this.$router.push(
          `/p/${response.data.post.id}/${response.data.post.slug}`
        );
      } catch (e) {
        if (e.response) {
          const message = `${e.response.status}:${e.response.data.message}`;
          this.msgOpts.icon = "exclamation-triangle";
          this.msgOpts.className[1] = "danger";
          this.$toasted.show(message, this.msgOpts);
        } else if (e.request) {
          console.log(e.message);
        } else {
          console.log(e.message);
        }
      }
    }
  }
};
</script>



<style lang="scss" scoped>
@import "../../scss/animations/slide-from-bottom";
</style>
