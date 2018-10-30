<template>
<div class="wrapper" :style="isTransitioning">
    <form>
        <div class="question" :id="`${element.type}_${parent}`" v-for="(element, parent) in elements" :key="parent">
            <span class="delete" @click.prevent.stop="$emit('removeElement', parent)"></span>
            <div class="columns is-multiline">
                <div class="column is-12">
                    <div class="field">
                        <label class="label" for="">Question:</label>
                        <div class="control">
                            <textarea class="textarea composer-textarea" cols="30" rows="2" v-model="element.question"></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select class="composer-select" :name="`select_${parent}`" @change="$emit('updateElement', { parent, value: $event.target.value })">
                                    <option :value="o" v-for="(opt, o) in selectOptions" :key="o" :selected="opt.type === element.type">
                                        {{opt.type.charAt(0).toUpperCase() + opt.type.slice(1)}}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-12" style="padding: 0 1rem; margin-bottom: 1.5rem" v-if="!element.text_field">
                    <div class="subhead">
                        <div class="left">
                            <h6 class="subtitle is-6">Sub Elements</h6>
                        </div>
                        <div class="right">
                            <button class="button is-info is-small" @click.prevent.stop="$emit('addSubElement', parent)">
                                <span>Add Sub Element</span>
                            </button>
                        </div>
                    </div>
                    <div class="sub-elements">
                        <draggable :list="element.subElements">
                            <div class="field is-horizontal" :id="`parent_${parent}_${child}`" v-for="(subElement, child) in element.subElements" :key="child" v-if="element.type === 'select'">
                                <div class="field-label">
                                    <label class="label" for="">Title/Value:</label>
                                </div>
                                <div class="field-body">
                                    <div class="field is-grouped">
                                        <div class="control is-expanded">
                                            <input class="composer-input input" placeholder="Insert field title.." type="text" v-model="subElement.title">
                                        </div>
                                        <div class="control" v-if="subElement.type === 'text_num'">
                                            <input class="composer-input input" placeholder="Insert value..." type="text" v-model="subElement.value">
                                        </div>
                                        <div class="control" v-else>
                                            <div class="select">
                                                <select class="composer-select" :name="`select_${parent}_${child}`" v-model="subElement.value">
                                                    <option value="true">
                                                        Default: True
                                                    </option>
                                                    <option value="false">
                                                        Default: False
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="control">
                                            <div class="select">
                                                <select class="composer-select" :name="`select_${parent}_${child}`" v-model="subElement.type">
                                                    <option value="text_num">
                                                        Text/Num
                                                    </option>
                                                    <option value="boolean">
                                                        Boolean
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="control">
                                            <button class="button is-danger" @click.prevent.stop="$emit('removeSubElement', { parent, child })">
                                                <i class="fa fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
    
    
    
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "recruitment-application-template-editor",
  components: { draggable },
  props: {
    elements: {
      type: Array,
      required: true
    },
    overflow: Boolean
  },
  computed: {
    selectOptions() {
      return this.$store.getters["recruitment/selectOptions"];
    },
    isTransitioning() {
      return this.overflow? "overflow: hidden" : null;
    }
  }
};
</script>
