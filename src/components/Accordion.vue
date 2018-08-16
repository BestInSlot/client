<script>
export default {
  props: {
    parentTag: {
      type: String,
      default: "div"
    },
    showInitially: {
      type: Boolean,
      default: false
    },
    headerTag: {
      type: String,
      default: "a"
    },
    childTag: {
      type: String,
      default: "div"
    },
    id: {
      type: String,
      default: null
    },
    containerClasses: {
      type: Object,
      default() {
        return null;
      }
    },
    headerClasses: {
      type: Object,
      default() {
        return null;
      }
    },
    toggleActiveClass: {
      type: String,
      default: "fa fa-chevron-up"
    },
    toggleInactiveClass: {
      type: String,
      default: "fa fa-chevron-down"
    },
    transitionDuration: {
      type: Number,
      default: 250
    },
    timingFunction: {
      type: String,
      default: "ease"
    }
  },

  data() {
    return {
      height: "0px",
      show: false,
      trasition: `height 250ms linear`,
      timeout: null
    };
  },

  beforeDestroy() {
    this.timeout = null;
  },

  mounted() {
    if (this.showInitially) {
      this.transition = "";
      this.height = `${this.$refs.accordion.scrollHeight}px`;
      this.show = true;
      this.$nextTick(() => {
        this.height = "";
      });
    }
  },

  methods: {
    toggleTransition(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.transition = "height 250ms ease";
      this.height = `${this.$refs.accordion.scrollHeight}px`;
      if (!this.show) {
        this.show = true;
        // clearInterval(this.timeout);
        this.$nextTick(() => {
          this.timeout = setTimeout(() => {
            this.height = "";
          }, 250);
        });
      } else {
        this.show = false;
        clearInterval(this.timeout);
        this.$nextTick(() => {
          this.timeout = setTimeout(() => {
            this.height = "0px";
          }, 50);
        });
      }
    }
  },

  render(h) {
    return h(
      this.parentTag,
      {
        class: {
          accordion: true,
          ...this.containerClasses
        },
        attrs: {
          id: this.id
        }
      },
      //child of this.parentTag
      [
        h(
          "div",
          {
            class: {
              "accordion-head": true,
              ...this.headerClasses
            }
          },
          //children of div.accordion-head
          [
            this.$slots.header,

            h("span", {
              class: {
                toggle: true,
                [this.toggleActiveClass]: this.show,
                [this.toggleInactiveClass]: !this.show
              },
              attrs: {
                role: "button"
              },
              on: {
                click: this.toggleTransition
              }
            })
          ]
        ),
        //child of this.parentTag
        h(
          this.childTag,
          {
            class: {
              "accordion-body": true,
              show: this.show
            },
            style: {
              height: this.height,
              transition: this.transition
            },
            ref: "accordion"
          },
          this.$slots.default
        )
      ]
    );
  }
};
</script>



<style lang="scss">
.accordion {
  display: flex;
  flex-direction: column;
  .accordion-head {
    display: flex;
    align-items: center;
    flex: 1;
    a {
      flex: 1;
    }
    .toggle {
      display: inline-block;
      border: none;
      background: transparent;
      &:focus {
        outline: none;
      }
    }
  }
  .accordion-body {
    height: 0;
    overflow: hidden;
    &.show {
      height: auto;
    }
    // transition: height 250ms ease;
  }
}
</style>
