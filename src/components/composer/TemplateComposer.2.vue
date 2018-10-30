<template>
 <div class="composer" ref="create" v-show="isActive">
        <div class="composer-container" :style="hasOverflow">
            <div class="composer-head is-fixed">
                <div class="level">
                    <div class="level-left">
                        <h4 class="subtitle is-4" @click="onTitleEdit" v-if="!editTitle">{{hasTitle}}</h4>
                        <input type="text" class="input" placeholder="Create Application..." v-model="title" @keyup.enter="editTitle = false" @blur="editTitle = false" v-else>
                    </div>
                    <div class="level-right">
                        <div :class="dropdownClasses" v-if="hasControls">
                            <div class="dropdown-toggle">
                                <button class="button is-info is-small-tablet is-small-mobile" :disabled="isPreview" @click.stop="dropdown = !dropdown">
                                    <i class="fa fa-plus"></i>
                                    <span>Add Element</span>
                                </button>
                            </div>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <a href="" class="dropdown-item" @click.prevent.stop="addElement(index)" v-for="(option, index) in selectOptions" :key="index">
                                        {{option.name.charAt(0).toUpperCase() + option.type.slice(1)}}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button class="button is-danger is-small-tablet is-small-mobile" @click.stop="onClose">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="controls" v-if="hasControls">
                    <div class="right">
                      <ul>
                        <li :class="editor" :style="isTransitioningToPreview" @click.stop="switchToEditor">
                            <a>Editor</a>
                        </li>
                        <li :class="preview" :style="isTransitionToEditor" @click.stop="switchToPreview">
                            <a>Preview</a>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
            <transition 
              :enter-active-class="slideEnter" 
              :leave-active-class="slideLeave"
              @before-enter="before"
              @before-leave="before"
              @after-enter="after"
              @after-leave="after">
              <component :is="selected" 
                :elements="fields"
                @removeElement="removeElement"
                @updateElement="updateElement"
                @addSubElement="addSubElement"
                @removeSubElement="removeSubElement"/>
            </transition>
            <div class="composer-footer is-fixed">
                <button class="button is-fullwidth is-info" :disabled="fields && !fields.length" @click.stop="saveTemplate">
                   Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from "./Editor";
import Preview from "./Preview";
import nanoid from "nanoid";
export default {
  props: {
    isActive: { type: Boolean, required: true },
    editable: Object
  },

  components: { appEditor: Editor, appPreview: Preview },

  data() {
    return {
      elements: [],
      dropdown: false,
      isPreview: false,
      overflow: false,
      editTitle: false,
      title: ""
    };
  },

  beforeDestroy() {
    this.$emit("update:isActive", false);
  },

  watch: {
    isActive(isActive) {
      document.documentElement.style = isActive ? "overflow-y: hidden;" : null;
    },
    editable(isEditable) {
      if (isEditable) {
        this.title = this.editable.title;
      } else {
        this.title = "Create Application";
      }
    }
  },

  computed: {
    fields: {
      get() {
        return this.editable && this.editable.fields.length
          ? this.editable.fields
          : this.elements;
      },
      set(val) {
        const fields =
          this.editable && this.editable.fields.length
            ? this.editable.fields
            : this.elements;

        fields.push(val);
      }
    },
    modalOverlay() {
      return ["is-overlay", { show: this.isActive }];
    },
    dropdownClasses() {
      return ["dropdown", { "is-active": this.dropdown }];
    },
    selected() {
      // return this.isPreview ? "app-preview" : "app-editor";
      //if we're a super user give us the privilage of switching between the template editor and the preview.
      //else we're a standard user and can only view the preview.
      return this.isSuperUser
        ? this.isPreview
          ? "app-preview"
          : "app-editor"
        : "app-preview";
    },
    selectOptions() {
      return this.$store.getters["recruitment/selectOptions"];
    },
    slideEnter() {
      return this.isPreview ? "slide-in-left" : "slide-in-right";
    },
    slideLeave() {
      return this.isPreview ? "slide-out-left" : "slide-out-right";
    },
    hasOverflow() {
      return { overflow: this.overflow ? "hidden" : null };
    },
    hasControls() {
      return this.isSuperUser;
    },
    hasTitle() {
      return this.title ? this.title : "Create Application";
    },
    isTransitioningToPreview() {
      return { opacity: this.isPreview && this.overflow ? 0.5 : null };
    },
    isTransitionToEditor() {
      return { opacity: !this.isPreview && this.overflow ? 0.5 : null };
    },
    preview() {
      return { active: this.isPreview };
    },
    editor() {
      return { active: !this.isPreview };
    },
    isSuperUser() {
      return this.$auth.user().is_admin || this.$auth.user().is_curator;
    },
    applicantAnswers() {
      return this.fields.map(field => {
        return field.answer;
      });
    }
  },

  methods: {
    onTitleEdit(evt) {
      this.editTitle = true;
      this.$nextTick(() => {
        document.querySelector(".top > .left > .input").focus();
      });
    },
    switchToEditor() {
      if (this.overflow) return;
      this.isPreview = false;
    },

    switchToPreview() {
      if (this.overflow) return;
      this.isPreview = true;
    },

    before() {
      this.overflow = true;
    },

    after() {
      this.overflow = false;
    },

    onClose() {
      if (this.editable) {
        this.$emit("update:editable", null);
      }
      this.$emit("update:isActive", false);
    },

    addElement(index) {
      const selected = this.selectOptions;
      const qid = Math.round()
        .toString(36)
        .substr(2);
      this.fields = {
        qid,
        ...selected[index],
        question: "",
        answer: { aid: qid, value: "" },
        subElements: []
      };
      this.dropdown = false;

      const id = `${selected[index].type}_${this.fields.length - 1}`;

      this.scrollToElement(id);
    },

    scrollToElement(id, opts = {}) {
      this.$nextTick(() => {
        document.getElementById(id).scrollIntoView(opts);
      });
    },

    updateElement({ parent, value }) {
      const el =
        this.editable && this.editable.fields.length
          ? this.editable.fields[parent]
          : this.elements[parent];
      const { type, text_field } = this.selectOptions[parseInt(value, 10)];
      el.type = type;
      el.text_field = text_field;
    },

    addSubElement(parentIndex) {
      const sub =
        this.editable && this.editable.fields.length
          ? this.editable.fields[parentIndex].subElements
          : this.elements[parentIndex].subElements;

      sub.push({
        type: "text_num",
        title: "",
        value: ""
      });

      const subElementIndex = this.fields[parentIndex].subElements.length - 1;
      const id = `parent_${parentIndex}_${subElementIndex}`;

      this.scrollToElement(id);
    },

    removeElement(index) {
      const fields =
        this.editable && this.editable.fields.length
          ? this.editable.fields
          : this.elements;

      fields.splice(index, 1);
    },

    removeSubElement({ parent, child }) {
      const sub =
        this.editable && this.editable.fields.length
          ? this.editable.fields[parent].subElements
          : this.elements[parent].subElements;

      sub.splice(child, 1);
    },

    async saveTemplate() {
      const { title } = this;
      const author_id = this.$auth.user().id;
      const verb = this.isSuperUser ? (this.editable ? "put" : "post") : "post";
      const url = this.isSuperUser
        ? this.editable
          ? `/recruitment/admin/template/${this.editable.id}`
          : "/recruitment/admin/template"
        : `/recruitment/apply/${this.editable.id}`;

      try {
        await this.$http[verb](url, {
          title,
          author_id,
          fields: this.isSuperUser ? this.fields : this.applicantAnswers
        });
        this.$toasted.show("Saved.", {
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
  animation: slideInLeft 0.25s ease;
}

.slide-in-right {
  animation: slideInRight 0.25s ease;
}

@keyframes slideLeftOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
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
    transform: translateX(0);
  }
}
</style>
