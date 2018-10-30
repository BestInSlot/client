<template>
    <div class="comment-submit">
        <button class="button is-primary is-small" @click.prevent="$emit('commentSubmit')" :disabled="isDisabled">
            COMMENT
        </button>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isDisabled: false
    };
  },

  methods: {
    toggle(val) {
      this.isDisabled = val;
      return this;
    }
  }
};
</script>
