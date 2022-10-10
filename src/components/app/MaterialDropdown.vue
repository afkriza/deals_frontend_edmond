<template>
  <div>
    <div :class="[$style.label, { [$style.isActive]: isActive }]">
      {{ label }}
    </div>
    <basic-dropdown
      :class="$style.dropdown"
      :isOpen="isOpen"
      @dropdown:open="open"
      @dropdown:close="close"
    >
      <div slot="trigger" :class="$style.trigger">
        <span v-html="value" :class="$style.triggerText"> </span>
        <ArrowDown :rotated="isOpen" />
      </div>
      <div :class="[$style.content, customContentClass]">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="$style.item"
          @click="onItemClick(item)"
        >
          {{ typeof item === 'object' ? item[itemAttribute] : item }}
        </div>
      </div>
    </basic-dropdown>
  </div>
</template>
<script>
  import BasicDropdown from 'components/core/BasicDropdown';

  import { isTruthyOrZero } from 'utils/number';
  import ArrowDown from '@/components/icons/ArrowDown';

  export default {
    components: {
      ArrowDown,
      BasicDropdown
    },

    props: {
      items: {
        type: Array,
        required: true
      },

      label: {
        type: String,
        required: true
      },

      value: {
        type: [String, Number],
        default: ''
      },

      itemAttribute: {
        type: String,
        default: 'name'
      },

      isOpen: {
        type: Boolean,
        default: false
      },

      customContentClass: {
        type: String,
        default: ''
      }
    },

    computed: {
      isActive() {
        return isTruthyOrZero(this.value);
      }
    },

    methods: {
      open() {
        this.$emit('open');
      },

      close() {
        this.$emit('close');
      },

      onItemClick(item) {
        this.$emit('item:click', item);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-weight: bold;

    min-height: 31px;
    padding-bottom: 3px;
    border-bottom: 1px solid $color-border-main;

    color: $color-text-main;
  }

  .label {
    position: relative;
    top: 28px;

    font-weight: bold;
    color: $color-text-main;

    transition: {
      property: top, font-size, font-weight, color;
      duration: 0.3s;
    }

    will-change: top, font-size;

    &.is-active {
      top: 0;
      font-size: 12px;
      font-weight: normal;
      color: $color-text-main-lighter;
    }
  }

  .content {
    font-size: 16px;

    max-height: 160px;

    overflow-y: auto;
    box-shadow: $dropdown-shadow;
  }

  .item {
    cursor: default;
    padding: 10px 15px;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }
</style>
