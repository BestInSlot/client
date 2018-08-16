<template>
  <div class="slide">
    <img :src="slide.img" alt="" style="width: 100%; height: 100%;">
    <div class="desc">
    <h4>{{slide.title}}</h4>
    <p>{{body}}</p>
    </div>  
  </div>
</template>

<script>
import truncate from 'lodash/truncate';

export default {
  props: {
    slide: {
      type: Object,
      required: true
    }
  },

  methods: {
    truncate(str, numOfChars, useWordBoundary) {
      if (str.length <= numOfChars) {
        return str;
      }
      let sub = str.substr(0, numOfChars - 1);
      return (
        (useWordBoundary ? sub.substr(0, sub.lastIndexOf(" ")) : sub) + "..."
      );
    }
  },

  computed: {
    body() {
      // return this.truncate(this.slide.desc, 250, true);
      return truncate(this.slide.body, {
        length: 250,
        separator: /,? +/
      })
    }
  }
};
</script>

<style lang="scss">
.desc {
  position: absolute;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.5);
  max-width: 95%;
  bottom: 25px;
  color: #f1f1f1;
  padding: 0.55rem;
  text-align: left;
  font-size: 11pt;
  h4,
  p {
    margin: 0;
  }
}
</style>
