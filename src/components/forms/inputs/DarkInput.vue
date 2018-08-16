<template>
    <div class="input-wrapper">
        <input
        class="dark-input" 
        v-validate="validators"
        :ref="attrs.id"         
        :type="attrs.type" 
        :id="attrs.id" 
        :name="attrs.id" 
        :value="value"
        @input="$emit('input', $event.target.value)" 
        required="required">
        <label for="" class="input-label">{{attrs.label}}</label>
        <!-- <span class="input-error" v-if="errors.has(id)">{{errors.first(id)}}</span> -->
        <span class="input-error" v-if="error">{{error}}</span>
    </div>
</template>

<script>
export default {
  $_veeValidate: {
    name() {
      return this.attrs.id;
    },
    value() {
      return this.$refs[this.attrs.id].value;
    }
  },
  props: {
    validators: Object,
    attrs: Object,
    value: String,
    error: String,
  },

  created() {
    console.log(this.$refs);
  }
};
</script>

<style lang="scss">
.input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  background-color: #272727;
  border: 1px solid #0f0f0f;
  box-shadow: inset 1px 1px 5px rgba(55, 55, 55, 0.7),
    inset -1px -1px 5px rgba(55, 55, 55, 0.5), 1px 1px 5px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  .dark-input {
    background: none;
    border: none;
    padding: 1rem 0.5rem 0.5rem;
    display: flex;
    flex: 1;
    color: #cacaca;
    font-size: 16px;
    &:focus {
      outline: none;
      border-color: rgba(52, 152, 219, 1);
    }
  }
  input:focus ~ label,
  input:valid ~ label {
    top: 0;
    font-size: 8pt;
  }
  .input-label {
    position: absolute;
    top: 10px;
    left: 0.5rem;
    font-weight: 700;
    pointer-events: none;
    transition: all 0.2s ease;
    color: #cacaca;
  }
  .input-error {
    position: absolute;
    background-color: #ff6666;
    padding: 0.25rem;
    color: #fff;
    bottom: -30px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    font-size: 9pt;
    &:before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      left: 0;
      right: 0;
      top: -7px;
      margin: 0 auto;
      border-style: solid;
      border-width: 0 10px 10px 10px;
      border-color: transparent transparent #ff6666 transparent;
    }
  }
}
</style>
