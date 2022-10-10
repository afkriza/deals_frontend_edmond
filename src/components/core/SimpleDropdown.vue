<template>
  <div :class="[$style.dropdown, $style[theme], { [$style.active]: isOpen }]">
    <basic-dropdown
      :class="$style.basicDropdown"
      :isOpen="isOpen"
      :disabled="disabled"
      :offset="offset"
      :customContentClass="customContentClass"
      :resetStyle="true"
      @dropdown:close="onDropdownClose"
      @dropdown:open="onDropdownOpen"
    >
      <div slot="trigger" :class="$style.trigger">
        <span :class="$style.dropdownTitle">
          <slot name="trigger" />
        </span>
        <div
          v-if="type === 'arrow'"
          :class="[$style.arrow, { [$style.isOpen]: isOpen }]"
        >
          <!-- @svg("block-arrow-down") -->
        </div>
      </div>
      <slot />
    </basic-dropdown>
  </div>
</template>

<script>
  import BasicDropdown from 'components/core/BasicDropdown';

  export default {
    name: 'SimpleDropdown',
    components: {
      BasicDropdown
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      offset: {
        type: Object,
        default: () => {
          return { horizontal: 0, vertical: 15 };
        }
      },
      customContentClass: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      theme: {
        type: String,
        default: 'light',
        validator(value) {
          return ['light', 'dark'].includes(value);
        }
      },
      type: {
        type: String,
        default: 'arrow',
        validator(value) {
          return ['arrow', 'clean'].includes(value);
        }
      }
    },
    methods: {
      onDropdownClose() {
        this.$emit('dropdown:close');
      },
      onDropdownOpen() {
        this.$emit('dropdown:open');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .dropdown {
    @include flex-center;
    justify-content: flex-start;

    min-width: 220px;
    height: 32px;

    border-radius: 16px;

    &.light {
      color: $color-text-light;

      &:hover {
        @include hard-shadow($color-border-main-dark, 2px);
      }
    }

    &.dark {
      color: $color-text-main;

      &:hover {
        @include hard-shadow($color-border-main-light, 2px);
      }
    }

    &.active {
      background-color: $color-bg-light;
      color: $color-text-primary;
    }

    .content {
      background-color: inherit;
    }
  }

  .trigger {
    @include flex-center;
    justify-content: space-between;

    width: 100%;
    height: 100%;
    padding: 0 16px;
  }

  .basic-dropdown {
    width: 100%;
    height: 100%;
  }

  .arrow {
    @include flex-center;
    justify-content: flex-start;
    margin-left: 5px;

    :global .icon--arrow-down {
      transition: transform 0.2s ease;
    }

    :global .icon-path--arrow-down {
      fill: currentColor;
    }

    &.isOpen {
      :global .icon--arrow-down {
        transform: rotate(180deg);
      }
    }
  }
</style>
