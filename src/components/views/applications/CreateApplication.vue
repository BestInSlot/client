<template>
 <div id="create-application" ref="create" v-show="isActive">
        <div class="container">
            <div class="top is-fixed">
                <div class="controls">
                    <div class="left">
                        <h4 class="subtitle is-4">Create Application</h4>
                    </div>
                    <div class="right">
                        <div :class="dropdownClasses">
                            <div class="dropdown-toggle">
                                <button class="button is-info is-small-tablet is-small-mobile" :disabled="isPreview" @click.stop="dropdown = !dropdown">
                                    <i class="fa fa-plus"></i>
                                    <span>Add Element</span>
                                </button>
                            </div>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <a href="" class="dropdown-item" @click.prevent.stop="addElement(index)" v-for="(option, index) in selectOptions" :key="index">
                                        {{option.type.charAt(0).toUpperCase() + option.type.slice(1)}}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button class="button is-danger is-small-tablet is-small-mobile" @click.stop="$emit('update:isActive', false)">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="sub-controls">
                    <ul>
                        <li :class="{ 'active': !isPreview }" @click.stop="isPreview = false">
                            <a>Editor</a>
                        </li>
                        <li :class="{ 'active': isPreview }" @click.stop="isPreview = true">
                            <a>Preview</a>
                        </li>
                    </ul>
                </div>
            </div>
            <transition 
              :enter-active-class="slideEnter" 
              :leave-active-class="slideLeave">
              <component :is="selected" 
                :elements="elements"
                @removeElement="removeElement"
                @updateElement="updateElement"
                @addSubElement="addSubElement"
                @removeSubElement="removeSubElement"/>
            </transition>
            <div class="footer is-fixed">
                <button class="button is-fullwidth is-info" :disabled="!elements.length" @click.stop="saveTemplate">
                   Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from "./Editor";
import Preview from "./Preview";

export default {
  props: {
    isActive: { type: Boolean, required: true }
  },

  components: { appEditor: Editor, appPreview: Preview },

  data() {
    return {
      elements: [],
      dropdown: false,
      isPreview: false,
    };
  },

  watch: {
    isActive(isActive) {
      document.documentElement.style = isActive ? "overflow-y: hidden;" : null;
    }
  },

  computed: {
    modalOverlay() {
      return ["is-overlay", { show: this.isActive }];
    },

    dropdownClasses() {
      return ["dropdown", { "is-active": this.dropdown }];
    },
    selected() {
      return this.isPreview ? "app-preview" : "app-editor";
    },
    selectOptions() {
      return this.$store.getters["recruitment/selectOptions"];
    },
   
    slideEnter() {
      return this.isPreview? "slide-in-left" : "slide-in-right";
    },
    slideLeave() {
      return this.isPreview? "slide-out-left" : "slide-out-right";
    },
    hasOverflow() {
      return { 'overflow': this.overflow? "hidden" : null };
    }
  },

  methods: {
    addElement(index) {
      const selected = this.selectOptions;
      this.elements.push({
        ...selected[index],
        question: "",
        subElements: []
      });
      this.dropdown = false;

      const id = `${selected[index].type}_${this.elements.length - 1}`;

      this.scrollToElement(id);
    },

    scrollToElement(id, opts = {}) {
      this.$nextTick(() => {
        document.getElementById(id).scrollIntoView(opts);
      });
    },

    updateElement({ parent, value }) {
      const el = this.elements[parent];
      const { type, text_field } = this.selectOptions[parseInt(value, 10)];
      el.type = type;
      el.text_field = text_field;
    },

    addSubElement(parentIndex) {
      const subElements = this.elements[parentIndex].subElements;
      subElements.push({
        type: "text_num",
        title: "",
        value: ""
      });

      const id = `parent_${parentIndex}_${subElements.length - 1}`;

      this.scrollToElement(id);
    },

    removeElement(index) {
      this.elements.splice(index, 1);
    },

    removeSubElement({ parent, child }) {
      const p = this.elements[parent];
      p.subElements.splice(child, 1);
    },

    async saveTemplate() {
      const fields = this.elements;
      const creator_id = this.$auth.user().id;
      console.log(this.$auth.user());
      try {
        await this.$http.post("/users/admin/recruitment", { creator_id, fields });
        this.$toasted.show("Recruitment Application Saved.", {
          theme: "primary",
          duration: 3000,
          icon: "check",
          className: ["bis-notification", "success"]
        });
      } catch (err) {
        this.$toasted.show(
          err.response
            ? `${err.response.status}: ${err.response.data.message}`
            : err.response.data,
          {
            theme: "primary",
            duration: 3000,
            icon: "exclamantion-triangle",
            className: ["bis-notification", "danger"]
          }
        );
      }
    }
  }
};
</script>

<style>

.slide-out-left {
  animation: slideLeftOut 0.25s ease;
}
.slide-out-right {
  animation: slideRightOut 0.25s ease;
}

.slide-in-left {
  animation: slideInLeft 0.255s ease;
}

.slide-in-right {
  animation: slideInRight 0.25s ease;
}

@keyframes slideLeftOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translate(-100%);
  }
}

@keyframes slideRightOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0)
  }
}
</style>
