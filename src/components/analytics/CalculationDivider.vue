<template>
  <app-tooltip position="bottom" offset-y="12px" :follow-mouse="true">
    <template v-slot:trigger>
      <div :class="classOverride" v-on="$listeners">
        <svg
          v-visible="isVisible"
          :class="$style.svg"
          preserveAspectRatio="none"
          viewBox="0 0 100 2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :class="[$style.path, { [$style.active]: isActive }]"
            d="M0 1L1174 1"
            stroke-dasharray="4 4"
          />
        </svg>
      </div>
    </template>

    <template v-slot:content>
      <div :class="[$style.tooltip, { [$style.destructive]: isActive }]">
        {{ tooltipText }}
      </div>
    </template>
  </app-tooltip>
</template>

<script>
  import AppTooltip from 'components/app/AppTooltip';

  export default {
    name: 'CalculationSeparator',
    components: { AppTooltip },
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      isVisible: {
        type: Boolean,
        default: true
      },
      classOverride: {
        type: [String, Object],
        default: ''
      }
    },

    computed: {
      tooltipText() {
        return this.isActive ? 'Remove border' : 'Add border to the table';
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    color: $color-text-main;
    padding: 4px 16px;

    &.destructive {
      color: $color-text-warning;
    }
  }

  .svg {
    width: 100%;
    height: 1px;
    fill: none;
  }

  .path {
    stroke: $color-border-main-mid;
    vector-effect: non-scaling-stroke;

    &.active {
      stroke-dasharray: none;
    }
  }
</style>
