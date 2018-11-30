<template>
    <div id="toolbar">
        <button :class="isBoldActive">
            <i class="fa fa-bold"></i>
        </button>
        <button :class="isItalicActive">
            <i class="fa fa-italic"></i>
        </button>
        <button :class="isUnderlineActive">
            <i class="fa fa-underline"></i>
        </button>
        <button class="format format-strike">
            <i class="fa fa-strike"></i>
        </button>
        <div class="sep"></div>
        <button class="format format-orderedlist">
            <i class="fa fa-list"></i>
        </button>
        <button class="format format-unorderedlist">
            <i class="fa fa-list-alt"></i>
        </button>
        <button class="format format-link">
            <i class="fa fa-link"></i>
        </button>
        <button :class="isBlockquoteActive">
            <i class="fa fa-quote"></i>
        </button>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: "comment-toolbar",
  props: {
    formats: {
      type: Object,
      required: false
    }
  },
  computed: {
    isBoldActive() {
      return ["format format-bold", { selected: this.formats.b }];
    },
    isItalicActive() {
      return ["format format-italic", { selected: this.formats.i }];
    },
    isUnderlineActive() {
      return ["format format-underline", { selected: this.formats.u }];
    },
    isBlockquoteActive() {
      return [
        "format format-blockquote",
        { selected: this.formats.blockquote }
      ];
    }
  }
};
</script>
