<template>
  <section id="recruitment" class="section">
        <div class="container">
            <div class="columns is-multiline">
                <div class="column is-12">
                    <div class="head">
                      <h4 class="subtitle is-4">Recruitment</h4>
                    </div>
                </div>
                <div class="column is-12" v-for="(app, index) in applications" :key="index">
                  <div class="template">
                    <span class="subtitle is-5">{{app.title}}</span>
                    <button class="button is-danger" @click="setEditableContent(app)">Apply</button>
                  </div>
                </div>
            </div>
        </div>
        <template-composer :isActive.sync="isActive" :editable.sync="toEdit"/>
    </section>
</template>

<script>
import TemplateComposer from "@/components/composer/TemplateComposer";
export default {
  async beforeRouteEnter(to, from, next) {
    next(async vm => {
      try {
        await vm.$store.dispatch("recruitment/fetchApplicationTemplates");
      } catch (err) {
        if (err && err.response) {
          vm.$toasted.show(
            err.response ? err.response.data.message : err.response.data,
            {
              theme: "primary",
              duration: 3000,
              className: ["bis-notification", "is-danger"],
              icon: "exclamanation-triangle"
            }
          );
        }
        console.log(err);
      }
    });
  },
  components: { TemplateComposer },
  data() {
    return {
      isActive: false,
      toEdit: null
    };
  },
  computed: {
    applications() {
      return this.$store.getters["recruitment/applications"];
    }
  },
  methods: {
    setEditableContent(template) {
      const copy = Object.create(template);
      this.toEdit = copy;
      this.isActive = true;
    }
  }
};
</script>
