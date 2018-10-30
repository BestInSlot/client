<template>
  <div :id="id">
  </div>
</template>

<script>
import { init, exec, toggleDisable } from "bis-pell";
import pick from "lodash/pick";
import actions from "./actions";
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: "editor"
    },
    defaultParagraphSeparator: {
      type: String,
      default: "p"
    },
    styleWithCss: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array,
      // default: () => [
      //   "bold",
      //   "italic",
      //   "underline",
      //   "heading1",
      //   "heading2",
      //   "code",
      //   "link",
      //   "image"
      // ]
      default: () => actions
    },
    classPrefix: {
      type: String,
      default: "pell"
    },
    hasSubmitButton: {
      type: Boolean,
      default: false
    },
    submitButtonClass: {
      type: String,
      default: "button is-primary is-small"
    },
    name: String
  },
  data() {
    return {
      editor: null,
      _content: "",
      placeholder: "Insert text here...."
    };
  },

  computed: {
    editableContent() {
      const copy = { ...this.$store.getters["posts/editableContent"] };
      return copy.body;
    },
    classes() {
      return {
        actionbar: `${this.classPrefix}-actionbar`,
        button: `${this.classPrefix}-button`,
        content: `${this.classPrefix}-content`,
        selected: `${this.classPrefix}-button-selected`,
        submitContainer: `${this.classPrefix}-submit`,
        submitButton: `${this.classPrefix}-button ${this.submitButtonClass}`
      };
    }
  },

  methods: {
    setContent(val) {
      this.editor.content.innerHTML = this.value;
      this._content = val;
      this.$emit("input", val);
      return this;
    },
    toggleButton(bool) {
      if (!this.editor) return;
      toggleDisable(bool);
      console.log(toggleDisable);
      return this;
    },
    init() {
      const element = document.getElementById(this.id);
      const props = pick(this.$props, [
        "defaultParagraphSeparator",
        "styleWithCss",
        "hasSubmitButton",
        "buttonText",
        "actions"
      ]);

      let opts = {
        element,
        ...props,
        classes: { ...this.classes },
        onChange: h => {
          const html = /<\s*p><\s*br><\s*\/p>/g.test(h) ? "" : h;
          this.$emit("input", html);
          // this.$emit("update:value", html)
          this.$emit("change", { editor: this.editor, html: html });
        }
      };

      if (actions && actions.length) {
        opts.actions = actions;
      }

      this.editor = init(opts);

      if (this.editor) {
        this.value
          ? (this.editor.content.innerHTML = this.value)
          : (this.editor.content.innerHTML =
              "Feel free to use either markdown or html...");
      }
    }
  },

  mounted() {
    if (this.$el) {
      this.init();
    }
  },

  watch: {
    content(val) {
      if (this.editor) {
        if (!!val && val !== this._content) {
          this._content = val;
          this.editor.content.innerHTML = this._content;
        } else {
          this._content = this.placeholder;
          this.editor.content.innerHTML = this._content;
        }
      }
    }
  },

  beforeDestroy() {
    this.editor = null;
  }
};
</script>

<style lang="scss">
$pell-actionbar-color: #0a0a0a;
$pell-content-height: 100%;
#editor {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
#comment-editor {
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  blockquote {
    padding: 0.75rem;
    background-color: #272727;
    border-left: 2px solid #171717;
    border-bottom: 2px solid #171717;
  }
}
.pell-content,
.pell-actionbar,
.comment-content,
.comment-actionbar {
  text-align: left;
}
.comment-content,
.pell-content {
  background-color: #1f1f1f;
  color: #cacaca;
  overflow-y: auto;
  overflow-x: hidden;
}
.comment-content {
  min-height: 150px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.pell-content {
  // background-color: #0a0303; //#1f2226;
  // color: #cacaca;
  flex: 1 1 100%;
  height: 100%;
  width: 100%;
  min-height: auto;
  // overflow-y: auto;
  // overflow-x: hidden;
  word-wrap: break-word;
}
.comment-content {
  padding: 0 0.5rem;
}
.pell-actionbar,
.comment-actionbar {
  padding: 0.25rem;
  background-color: #171717;
}
.comment-actionbar {
  display: flex;
  align-items: center;
  padding: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.comment-submit {
  display: inline-flex;
  flex: 1;
  justify-content: flex-end;
  padding: 0.25rem;
}
.pell-button,
.comment-button {
  color: #f1f1f1;
  background: none;
  border: none;
  &:hover {
    background-color: darken(#171717, 5%);
    &:first-child {
      border-top-left-radius: 4px;
    }
  }
}
@import "../../../node_modules/bis-pell/src/pell";
</style>
