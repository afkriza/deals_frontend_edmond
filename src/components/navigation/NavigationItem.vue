<template>
  <div
    :class="$style.item"
    @mouseleave="isTooltipOpen = false"
    @mouseenter="isTooltipOpen = true"
  >
    <router-link
      v-slot="{ href, isActive, navigate }"
      :to="page ? { name: page } : ''"
    >
      <a
        :class="[$style.link, { [$style.active]: page && isActive }]"
        :href="page ? href : null"
        @click="navigate"
      >
        <div :class="$style.iconContainer">
          <slot :isActive="Boolean(page && isActive)" name="icon" />
        </div>
      </a>
    </router-link>
    <transition mode="out-in" name="navigation-tooltip-fade">
      <NavigationTooltip
        v-show="isTooltipOpen"
        :class="[$style.tooltip, $style.centered]"
        :content-class="$style.baseTooltip"
        :tooltip-y-offset="tooltipYOffset"
      >
        <slot>
          <NavigationTooltipItem :text="text" />
        </slot>
      </NavigationTooltip>
    </transition>
  </div>
</template>

<script>
  import NavigationTooltip from './NavigationTooltip';
  import NavigationTooltipItem from './NavigationTooltipItem';

  export default {
    name: 'NavLink',
    components: {
      NavigationTooltip,
      NavigationTooltipItem
    },
    inheritAttrs: false,
    props: {
      page: {
        type: String,
        default: null
      },
      text: {
        type: String,
        default: ''
      },
      tooltipHeight: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isTooltipOpen: false,
        tooltipYOffset: '0px'
      };
    },

    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.calculateTooltipOffset);
        this.calculateTooltipOffset();
      });
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.calculateTooltipOffset);
    },
    methods: {
      calculateTooltipOffset() {
        if (this.tooltipHeight) {
          const tooltipTop = this.$el.getBoundingClientRect().top;
          const offset = window.innerHeight - tooltipTop - this.tooltipHeight;
          if (offset < 0) {
            this.tooltipYOffset = offset + 'px';
          }
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .item {
    position: relative;
    .icon-container {
      height: 32px;
      width: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:hover {
      .icon-container {
        background-color: $color-bg-main-dimmed;
        border: 1px solid $color-border-main-light;
        border-radius: 4px;
        padding: 3px;
      }
    }
  }

  .link {
    @include flex-center;
    position: relative;

    width: 100%;
    height: 60px;

    &.active::after {
      content: '';

      position: absolute;
      top: 13px;
      bottom: 13px;
      right: 0;

      width: 3px;
      background-color: $color-bg-primary;
    }
  }

  .base-tooltip {
    max-height: 70vh;
  }

  .tooltip {
    top: 0;
    padding-left: 24px;
    color: $color-text-main;

    &.top-padded {
      padding-top: 8px;
    }

    &.centered {
      top: 5px;
    }

    &.top-anchored {
      top: 0;
    }
  }
</style>
