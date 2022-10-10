<template>
  <label
    :class="[$style.checkbox, { [$style.dark]: dark }]"
    :style="{ '--size': size }"
  >
    <span :class="$style.input">
      <input
        type="checkbox"
        name="checkbox"
        v-bind="$attrs"
        :checked="checked"
        @change="$emit('change', $event.target.checked)"
      />
      <span :class="[$style.control, { [$style.checked]: checked }]">
        <svg
          viewBox="-2 -3 14 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.06603 0.733808C9.39407 0.422064 9.92593 0.422064 10.254 0.733808C10.582 1.04555 10.582 1.55099 10.254 1.86273L3.36 8.41421L0.24603 5.45494C-0.0820101 5.1432 -0.0820101 4.63776 0.24603 4.32602C0.574071 4.01428 1.10593 4.01428 1.43397 4.32602L3.36 6.15637L9.06603 0.733808Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </span>
    <span v-if="label" :class="$style.label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
  import { Component, Model, Prop, Vue } from 'vue-property-decorator';

  @Component({
    inheritAttrs: false
  })
  export default class InputCheckbox extends Vue {
    @Model('change', {
      type: Boolean,
      required: true
    })
    readonly checked: boolean;

    @Prop({
      type: String,
      default: ''
    })
    readonly label: string;

    @Prop({
      type: String,
      default: '16px'
    })
    readonly size: string;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .checkbox {
    --color-label: #{$color-text-main};

    --color-border: #adadad;
    --color-background: #{$color-bg-light};

    --color-text: #{$color-text-main};
    --color-hover-border: #{$color-border-primary};
    --color-hover-background: #{$color-bg-primary-dimmed};

    --color-checked-border: #{$color-border-primary};
    --color-checked-background: #{$color-bg-primary};
    --color-checked-checkmark: #{$color-bg-light};

    &.dark {
      --color-label: #{$color-text-light};

      --color-border: #adadad;
      --color-background: #2a3139;

      --color-hover-border: #{$color-border-primary-highlight};
      --color-hover-background: #32465d;

      --color-checked-border: #{$color-border-light};
      --color-checked-background: #{$color-bg-light};
      --color-checked-checkmark: #{$color-bg-primary};
    }

    display: grid;
    grid-template-columns: min-content auto;
    grid-gap: 0.5em;
    color: var(--color-text);
    align-items: center;

    cursor: pointer;

    &:hover .control:not(.checked) {
      border: 1px solid var(--color-hover-border);
      background-color: var(--color-hover-background);
    }
  }

  .input {
    display: grid;
    grid-template-areas: 'checkbox';

    > * {
      grid-area: checkbox;
    }

    input {
      cursor: pointer;
      opacity: 0;
      width: var(--size);
      height: var(--size);
    }

    input:checked + .control svg {
      transform: scale(1);
    }
  }

  .control {
    display: inline-grid;
    width: var(--size);
    height: var(--size);
    border-radius: 2px;
    border: 1px solid #adafb2;
    background-color: var(--color-background);
    cursor: pointer;
    color: $color-text-light;

    &.checked {
      color: var(--color-checked-checkmark);
      background-color: var(--color-checked-background);
      border-color: var(--color-checked-border);
    }

    svg {
      transition: transform 0.1s ease-in 25ms;
      transform: scale(0);
      transform-origin: bottom left;
    }
  }

  .label {
    color: var(--color-label);

    line-height: 20px;
  }
</style>
