<template>
  <div :class="[$style.operator, { [$style.placed]: isPlaced }, 'operator']">
    <span :class="$style.icon">
      <component :is="operator.icon" />
    </span>
  </div>
</template>

<script>
  import OperatorModel from '../models/Operator.js';

  import operatorsMixin from 'mixins/widget-operators';

  export default {
    name: 'Operator',
    mixins: [operatorsMixin],
    props: {
      isPlaced: {
        type: Boolean,
        default: false
      },

      operator: {
        type: OperatorModel,
        required: true
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .operator {
    @include flex-center;

    background-color: $color-bg-light;
    color: $color-text-primary;

    border-radius: 4px;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s ease-in-out;

    .icon {
      position: relative;
      z-index: 1;
    }

    width: 40px;
    height: 40px;

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
    }

    &:hover::before {
      width: 60px;
      height: 60px;
    }

    &:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
  }

  .placed {
    box-shadow: none;
    border: 1px solid $color-border-main-light;

    &::before {
      display: none;
    }

    &:hover {
      box-shadow: none;
      background-color: $color-bg-main-dimmed;
    }
  }
</style>
