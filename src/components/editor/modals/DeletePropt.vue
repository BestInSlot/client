<template>
  <div :class="['modal', { 'is-active': modalType}]">
      <div class="modal-card">
          <header class="modal-card-head">
              <p class="modal-card-title">Delete</p>
              <button class="delete"></button>
          </header>
          <section class="modal-card-body">
              <div class="columns is-vcentered">
                <div class="column is-narrow">
                    <i class="fa fa-exclamation-triangle fa-3x"></i>
                </div>
                <div class="column">
                    Are you sure you wish to delete this?
                </div>
            </div>
          </section>
          <footer class="modal-card-foot">
              <button class="button is-primary" @click="$store.dispatch('deletePost')">Proceed</button>
              <button class="button" @click="$emit('update:modalType', '')">Cancel</button>
          </footer>
      </div>
  </div>
</template>

<script>
export default {
  name: "delete-prompt",
  props: ["modalType"]
};
</script>

