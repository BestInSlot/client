<template>
<div class="field">
    <div class="control has-icons-right">
        <label for="">{{name}}</label>
        <input :class="inputClasses" :type="password? 'password' : 'text'"
            v-validate="{
            email,
            required,
            regex,
            numeric,
            alpha,
            alpha_num: alphaNum,
            alpha_dash: alphaDash,
            alpha_spaces: alphaSpaces,
            between,
            min,
            max,
            confirmed
            }" 
            :name="id" 
            :id="id"
            :disabled="disable"
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
  name: 'modal-input',
  inject: ['$validator'],
  props: {
    name: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    regex: {
      type: RegExp
    },
    numeric: {
      type: Boolean,
      default: false
    },
    alpha: {
      type: Boolean,
      default: false
    },
    alphaNum: {
      type: Boolean,
      default: false
    },
    alphaDash: {
      type: Boolean,
      default: false
    },
    alphaSpaces: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: false
    },
    between: {
      type: [Array, Boolean],
      default: false
    },
    min: {
      type: [Number, Boolean],
      default: false
    },
    max: {
      type: [Number, Boolean],
      default: false
    },
    confirmed: {
      type: [String, Boolean],
      default: false
    },
    
    password: Boolean,
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
    }
  }



};
</script>


<style lang="scss">
.bis-modal {
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
      &:before, :after {
        position: absolute;
        
        display: block;
        width: 100%;
        height: 50%;
        padding: 0.50rem 0.35rem;
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


