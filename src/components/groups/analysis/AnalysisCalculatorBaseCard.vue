<template>
  <section :class="$style.card">
    <slot />
  </section>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class AnalysisCalculatorBaseCard extends Vue {}
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    background-color: $color-bg-primary-darker;

    padding: 20px;
  }
</style>
