<template>
  <div :class="$style.tooltip" :style="tooltipPosition">
    <div :class="[$style.tooltipContent, contentClass && contentClass]">
      <slot />
    </div>
  </div>
</template>

<script>
  const validPositions = ['left', 'top', 'right', 'bottom'];

  export default {
    name: 'BaseTooltip',
    props: {
      position: {
        type: String,
        default: 'right',
        validator(value) {
          return validPositions.indexOf(value) !== -1;
        }
      },

      offsetX: {
        type: String,
        default: '0px'
      },

      contentClass: {
        type: String
      },

      offsetY: {
        type: String,
        default: '0px'
      }
    },
    computed: {
      tooltipPosition() {
        const cssPosition = this.actualPosition(this.position);

        const style = {};
        if (cssPosition === 'top' || cssPosition === 'bottom') {
          style[cssPosition] = `calc(100% + ${this.offsetY})`;
          style.left = this.offsetX;
        } else {
          style[cssPosition] = `calc(100% + ${this.offsetX})`;
          style.top = this.offsetY;
        }

        return style;
      }
    },
    methods: {
      // TODO: remove this witchery, use array indices calculation instead
      actualPosition(position) {
        switch (position) {
          case 'top':
            return 'bottom';
          case 'bottom':
            return 'top';
          case 'left':
            return 'right';
          case 'right':
            return 'left';
          default:
            return 'left';
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    position: absolute;
    z-index: $z-tooltip;
  }

  .tooltip-content {
    border-radius: $base-border-radius;
    background-color: $color-bg-light;
    box-shadow: $tooltip-shadow;
    max-height: 80vh;
    overflow-y: auto;
  }
</style>
