<template>
  <ul :class="[$style.colors, { [$style.large]: large }]">
    <li
      v-for="color in colors"
      :key="color.value"
      :class="[$style.color, { [$style.border]: opaque }]"
      :style="{
        backgroundColor: color.value,
        color: opaque ? color.border : 'white'
      }"
      @click="$emit('update', color.value)"
    >
      <IconCheckmark
        v-if="value === color.value"
        :class="$style.icon"
        viewBox="0 0 16 16"
      />
    </li>
  </ul>
</template>

<script>
  import IconCheckmark from '@/assets/images/icons/checkmark.svg';

  export default {
    model: {
      event: 'update'
    },
    name: 'ColorPalette',
    components: { IconCheckmark },
    props: {
      value: String,

      colors: {
        type: Array,
        default: () => []
      },

      opaque: Boolean,
      large: Boolean
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .colors {
    --size: 18px;
    --checkmark-size: 12px;

    &.large {
      --size: 24px;
      --checkmark-size: 16px;
    }

    display: grid;
    grid-template-columns: repeat(auto-fit, var(--size));
    grid-auto-flow: row;
    gap: 6px;
    list-style-type: none;

    .icon {
      width: var(--checkmark-size);
      height: var(--checkmark-size);
    }

    .color {
      @include flex-center;
      @include circle(var(--size));
      cursor: pointer;

      color: $color-text-light;

      &.border {
        border: {
          style: solid;
          width: 1px;
        }
      }

      &:hover {
        box-shadow: 0 0 0 3px $color-border-primary-light;
      }
    }
  }
</style>
