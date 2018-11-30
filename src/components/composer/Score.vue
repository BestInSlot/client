<template>
    <div class="score">
        <span>Votes:</span>
        <span :class="upClass" @click="upvote">&#x25B2;</span>
        <span :class="classes">{{modifiedScore}}</span>
        <span :class="downClass" @click="downvote">&#x25BC;</span>
    </div>
</template>

<script>
export default {
  name: "score",
  props: {
    score: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      vote: 0
    };
  },

  computed: {
    modifiedScore() {
      return this.vote + this.score;
    },
    isUpvoted() {
      return this.vote > 0;
    },
    isDownvoted() {
      return this.vote < 0;
    },
    upClass() {
      return ["up", { positive: this.isUpvoted }];
    },
    downClass() {
      return ["down", { negative: this.isDownvoted }];
    },
    classes() {
      return { positive: this.isUpvoted, negative: this.isDownvoted };
    }
  },

  methods: {
    upvote() {
      if (this.isUpvoted) return;
      this.vote++;
    },
    downvote() {
      if (this.isDownvoted) return;
      this.vote--;
    }
  }
};
</script>

<style lang="scss">
.score {
  color: #fff;
  span {
    padding: 1rem;
  }
  .up,
  .down {
    border: 3px solid #fff;
    border-radius: 4px;
    padding: 0.15rem;
    cursor: pointer;
  }
  .up {
    &:hover {
      color: lightgreen;
    }
  }
  .down {
    &:hover {
      color: lightcoral;
    }
  }
  &.positive {
    border-color: lightgreen;
    color: lightgreen;
  }
  &.negative {
    border-color: lightcoral;
    color: lightcoral;
  }
}
</style>
