<template>
  <label :class="[$style.radio, { [$style.dark]: dark }]">
    <span :class="$style.input">
      <input
        type="radio"
        :checked="checked"
        :value="value"
        v-bind="$attrs"
        @change="updateInput"
      />
      <span :class="$style.control"></span>
    </span>
    <slot name="label">
      <span :class="$style.label">{{ label }}</span>
    </slot>
  </label>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import { isEqual } from 'lodash';

  @Component({
    inheritAttrs: false,
    model: {
      prop: 'modelValue',
      event: 'change'
    }
  })
  export default class InputRadio extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    readonly label: string;

    @Prop()
    readonly value;

    @Prop()
    readonly modelValue;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;

    get checked() {
      return isEqual(this.modelValue, this.value);
    }

    @Emit('change')
    updateInput() {
      return this.value;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  @keyframes pop {
    25% {
      transform: scale(0);
    }

    75% {
      transform: scale(1.25);
    }

    100% {
      transform: scale(1);
    }
  }

  .radio {
    display: grid;
    grid-template-columns: min-content auto;
    grid-gap: 0.5em;

    align-content: center;

    cursor: pointer;

    --bg-color: #{$color-bg-light};
    --border-color: #{$color-border-main-mid};
    --dot-color: #{$color-bg-primary};

    &.dark {
      --border-color: #{$color-bg-light};
      --dot-color: #62d9c9;

      .input input:not(:checked) + .control {
        --border-color: #{$color-border-brown-gray};
        background-color: transparent;
      }
    }
  }

  .input {
    display: flex;
    align-items: center;
    input {
      opacity: 0;
      width: 0;
      height: 0;

      & + .control::before {
        content: '';
        width: 10px;
        height: 10px;
        box-shadow: inset 0.5em 0.5em var(--dot-color);
        border-radius: 50%;
        transition: 180ms transform ease-in-out;
        transform: scale(0);
      }

      &:checked + .control::before {
        animation: pop 0.1s forwards;
      }
    }
  }

  .control {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 0.1em solid var(--border-color);
    background-color: var(--bg-color);
  }
</style>
