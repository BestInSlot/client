<template>
<div class="field">
    <div class="control has-icons-right">
        <label for="">{{label}}</label>
        <input 
            v-validate="validators"
            :class="inputClasses" 
            :type="type"
            :name="id"
            :id="id"
            :disabled="disable"
            :data-vv-delay="delay"
            required="required" 
            :value="value"
            @input="$emit('input', $event.target.value)">
            <span class="icon is-small is-right" v-if="!value || errors.has(id)">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </span>
            <span class="icon is-small is-right" v-else>
                <i class="fa fa-check" aria-hidden="true"></i>
            </span>
            
    </div>
    <p class="error" v-show="errors.has(id)">{{errors.first(id)}}</p>
    <slot></slot>
</div>  
</template>

<script>
export default {
  name: "modal-input",
  inject: ["$validator"],
  props: {
    validators: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: "text"
    },
    delay: {
      type: Number,
      default: 0
    },

    disable: Boolean,
    id: String,
    value: String,
    label: String
  },

  computed: {
    inputClasses() {
      return [
        "input",
        {
          "is-success": !this.errors.has(this.id) && this.value,
          "is-danger": this.errors.has(this.id) || !this.value
        }
      ];
    }
  }
};
</script>


<style lang="scss">
.bis {
  .error {
    font-size: 12px;
    position: absolute;
    color: #cacaca;
  }
  label {
    position: absolute;
    pointer-events: none;
    color: #cacaca;
    background: transparent;
    font-size: 9pt;
    top: -9px;
    left: 5px;
    z-index: 1000;
    font-weight: bold;
    padding: 0 0.3125rem;
    &:before,
    :after {
      position: absolute;

      display: block;
      width: 100%;
      height: 50%;
      padding: 0.5rem 0.35rem;
      z-index: -1;
    }
  }
  label:before {
    content: "";
    background-color: #272727;
    top: 0;
    left: 0;
  }
  label:after {
    content: "";
    background-color: #333;
    display: block;
    width: 100%;
    height: 10px;
    position: absolute;
    bottom: -1px;
    left: 0;
    z-index: -1;
  }
  .control {
    position: relative;

    .input {
      background-color: #333;
      border: 2px solid #555;
      color: #cacaca;
      box-shadow: 1px 1px 0 rgba(55, 55, 55, 0.5); // padding: 1px 5px 0;
      padding-left: 0.55rem;
      &:focus {
        outline: none;
        border-color: #3498db !important;
      }
      &.is-danger {
        border-color: #ff6961 !important;
      }
    }
  }
}
</style>


