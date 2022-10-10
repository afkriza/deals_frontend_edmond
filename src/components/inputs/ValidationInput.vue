<template>
  <validation-field :v="v" :errorMessages="errorMessages">
    <component
      :is="input"
      slot-scope="{ isError, errorMessage }"
      v-bind="$attrs"
      v-on="$listeners"
      :isInvalid="$attrs.isInvalid || isError"
      :helperText="errorMessage || $attrs.helperText"
    />
  </validation-field>
</template>

<script>
  import AnimatedInput from 'components/inputs/AnimatedInput';
  import ValidationField from 'components/renderless/ValidationField';

  export default {
    name: 'ValidationInput',
    inheritAttrs: false,
    model: {
      event: 'update'
    },
    components: {
      AnimatedInput,
      ValidationField
    },
    props: {
      input: {
        type: Object,
        default: () => AnimatedInput
      },

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
       * }
       */
      errorMessages: {
        type: Object,
        default() {
          return {};
        }
      }
    }
  };
</script>
