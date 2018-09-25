<template>
    <div class="wrapper has-padding">
        <div id="pending">
            <span class="subtitle is-4">Pending</span>
            <applicant-item v-for="(application, i) in pending" 
                :created_at="application.created_at" 
                :applicant="application.applicant" 
                :key="i"> 
            </applicant-item>
        </div>
    </div>
</template>


<script>
import ApplicantItem from "./ApplicantItem";
export default {
  components: { ApplicantItem },
  computed: {
    pending() {
      return this.$store.getters[
        "recruitment/selectedApplication"
      ].applications.filter(app => app.pending);
    },
    processed() {
      return this.$store.getters[
        "recruitment/selectedApplication"
      ].applications.filter(app => !app.pending);
    }
  },

  beforeDestroy() {
    this.$store.dispatch("fetchApplicants", null);
  }
};
</script>


<style>
#pending {
  margin-top: 3rem;
}

.has-padding {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}
</style>
