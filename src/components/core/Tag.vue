<template>
  <div :class="$style.tagWrapper">
    <div :class="$style.tag" @click="onClick">
      <span :class="$style.closeBtn">
        <!-- @svg("x") -->
      </span>
      {{ label }}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      },

      value: {
        type: String,
        required: true
      }
    },

    methods: {
      onClick(e) {
        e.stopPropagation();
        this.$emit('input', this.value);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .tag {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.71em;

    display: flex;
    align-items: center;
    padding: 2px 10px 2px 5px;

    border-radius: 14px;

    color: $color-text-primary;
    background-color: $color-bg-primary-dimmed;

    cursor: pointer;
  }

  .close-btn {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
</style>
