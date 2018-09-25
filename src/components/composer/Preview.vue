<template >
    <div class="wrapper" @click.stop="selector = 0" >
      <div id="questions" v-if="isSuperUser">
        <draggable :list="elements" :options="options">
          <div class="question" v-for="(element, parent) in elements" :key="parent">
              <div class="content">
                  <strong>QUESTION {{parent+1}}</strong>
                  <p>{{element.question}}</p>
              </div>
              <form-element :type="element.type" :selectOptions="element.subElements" :selector="selector" :selectorId="parent+1" @toggle="toggle"/>
          </div>
        </draggable>
      </div>
      <div id="questions" v-else>
        <div class="question" v-for="(element, parent) in elements" :key="parent">
            <div class="content">
                <strong>QUESTION #{{parent+1}}</strong>
                <p>{{element.question}}</p>
            </div>
            <form-element v-model="element.answer" :type="element.type" :selectOptions="element.subElements" :selector="selector" :selectorId="parent+1" @toggle="toggle"/>
        </div>
      </div>
    </div>
</template>



<script>
import FormElement from "./FormElement.vue";
import draggable from "vuedraggable";
export default {
  name: "RecruitmentTemplatePreview",
  components: { FormElement, draggable },
  props: {
    elements: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      selector: 0,
      options: {
        sort: true,
        ghostClass: "ghost",
        chosenClass: "chosen"
      }
    };
  },

  computed: {
    isSuperUser() {
      return this.$auth.user().is_admin || this.$auth.user().is_curator;
    }
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

<style>
.ghost {
  opacity: 0.5;
}
.chosen {
  opacity: 0.5;
}
</style>
