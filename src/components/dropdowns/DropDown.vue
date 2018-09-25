<script>
export default {
  name: "dropdown",
  props: {
    parentTag: {
      type: String,
      default: "div"
    },
    parentClass: {
      type: [String, Array]
    },
    id: {
      type: [Number, String]
    },
    attributes: {
      type: [Array, Object]
    },
    isHoverable: {
      type: Boolean,
      default: false
    },
    isActivable: {
      type: Boolean,
      default: true
    },

    activableClass: String,
    hoverableClass: String
  },

  data() {
    return {
      dropdownId: ""
    };
  },

  methods: {
    generateId(num) {
      let chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let rnd = "";
      for (let i = 0; i <= num; i++) {
        rnd += chars.charAt(Math.floor(Math.random() * chars.length - 1) + 1);
      }
      return rnd;
    }
  },

  computed: {
    isActive() {
      return this.$store.getters.dropdown === this.dropdownId;
    }
  },

  created() {
    this.dropdownId = this.generateId(20);
  },

  render(h) {
    return h(
      this.parentTag,
      {
        attrs: {
          id: this.id
        },
        class: {
          [this.hoverableClass]: this.isHoverable ? true : false,
          [this.activableClass]: this.isActivable ? this.isActive : false,
          [this.parentClass]: true
        },
        on: {
          click: event => {
            if (!this.isActivable) return;
            this.$store.dispatch("toggleDropDown", this.dropdownId);
          }
        }
      },
      this.$slots.default
    );
  }
};
</script>
