<template>
  <section class="section" style="padding: 3rem 0 1.5rem;">
    <div id="featured">
      <div class="featured-container" :style="{ height: `${height}px`}">
        <transition-group  tag="div" class="featured-slides" name="fade">
          <slide v-for="(slide, i) in slides" :key="i" 
          :slide="slide"
          @mouseover.native="pauseTimer" 
          @mouseout.native="unPauseTimer" 
          v-show="currentSlideIndex === i"></slide>
        </transition-group>
        <div class="slider-progress-bar">
          <div class="bar" :style="{ width: progress + '%'}"></div>
        </div>
      </div>
      <div class="slide-controls">
          <button class="prev" :disabled="isFirstSlide" @click="prev">&#60;</button>
          <button class="next" :disabled="isLastSlide" @click="next">&#62;</button>
          <div class="pips">
            <button class="pip" 
            v-for="(n, i) in slides" 
            :key="i" :class="{ active: i === currentSlideIndex }"
            :disabled="i === currentSlideIndex"
            @click="goTo(i)"></button>
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import Slide from "./Slide";
export default {
  name: "carousel",
  components: { Slide },
  props: {
    height: {
      type: Number,
      default: 400
    },
    duration: {
      type: Number,
      default: 3000
    },
    slides: {
      type: Array,
      default: () => []
    },
    speed: {
      type: Number,
      default: 600
    },
    auto: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      currentSlideIndex: 0,
      progress: 0,
      isPaused: false,
      timer: null
    };
  },

  mounted() {
    this.startTimer();
  },

  beforeDestroy() {
    this.isPaused = false;
    this.clearTimer();
  },

  computed: {
    isFirstSlide() {
      return this.currentSlideIndex === 0;
    },
    isLastSlide() {
      return this.currentSlideIndex === this.slides.length - 1;
    }
  },

  watch: {
    currentSlideIndex(n) {
      this.move(n);
    }
  },

  methods: {
    startTimer() {
      if (this.auto) {
        if (!this.timer) {
          this.timer = setInterval(() => {
            // if (this.isPaused) return;
            this.progress++;
            if (this.progress > 100) {
              if (!this.isLastSlide) {
                this.currentSlideIndex++;
              } else {
                this.currentSlideIndex = 0;
              }
            }
          }, this.duration / 100);
        }
      }
    },

    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
      
      if (!this.isPaused) {
        this.progress = 0;
      }
    },

    resetTimer() {
      this.clearTimer();
      const timeout = setTimeout(() => {
        this.$nextTick(() => {
          this.startTimer();
          clearTimeout(timeout);
        });
      }, this.speed);
    },

    pauseTimer() {
      this.isPaused = true;
      
      if (this.timer && this.auto) {
          this.clearTimer();
      }
    },

    unPauseTimer() {
      this.isPaused = false;
      
      if (!this.timer && this.auto) {
          this.startTimer();
      }
    },

    next() {
      if (this.isLastSlide) return;
      this.currentSlideIndex++;
    },

    prev() {
      if (this.isFirstSlide) return;
      this.currentSlideIndex--;
    },

    goTo(n) {
        if (this.currentSlideIndex === n) return; 
        this.currentSlideIndex = n;
    },

    move() {
      if (this.timer) {
        this.resetTimer();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#featured {
  position: relative;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
  &:hover {
    .prev,
    .next {
      opacity: 1;
    }
  }
  .prev,
  .next {
    position: absolute;
    height: 90px;
    width: 45px;
    background-color: rgba(0, 0, 0, 0.3);
    top: 35%;
    border: none;
    font-size: 175%;
    font-weight: 700;
    color: #cacaca;
    opacity: 0;
    transition: opacity ease-in-out 200ms;
    &:focus {
      outline: none;
      border: none;
    }
  }
  .prev {
    left: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .next {
    right: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .pips {
    position: absolute;
    bottom: -15px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    .pip {
      display: inline-block;
      width: 20px;
      padding: 5px;
      background-color: #555;
      border: 0;
      border-radius: 1px;
      margin-right: 2px;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        background-color: #3498db;
      }
    }
  }
  .featured-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    .featured-slides {
      position: relative;
      display: flex;
      flex: 1;
      .slide {
        position: absolute;
        width: 100%;
        height: 100%;
        img {
            width: auto;
            height: auto;
        }
      }
    }
    .slider-progress-bar {
      width: 100%;
      height: 3px;
      background-color: #555;
      .bar {
        height: inherit;
        background-color: #3498db;
      }
    }
  }
}

.fade-enter-active {
  animation: fadeIn 600ms ease-in forwards;
}

.fade-leave-to {
  animation: fadeOut 600ms ease-in forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
