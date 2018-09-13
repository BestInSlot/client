<template>
    <div class="wrapper" @click.stop="selector = 0">
      <div id="questions">
        <draggable :list="elements">
          <div class="question" v-for="(element, parent) in elements" :key="parent">
              <div class="content">
                  <em>#{{parent+1}} {{element.question}}:</em>
              </div>
              <form-element :type="element.type" :selectOptions="element.subElements" :selector="selector" :selectorId="parent+1" @toggle="toggle"/>
          </div>
        </draggable>
        
      </div>
    </div>
</template>

<script>
import FormElement from "./FormElement.vue";
import draggable from "vuedraggable";
export default {
  name: "recruitment-application-template-preview",
  components: { FormElement, draggable },
  props: {
    elements: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: "preview"
    }
  },

  data() {
    return {
      selector: 0
    };
  },

  methods: {
    toggle(id) {
      if (id === this.selector) {
        this.selector = 0;
        return;
      }

      this.selector = id;
    }
  }
};
</script>