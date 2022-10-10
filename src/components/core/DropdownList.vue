<template>
  <div :class="$style.container">
    <span v-if="title" :class="$style.title">{{ title }}</span>
    <ul :class="$style.list">
      <li
        v-for="({ id, item }, index) in items_"
        :key="id"
        :class="[
          $style.item,
          customItemClass,
          { [$style.disabled]: isItemDisabled(item) }
        ]"
        @mouseover="onMouseover(id)"
        @mouseleave="onMouseleave"
        @mousedown="onClick(item)"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
          :isHover="hoverItemId === id"
        />
      </li>
    </ul>
    <slot />
  </div>
</template>

<script>
  import { generateRandomHex } from 'utils/string';
  import { every, includes } from 'lodash';

  export default {
    name: 'DropdownList',

    props: {
      customItemClass: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      items: {
        type: Array,
        default: () => []
      },
      disabledItems: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      items_() {
        return this.items.map(item => ({ id: this.generateRandomHex(), item }));
      }
    },

    methods: {
      generateRandomHex,

      onMouseover(itemId) {
        this.hoverItemId = itemId;
      },

      onMouseleave() {
        this.hoverItemId = null;
      },

      onClick(item) {
        this.$emit('select', item);
      },

      isItemDisabled(item) {
        return includes(this.disabledItems, item);
      }
    },

    data() {
      return {
        hoverItemId: null
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .title {
    font-size: 12px;
    line-height: 16px;
    font-weight: bold;

    display: block;
    padding: 8px 16px;

    color: $color-text-main-lighter;
    text-transform: uppercase;
    letter-spacing: 0.2px;
  }

  .list {
    margin: 0;
    padding: 0;

    color: $color-text-main;

    list-style-type: none;
  }

  .item {
    @include flex-center;
    justify-content: flex-start;
    white-space: nowrap;
    min-height: 32px;
    padding: 0 16px;
    cursor: pointer;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }

    &.disabled {
      color: $color-text-main-mild-light;
      cursor: default;
      pointer-events: none;

      &:hover {
        background-color: unset;
      }
    }
  }
</style>
