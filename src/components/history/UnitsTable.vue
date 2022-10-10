<template>
  <div :class="$style.wrapper">
    <div :class="$style.headerWrapper">
      <div :class="$style.header">
        <div
          v-for="headerItem in headerItems"
          :class="$style.cell"
          :key="headerItem.label"
        >
          <h5 :class="$style.heading">
            {{ headerItem.label }}
          </h5>
        </div>
      </div>
    </div>
    <div :class="$style.dataContainer" id="data-container">
      <slot :units="units" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      units: {
        type: Array,
        required: true
      },
      headerItems: {
        type: Array,
        required: true
      }
    },

    data() {
      return {};
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    @include column;
    min-height: 0;
  }

  .header-wrapper {
    border: {
      bottom: 1px solid $color-border-main-light;
      top: 1px solid $color-border-main-light;
    }
  }

  .header {
    display: flex;
    align-items: center;
    margin-right: 20px;
    margin-left: 20px;

    @include media(large) {
      margin-right: 100px;
      margin-left: 100px;
    }
  }

  .heading {
    line-height: 16px;
    letter-spacing: 0.2px;

    margin: 0;
    text-transform: uppercase;
  }

  .cell {
    flex: 1 0;
    color: $color-text-main-lighter;
    padding: 12px 0;
    display: flex;
  }

  .data-container {
    overflow-y: auto;
  }
</style>
