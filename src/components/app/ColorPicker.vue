<template>
  <VPopover
    :container="false"
    :open.sync="isOpen"
    :popover-class="$style.popover"
    :placement="placement"
  >
    <template #popover>
      <div v-close-popover :class="$style.dropdown">
        <IconButton :class="$style.buttonNone" @click="unsetColor">
          <template #icon>
            <NoneColorIcon />
          </template>
          <template #text>
            <span :class="$style.textNone">None</span>
          </template>
        </IconButton>
        <ColorPalette
          v-model="color"
          :class="$style.palette"
          :colors="colors"
          :opaque="opaque"
          :large="large"
        />
      </div>
    </template>
    <slot :is-open="isOpen" />
  </VPopover>
</template>

<script>
  import { VClosePopover, VPopover } from 'v-tooltip';
  import ColorPalette from 'components/app/ColorPalette';
  import NoneColorIcon from '@/assets/images/icons/none-color.svg';
  import IconButton from '@/components/buttons/IconButton';

  export default {
    directives: {
      closePopover: VClosePopover
    },
    components: {
      IconButton,
      VPopover,
      ColorPalette,
      NoneColorIcon
    },
    model: {
      event: 'update'
    },

    props: {
      value: String,

      colors: {
        type: Array,
        default: () => []
      },

      placement: {
        type: String,
        default: 'bottom'
      },

      opaque: Boolean,
      large: Boolean
    },

    data() {
      return {
        isOpen: false
      };
    },

    computed: {
      color: {
        get() {
          return this.value;
        },

        set(newColor) {
          this.$emit('update', newColor);
        }
      }
    },

    methods: {
      unsetColor() {
        this.color = '';
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .colors {
    margin: 0;
    padding: 20px;
  }

  .dropdown {
    @include column;

    background-color: $color-bg-light;

    width: 176px;
  }

  .button-none {
    padding: 16px 16px 12px;
  }

  .text-none {
    text-transform: none;
    color: $color-text-main;
    font-weight: normal;

    margin-left: 8px;
  }

  .palette {
    padding: 16px;
    margin: 0;

    border-top: 1px solid $color-border-main-light;
  }

  .popover[x-placement^='bottom'] {
    margin-top: 2px;
  }
</style>
