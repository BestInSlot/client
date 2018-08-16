import { post } from "axios";
import { Validator } from "vee-validate";

export default function validateIsUnique() {
  const isUnique = (value, args) => {
    const key = args[0];
    const url = this.$auth.check() ? "/users/validate" : "/users/check";
    return post(url, { [key]: value }).then(res => {
      return {
        valid: res.data.valid,
        data: {
          message: res.data.message
        }
      };
    });
  };

  Validator.extend("unique", {
    validate: isUnique,
    getMessage: (field, params, data) => {
      return data.message;
    }
  });
}
