<template>
  <a :class="$style.iconLink" @click.prevent="onLinkClick">
    <span v-if="icon === 'add'">
      <!-- @svg("add") -->
    </span>
    <span :class="$style.iconLinkText">
      {{ text }}
    </span>
  </a>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        default: 'add'
      }
    },

    methods: {
      onLinkClick() {
        this.$emit('click');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .icon-link {
    font-weight: bold;

    display: flex;
    align-items: center;

    padding: 11px 15px;

    color: $color-text-primary;

    cursor: pointer;
  }

  .icon-link-text {
    margin-left: 7px;
  }
</style>
