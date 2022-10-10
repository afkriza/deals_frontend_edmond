<template>
  <div :class="$style.miniSlider">
    <button @click="onNavigationBack" :class="$style.miniArrowLeft">
      <!-- @svg("chevron") -->
    </button>
    <button
      @click="onSlideActioClick"
      :class="[$style.miniTitle, { [$style.isDisabled]: actionDisabled }]"
    >
      {{ title }}
    </button>
    <button @click="onNavigationForward" :class="$style.miniArrowRight">
      <!-- @svg("chevron") -->
    </button>
  </div>
</template>

<script>
  export default {
    name: 'MiniSlider',
    props: {
      title: {
        type: [String, Number],
        default: ''
      },
      actionDisabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onNavigationBack() {
        this.$emit('navigationBack:click');
      },
      onSlideActioClick() {
        if (!this.actionDisabled) {
          this.$emit('slideAction:click');
        }
      },
      onNavigationForward() {
        this.$emit('navigationForward:click');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .mini-slider {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    color: $color-text-primary-darker;
  }

  .mini-arrow-left,
  .mini-arrow-right,
  .mini-title {
    @include button;
  }

  .mini-title {
    margin: 0 10px;
    font-weight: bold;
  }

  .is-disabled {
    cursor: default;
    pointer-events: none;
  }

  .mini-arrow-left,
  .mini-arrow-right {
    display: inline-flex;

    :global .icon-path--chevron {
      fill: $color-bg-main-darker;
    }
  }

  .mini-arrow-right :global .icon--chevron {
    transform: rotate(180deg);
  }
</style>
