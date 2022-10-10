<template>
  <ButtonFlat :class="$style.button" v-on="$listeners">
    <slot />
  </ButtonFlat>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';

  @Component({
    components: { ButtonFlat }
  })
  export default class FilterButton extends Vue {}
</script>

<style lang="scss" module>
  @import 'utils';

  .button {
    color: $color-gray-90;
    font-size: 12px;
    line-height: 16px;
    background-color: $color-bg-primary-dark;
    padding: 6px 10px;

    transition: 40ms background-color, color linear;

    &:hover {
      color: $color-text-light;
      background-color: $color-bg-primary-mid;
    }

    &:active {
      color: $color-text-primary;
      background-color: $color-bg-light;
    }
  }
</style>
