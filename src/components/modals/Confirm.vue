<template>
    <div :class="rootClasses">
      <div :class="overlayClasses"></div>
      <div class="modal-card">
          <header class="modal-card-head">
              <p class="modal-card-title">Confirm Change</p>
              <button class="delete" @click="$emit('update:isActive', false)"></button>
          </header>
          <section class="modal-card-body">
              <div class="columns is-vcentered">
                <div class="column is-narrow has-text-centered">
                    <i class="fa fa-exclamation-triangle fa-3x"></i>
                </div>
                <div class="column">
                    <div class="content">
                        <p>Any alterations to your username or email will require a relog.</p>
                        <p class="has-text-centered">Do you wish to continue?</p>
                    </div>
                </div>
            </div>
          </section>
          <footer class="modal-card-foot foot-end">
              <button class="button is-danger" @click="$emit('confirm')">Confirm</button>
              <button class="button is-default" @click="$emit('update:modalType', false)">Cancel</button>
          </footer>
      </div>
  </div>
</template>


<script>
export default {
 name: 'ConfirmModal',
 props: {
     isActive: {
         type: Boolean,
     }
 },
 computed: {
     rootClasses() {
         return ['modal', { 'is-active': this.isActive }]
     },
     overlayClasses() {
         return ['modal-overlay', { 'is-active': this.isActive }]
     }
 }
}
</script>


<style>
.foot-end {
    justify-content: flex-end;
}
</style>
