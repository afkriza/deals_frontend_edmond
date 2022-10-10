<template>
  <VPopover
    :container="false"
    :open.sync="isOpen"
    :popover-class="$style.popover"
  >
    <template #popover>
      <div :class="$style.dropdown" v-close-popover>
        <div :class="$style.title">Color</div>
        <ColorPalette
          :class="$style.palette"
          v-model="selectedTextColor"
          :colors="editorTextColors"
          large
        />
      </div>
    </template>
    <slot :is-open="isOpen" />
  </VPopover>
</template>

<script>
  import { VClosePopover, VPopover } from 'v-tooltip';
  import ColorPalette from 'components/app/ColorPalette';
  import editorTextColors from 'enums/editor-text-colors';

  export default {
    model: {
      event: 'update'
    },
    directives: {
      closePopover: VClosePopover
    },
    components: {
      VPopover,
      ColorPalette
    },

    props: {
      value: String
    },
    computed: {
      selectedTextColor: {
        get() {
          return this.value;
        },

        set(newTextColor) {
          this.$emit('update', newTextColor);
        }
      }
    },
    data() {
      return {
        isOpen: false,
        editorTextColors
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .dropdown {
    @include column;

    background-color: $color-bg-light;

    width: 248px;

    border: 1px solid $color-border-main-light;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .popover[x-placement^='bottom'] {
    margin-top: 2px;
  }

  .title {
    color: $color-text-main-light;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    margin: 16px;
  }

  .palette {
    margin: 0 16px 16px;
    padding: 0;
  }
</style>
