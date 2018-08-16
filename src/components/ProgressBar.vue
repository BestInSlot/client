<template>
  <div class="progress" :style="{ 
      width: percent+'%',
      height: height,
      'background-color': canSuccess? color : failedColor,
      'opacity': show ? 1 : 0
      }"></div>
</template>
<script>
export default {
  data() {
      return {
          percent: 0,
          show: false,
          canSuccess: true,
          duration: 3000,
          height: '2px',
          color: '',
          failedColor: '',
          timer: null
      }
  },

  methods: {
      start() {
          this.show = true;
          this.canSuccess = true

          if (this.timer) {
              clearInterval(this.timer);
              this.percent = 0;
          }
          let cut = 10000 / Math.floor(this.duration);
          this.timer = setInterval(() => {
              this.increase(cut * Math.random())
              if (this.percent > 95) {
                  this.finish();
              }
          }, 100)
          return this; 
      },

      increase(num) {
          this.percent = this.percent + Math.floor(num);
          return this;
      },

      decrease(num) {
          this.percent = this.percent - Math.floor(num);
      },

      finish() {
          this.percent = 100;
          this.hide();
          return this
      },
      
      hide() {
          clearInterval(this.timer);
          this.time = null;
          setTimeout(() => {
              this.show = false;
              this.$nextTick(() => {
                  setTimeout(() => {
                      this.percent = 0;
                  }, 200)
              })
          }, 500)
          return this;
      },

      fail() {
          this.canSuccess = false;
          return this;
      }
  }
}
</script>

<style lang="scss">
.progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    width: 0%;
    transition: width 0.2s, opacity 0.4s;
    opacity: 1;
    background-color: #50a4c3;
    z-index: 999999;
}
</style>
