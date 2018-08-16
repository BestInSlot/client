<template>
    <div :class="['modal', { 'is-active': modalType}]">
      <div class="modal-card">
          <header class="modal-card-head">
              <p class="modal-card-title">Cancel</p>
              <button class="delete" @click="$emit('update:modalType', '')"></button>
          </header>
          <section class="modal-card-body">
              <div class="columns is-vcentered">
                <div class="column is-narrow has-text-centered">
                    <i class="fa fa-exclamation-triangle fa-3x"></i>
                </div>
                <div class="column">
                    Cancelling will close the editor and any progress will be lost.
                </div>
            </div>
          </section>
          <footer class="modal-card-foot foot-end">
              <button class="button is-primary" @click="$emit('closeEditor')">Proceed</button>
              <button class="button" @click="$emit('update:modalType', '')">Cancel</button>
          </footer>
      </div>
  </div>
</template>


<script>
export default {
 name: 'cancel-prompt',
 props: ['modalType']
}
</script>


<style>
.foot-end {
    justify-content: flex-end;
}
</style>
