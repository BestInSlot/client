<template>
  <div class="text-editor-container">
    <div :id="id" ref="editor"></div>
  </div>
</template>

<script>
import Quill from 'quill';
import {markdown} from 'markdown';
import defaultOptions from './options';

export default {
  name: 'quill-text-editor',
  props: {

    value: String,
    disabled: Boolean,

    id: {
      type: String,
      default () {
        return 'text-editor'
      }
    },
  },

  data() {
    return {
      editor: null,
      defaultOptions
    }
  },

  mounted() {
    this.initalize();
  },

  watch: {
    disabled(newVal, oldVal) {
      if (this.editor) {
        this.editor.enable(!newVal);
      }
    }
  },

  methods: {
    initalize() {
      if (this.$el) {

        const options = Object.assign({}, this.defaultOptions);

        this.editor = new Quill(this.$refs.editor, options);

        if (this.value) {
          this.editor.clipboard.dangerouslyPasteHTML(this.value);
        }

        if (this.disabled) {
          this.editor.enable(false);
        }

        this.editor.on('selection-change', range => {
          if (!range) {
            this.$emit('blur', this.editor);
          } else {
            this.$emit('focus', this.editor);
          }
        })

        this.editor.on('text-change', (delta, oldDelta, source) => {
          let html = this.editor.root.innerHTML;
          const editor = this.editor;
          const text = editor.getText();
          if (html === '<p><br></p>') html = '';
          this.$emit('input', markdown.toHTML(html));
          this.$emit('change', { editor, html, text });
        })
      }


    }
  },


  beforeDestroy() {
    this.editor.off('text-change');
    this.editor.off('selection-change');
    this.editor = null;
  }
}


</script>



<style src="../../../node_modules/quill/dist/quill.snow.css">

</style>
<style lang="scss">
.text-editor-container {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  .ql-toolbar {
    background-color: #0a0a0a !important;
  }
  .ql-container {
    background-color: #0b0b0b !important;
  }
  .ql-snow {
    border: none !important;
  }
}
</style>