<template>
    <section id="recruitment" class="section">
        <div class="container">
            <div class="columns is-multiline">
                <div class="column is-12">
                    <div class="head flex">
                        <div class="left">
                            <h4 class="subtitle is-4">Templates</h4>
                        </div>
                        <div class="right">
                            <button class="button is-info" @click="isActive = true">
                                <i class="fa fa-plus"></i>
                                <span>New Template</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="column is-12" v-for="(template, index) in applications" :key="index">
                  <div class="template">
                    <span class="subtitle is-5">{{template.title}}</span>
                    <div class="buttons">
                       <button class="button is-success is-small" @click="toggleApplicants(template.id)">
                        <i class="fa fa-edit"></i>
                        <span>View</span>
                      </button>
                      <button class="button is-info is-small" @click="setEditableContent(template)">
                        <i class="fa fa-edit"></i>
                        <span>Edit</span>
                      </button>
                      <button class="button is-danger is-small">
                          <i class="fa fa-trash"></i>
                          <span>Remove</span>
                        </button>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <template-composer :isActive.sync="isActive" :editable.sync="toEdit" v-if="!displayApplicants"/>
        <recruitment-composer :isActive.sync="displayApplicants" v-else/>
    </section>
</template>

<script>
import TemplateComposer from "@/components/composer/TemplateComposer";
import RecruitmentComposer from "@/components/composer/RecruitmentComposer";
import {mapGetters} from "vuex";
export default {
  components: { TemplateComposer, RecruitmentComposer },
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

  data() {
    return {
      isActive: false,
      displayApplicants: false,
      toEdit: null
    };
  },

  methods: {
    setEditableContent(template) {
      //We want to make a copy without altering the original object.
      this.toEdit = Object.create(template);
      this.isActive = true;
    },
    async toggleApplicants(id) {
      try {
        await this.$store.dispatch("recruitment/fetchApplicants", id);
        this.displayApplicants = true;
        // this.isActive = true;
      } catch (err) {
        this.displayApplicants = false;
        this.$toasted.show("Encountered a problem fetching data...", {
          theme: "primary",
          duration: 3000,
          className: ["bis-notification", "is-danger"],
          icon: "exclamanation-triangle"
        });
      }
    }
  },

  computed: {
    ...mapGetters([
      "recruitment/total",
      "recruitment/currentPage",
      "recruitment/limit",
      "recruitment/applications"
    ]),
    applications() {
      return this.$store.getters["recruitment/applications"];
    }
  }
};
</script>
