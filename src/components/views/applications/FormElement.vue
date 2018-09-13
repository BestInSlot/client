<script>
import isObject from "lodash/isObject";
export default {
  props: {
    type: {
      type: String,
      default: "input"
    },
    classes: {
      type: [String, Array, Object]
    },
    isHoverable: {
      type: Boolean,
      default: false
    },
    styles: Object,
    selectOptions: Array,
    value: String,
    id: String,
    selectorId: Number,
    selector: Number,
    name: String,
    disabled: Boolean,
    required: Boolean,
    checked: Boolean
  },

  data() {
    return {
      attrs: null,
      selected: "Select...",
    };
  },

  computed: {
    _classes() {
      let results = {};
      if ((this.classes && this.classes.length) || this.classes) {
        if (Array.isArray(this.classes)) {
          this.classes.forEach(_class => {
            results[_class] = true;
          });
        } else {
          results = { [this.classes]: true };
        }
        return results;
      }
      return null;
    },

    show() {
      return this.selectorId === this.selector;
    }
  },

  methods: {
    onClick(val, target) {
      this.$emit("selected", val);
      this.$emit("toggle", this.selectorId);
    },

    renderSelect(h) {
      const opts = this.selectOptions.map(opt => {
        return h(
          "a",
          {
            class: { "dropdown-item": true },
            on: {
              click: event => {
                event.preventDefault();
                event.stopPropagation();
                // this.$emit("selected", opt.value);
                this.onClick(opt.value, event.target);
                this.selected = opt.title;
              }
            }
          },
          opt.title
        );
      });

      opts.unshift(
        h(
          "a",
          {
            class: { "dropdown-item": true },
            on: {
              click: event => {
                event.preventDefault();
                event.stopPropagation();
                // this.$emit("selected", "");
                this.$emit("toggle", this.selectorId);
                this.selected = "Select...";
              }
            }
          },
          "Select..."
        )
      );

      const dropdownToggleButton = h(
        "button",
        {
          class: { button: true },
          attrs: { "aria-haspopup": true, "aria-controls": this.id }
        },
        [
          h("span", { style: { "margin-right": "10px" } }, [this.selected]),
          h("i", { class: { "fa fa-chevron-down": true } })
        ]
      );

      const dropdownToggle = h("div", { class: { "dropdown-trigger": true } }, [
        dropdownToggleButton
      ]);

      const dropdownContent = h(
        "div",
        { class: { "dropdown-content": true } },
        opts
      );

      const dropdownMenu = h(
        "div",
        {
          class: { "dropdown-menu": true },
          attrs: { id: this.id, role: "menu" }
        },
        [dropdownContent]
      );
      const dropdownParent = h(
        "div",
        {
          attrs: { ...this.attrs },
          class: {
            dropdown: true,
            "is-active": !this.isHoverable && this.show,
            "is-hoverable": this.isHoverable
            // ...this._classes
          },
          style: { ...this.styles },
          on: {
            click: event => {
              event.stopPropagation();
              this.$emit("toggle", this.selectorId)
            }
          }
        },
        [dropdownToggle, dropdownMenu]
      );

      return dropdownParent;
    },

    renderInput(h) {
      return h(this.type, {
        attrs: { ...this.attrs },
        class: { ...this._classes, input: true },
        on: {
          input: function(event) {
            this.$emit("input", event.target.value);
          },
          change: function(event) {
            this.$emit("change", event.target.value);
          }
        }
      });
    },

    renderTextarea(h) {
      return h(this.type, {
        attrs: { ...this.attrs },
        class: { ...this._classes, textarea: true },
        on: {
          input: function(event) {
            this.$emit("input", event.target.value);
          },
          change: function(event) {
            this.$emit("change", event.target.value);
          }
        }
      });
    }
  },

  created() {
    // if (this.classes.length) {
    //   if (Array.isArray(this.classes)) {
    //     this._classes.forEach(_class => {
    //       this._classes[_class] = true;
    //     });
    //   }
    // } else if (isObject(this.classes)) {
    //   this._classes = { ...this.classes };
    // } else {
    //   this._classes[this.classes] = true;
    // }

    this.attrs = {
      id: this.id,
      name: this.name,
      disabled: this.disabled,
      required: this.required,
      checked: this.value,
      value: this.value
    };
  },

  render(h) {
    const type = `render${this.type.charAt(0).toUpperCase() +
      this.type.slice(1)}`;
    return this[type](h);
  }
};
</script>
