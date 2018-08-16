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
              <input type="text" class="editor-input">
            </div>
            <editor v-model="content"></editor>
          </div>
          <div class="preview-wrapper"></div>
        </div>
      </div>
      <div class="bottom-controls">
        <div class="left-controls">
          <button class="control-button is-primary">Create Post</button>
          <button class="control-button has-outline" @click.prevent="initCancelPrompt">Cancel</button>
        </div>
        <div class="right-controls">
          <a class="show-hide" @click.prevent="togglePreview">{{showHide}}</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Editor from "./Editor";
import CancelPrompt from "./modals/CancelPrompt";
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
      showPreview: true,
      hidden: false,
      sending: false,
      isDragging: false,
      draft: null,
      modalType: '',
      content: "Insert plain text or html here..."
    };
  },
  computed: {
    rootClasses() {
      return { draft: this.hidden, "hide-preview": !this.showPreview };
    },
    showHide() {
      return this.showPreview ? "<< hide preview" : "show preview >>";
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

  methods: {
    init(evt) {
      console.log("attaching event listeners.");
      this.startingHeight = this.height;
      this.isDragging = true;
      if (evt instanceof MouseEvent) {
        this.startingPointY = evt.clientY;
        window.addEventListener("mousemove", (evt) => { 
          this.resize(evt, evt.clientY); 
        }, false);
        window.addEventListener("mouseup", this.onEnd, false);
        
      } else {
         this.startingPointY = evt.targetTouches[0].clientY;        
         window.addEventListener("touchmove", (evt) => {
           this.resize(evt, evt.targetTouches[0].clientY);
         }, false);
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
    togglePreview() {
      this.showPreview = !this.showPreview;
    },
    initCancelPrompt() {
      if (this.content) {
        this.modalType = 'cancel-prompt';
      }
    },
    closeEditor() {
      this.$store.dispatch('toggleEditor', false);
      this.modalType = '';
      setTimeout(() => {
        this.$nextTick(() => {
          this.hidden = false;
          this.showPreview = true;
          this.content = "Insert plain text or html here...";
        })
      }, 250);
    }
  }
};
</script>



<style lang="scss" scoped>
#editor-container {
  display: flex;
  background-color: #181a1e;
  flex-direction: column;
  max-width: 1475px;
  min-height: 230px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  z-index: 100;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);

  #resizer {
    padding: 4px 0;
    cursor: row-resize;
    background-color: #0a0b0c;
    &:before {
        content: '';
        display: block;
        width: 27px;
        margin: auto;
        border-top: 3px double #fff;
    }
  }

  &.hide-preview {
    max-width: calc(1475px / 2) !important;
    .preview-wrapper {
      display: none !important;
    }
  }

  .top-controls,
  .bottom-controls,
  .editor-area {
    padding-right: 0.75rem;
    padding-left: 0.75rem;
  }

  .top-controls,
  .bottom-controls {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;

    .left-controls {
      align-items: center;
    }

    .right-controls {
      flex-direction: row-reverse;
      .show-hide {
        text-decoration: none;
        color: darkgrey;
        cursor: pointer;
      }
    }

    .left-controls,
    .right-controls {
      flex-basis: 50%;
      display: flex;
    }

    .control-button {
      border: 0;
      padding: 0.55rem;
      margin: 0 5px;
      &:last-child {
        margin: 0;
      }
      &:focus {
        border: none;
        outline: none;
      }
      &.is-primary {
        background-color: lightgrey;
      }
      &.has-outline {
        padding: 0.49rem;
        background-color: transparent;
        border: 1px solid lightgrey;
        color: #cacaca;
      }
    }
  }

  .top-controls {
    .minimize {
      color: #cacaca;
    }
    .right-controls {
      flex: 1;
    }
  }

  button {
    border: 0;
    background: transparent;
    cursor: pointer;
    &:focus {
      border: none;
      outline: none;
    }
  }
  .editor-modals {
    position: relative;
    .modal-background {
      position: fixed;
    }
  }
  .editor-area {
    margin: 0 auto;
    padding: 5px 15px;
    height: calc(100% - 11px);
    width: 100%;
    display: flex;
    flex-direction: column;
    &.hidden {
      display: none;
    }
    .editor-wrappers {
      display: flex;
      flex-grow: 1;
      max-width: 100%;
      .editor-wrapper {
        display: flex;
        flex-direction: column;
        position: relative;
        flex: 1;
      }
      .preview-wrapper {
        overflow: auto;
        cursor: default;
        max-width: 49%;
        margin-left: 1%;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    }
  }
}

.draft {
  height: 50px !important;
  min-height: 50px !important;
  background-color: #0b0b0b;
  cursor: pointer;
  .draft-controls {
      display: flex;
      align-items: center;
      padding: 1rem;
      color: #cacaca;
      .draft-text {
        text-align: left;
        flex: 1;
      }
      .restore {
        width: 100%;
        height: 100%;
      }
  }
  
  .top-controls,
  .bottom-controls {
    display: none !important;
  }
}

.editor-input-wrapper {
  margin-bottom: 0.75rem;
}
.editor-input {
  background-color: #1f2226;
  color: #cacaca;
  padding: 0.5rem 0.25rem;
  border: none;
  flex: 1;
  width: 100%;
  &:focus {
    border: none;
    outline: none;
  }
}

@import '../../scss/animations/slide-from-bottom';
</style>
