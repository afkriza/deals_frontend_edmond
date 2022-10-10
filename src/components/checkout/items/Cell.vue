<template>
  <div :class="cellClasses">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      bold: {
        type: Boolean,
        value: false
      },
      small: {
        type: Boolean,
        value: false
      },
      active: {
        type: Boolean,
        value: false
      },
      light: {
        type: Boolean,
        value: false
      },
      upper: {
        type: Boolean,
        value: false
      },
      danger: {
        type: Boolean,
        value: false
      }
    },
    computed: {
      cellClasses() {
        return [
          this.$style.cell,
          {
            [this.$style.bold]: this.bold,
            [this.$style.upper]: this.upper,
            [this.$style.active]: this.active,
            [this.$style.light]: this.light,
            [this.$style.danger]: this.danger,
            [this.$style.small]: this.small
          }
        ];
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .cell {
    position: relative;
    display: flex;
    flex: 1 0;
    align-items: center;
    line-height: 20px;
    padding: 12px 0;
    color: $color-text-main;

    &:last-child {
      justify-content: flex-end;
    }
  }

  .bold {
    font-weight: bold;
  }

  .light {
    color: $color-text-main-lighter;
  }

  .danger {
    color: $color-text-warning;
  }

  .active {
    color: $color-text-primary;
  }

  .upper {
    text-transform: uppercase;
  }

  .small {
    padding: 7px 0;
  }
</style>
