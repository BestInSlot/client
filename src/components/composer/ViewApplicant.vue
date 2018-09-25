<template>
    <div class="wrapper">
        <div id="questions">
            <question
            v-for="(content, index) in records"
            :content="content"
            :selectorId="index+1"  
            :selector.sync="selector" 
            :key="index"/>
        </div>
    </div>
</template>

<script>
import Question from "./Question";
export default {
  components: { Question },
  data() {
    return {
      selector: 0
    };
  },

  computed: {
    records() {
      return this.$store.getters["recruitment/content"];
    }
  }
};
</script>
