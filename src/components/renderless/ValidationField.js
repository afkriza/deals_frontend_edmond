export default {
  name: 'ValidationField',
  props: {
    /**
     * Veulidate object, accessed from parent component as: $v.fieldName
     */
    v: {
      type: Object,
      required: true
    },

    /**
     * Override error messages for specific validator
     * eg.
     * {
     *  required: "Required error message"
     *  email: "Email error message"
     *  minLength: (v) => `Must be min ${v.$params.minLength.min} chars`
     * }
     */
    errorMessages: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    /**
     * Convenience flag to easily decide if a message should be displayed.
     * Equivalent to this.v.$dirty && !this.v.$pending && this.v.$invalid
     */
    isError() {
      return this.v.$error;
    },

    /**
     * Validators should be mutually exclusive so that only one
     * error is active at the time, otherwise, order of error message
     * that will be returned is not guaranteed
     */
    errorMessage() {
      if (this.isError) {
        for (const param of Object.keys(this.v.$params)) {
          if (this.v[param] === false) {
            let errorMessage = this.errorMessages[param];

            if (!errorMessage) {
              errorMessage = this.$options.errorMessages[param];
            }

            return typeof errorMessage === 'function'
              ? errorMessage(this.v)
              : errorMessage;
          }
        }
      }

      return '';
    }
  },

  /**
   * Default error messages
   */
  errorMessages: {
    required: 'This field is required',
    email: 'Invalid email address',
    sameAsPassword: "Passwords don't match",
    minLength: v => `Must be at least ${v.$params.minLength.min} characters`,
    isEmailTaken: 'Email taken'
  },

  render() {
    return this.$scopedSlots.default({
      isError: this.isError,
      errorMessage: this.errorMessage
    });
  }
};
