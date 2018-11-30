<template>
  <div :class="className">
    <div id="toolbar">
      <div class="format-block" v-for="(block, b) in formats" :key="b">
        <button
          :class="['format', `format-${format.name}`, { selected: format.active }]"
          v-for="(format, i) in block"
          :key="i"
          @click.prevent="applyFormat(format)"
        >
          <i :class="format.icon"></i>
        </button>
      </div>
      <slot></slot>
    </div>
    <div class="editor-content" ref="editor"></div>
  </div>
</template>

<script>
import Squire from "squire-rte";

const capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

let events = [
  "keydown",
  "keypress",
  "keyup",
  "select",
  "undoStateChange",
  "willPaste",
  "focus",
  "blur"
];

let formats = [
  [
    { name: "bold", tag: "b", icon: "fa fa-bold", active: false },
    { name: "italic", tag: "i", icon: "fa fa-italic", active: false },
    { name: "underline", tag: "u", icon: "fa fa-underline", active: false }
  ],
  [
    {
      name: "blockquote",
      tag: "blockquote",
      icon: "fa fa-quote-left",
      active: false
    },
    { name: "orderedlist", tag: "ol", icon: "fa fa-list", active: false },
    { name: "unorderedlist", tag: "ul", icon: "fa fa-list-ol", active: false }
  ]
];

export default {
  name: "squire",
  props: {
    className: {
      type: String,
      default: "editor"
    },
    isSetHTMLSanitized: {
      type: Boolean,
      default: true
    },
    isInsertedHTMLSanitized: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    defaultBlockTag: {
      type: String,
      default: "P"
    },
    defaultBlockAttributes: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      squire: null,
      innerContent: "",
      formats
    };
  },
  beforeDestroy() {
    events.forEach(event => this.squire.removeEventListener(event));
    this.squire.removeEventListener("input");
    this.squire.removeEventListener("cursor");
    this.squire = null;
    delete this.squire;
  },
  mounted() {
    this.init();
  },

  methods: {
    setActiveFormat() {
      this.formats.forEach(block => {
        block.forEach(format => {
          format.active = this.squire.hasFormat(format.tag);
        });
      });
    },

    focus() {
      if (!this.squire) return;
      return this.squire.focus();
    },

    hasFocus() {
      return this.$refs.editor.hasFocus();
    },

    scrollToBottom() {
      const editor = this.$refs.editor;
      editor.scrollTop = editor.scrollHeight;
    },

    insertHTML(html) {
      this.squire.insertHTML(html);
    },

    applyFormat(format) {
      if (this.squire.hasFormat(format.tag)) {
        switch (format.tag) {
          case "blockquote":
            this.squire.decreaseQuoteLevel();
            break;
          case "ol":
            this.squire.removeList();
            break;
          case "ul":
            this.squire.removeList();
            break;
          default:
            this.squire[`remove${capitalize(format.name)}`]();
        }
        format.active = false;
      } else {
        switch (format.tag) {
          case "blockquote":
            this.squire.increaseQuoteLevel();
            break;
          case "ol":
            this.squire.makeOrderedList();
            break;
          case "ul":
            this.squire.makeUnorderedList();
            break;
          default:
            format;
            this.squire[`${format.name}`]();
        }
        format.active = true;
      }
    },

    init() {
      if (this.$el) {
        this.squire = new Squire(this.$refs.editor, {
          blockTag: this.defaultBlockTag,
          blockAttributes: this.defaultBlockAttributes
        });

        this.squire.addEventListener("input", e => {
          const html =
            this.squire.getHTML() === "<p><br><p>" ? "" : this.squire.getHTML();
          this.innerContent = html;
          this.$emit("input", html);
          this.$emit("change", { squire: this.squire, html });
        });

        this.squire.addEventListener("cursor", ({ range }) => {
          this.$emit("on-cursor", { range, squire: this.squire });
        });

        this.squire.addEventListener("pathChange", e => {
          this.setActiveFormat();
          this.$emit("on-change", { event: e, squire: this.squire });
        });

        events.forEach(event => {
          this.squire.addEventListener(event, e => {
            this.$emit(`on-${event}`, { event: e, squire: this.squire });
          });
        });

        if (this.value || this.content) {
          this.squire.setHTML(this.value || this.content);
        }
      }
    }
  },

  watch: {
    content(val) {
      if (val && val !== this.innerContent) {
        this.innerContent = val;
      } else {
        this.innerContent = "";
      }
    },
    value(val) {
      if (val && val !== this.innerContent) {
        this.innerContent = val;
      } else {
        this.innerContent = "";
      }
    }
  }
};
</script>


<style lang="scss">
.format-block:not(:last-child) {
  border-right: 1px solid #555;
  padding-right: 0.5rem;
}
</style>
