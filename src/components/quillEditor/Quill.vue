<template>
    <div :class="className">
        <slot name="toolbar"></slot>
        <div ref="editor"></div>
    </div>
</template>

<script>
import defaultOptions from "./options";
import QuoteBlock, { Quote as InlineQuote } from "./quote";
import Quill from "quill";

Quill.register({ "formats/blockquote": QuoteBlock }, true);

export default {
  name: "quill-editor",
  props: {
    content: String,
    value: String,
    name: String,
    className: {
      type: String,
      default: "quill-editor"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: false,
      default: () => {}
    },
    globalOptions: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      _options: {},
      _content: "",
      quill: null,
      index: 0,
      defaultOptions
    };
  },

  beforeDestroy() {
    this.quill = null;
  },

  mounted() {
    this.init();
  },

  watch: {
    content(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal;
          this.quill.pasteHTML(newVal);
        } else if (!newVal) {
          this.quill.setText("");
        }
      }
    },
    value(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          console.log("firing...");
          this._content = newVal;
          this.quill.pasteHTML(newVal);
        } else if (!newVal) {
          this.quill.setText("");
        }
      }
    },

    disabled(newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal);
      }
    }
  },

  methods: {
    init() {
      if (this.$el) {
        this._options = Object.assign(
          {},
          this.defaultOptions,
          this.globalOptions,
          this.options
        );

        this.quill = new Quill(this.$refs.editor, this._options);
        this.quill.enable(false);

        if (this.value || this.content) {
          this.quill.pasteHTML(this.value || this.content);
        }

        if (!this.disabled) {
          this.quill.enable(true);
        }

        this.quill.on("selection-change", range => {
          if (range) {
            if (range.length === 0) {
              console.log("cursor is at %s", range.index);
              this.index = range.index;
            } else {
              const text = this.quill.getText(range.index, range.length);
              console.log("Selected Text: %s", text);
            }
          } else {
            console.log("cursor not on editor");
          }
          // if (!range) {
          //   this.$emit("blur", this.quill);
          // } else {
          //   this.$emit("focus", this.quill);
          // }
        });

        this.quill.on("text-change", (delta, oldDelta, source) => {
          let html = this.$refs.editor.children[0].innerHTML;
          const quill = this.quill;
          const text = quill.getText();
          this._content = html;
          this.$emit("input", this._content);
          this.$emit("change", { html, text, quill });
        });

        this.$emit("ready", this.quill);
      }
    },
    focus() {
      console.log("focus firing off...");
      if (this.quill) this.quill.focus();
    },
    hasFocus() {
      if (this.quill) {
        //returns true if the editor has focus else false.
        return this.quill.hasFocus();
      }
    },
    pasteHTML(html) {
      if (this.quill) {
        return this.quill.pasteHTML(html);
      }
    },
    dangerouslyPasteHTML(index, html) {
      if (this.quill) {
        return this.quill.clipboard.dangerouslyPasteHTML(index, html);
      }
    },
    deleteText(index, length, source) {
      if (this.quill) {
        return this.quill.deleteText(index, length, source);
      }
    },
    setSelection(index, length, source) {
      if (this.quill) {
        return this.quill.setSelection(index, length, source);
      }
    },
    getSelection() {
      if (this.quill) {
        return this.quill.getSelection();
      }
    },
    getLength(trueLength) {
      if (this.quill) {
        return this.quill.getLength();
      }
    },
    getText(index, length) {
      if (this.quill) {
        return this.quill.getText(index, length);
      }
    },
    getContents(index, length) {
      if (this.quill) {
        return this.quill.getContents(index, length);
      }
    },
    quote(content) {
      console.log(content);
      const range = this.getSelection();
      this.focus();
      this.$nextTick(() => {
        if (!this.quill.hasFocus()) {
          console.log("no range...");
          const length = this.getLength();
          this._content = content;
          this.dangerouslyPasteHTML(length, content);
          this.$emit("input", this._content);
        } else {
          console.log("have range...");
          this._content = content;
          this.dangerouslyPasteHTML(this.index, this._content);
          this.$emit("input", this._content);
          this.index = 0;
        }
      });
    }
  }
};
</script>
