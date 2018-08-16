<template>
  <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{formattedLabel}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control has-icons-right">
            <input :class="inputClasses" :type="inputType" v-validate="validators" :name="id" :id="id" :disabled="disable" required="required" :value="value" @input="$emit('input', $event.target.value)">
            <span class="icon is-small is-right" v-if="!value || errors.has(id)">
              <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </span>
            <span class="icon is-small is-right" v-else>
              <i class="fa fa-check" aria-hidden="true"></i>
            </span>
          </div>
          <p v-show="errors.has(id)">{{errors.first(id)}}</p>          
        </div>
        <slot></slot>
      </div>
    </div>
</template>


<script>
'use strict';

export default {
  name: 'horizontal-form-input',
  inject: ['$validator'],

  props: {
    inputType: {
      type: String,
      default: 'text'
    },

    validators: {
      type: Object,
      default () {
        return {};
      },
    },

    label: String,
    disable: Boolean,
    id: String,
    value: String
  },
    

    computed: {
      inputClasses() {
        return ['input', {
          'is-success': !this.errors.has(this.id) && this.value,
          'is-danger': this.errors.has(this.id) || !this.value
        }];
      },

      formattedLabel() {
        const labelToFormat = this.label.charAt(0).toUpperCase() + this.label.slice(1);
        return labelToFormat.replace(/([a-z])([A-Z])/, '$1 $2');
      }
    }
}


</script>

