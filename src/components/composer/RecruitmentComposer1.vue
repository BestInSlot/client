<template>
  <div class="composer" v-show="isActive">
    <div class="container composer-container" :style="hasOverflow">
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
              <div class="right">
                <div class="select is-small">
                  <select class="composer-select" name="applicant-limit" v-model="limit">
                    <option value.number="20">Show: 20</option>
                    <option value.number="40">Show: 40</option>
                    <option value.number="60">Show: 60</option>
                  </select>
                </div>
              </div>
               <div class="left">
                <pagination :total="total" :current="current" :per-page="limit" :size="'is-small'"/>
              </div>
            </div>
            <div class="controls" v-else>
              <div class="right">
                <ul>
                  <li @click="$store.dispatch('recruitment/setContent', null)">
                      <a>Go to List</a>
                  </li>
                </ul>
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
          <component :is="selected" @updateTitle="applicationName = $event"/>
        </transition>
        <div class="composer-footer is-fixed" v-if="viewApplicant">
            <div class="buttons">
              <button class="button composer-button is-half is-success" @click.stop="setRecruitmentAppState({approved: true, reject: false})">
                  Accept
              </button>
              <button class="button composer-button is-half is-danger" @click.stop="setRecruitmentAppState({approved: false, reject: true})">
                  Reject
              </button>
            </div>
        </div>
        <div class="composer-footer is-fixed" v-else></div>
    </div>
  </div>
</template>

<script>
import ViewList from "./ViewList";
import ViewApplicant from "./ViewApplicant.1";
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
      overflow: false,
      current: 1,
      limit: 20,
      title: ""
    };
  },

  beforeDestroy() {
    this.$emit("update:isActive", false);
    document.documentElement.style = null;
  },

  created() {
    document.documentElement.style = "overflow-y: hidden";
  },

  computed: {
    total() {
      return this.$store.getters["recruitment/selectedApplication"].applications
        .length;
    },
    viewApplicant() {
      return !!this.$store.getters["recruitment/content"];
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
      return this.viewApplicant ? "slide-in-left" : "slide-in-right";
    },
    slideLeave() {
      return this.viewApplicant ? "slide-out-left" : "slide-out-right";
    },
    hasOverflow() {
      return { "overflow-x": this.overflow ? "hidden" : null };
    },
    applicationName: {
      get() {
        return this.title || this.$store.getters["recruitment/selectedApplication"].title;
      },
      set(val) {
        this.title = val;
      }
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
      this.$store.dispatch("recruitment/setContent", null);
      this.$store.commit("recruitment/SET_SELECTED_APPLICATION", null);
    },

    async save() {}
  }
};
</script>

<style>
.slide-out-left {
  animation: slideLeftOut 0.25s ease;
}
.slide-out-right {
  animation: slideRightOut 0.25s ease;
}

.slide-in-left {
  animation: slideInLeft 0.25s ease;
}

.slide-in-right {
  animation: slideInRight 0.25s ease;
}

@keyframes slideLeftOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes slideRightOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
