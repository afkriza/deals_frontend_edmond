<template>
  <VPopover
    :container="false"
    :open.sync="isOpen"
    :popover-class="$style.popover"
  >
    <template #popover>
      <div :class="$style.dropdown" v-close-popover>
        <div :class="$style.title">Text style</div>
        <div
          v-for="(textStyle, index) in allTextStyles"
          :key="index"
          :class="[
            $style.textStyle,
            { [$style.isSelected]: textStyle === value }
          ]"
          :style="{
            fontSize: TEXT_STYLES[textStyle].size,
            textTransform: TEXT_STYLES[textStyle].textTransform
          }"
          @click="selectedTextStyle = textStyle"
        >
          {{ TEXT_STYLES[textStyle].label }}
        </div>
      </div>
    </template>
    <slot :is-open="isOpen" />
  </VPopover>
</template>

<script>
  import { VClosePopover, VPopover } from 'v-tooltip';
  import { TEXT_STYLES, allTextStyles } from 'constants/text-styles';

  export default {
    directives: {
      closePopover: VClosePopover
    },
    components: {
      VPopover
    },

    props: {
      value: String
    },

    computed: {
      selectedTextStyle: {
        get() {
          return this.value;
        },

        set(newTextStyle) {
          this.$emit('update', newTextStyle);
        }
      }
    },

    data() {
      return {
        isOpen: false,
        TEXT_STYLES,
        allTextStyles
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .dropdown {
    @include column;

    background-color: $color-bg-light;

    width: 216px;
  }

  .popover[x-placement^='bottom'] {
    margin-top: 2px;
  }

  .title {
    color: $color-text-main-light;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    margin: {
      top: 16px;
      left: 16px;
      bottom: 8px;
    }
  }

  .text-style {
    cursor: pointer;
    height: 48px;
    padding: 12px 16px;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .is-selected {
    background-color: $color-bg-primary-dimmed;
  }
</style>
