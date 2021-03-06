<template>
  <div :id="id"></div>
</template>

<script>
import { init, exec } from "bis-pell";
import actions from "./actions";
export default {
  props: {
    value: {
      type: String
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
      default: () => [
        "bold",
        "italic",
        "underline",
        "heading1",
        "heading2",
        "code",
        "link",
        "image"
      ]
    },
    classPrefix: {
      type: String,
      default: "pell"
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
    }
  },

  methods: {
    init() {
      const element = document.getElementById(this.id);
      const {
        defaultParagraphSeparator,
        styleWithCss,
        actions,
        classPrefix
      } = this;

      const classes = {};

      const pellClasses = [
        "actionbar",
        "button",
        "content",
        "button-selected"
      ].forEach(key => {
        classes[key] = `${classPrefix}-${key}`;
      });

      let opts = {
        element,
        defaultParagraphSeparator,
        styleWithCss,
        classes: { ...classes },
        onChange: h => {
          console.log(`${/<\s*p><\s*br><\s*\/p>/g.test(h)} regex detected`);
          let html = /<\s*p><\s*br><\s*\/p>/g.test(h) ? "" : h;
          this.$emit("input", html);
          // this.$emit("update:value", html)
          this.$emit("change", { editor: this.editor, html: html });
        }
      };
      if (actions.length) {
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
    editableContent(val) {
      if (this.editor) {
        if (!!val && val !== this._content) {
          this._content = val;
          this.editor.content.innerHTML = this._content;
        } else {
          this._content = this.placeholder;
          this.editor.content.innerHTML = this._content;
        }
      }
    },
    value(val) {
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
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding: 0.5rem;
}
.pell-button,
.comment-button {
  color: #f1f1f1;
  padding: 0.5rem;
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
