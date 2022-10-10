<template>
  <div :class="$style.tabs">
    <div :class="$style.tabsWrapper">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="[$style.tab, { [$style.isActive]: tab.id === activeTabID }]"
        @click="onTabClick(tab.id)"
      >
        <h3 :class="$style.name">
          <span>{{ tab.name }}</span>
          <span v-if="tab.quantity >= 0"> ({{ tab.quantity }})</span>
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      tabs: {
        type: Array,
        required: true
      },
      activeTabID: {
        type: String,
        required: true
      }
    },
    data() {
      return {};
    },
    methods: {
      onTabClick(tabID) {
        if (this.activeTabID !== tabID) {
          this.$emit('tab:change', tabID);
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .tabs {
    z-index: $z-floating-content;
    padding: 3px 10px 0;

    background-color: $color-bg-primary-dark;
  }

  .tabs-wrapper {
    @extend %container;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin: 0;
    margin-left: 40px;
  }

  .tab {
    @include flex-center;
    font-weight: normal;
    margin-right: 24px;
    padding: 15px 0;
    color: $color-text-light;

    &.is-active {
      font-weight: bold;
      border-bottom: 4px solid currentColor;
    }

    &:not(.is-active) {
      cursor: pointer;
      color: $color-text-main-lighter;
      padding-bottom: 19px;
    }
  }

  .name {
    font-weight: inherit;
    margin: 0;
  }
</style>
