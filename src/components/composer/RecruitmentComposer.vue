<template>
  <div class="composer" v-show="isActive">
    <div class="composer-container" :style="hasOverflow">
        <div class="composer-head is-fixed">
            <div class="top">
                <div class="left">
                    <h6 class="subtitle is-6">{{applicationName}}</h6>
                </div>
                <div class="right">
                    <button class="button is-danger is-small" @click.stop="onClose">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="controls" v-if="!viewApplicant">
              <div class="left">
                <pagination :total="total" :current="current" :per-page="limit" :size="'is-small'"/>
              </div>
              <div class="right">
                <div class="select is-small">
                  <select class="composer-select" name="applicant-limit" v-model="limit">
                    <option value="20">Show: 20</option>
                    <option value="40">Show: 40</option>
                    <option value="60">Show: 60</option>
                  </select>
                </div>
              </div>
            </div>
        </div>
        <transition 
          :enter-active-class="slideEnter" 
          :leave-active-class="slideLeave"
          @before-enter="before"
          @before-leave="before"
          @after-enter="after"
          @after-leave="after">
          <!-- <component :is="selected" @view="viewApplicant" @remove="removeApplicant" @goBack="viewApplicant = false"/> -->
          <component :is="selected"/>
        </transition>
        <div class="footer is-fixed" v-if="viewApplicant">
            <div class="buttons">
              <button class="button is-fullwidth is-success" @click.stop="setRecruitmentAppState({approved: true, reject: false})">
                  Accept
              </button>
              <button class="button is-fullwidth is-success" @click.stop="setRecruitmentAppState({approved: false, reject: true})">
                  Reject
              </button>
            </div>
        </div>
        <div class="footer is-fixed" v-else></div>
    </div>
  </div>
</template>

<script>
import ViewList from "./ViewList";
import ViewApplicant from "./ViewApplicant";
import Pagination from "@/components/Pagination";
import { mapActions } from "vuex";
export default {
  props: {
    isActive: { type: Boolean, required: true }
  },

  components: {
    viewList: ViewList,
    viewApplicant: ViewApplicant,
    Pagination
  },

  data() {
    return {
      dropdown: false,
      viewApplicant: false,
      overflow: false,
      applicant: null,
      current: 1,
      limit: 20
    };
  },

  beforeDestroy() {
    // this.$emit("update:isActive", false);
    document.documentElement.style = null;

  },

  watch: {
    isActive(isActive) {
      document.documentElement.style = isActive ? "overflow-y: hidden;" : null;
    }
  },

  created() {
    document.documentElement.style = "overflow-y: hidden";
  },

  computed: {
    total() {
      return this.$store.getters["recruitment/selectedApplication"].applications
        .length;
    },

    modalOverlay() {
      return ["is-overlay", { show: this.isActive }];
    },
    dropdownClasses() {
      return ["dropdown", { "is-active": this.dropdown }];
    },
    selected() {
      return this.viewApplicant
        ? "view-applicant"
        : !this.viewApplicant && this.isSuperUser
          ? "view-list"
          : "view-applicant";
    },
    slideEnter() {
      return this.isPreview ? "slide-in-left" : "slide-in-right";
    },
    slideLeave() {
      return this.isPreview ? "slide-out-left" : "slide-out-right";
    },
    hasOverflow() {
      return { "overflow-x": this.overflow ? "hidden" : null };
    },
    hasTitle() {
      return this.title ? this.title : "Application";
    },
    applicationName() {
      return this.$store.getters["recruitment/selectedApplication"].title;
    },
    isSuperUser() {
      return this.$auth.user().is_admin || this.$auth.user().is_curator;
    }
  },

  methods: {
    ...mapActions([
      "recruitment/fetchApplicants",
      "recruitment/setEditableContent"
    ]),

    async fetchSingleApplicant(id) {
      try {
        const { data: { applicant: applicant } } = await this.$http.get(
          `/users/admin/recruitment/applicant/${id}`
        );
        this.setContent(applicant);
        this.viewApplicant = true;
      } catch (err) {
        if (err.response) {
          this.$toasted.show("Problem retrieving data...", {
            theme: "primary",
            className: ["bis-notification", "is-danger"],
            icon: "exclamanation-triangle",
            duration: 3000
          });
        }
      }
    },

    async setRecruitmentAppState(payload) {
      try {
        await this.$http.put(`/recruitment/update/${content.id}`, {
          ...payload
        });
      } catch (err) {}
    },

    before() {
      this.overflow = true;
    },

    after() {
      this.overflow = false;
    },

    onClose() {
      this.$emit("update:isActive", false);
    },

    async save() {}
  }
};
</script>

<style>
@import "../../scss/animations/composer-animations.scss";
</style>
